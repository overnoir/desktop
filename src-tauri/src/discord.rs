use crate::vault::{
    delete_vault_items as delete_vault_items_fn, get_vault_items, update_vault_items,
};
use discord_rich_presence::{DiscordIpc, DiscordIpcClient};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{
    collections::HashMap,
    env,
    sync::atomic::{AtomicBool, Ordering},
    sync::{mpsc, Arc, Mutex},
    thread,
    time::{SystemTime, UNIX_EPOCH},
};
use tauri::{AppHandle, Emitter, Manager};
use uuid::Uuid;

#[derive(Deserialize, Serialize)]
pub struct TokenResponse {
    refresh_token: Option<String>,
    access_token: String,
    token_type: String,
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
    is_self_deafened: bool,
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
    client_secret: String,
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

macro_rules! try_emit {
    ($app:expr, $guild:expr, $last_emit:expr) => {{
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_millis() as u128)
            .unwrap_or(0);
        if now.saturating_sub($last_emit) >= 50 || $last_emit == 0 {
            let _ = $app.emit_to("overlay", "guild-update", $guild);
            $last_emit = now;
        }
    }};
}

pub fn init_discord(app_handle: &AppHandle) {
    let client_id = env::var("DISCORD_CLIENT_ID").unwrap().to_string();

    app_handle.manage(Discord {
        client_secret: env::var("DISCORD_CLIENT_SECRET").unwrap().to_string(),
        client: Mutex::new(Some(DiscordIpcClient::new(&client_id))),
        stop_flag: Mutex::new(None),
        client_id,
    });
}

fn parse_user(data: &Value) -> Option<User> {
    let voice_state = &data["voice_state"];
    let user = data["user"].as_object()?;

    Some(User {
        is_self_deafened: voice_state["self_deaf"].as_bool().unwrap_or(false),
        is_self_muted: voice_state["self_mute"].as_bool().unwrap_or(false),
        is_deafened: voice_state["deaf"].as_bool().unwrap_or(false),
        is_muted: voice_state["mute"].as_bool().unwrap_or(false),
        is_bot: user["bot"].as_bool().unwrap_or(false),
        nick: data["nick"].as_str().map(|s| s.to_string()),
        username: user["username"].as_str()?.to_string(),
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

fn recv_until_response(
    client: &mut DiscordIpcClient,
    nonce: &str,
    users: &mut HashMap<String, User>,
    stop: &AtomicBool,
) -> Result<Value, String> {
    loop {
        if stop.load(Ordering::Relaxed) {
            return Err("Stopped".to_string());
        }

        let (_, data) = client.recv().map_err(|e| e.to_string())?;

        if data["nonce"].as_str() == Some(nonce) {
            return Ok(data["data"].clone());
        }

        match data["evt"].as_str() {
            Some("VOICE_STATE_CREATE") | Some("VOICE_STATE_UPDATE") => {
                if let Some(user) = parse_user(&data["data"]) {
                    users.insert(user.id.clone(), user);
                }
            }
            Some("VOICE_STATE_DELETE") => {
                if let Some(user_id) = data["data"]["user"]["id"].as_str() {
                    users.remove(user_id);
                }
            }
            Some("SPEAKING_START") => {
                if let Some(user_id) = data["data"]["user_id"].as_str() {
                    if let Some(user) = users.get_mut(user_id) {
                        user.is_speaking = true;
                    }
                }
            }
            Some("SPEAKING_STOP") => {
                if let Some(user_id) = data["data"]["user_id"].as_str() {
                    if let Some(user) = users.get_mut(user_id) {
                        user.is_speaking = false;
                    }
                }
            }
            _ => {}
        }
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
    client.send(command, 1).map_err(|e| e.to_string())?;
    recv_until_response(client, &nonce, users, stop)
}

fn get_guild_info(client: &mut DiscordIpcClient, guild_id: &str) -> (String, Option<String>) {
    let nonce = Uuid::new_v4().to_string();
    let cmd = json!({
        "nonce": nonce.clone(),
        "cmd": "GET_GUILD",
        "args": {
            "guild_id": guild_id,
        },
    });

    if client.send(cmd, 1).is_err() {
        return (String::new(), None);
    }

    loop {
        match client.recv() {
            Ok((_, data)) => {
                if data["nonce"].as_str() == Some(&nonce) {
                    let name = data["data"]["name"].as_str().unwrap_or("").to_string();
                    let icon_url = data["data"]["icon_url"].as_str().map(|s| s.to_string());
                    return (name, icon_url);
                }
            }
            Err(_) => return (String::new(), None),
        }
    }
}

fn start_channel_listener(app_handle: &AppHandle) -> Result<ConnectedUser, String> {
    let discord_state = app_handle.state::<Discord>();

    {
        let mut channel_guard = discord_state.stop_flag.lock().map_err(|e| e.to_string())?;

        if let Some(listener) = channel_guard.as_ref() {
            listener.store(true, Ordering::Relaxed);
        }

        *channel_guard = None;
    }

    let (tx, rx) = mpsc::channel();
    let stop_flag = Arc::new(AtomicBool::new(false));
    let client_id = discord_state.client_id.clone();
    let listener_stop = stop_flag.clone();
    let app = app_handle.clone();

    thread::spawn(move || {
        let mut channel_client = DiscordIpcClient::new(&client_id);
        let mut users: HashMap<String, User> = HashMap::new();

        if channel_client.connect().is_err() {
            let _ = app.emit_to("overlay", "guild-error", "Voice RPC connection failed");
            return;
        }

        let vault = match get_vault_items(&app, &["discord_access_token"]) {
            Ok(v) => v,
            Err(e) => {
                let _ = app.emit_to(
                    "overlay",
                    "guild-error",
                    format!("Failed to read vault: {}", e),
                );
                return;
            }
        };
        let access_token: String = match vault.get("discord_access_token").and_then(|v| v.clone()) {
            Some(token) => token,
            None => {
                let _ = app.emit_to(
                    "overlay",
                    "guild-error",
                    "No access token for channel listener",
                );
                return;
            }
        };

        let (connected_user_id, connected_username, connected_avatar) = match send_and_wait(
            &mut channel_client,
            json!({
                "args": { "access_token": access_token },
                "nonce": Uuid::new_v4().to_string(),
                "cmd": "AUTHENTICATE",
            }),
            &mut users,
            &*listener_stop,
        ) {
            Ok(auth_data) => {
                let user_data = &auth_data["user"];
                match user_data["id"].as_str() {
                    Some(id) => {
                        let username = user_data["username"]
                            .as_str()
                            .unwrap_or("Unknown")
                            .to_string();
                        let avatar = user_data["avatar"].as_str().map(|s| s.to_string());
                        (id.to_string(), username, avatar)
                    }
                    None => {
                        let _ = app.emit_to(
                            "overlay",
                            "guild-error",
                            "Channel auth response missing user id",
                        );
                        return;
                    }
                }
            }
            Err(_) => {
                let _ = app.emit_to("overlay", "guild-error", "Channel auth failed");
                return;
            }
        };

        let _ = tx.send(ConnectedUser {
            id: connected_user_id,
            username: connected_username,
            avatar: connected_avatar,
        });

        if send_and_wait(
            &mut channel_client,
            json!({
                "nonce": Uuid::new_v4().to_string(),
                "evt": "VOICE_CHANNEL_SELECT",
                "cmd": "SUBSCRIBE",
            }),
            &mut users,
            &*listener_stop,
        )
        .is_err()
        {
            let _ = app.emit_to(
                "overlay",
                "guild-error",
                "Failed to subscribe to VOICE_CHANNEL_SELECT",
            );
            return;
        }

        let current_vc = send_and_wait(
            &mut channel_client,
            json!({
                "cmd": "GET_SELECTED_VOICE_CHANNEL",
                "nonce": Uuid::new_v4().to_string()
            }),
            &mut users,
            &*listener_stop,
        );

        let mut current_guild: Option<Guild> = None;

        if let Ok(ref response) = current_vc {
            if response.is_object() && response["id"].is_string() {
                let channel_id = response["id"].as_str().unwrap().to_string();
                let guild_id = response["guild_id"].as_str().unwrap_or("").to_string();
                let channel_name = response["name"].as_str().unwrap_or("").to_string();

                let (guild_name, guild_icon_url) = get_guild_info(&mut channel_client, &guild_id);

                if let Some(voice_states) = response["voice_states"].as_array() {
                    for vs in voice_states {
                        if let Some(user) = parse_user(vs) {
                            users.insert(user.id.clone(), user);
                        }
                    }
                }

                for evt in &CHANNEL_EVENTS {
                    let _ = send_and_wait(
                        &mut channel_client,
                        json!({
                            "args": { "channel_id": channel_id },
                            "nonce": Uuid::new_v4().to_string(),
                            "cmd": "SUBSCRIBE",
                            "evt": evt,
                        }),
                        &mut users,
                        &*listener_stop,
                    );
                }

                current_guild = Some(Guild {
                    id: guild_id,
                    name: guild_name,
                    icon_url: guild_icon_url,
                    channel: Channel {
                        id: channel_id,
                        name: channel_name,
                        users: vec![],
                    },
                });

                if let Some(ref guild) = current_guild {
                    let mut g = guild.clone();
                    g.channel.users = users.values().cloned().collect();
                    let _ = &app.emit_to("overlay", "guild-update", &g);
                }
            }
        }

        let mut last_emit: u128 = 0;

        while !listener_stop.load(Ordering::Relaxed) {
            match channel_client.recv() {
                Ok((_, data)) => {
                    if listener_stop.load(Ordering::Relaxed) {
                        break;
                    }

                    if data["evt"] == "VOICE_CHANNEL_SELECT" {
                        let new_channel_id =
                            data["data"]["channel_id"].as_str().map(|s| s.to_string());

                        if let Some(old) = current_guild.take() {
                            for evt in &CHANNEL_EVENTS {
                                let _ = send_and_wait(
                                    &mut channel_client,
                                    json!({
                                        "nonce": Uuid::new_v4().to_string(),
                                        "args": { "channel_id": old.channel.id },
                                        "cmd": "UNSUBSCRIBE",
                                        "evt": evt,
                                    }),
                                    &mut users,
                                    &*listener_stop,
                                );
                            }
                        }

                        users.clear();

                        if let Some(ref new_id) = new_channel_id {
                            for evt in &CHANNEL_EVENTS {
                                let _ = send_and_wait(
                                    &mut channel_client,
                                    json!({
                                        "nonce": Uuid::new_v4().to_string(),
                                        "args": { "channel_id": new_id },
                                        "cmd": "SUBSCRIBE",
                                        "evt": evt,
                                    }),
                                    &mut users,
                                    &*listener_stop,
                                );
                            }

                            let nonce = Uuid::new_v4().to_string();

                            if channel_client
                                .send(
                                    json!({
                                        "args": { "channel_id": new_id },
                                        "nonce": nonce.clone(),
                                        "cmd": "GET_CHANNEL",
                                    }),
                                    1,
                                )
                                .is_ok()
                            {
                                if let Ok(response) =
                                    recv_until_response(&mut channel_client, &nonce, &mut users, &*listener_stop)
                                {
                                    if let Some(voice_states) = response["voice_states"].as_array()
                                    {
                                        for vs in voice_states {
                                            if let Some(user) = parse_user(vs) {
                                                users.insert(user.id.clone(), user);
                                            }
                                        }
                                    }

                                    let guild_id =
                                        response["guild_id"].as_str().unwrap_or("").to_string();

                                    let (guild_name, guild_icon_url) =
                                        get_guild_info(&mut channel_client, &guild_id);

                                    let channel_name =
                                        response["name"].as_str().unwrap_or("").to_string();

                                    current_guild = Some(Guild {
                                        id: guild_id,
                                        name: guild_name,
                                        icon_url: guild_icon_url,
                                        channel: Channel {
                                            id: new_id.clone(),
                                            name: channel_name,
                                            users: vec![],
                                        },
                                    });
                                }
                            }

                            if let Some(ref guild) = current_guild {
                                let mut g = guild.clone();
                                g.channel.users = users.values().cloned().collect();
                                let _ = &app.emit_to("overlay", "guild-update", &g);
                            }
                        } else {
                            let _ = app.emit_to("overlay", "guild-update", serde_json::Value::Null);
                        }
                    } else if let Some(guild) = &current_guild {
                        match data["evt"].as_str() {
                            Some("VOICE_STATE_CREATE") | Some("VOICE_STATE_UPDATE") => {
                                if let Some(user) = parse_user(&data["data"]) {
                                    users.insert(user.id.clone(), user);
                                    let mut g = guild.clone();
                                    g.channel.users = users.values().cloned().collect();
                                    try_emit!(&app, &g, last_emit);
                                }
                            }
                            Some("VOICE_STATE_DELETE") => {
                                if let Some(user_id) = data["data"]["user"]["id"].as_str() {
                                    users.remove(user_id);

                                    let mut g = guild.clone();
                                    g.channel.users = users.values().cloned().collect();
                                    try_emit!(&app, &g, last_emit);
                                }
                            }
                            Some("SPEAKING_START") => {
                                if let Some(user_id) = data["data"]["user_id"].as_str() {
                                    if let Some(user) = users.get_mut(user_id) {
                                        user.is_speaking = true;
                                    }

                                    let mut g = guild.clone();
                                    g.channel.users = users.values().cloned().collect();
                                    try_emit!(&app, &g, last_emit);
                                }
                            }
                            Some("SPEAKING_STOP") => {
                                if let Some(user_id) = data["data"]["user_id"].as_str() {
                                    if let Some(user) = users.get_mut(user_id) {
                                        user.is_speaking = false;
                                    }

                                    let mut g = guild.clone();
                                    g.channel.users = users.values().cloned().collect();
                                    try_emit!(&app, &g, last_emit);
                                }
                            }
                            _ => {}
                        }
                    }
                }
                Err(_) => {
                    let _ = app.emit_to("overlay", "guild-error", "Channel listener disconnected");
                    break;
                }
            }
        }

        let _ = channel_client.close();
    });

    {
        let mut channel_guard = discord_state.stop_flag.lock().map_err(|e| e.to_string())?;
        *channel_guard = Some(stop_flag);
    }

    let connected_user = rx
        .recv()
        .map_err(|_| "Channel listener thread failed".to_string())?;

    Ok(connected_user)
}

fn save_tokens(app_handle: &AppHandle, token_response: &TokenResponse) -> Result<(), String> {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_millis() as u64;

    update_vault_items(
        app_handle,
        vec![
            ("discord_access_token", token_response.access_token.clone()),
            (
                "discord_refresh_token",
                token_response.refresh_token.clone().unwrap_or_default(),
            ),
            (
                "discord_access_token_expires_at",
                (now + token_response.expires_in * 1000).to_string(),
            ),
            (
                "discord_refresh_token_expires_at",
                (now + token_response.expires_in * 1000 + 30 * 24 * 60 * 60 * 1000).to_string(),
            ),
        ],
    )
}

async fn authorize(app_handle: &AppHandle) -> Result<TokenResponse, String> {
    let discord = app_handle.state::<Discord>();

    let code = {
        let mut client_guard = discord.client.lock().map_err(|e| e.to_string())?;
        let client = client_guard
            .as_mut()
            .ok_or("Discord client is not initialized")?;

        client
            .send(
                json!({
                    "nonce": Uuid::new_v4().to_string(),
                    "cmd": "AUTHORIZE",
                    "args": {
                        "client_id": discord.client_id,
                        "scopes": ["rpc"]
                    },
                }),
                1,
            )
            .map_err(|e| e.to_string())?;

        let received = client.recv().map_err(|e| e.to_string())?;

        if received.1["evt"] == "ERROR" {
            let message = received.1["data"]["message"]
                .as_str()
                .unwrap_or("Unknown error");

            return Err(message.to_string());
        }

        received.1["data"]["code"]
            .as_str()
            .ok_or("Failed to get authorization code")?
            .to_string()
    };

    let params = [
        ("client_secret", discord.client_secret.as_str()),
        ("client_id", discord.client_id.as_str()),
        ("grant_type", "authorization_code"),
        ("code", code.as_str()),
    ];

    let response_text = tauri_plugin_http::reqwest::Client::new()
        .post(&DISCORD_API_OAUTH2_TOKEN_URL.to_string())
        .form(&params)
        .send()
        .await
        .map_err(|e| format!("Token request failed: {}", e))?
        .text()
        .await
        .map_err(|e| format!("Failed to read token response: {}", e))?;

    serde_json::from_str(&response_text)
        .map_err(|e| format!("Failed to parse token response: {}", e))
}

#[tauri::command]
pub async fn connect_discord(app_handle: AppHandle) -> Result<ConnectedUser, String> {
    let discord = app_handle.state::<Discord>();

    let vault = get_vault_items(
        &app_handle,
        &[
            "discord_refresh_token_expires_at",
            "discord_access_token_expires_at",
            "discord_refresh_token",
            "discord_access_token",
        ],
    )?;

    let access_token_expires_at = vault
        .get("discord_access_token_expires_at")
        .cloned()
        .flatten();
    let refresh_token_expires_at = vault
        .get("discord_refresh_token_expires_at")
        .cloned()
        .flatten();
    let refresh_token = vault.get("discord_refresh_token").cloned().flatten();
    let access_token = vault.get("discord_access_token").cloned().flatten();

    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_millis() as u64;

    if access_token.is_some() {
        if let Some(ref expires_at_str) = access_token_expires_at {
            if let Ok(expires_at) = expires_at_str.parse::<u64>() {
                if expires_at > now {
                    return start_channel_listener(&app_handle);
                }
            }
        }

        if let Some(ref refresh) = refresh_token {
            if let Some(ref expires_at_str) = refresh_token_expires_at {
                if let Ok(expires_at) = expires_at_str.parse::<u64>() {
                    if expires_at > now {
                        let params = [
                            ("client_secret", discord.client_secret.as_str()),
                            ("client_id", discord.client_id.as_str()),
                            ("refresh_token", refresh),
                            ("grant_type", "refresh_token"),
                        ];

                        let response_text = tauri_plugin_http::reqwest::Client::new()
                            .post(&DISCORD_API_OAUTH2_TOKEN_URL.to_string())
                            .form(&params)
                            .send()
                            .await
                            .map_err(|e| format!("Token refresh request failed: {}", e))?
                            .text()
                            .await
                            .map_err(|e| format!("Failed to read refresh response: {}", e))?;

                        let token_response: TokenResponse = serde_json::from_str(&response_text)
                            .map_err(|e| format!("Failed to parse refresh response: {}", e))?;

                        save_tokens(&app_handle, &token_response)?;
                        return start_channel_listener(&app_handle);
                    }
                }
            }
        }
    }

    {
        let mut client_guard = discord.client.lock().map_err(|e| e.to_string())?;
        let client = client_guard
            .as_mut()
            .ok_or("Discord client is not initialized")?;
        client.connect().map_err(|e| e.to_string())?;
    }

    let token_response = authorize(&app_handle).await?;

    {
        let mut client_guard = discord.client.lock().map_err(|e| e.to_string())?;
        if let Some(client) = client_guard.as_mut() {
            let _ = client.close();
        }
        *client_guard = Some(DiscordIpcClient::new(&discord.client_id));
    }

    save_tokens(&app_handle, &token_response)?;
    start_channel_listener(&app_handle)
}

#[tauri::command]
pub fn disconnect_discord(app_handle: AppHandle, delete_vault_items: bool) -> Result<(), String> {
    let discord = app_handle.state::<Discord>();

    {
        let mut channel_guard = discord.stop_flag.lock().map_err(|e| e.to_string())?;

        if let Some(listener) = channel_guard.as_ref() {
            listener.store(true, Ordering::Relaxed);
        }

        *channel_guard = None;
    }

    app_handle
        .emit_to("overlay", "guild-update", serde_json::Value::Null)
        .map_err(|e| e.to_string())?;

    if delete_vault_items {
        delete_vault_items_fn(
            &app_handle,
            &[
                "discord_refresh_token_expires_at",
                "discord_access_token_expires_at",
                "discord_refresh_token",
                "discord_access_token",
            ],
        )?;
    }

    Ok(())
}
