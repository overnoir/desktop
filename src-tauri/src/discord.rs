use crate::vault::{get_vault_item, save_vault, update_vault};
use discord_rich_presence::{DiscordIpc, DiscordIpcClient};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{
    collections::{HashMap, HashSet},
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
    is_self_deafened: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    avatar: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    nick: Option<String>,
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
pub struct ConnectedUser {
    id: String,
}

pub struct Discord {
    stop_flag: Mutex<Option<Arc<AtomicBool>>>,
    client: Mutex<Option<DiscordIpcClient>>,
    client_secret: String,
    client_id: String,
}

const CHANNEL_EVENTS: [&str; 5] = [
    "VOICE_STATE_CREATE",
    "VOICE_STATE_UPDATE",
    "VOICE_STATE_DELETE",
    "SPEAKING_START",
    "SPEAKING_STOP",
];

macro_rules! try_emit {
    ($app:expr, $channel_id:expr, $channel_name:expr, $users:expr, $speaking:expr, $last_emit:expr) => {{
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_millis() as u128)
            .unwrap_or(0);
        if now.saturating_sub($last_emit) >= 50 || $last_emit == 0 {
            emit_channel_state($app, $channel_id, $channel_name, $users, $speaking);
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

    println!("{:?}", user);

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
    speaking: &mut HashSet<String>,
) -> Result<Value, String> {
    loop {
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
                    speaking.remove(user_id);
                }
            }
            Some("SPEAKING_START") => {
                if let Some(user_id) = data["data"]["user_id"].as_str() {
                    speaking.insert(user_id.to_string());
                }
            }
            Some("SPEAKING_STOP") => {
                if let Some(user_id) = data["data"]["user_id"].as_str() {
                    speaking.remove(user_id);
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
    speaking: &mut HashSet<String>,
) -> Result<Value, String> {
    let nonce = command["nonce"]
        .as_str()
        .ok_or("Command must have a nonce")?
        .to_string();
    client.send(command, 1).map_err(|e| e.to_string())?;
    recv_until_response(client, &nonce, users, speaking)
}

fn emit_channel_state(
    app: &AppHandle,
    id: &str,
    name: String,
    users: &HashMap<String, User>,
    speaking: &HashSet<String>,
) {
    let _ = app.emit_to(
        "overlay",
        "channel-update",
        &Channel {
            id: id.to_string(),
            name,
            users: users
                .values()
                .map(|u| {
                    let mut user = u.clone();
                    user.is_speaking = speaking.contains(&user.id);
                    user
                })
                .collect(),
        },
    );
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
        let mut speaking: HashSet<String> = HashSet::new();

        if channel_client.connect().is_err() {
            let _ = app.emit_to("overlay", "channel-error", "Voice RPC connection failed");
            return;
        }

        let access_token = match get_vault_item(&app, "discord_access_token") {
            Ok(Some(token)) => token,
            Ok(None) => {
                let _ = app.emit_to(
                    "overlay",
                    "channel-error",
                    "No access token for channel listener",
                );
                return;
            }
            Err(e) => {
                let _ = app.emit_to(
                    "overlay",
                    "channel-error",
                    format!("Failed to read token: {}", e),
                );
                return;
            }
        };

        let connected_user_id = match send_and_wait(
            &mut channel_client,
            json!({
                "args": { "access_token": access_token },
                "nonce": Uuid::new_v4().to_string(),
                "cmd": "AUTHENTICATE",
            }),
            &mut users,
            &mut speaking,
        ) {
            Ok(auth_data) => match auth_data["user"]["id"].as_str() {
                Some(id) => id.to_string(),
                None => {
                    let _ = app.emit_to(
                        "overlay",
                        "channel-error",
                        "Channel auth response missing user id",
                    );
                    return;
                }
            },
            Err(_) => {
                let _ = app.emit_to("overlay", "channel-error", "Channel auth failed");
                return;
            }
        };

        let _ = tx.send(ConnectedUser {
            id: connected_user_id,
        });

        if send_and_wait(
            &mut channel_client,
            json!({
                "nonce": Uuid::new_v4().to_string(),
                "evt": "VOICE_CHANNEL_SELECT",
                "cmd": "SUBSCRIBE",
            }),
            &mut users,
            &mut speaking,
        )
        .is_err()
        {
            let _ = app.emit_to(
                "overlay",
                "channel-error",
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
            &mut speaking,
        );

        let mut current_channel_name = String::new();
        let mut current_channel: Option<String> = None;

        if let Ok(ref response) = current_vc {
            if response.is_object() && response["id"].is_string() {
                let channel_id = response["id"].as_str().unwrap().to_string();
                current_channel = Some(channel_id.clone());

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
                        &mut speaking,
                    );
                }

                current_channel_name = response["name"].as_str().unwrap_or("").to_string();

                emit_channel_state(
                    &app,
                    &channel_id,
                    current_channel_name.clone(),
                    &users,
                    &speaking,
                );
            }
        }

        let mut last_emit: u128 = 0;

        while !listener_stop.load(Ordering::Relaxed) {
            match channel_client.recv() {
                Ok((_, data)) => {
                    if data["evt"] == "VOICE_CHANNEL_SELECT" {
                        let new_channel_id =
                            data["data"]["channel_id"].as_str().map(|s| s.to_string());

                        if let Some(old_id) = current_channel.take() {
                            for evt in &CHANNEL_EVENTS {
                                let _ = send_and_wait(
                                    &mut channel_client,
                                    json!({
                                        "nonce": Uuid::new_v4().to_string(),
                                        "args": { "channel_id": old_id },
                                        "cmd": "UNSUBSCRIBE",
                                        "evt": evt,
                                    }),
                                    &mut users,
                                    &mut speaking,
                                );
                            }
                        }

                        users.clear();
                        speaking.clear();

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
                                    &mut speaking,
                                );
                            }

                            *&mut current_channel = Some(new_id.clone());

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
                                if let Ok(response) = recv_until_response(
                                    &mut channel_client,
                                    &nonce,
                                    &mut users,
                                    &mut speaking,
                                ) {
                                    if let Some(voice_states) = response["voice_states"].as_array()
                                    {
                                        for vs in voice_states {
                                            if let Some(user) = parse_user(vs) {
                                                users.insert(user.id.clone(), user);
                                            }
                                        }
                                    }

                                    current_channel_name =
                                        response["name"].as_str().unwrap_or("").to_string();
                                }
                            }

                            emit_channel_state(
                                &app,
                                new_id,
                                current_channel_name.clone(),
                                &mut users,
                                &mut speaking,
                            );
                        } else {
                            current_channel_name = String::new();

                            let _ =
                                app.emit_to("overlay", "channel-update", serde_json::Value::Null);
                        }
                    } else if let Some(channel_id) = &current_channel {
                        match data["evt"].as_str() {
                            Some("VOICE_STATE_CREATE") | Some("VOICE_STATE_UPDATE") => {
                                if let Some(user) = parse_user(&data["data"]) {
                                    users.insert(user.id.clone(), user);
                                    try_emit!(
                                        &app,
                                        channel_id,
                                        current_channel_name.clone(),
                                        &users,
                                        &speaking,
                                        last_emit
                                    );
                                }
                            }
                            Some("VOICE_STATE_DELETE") => {
                                if let Some(user_id) = data["data"]["user"]["id"].as_str() {
                                    users.remove(user_id);
                                    speaking.remove(user_id);

                                    try_emit!(
                                        &app,
                                        channel_id,
                                        current_channel_name.clone(),
                                        &users,
                                        &speaking,
                                        last_emit
                                    );
                                }
                            }
                            Some("SPEAKING_START") => {
                                if let Some(user_id) = data["data"]["user_id"].as_str() {
                                    speaking.insert(user_id.to_string());

                                    try_emit!(
                                        &app,
                                        channel_id,
                                        current_channel_name.clone(),
                                        &users,
                                        &speaking,
                                        last_emit
                                    );
                                }
                            }
                            Some("SPEAKING_STOP") => {
                                if let Some(user_id) = data["data"]["user_id"].as_str() {
                                    speaking.remove(user_id);

                                    try_emit!(
                                        &app,
                                        channel_id,
                                        current_channel_name.clone(),
                                        &users,
                                        &speaking,
                                        last_emit
                                    );
                                }
                            }
                            _ => {}
                        }
                    }
                }
                Err(_) => {
                    let _ =
                        app.emit_to("overlay", "channel-error", "Channel listener disconnected");
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

    update_vault(
        app_handle,
        "discord_access_token",
        token_response.access_token.clone(),
    )?;
    update_vault(
        app_handle,
        "discord_refresh_token",
        token_response.refresh_token.clone().unwrap_or_default(),
    )?;
    update_vault(
        app_handle,
        "discord_access_token_expires_at",
        (now + token_response.expires_in * 1000).to_string(),
    )?;
    update_vault(
        app_handle,
        "discord_refresh_token_expires_at",
        (now + token_response.expires_in * 1000 + 30 * 24 * 60 * 60 * 1000).to_string(),
    )?;

    save_vault(app_handle)?;

    Ok(())
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
        .post("https://discord.com/api/oauth2/token")
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

    let access_token_expires_at = get_vault_item(&app_handle, "discord_access_token_expires_at")?;
    let refresh_token_expires_at = get_vault_item(&app_handle, "discord_refresh_token_expires_at")?;
    let refresh_token = get_vault_item(&app_handle, "discord_refresh_token")?;
    let access_token = get_vault_item(&app_handle, "discord_access_token")?;

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
                            .post("https://discord.com/api/oauth2/token")
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
pub fn disconnect_discord(app_handle: AppHandle) -> Result<(), String> {
    let discord = app_handle.state::<Discord>();

    {
        let mut channel_guard = discord.stop_flag.lock().map_err(|e| e.to_string())?;

        if let Some(listener) = channel_guard.as_ref() {
            listener.store(true, Ordering::Relaxed);
        }

        *channel_guard = None;
    }

    app_handle
        .emit_to("overlay", "channel-update", serde_json::Value::Null)
        .map_err(|e| e.to_string())?;

    Ok(())
}
