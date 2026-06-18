use crate::vault::{
    delete_vault_items as delete_vault_items_fn, get_vault_items, update_vault_items,
};
use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine as _};
use discord_rich_presence::{DiscordIpc, DiscordIpcClient};
use rand::rngs::OsRng;
use rand::RngCore;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::{
    collections::HashMap,
    env,
    sync::{
        atomic::{AtomicBool, Ordering},
        mpsc, Arc, Mutex,
    },
    thread,
    time::{SystemTime, UNIX_EPOCH},
};
use tauri::{AppHandle, Emitter, Manager};
use uuid::Uuid;

#[derive(Debug, Deserialize, Serialize)]
pub struct TokenResponse {
    refresh_token: Option<String>,
    access_token: String,
    expires_in: u64,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AvatarDecoration {
    sku_id: String,
    asset: String,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct User {
    #[serde(skip_serializing_if = "Option::is_none")]
    avatar_decoration: Option<AvatarDecoration>,
    #[serde(skip_serializing_if = "Option::is_none")]
    avatar: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    nick: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    global_name: Option<String>,
    is_self_deafened: bool,
    discriminator: String,
    is_self_muted: bool,
    is_deafened: bool,
    is_speaking: bool,
    username: String,
    is_muted: bool,
    is_bot: bool,
    id: String,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Channel {
    users: Vec<User>,
    name: String,
    id: String,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Guild {
    #[serde(skip_serializing_if = "Option::is_none")]
    icon_url: Option<String>,
    channel: Channel,
    name: String,
    id: String,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ConnectedUser {
    #[serde(skip_serializing_if = "Option::is_none")]
    avatar: Option<String>,
    username: String,
    id: String,
}

pub struct Discord {
    stop_flag: Mutex<Option<Arc<AtomicBool>>>,
    client: Mutex<Option<DiscordIpcClient>>,
    client_id: String,
}

const DISCORD_API_OAUTH2_TOKEN_URL: &str = "https://discord.com/api/v10/oauth2/token";

const CHANNEL_EVENTS: [&str; 5] = [
    "VOICE_STATE_CREATE",
    "VOICE_STATE_UPDATE",
    "VOICE_STATE_DELETE",
    "SPEAKING_START",
    "SPEAKING_STOP",
];

pub fn init_discord(app_handle: &AppHandle) {
    let client_id = env::var("DISCORD_CLIENT_ID").unwrap_or_else(|_| {
        option_env!("DISCORD_CLIENT_ID")
            .expect("DISCORD_CLIENT_ID must be set")
            .to_string()
    });

    app_handle.manage(Discord {
        client: Mutex::new(Some(DiscordIpcClient::new(&client_id))),
        client_id: client_id.to_string(),
        stop_flag: Mutex::new(None),
    });
}

fn generate_code_verifier() -> Result<String, String> {
    let mut bytes = [0u8; 32];
    OsRng
        .try_fill_bytes(&mut bytes)
        .map_err(|e| format!("Failed to generate code verifier: {}", e))?;
    Ok(URL_SAFE_NO_PAD.encode(bytes))
}

fn derive_code_challenge(verifier: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(verifier.as_bytes());
    let hash = hasher.finalize();
    URL_SAFE_NO_PAD.encode(hash)
}

fn parse_user(data: &Value) -> Option<User> {
    let voice_state = &data["voice_state"];
    let user = data["user"].as_object()?;

    Some(User {
        is_self_deafened: voice_state["self_deaf"].as_bool().unwrap_or(false),
        is_self_muted: voice_state["self_mute"].as_bool().unwrap_or(false),
        is_deafened: voice_state["deaf"].as_bool().unwrap_or(false),
        is_muted: voice_state["mute"].as_bool().unwrap_or(false),
        discriminator: user["discriminator"].as_str()?.to_string(),
        nick: data["nick"].as_str().map(|s| s.to_string()),
        is_bot: user["bot"].as_bool().unwrap_or(false),
        username: user["username"].as_str()?.to_string(),
        global_name: user
            .get("global_name")
            .and_then(|g| g.as_str())
            .map(|s| s.to_string()),
        id: user["id"].as_str()?.to_string(),
        is_speaking: false,
        avatar_decoration: user.get("avatar_decoration_data").and_then(|d| {
            if d.is_null() {
                return None;
            }
            Some(AvatarDecoration {
                sku_id: d["skuId"].as_str()?.to_string(),
                asset: d["asset"].as_str()?.to_string(),
            })
        }),
        avatar: user
            .get("avatar")
            .and_then(|a| a.as_str())
            .map(|s| s.to_string()),
    })
}

fn apply_voice_event(evt: &str, data: &Value, users: &mut HashMap<String, User>) {
    match evt {
        "VOICE_STATE_CREATE" | "VOICE_STATE_UPDATE" => {
            if let Some(mut user) = parse_user(data) {
                user.is_speaking = users.get(&user.id).map_or(false, |u| u.is_speaking);
                users.insert(user.id.clone(), user);
            }
        }
        "VOICE_STATE_DELETE" => {
            if let Some(user_id) = data["user"]["id"].as_str() {
                users.remove(user_id);
            }
        }
        "SPEAKING_START" => {
            if let Some(user_id) = data["user_id"].as_str() {
                if let Some(user) = users.get_mut(user_id) {
                    user.is_speaking = true;
                }
            }
        }
        "SPEAKING_STOP" => {
            if let Some(user_id) = data["user_id"].as_str() {
                if let Some(user) = users.get_mut(user_id) {
                    user.is_speaking = false;
                }
            }
        }
        _ => {}
    }
}

fn send_and_wait(
    client: &mut DiscordIpcClient,
    command: Value,
    users: &mut HashMap<String, User>,
    stop: &AtomicBool,
) -> Result<Value, String> {
    let nonce = command["nonce"]
        .as_str()
        .ok_or("Command must have a nonce")?
        .to_string();
    client
        .send(command, 1)
        .map_err(|e| format!("Failed to send IPC command: {}", e))?;
    loop {
        if stop.load(Ordering::Relaxed) {
            return Err("Stopped".to_string());
        }

        let (_, data) = client
            .recv()
            .map_err(|e| format!("Failed to receive IPC response: {}", e))?;

        if data["nonce"].as_str() == Some(&nonce) {
            return Ok(data["data"].clone());
        }

        if let Some(evt) = data["evt"].as_str() {
            apply_voice_event(evt, &data["data"], users);
        }
    }
}

fn subscribe_to_events(
    client: &mut DiscordIpcClient,
    channel_id: &str,
    users: &mut HashMap<String, User>,
    stop: &AtomicBool,
) {
    for evt in &CHANNEL_EVENTS {
        let _ = send_and_wait(
            client,
            json!({
                "args": { "channel_id": channel_id },
                "nonce": Uuid::new_v4().to_string(),
                "cmd": "SUBSCRIBE",
                "evt": evt,
            }),
            users,
            stop,
        );
    }
}

fn build_guild_from_channel(
    response: &Value,
    channel_id: &str,
    users: &mut HashMap<String, User>,
) -> Option<Guild> {
    let guild_id = response["guild_id"].as_str().unwrap_or("").to_string();
    let channel_name = response["name"].as_str().unwrap_or("").to_string();

    if let Some(voice_states) = response["voice_states"].as_array() {
        for voice_state in voice_states {
            if let Some(user) = parse_user(voice_state) {
                users.insert(user.id.clone(), user);
            }
        }
    }

    Some(Guild {
        id: guild_id.clone(),
        name: channel_name.clone(),
        icon_url: None,
        channel: Channel {
            id: channel_id.to_string(),
            name: channel_name,
            users: vec![],
        },
    })
}

fn fetch_guild_info(
    client: &mut DiscordIpcClient,
    guild_id: &str,
    stop: &AtomicBool,
) -> Option<(String, Option<String>)> {
    send_and_wait(
        client,
        json!({
            "nonce": Uuid::new_v4().to_string(),
            "cmd": "GET_GUILD",
            "args": { "guild_id": guild_id },
        }),
        &mut HashMap::new(),
        stop,
    )
    .ok()
    .and_then(|data| {
        Some((
            data["name"].as_str().unwrap_or("").to_string(),
            data["icon_url"].as_str().map(|s| s.to_string()),
        ))
    })
}

fn start_channel_listener(
    app_handle: &AppHandle,
    access_token: String,
    connected_client: Option<DiscordIpcClient>,
) -> Result<ConnectedUser, String> {
    let discord_state = app_handle.state::<Discord>();

    {
        let mut channel_guard = discord_state
            .stop_flag
            .lock()
            .map_err(|e| format!("Failed to acquire stop flag lock: {}", e))?;
        if let Some(listener) = channel_guard.as_ref() {
            listener.store(true, Ordering::Relaxed);
        }
        *channel_guard = None;
    }

    let (tx, rx) = mpsc::channel::<Result<ConnectedUser, String>>();
    let stop_flag = Arc::new(AtomicBool::new(false));
    let client_id = discord_state.client_id.clone();
    let listener_stop = stop_flag.clone();
    let app_handle_clone = app_handle.clone();

    thread::spawn(move || {
        let mut client = if let Some(c) = connected_client {
            c
        } else {
            let mut c = DiscordIpcClient::new(&client_id);
            if c.connect().is_err() {
                let _ = tx.send(Err("Voice RPC connection failed".to_string()));
                return;
            }
            c
        };
        let mut users: HashMap<String, User> = HashMap::new();

        let result = (|| -> Result<ConnectedUser, String> {
            let auth = send_and_wait(
                &mut client,
                json!({
                    "nonce": Uuid::new_v4().to_string(),
                    "args": { "access_token": access_token },
                    "cmd": "AUTHENTICATE",
                }),
                &mut users,
                &listener_stop,
            )?;

            let user = &auth["user"];
            Ok(ConnectedUser {
                id: user["id"]
                    .as_str()
                    .ok_or("Channel auth response missing user id")?
                    .to_string(),
                username: user["username"].as_str().unwrap_or("Unknown").to_string(),
                avatar: user["avatar"].as_str().map(|s| s.to_string()),
            })
        })();

        match result {
            Ok(user) => {
                let _ = tx.send(Ok(user));
            }
            Err(e) => {
                let _ = tx.send(Err(e));
                return;
            }
        };

        if send_and_wait(
            &mut client,
            json!({
                "nonce": Uuid::new_v4().to_string(),
                "evt": "VOICE_CHANNEL_SELECT",
                "cmd": "SUBSCRIBE",
            }),
            &mut users,
            &listener_stop,
        )
        .is_err()
        {
            let _ = app_handle_clone.emit_to(
                "overlay",
                "guild-error",
                "Failed to subscribe to VOICE_CHANNEL_SELECT",
            );
            return;
        }

        let current_vc = send_and_wait(
            &mut client,
            json!({
                "cmd": "GET_SELECTED_VOICE_CHANNEL",
                "nonce": Uuid::new_v4().to_string()
            }),
            &mut users,
            &listener_stop,
        );

        let mut current_guild: Option<Guild> = None;

        if let Ok(ref response) = current_vc {
            if response.is_object() && response["id"].is_string() {
                let channel_id = response["id"].as_str().unwrap().to_string();
                current_guild = build_guild_from_channel(response, &channel_id, &mut users);

                if let Some(ref guild) = current_guild {
                    let mut guild_clone = guild.clone();
                    guild_clone.channel.users = users.values().cloned().collect();
                    let _ = app_handle_clone.emit_to("overlay", "guild-update", &guild_clone);

                    subscribe_to_events(&mut client, &channel_id, &mut users, &listener_stop);

                    if let Some((name, icon_url)) =
                        fetch_guild_info(&mut client, &guild.id, &listener_stop)
                    {
                        if let Some(ref mut g) = current_guild {
                            g.name = name;
                            g.icon_url = icon_url;
                            g.channel.users = users.values().cloned().collect();
                            let _ = app_handle_clone.emit_to("overlay", "guild-update", &g);
                        }
                    }
                }
            }
        }

        while !listener_stop.load(Ordering::Relaxed) {
            match client.recv() {
                Ok((_, data)) => {
                    if listener_stop.load(Ordering::Relaxed) {
                        break;
                    }

                    let evt = data["evt"].as_str().unwrap_or("");

                    if evt == "VOICE_CHANNEL_SELECT" {
                        let new_id = data["data"]["channel_id"].as_str().map(|s| s.to_string());

                        if let Some(old) = current_guild.take() {
                            for evt in &CHANNEL_EVENTS {
                                let _ = send_and_wait(
                                    &mut client,
                                    json!({
                                        "args": { "channel_id":  &old.channel.id },
                                        "nonce": Uuid::new_v4().to_string(),
                                        "cmd": "UNSUBSCRIBE",
                                        "evt": evt,
                                    }),
                                    &mut users,
                                    &listener_stop,
                                );
                            }
                        }

                        users.clear();

                        let _ = app_handle_clone.emit_to(
                            "overlay",
                            "guild-update",
                            serde_json::Value::Null,
                        );

                        if let Some(ref new_channel_id) = new_id {
                            subscribe_to_events(
                                &mut client,
                                new_channel_id,
                                &mut users,
                                &listener_stop,
                            );

                            if let Ok(response) = send_and_wait(
                                &mut client,
                                json!({
                                    "args": { "channel_id": new_channel_id },
                                    "nonce": Uuid::new_v4().to_string(),
                                    "cmd": "GET_CHANNEL",
                                }),
                                &mut users,
                                &listener_stop,
                            ) {
                                current_guild =
                                    build_guild_from_channel(&response, new_channel_id, &mut users);
                            }

                            if let Some(ref guild) = current_guild {
                                let mut guild_clone = guild.clone();
                                guild_clone.channel.users = users.values().cloned().collect();
                                let _ = app_handle_clone.emit_to(
                                    "overlay",
                                    "guild-update",
                                    &guild_clone,
                                );

                                if let Some((name, icon_url)) =
                                    fetch_guild_info(&mut client, &guild.id, &listener_stop)
                                {
                                    if let Some(ref mut g) = current_guild {
                                        g.name = name;
                                        g.icon_url = icon_url;
                                        g.channel.users = users.values().cloned().collect();
                                        let _ =
                                            app_handle_clone.emit_to("overlay", "guild-update", &g);
                                    }
                                }
                            }
                        }
                    } else if let Some(guild) = &current_guild {
                        apply_voice_event(evt, &data["data"], &mut users);
                        let mut guild_clone = guild.clone();
                        guild_clone.channel.users = users.values().cloned().collect();
                        let _ = app_handle_clone.emit_to("overlay", "guild-update", &guild_clone);
                    }
                }
                Err(_) => {
                    let _ = app_handle_clone.emit_to(
                        "overlay",
                        "guild-error",
                        "Channel listener disconnected",
                    );
                    let _ = app_handle_clone.emit_to(
                        "overlay",
                        "guild-update",
                        serde_json::Value::Null,
                    );
                    break;
                }
            }
        }

        let _ = client.close();
    });

    {
        let mut channel_guard = discord_state
            .stop_flag
            .lock()
            .map_err(|e| format!("Failed to acquire stop flag lock: {}", e))?;
        *channel_guard = Some(stop_flag);
    }

    match rx.recv() {
        Ok(Ok(user)) => Ok(user),
        Ok(Err(e)) => Err(e),
        Err(_) => Err("Channel listener thread failed".to_string()),
    }
}

fn save_tokens(app_handle: &AppHandle, token_response: &TokenResponse) -> Result<(), String> {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| format!("System time error: {}", e))?
        .as_millis() as u64;

    let mut items = vec![
        ("discord_access_token", token_response.access_token.clone()),
        (
            "discord_access_token_expires_at",
            (now + token_response.expires_in * 1000).to_string(),
        ),
    ];

    if let Some(ref refresh) = token_response.refresh_token {
        items.push(("discord_refresh_token", refresh.clone()));
    }

    update_vault_items(app_handle, items)
}

async fn exchange_code(params: &[(&str, &str)]) -> Result<TokenResponse, String> {
    let response = tauri_plugin_http::reqwest::Client::new()
        .post(DISCORD_API_OAUTH2_TOKEN_URL)
        .form(params)
        .send()
        .await
        .map_err(|e| format!("Token request failed: {}", e))?
        .text()
        .await
        .map_err(|e| format!("Failed to read token response: {}", e))?;

    serde_json::from_str(&response).map_err(|e| format!("Failed to parse token response: {}", e))
}

#[tauri::command]
pub async fn connect_discord(app_handle: AppHandle) -> Result<ConnectedUser, String> {
    let discord = app_handle.state::<Discord>();

    let vault = get_vault_items(
        &app_handle,
        &[
            "discord_access_token_expires_at",
            "discord_refresh_token",
            "discord_access_token",
        ],
    )?;

    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| format!("System time error: {}", e))?
        .as_millis() as u64;

    let refresh_token = vault.get("discord_refresh_token").cloned().flatten();
    let access_token = vault.get("discord_access_token").cloned().flatten();
    let expires_at = vault
        .get("discord_access_token_expires_at")
        .cloned()
        .flatten();

    if let Some(ref token) = access_token {
        if expires_at
            .and_then(|e| e.parse::<u64>().ok())
            .map_or(false, |e| e > now)
        {
            return start_channel_listener(&app_handle, token.clone(), None);
        }
    }

    if let Some(ref refresh) = refresh_token {
        let token_response = exchange_code(&[
            ("client_id", discord.client_id.as_str()),
            ("refresh_token", refresh.as_str()),
            ("grant_type", "refresh_token"),
        ])
        .await?;

        save_tokens(&app_handle, &token_response)?;
        return start_channel_listener(&app_handle, token_response.access_token.clone(), None);
    }

    let verifier = generate_code_verifier()?;
    let challenge = derive_code_challenge(&verifier);

    let mut client = {
        let mut client_guard = discord
            .client
            .lock()
            .map_err(|e| format!("Failed to acquire client lock: {}", e))?;
        client_guard
            .take()
            .ok_or("Discord client is not initialized")?
    };

    client
        .connect()
        .map_err(|e| format!("Failed to connect Discord IPC: {}", e))?;

    client
        .send(
            json!({
                "nonce": Uuid::new_v4().to_string(),
                "cmd": "AUTHORIZE",
                "args": {
                    "client_id": discord.client_id,
                    "scopes": ["rpc"],
                    "code_challenge": challenge,
                    "code_challenge_method": "S256"
                },
            }),
            1,
        )
        .map_err(|e| format!("Failed to send AUTHORIZE command: {}", e))?;

    let received = client
        .recv()
        .map_err(|e| format!("Failed to receive AUTHORIZE response: {}", e))?;

    if received.1["evt"] == "ERROR" {
        let _ = client.close();
        return Err(received.1["data"]["message"]
            .as_str()
            .unwrap_or("Unknown error")
            .to_string());
    }

    let code = received.1["data"]["code"]
        .as_str()
        .ok_or("Failed to get authorization code")?
        .to_string();

    let token_response = exchange_code(&[
        ("client_id", discord.client_id.as_str()),
        ("grant_type", "authorization_code"),
        ("code_verifier", verifier.as_str()),
        ("code", code.as_str()),
    ])
    .await?;

    save_tokens(&app_handle, &token_response)?;

    let result = start_channel_listener(
        &app_handle,
        token_response.access_token.clone(),
        Some(client),
    );

    {
        let mut client_guard = discord
            .client
            .lock()
            .map_err(|e| format!("Failed to acquire client lock: {}", e))?;
        *client_guard = Some(DiscordIpcClient::new(&discord.client_id));
    }

    result
}

#[tauri::command]
pub fn disconnect_discord(app_handle: AppHandle, delete_vault_items: bool) -> Result<(), String> {
    let discord = app_handle.state::<Discord>();

    {
        let mut channel_guard = discord
            .stop_flag
            .lock()
            .map_err(|e| format!("Failed to acquire stop flag lock: {}", e))?;

        if let Some(listener) = channel_guard.as_ref() {
            listener.store(true, Ordering::Relaxed);
        }

        *channel_guard = None;
    }

    app_handle
        .emit_to("overlay", "guild-update", serde_json::Value::Null)
        .map_err(|e| format!("Failed to emit disconnect event: {}", e))?;

    if delete_vault_items {
        delete_vault_items_fn(
            &app_handle,
            &[
                "discord_access_token_expires_at",
                "discord_refresh_token",
                "discord_access_token",
            ],
        )?;
    }

    Ok(())
}
