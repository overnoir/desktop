use crate::vault::{get_vault_item, update_vault};
use discord_rich_presence::{DiscordIpc, DiscordIpcClient};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{
    collections::{HashMap, HashSet},
    env,
    sync::atomic::{AtomicBool, Ordering},
    sync::{Arc, Mutex},
    thread,
    time::{SystemTime, UNIX_EPOCH},
};
use tauri::{AppHandle, Emitter, Manager};
use uuid::Uuid;

#[derive(Deserialize, Serialize)]
pub struct TokenResponse {
    access_token: String,
    token_type: String,
    expires_in: u64,
    scope: String,
    refresh_token: Option<String>,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct VoiceUser {
    user_id: String,
    username: String,
    discriminator: String,
    avatar: Option<String>,
    nick: Option<String>,
    is_speaking: bool,
    is_muted: bool,
    is_deafened: bool,
    is_self_muted: bool,
    is_self_deafened: bool,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct VoiceChannelState {
    channel_id: Option<String>,
    channel_name: Option<String>,
    guild_id: Option<String>,
    users: Vec<VoiceUser>,
    current_user_id: Option<String>,
}

struct VoiceListener {
    stop_flag: Arc<AtomicBool>,
}

pub struct DiscordState {
    client: Mutex<Option<DiscordIpcClient>>,
    client_secret: String,
    client_id: String,
    voice_listener: Mutex<Option<VoiceListener>>,
}

pub fn init_discord(app_handle: AppHandle) {
    let discord_client_secret = env::var("DISCORD_CLIENT_SECRET").unwrap().to_string();
    let discord_client_id = env::var("DISCORD_CLIENT_ID").unwrap().to_string();
    let discord_client = DiscordIpcClient::new(&discord_client_id);

    app_handle.manage(DiscordState {
        client: Mutex::new(Some(discord_client)),
        client_secret: discord_client_secret,
        client_id: discord_client_id,
        voice_listener: Mutex::new(None),
    });
}

fn connect_rpc(state: &DiscordState) -> Result<(), String> {
    let mut client_guard = state.client.lock().map_err(|e| e.to_string())?;
    let client = client_guard
        .as_mut()
        .ok_or("Discord client is not initialized")?;

    client.connect().map_err(|e| e.to_string())?;

    Ok(())
}

fn authenticate(state: &DiscordState, access_token: &str) -> Result<(), String> {
    let mut client_guard = state.client.lock().map_err(|e| e.to_string())?;
    let client = client_guard
        .as_mut()
        .ok_or("Discord client is not initialized")?;

    client
        .send(
            json!({
                "cmd": "AUTHENTICATE",
                "args": {
                    "access_token": access_token
                },
                "nonce": Uuid::new_v4().to_string()
            }),
            1,
        )
        .map_err(|e| e.to_string())?;

    client.recv().map_err(|e| e.to_string())?;

    Ok(())
}

fn parse_voice_user(data: &Value) -> Option<VoiceUser> {
    let user = data["user"].as_object()?;
    let user_id = user["id"].as_str()?.to_string();
    let username = user["username"].as_str()?.to_string();
    let discriminator = user
        .get("discriminator")
        .and_then(|d| d.as_str())
        .unwrap_or("0")
        .to_string();
    let avatar = user
        .get("avatar")
        .and_then(|a| a.as_str())
        .map(|s| s.to_string());
    let nick = data["nick"].as_str().map(|s| s.to_string());
    let voice_state = &data["voice_state"];

    Some(VoiceUser {
        user_id,
        username,
        discriminator,
        avatar,
        nick,
        is_speaking: false,
        is_muted: voice_state["mute"].as_bool().unwrap_or(false),
        is_deafened: voice_state["deaf"].as_bool().unwrap_or(false),
        is_self_muted: voice_state["self_mute"].as_bool().unwrap_or(false),
        is_self_deafened: voice_state["self_deaf"].as_bool().unwrap_or(false),
    })
}

fn recv_until_response(
    client: &mut DiscordIpcClient,
    nonce: &str,
    users: &mut HashMap<String, VoiceUser>,
    speaking: &mut HashSet<String>,
) -> Result<Value, String> {
    loop {
        let (_, data) = client.recv().map_err(|e| e.to_string())?;

        if data["nonce"].as_str() == Some(nonce) {
            return Ok(data["data"].clone());
        }

        match data["evt"].as_str() {
            Some("VOICE_STATE_CREATE") | Some("VOICE_STATE_UPDATE") => {
                if let Some(user) = parse_voice_user(&data["data"]) {
                    users.insert(user.user_id.clone(), user);
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

fn emit_voice_state(
    app: &AppHandle,
    channel_id: &str,
    channel_name: Option<String>,
    guild_id: Option<String>,
    users: &HashMap<String, VoiceUser>,
    speaking: &HashSet<String>,
    current_user_id: Option<String>,
) {
    let voice_users: Vec<VoiceUser> = users
        .values()
        .map(|u| {
            let mut u = u.clone();
            u.is_speaking = speaking.contains(&u.user_id);
            u
        })
        .collect();

    let state = VoiceChannelState {
        channel_id: Some(channel_id.to_string()),
        channel_name,
        guild_id,
        users: voice_users,
        current_user_id,
    };

    let _ = app.emit("voice-state", &state);
}

fn handle_channel_change(
    app: &AppHandle,
    voice_client: &mut DiscordIpcClient,
    data: &Value,
    users: &mut HashMap<String, VoiceUser>,
    speaking: &mut HashSet<String>,
    current_channel: &mut Option<String>,
    current_channel_name: &mut Option<String>,
    current_guild_id: &mut Option<String>,
    current_user_id: Option<String>,
) {
    let new_channel_id = data["data"]["channel_id"].as_str().map(|s| s.to_string());
    *current_guild_id = data["data"]["guild_id"].as_str().map(|s| s.to_string());

    if let Some(old_id) = current_channel.take() {
        let events = [
            "VOICE_STATE_CREATE",
            "VOICE_STATE_UPDATE",
            "VOICE_STATE_DELETE",
            "SPEAKING_START",
            "SPEAKING_STOP",
        ];

        for evt in &events {
            let unsub = json!({
                "cmd": "UNSUBSCRIBE",
                "evt": evt,
                "args": { "channel_id": old_id },
                "nonce": Uuid::new_v4().to_string()
            });
            let _ = voice_client.send(unsub, 1);
            let _ = voice_client.recv();
        }
    }

    users.clear();
    speaking.clear();

    if let Some(ref new_id) = new_channel_id {
        let events = [
            "VOICE_STATE_CREATE",
            "VOICE_STATE_UPDATE",
            "VOICE_STATE_DELETE",
            "SPEAKING_START",
            "SPEAKING_STOP",
        ];

        for evt in &events {
            let sub = json!({
                "cmd": "SUBSCRIBE",
                "evt": evt,
                "args": { "channel_id": new_id },
                "nonce": Uuid::new_v4().to_string()
            });
            let _ = voice_client.send(sub, 1);
            let _ = voice_client.recv();
        }

        let nonce = Uuid::new_v4().to_string();
        let get_channel = json!({
            "cmd": "GET_CHANNEL",
            "args": { "channel_id": new_id },
            "nonce": nonce.clone()
        });

        if voice_client.send(get_channel, 1).is_ok() {
            if let Ok(response) = recv_until_response(voice_client, &nonce, users, speaking) {
                if let Some(voice_states) = response["voice_states"].as_array() {
                    for vs in voice_states {
                        if let Some(user) = parse_voice_user(vs) {
                            users.insert(user.user_id.clone(), user);
                        }
                    }
                }

                *current_channel_name = response["name"].as_str().map(|s| s.to_string());
            }
        }

        emit_voice_state(
            app,
            new_id,
            current_channel_name.clone(),
            current_guild_id.clone(),
            users,
            speaking,
            current_user_id.clone(),
        );
    } else {
        *current_channel_name = None;
        *current_guild_id = None;

        emit_voice_state(
            app,
            "",
            None,
            None,
            &HashMap::new(),
            &HashSet::new(),
            current_user_id.clone(),
        );
    }
}

fn start_voice_listener(app_handle: &AppHandle) -> Result<(), String> {
    let discord_state = app_handle.state::<DiscordState>();

    {
        let mut voice_guard = discord_state
            .voice_listener
            .lock()
            .map_err(|e| e.to_string())?;

        if let Some(listener) = voice_guard.as_ref() {
            listener.stop_flag.store(true, Ordering::Relaxed);
        }

        *voice_guard = None;
    }

    let stop_flag = Arc::new(AtomicBool::new(false));
    let listener_stop = stop_flag.clone();
    let app = app_handle.clone();
    let client_id = discord_state.client_id.clone();

    thread::spawn(move || {
        let mut voice_client = DiscordIpcClient::new(&client_id);

        if voice_client.connect().is_err() {
            let _ = app.emit("voice-error", "Voice RPC connection failed");
            return;
        }

        let access_token = match get_vault_item(&app, "discord_access_token") {
            Ok(Some(token)) => token,
            Ok(None) => {
                let _ = app.emit("voice-error", "No access token for voice listener");
                return;
            }
            Err(e) => {
                let _ = app.emit("voice-error", format!("Failed to read token: {}", e));
                return;
            }
        };

        let auth = json!({
            "cmd": "AUTHENTICATE",
            "args": { "access_token": access_token },
            "nonce": Uuid::new_v4().to_string()
        });

        let auth_response = if voice_client.send(auth, 1).is_err() {
            let _ = app.emit("voice-error", "Voice auth failed");
            return;
        } else {
            match voice_client.recv() {
                Ok((_, resp)) => resp,
                Err(_) => {
                    let _ = app.emit("voice-error", "Voice auth failed");
                    return;
                }
            }
        };

        let current_user_id = auth_response["data"]["user"]["id"]
            .as_str()
            .map(|s| s.to_string());

        let sub_vcs = json!({
            "cmd": "SUBSCRIBE",
            "evt": "VOICE_CHANNEL_SELECT",
            "nonce": Uuid::new_v4().to_string()
        });

        if voice_client.send(sub_vcs, 1).is_err() || voice_client.recv().is_err() {
            let _ = app.emit("voice-error", "Failed to subscribe to VOICE_CHANNEL_SELECT");
            return;
        }

        let get_current = json!({
            "cmd": "GET_SELECTED_VOICE_CHANNEL",
            "nonce": Uuid::new_v4().to_string()
        });

        if voice_client.send(get_current, 1).is_err() {
            return;
        }

        let mut users: HashMap<String, VoiceUser> = HashMap::new();
        let mut speaking: HashSet<String> = HashSet::new();
        let mut current_channel: Option<String> = None;
        let mut current_channel_name: Option<String> = None;
        let mut current_guild_id: Option<String> = None;
        let current_user_id = current_user_id;

        if let Ok((_, response)) = voice_client.recv() {
            if response["data"].is_object() && response["data"]["id"].is_string() {
                let channel_id = response["data"]["id"].as_str().unwrap().to_string();
                current_channel = Some(channel_id.clone());

                if let Some(voice_states) = response["data"]["voice_states"].as_array() {
                    for vs in voice_states {
                        if let Some(user) = parse_voice_user(vs) {
                            users.insert(user.user_id.clone(), user);
                        }
                    }
                }

                let events = [
                    "VOICE_STATE_CREATE",
                    "VOICE_STATE_UPDATE",
                    "VOICE_STATE_DELETE",
                    "SPEAKING_START",
                    "SPEAKING_STOP",
                ];

                for evt in &events {
                    let sub = json!({
                        "cmd": "SUBSCRIBE",
                        "evt": evt,
                        "args": { "channel_id": channel_id },
                        "nonce": Uuid::new_v4().to_string()
                    });
                    let _ = voice_client.send(sub, 1);
                    let _ = voice_client.recv();
                }

                current_channel_name = response["data"]["name"].as_str().map(|s| s.to_string());
                current_guild_id = response["data"]["guild_id"].as_str().map(|s| s.to_string());

                emit_voice_state(
                    &app,
                    &channel_id,
                    current_channel_name.clone(),
                    current_guild_id.clone(),
                    &users,
                    &speaking,
                    current_user_id.clone(),
                );
            }
        }

        while !listener_stop.load(Ordering::Relaxed) {
            match voice_client.recv() {
                Ok((_, data)) => {
                    if data["evt"] == "VOICE_CHANNEL_SELECT" {
                        handle_channel_change(
                            &app,
                            &mut voice_client,
                            &data,
                            &mut users,
                            &mut speaking,
                            &mut current_channel,
                            &mut current_channel_name,
                            &mut current_guild_id,
                            current_user_id.clone(),
                        );
                    } else if let Some(channel_id) = &current_channel {
                        match data["evt"].as_str() {
                            Some("VOICE_STATE_CREATE") | Some("VOICE_STATE_UPDATE") => {
                                if let Some(user) = parse_voice_user(&data["data"]) {
                                    let channel_name = current_channel_name.clone();
                                    let guild_id = current_guild_id.clone();

                                    users.insert(user.user_id.clone(), user);
                                    emit_voice_state(
                                        &app,
                                        channel_id,
                                        channel_name,
                                        guild_id,
                                        &users,
                                        &speaking,
                                        current_user_id.clone(),
                                    );
                                }
                            }
                            Some("VOICE_STATE_DELETE") => {
                                if let Some(user_id) = data["data"]["user"]["id"].as_str() {
                                    users.remove(user_id);
                                    speaking.remove(user_id);

                                    let channel_name = current_channel_name.clone();
                                    let guild_id = current_guild_id.clone();

                                    emit_voice_state(
                                        &app,
                                        channel_id,
                                        channel_name,
                                        guild_id,
                                        &users,
                                        &speaking,
                                        current_user_id.clone(),
                                    );
                                }
                            }
                            Some("SPEAKING_START") => {
                                if let Some(user_id) = data["data"]["user_id"].as_str() {
                                    speaking.insert(user_id.to_string());

                                    let channel_name = current_channel_name.clone();
                                    let guild_id = current_guild_id.clone();

                                    emit_voice_state(
                                        &app,
                                        channel_id,
                                        channel_name,
                                        guild_id,
                                        &users,
                                        &speaking,
                                        current_user_id.clone(),
                                    );
                                }
                            }
                            Some("SPEAKING_STOP") => {
                                if let Some(user_id) = data["data"]["user_id"].as_str() {
                                    speaking.remove(user_id);

                                    let channel_name = current_channel_name.clone();
                                    let guild_id = current_guild_id.clone();

                                    emit_voice_state(
                                        &app,
                                        channel_id,
                                        channel_name,
                                        guild_id,
                                        &users,
                                        &speaking,
                                        current_user_id.clone(),
                                    );
                                }
                            }
                            _ => {}
                        }
                    }
                }
                Err(_) => {
                    let _ = app.emit("voice-error", "Voice listener disconnected");
                    break;
                }
            }
        }

        let _ = voice_client.close();
    });

    {
        let mut voice_guard = discord_state
            .voice_listener
            .lock()
            .map_err(|e| e.to_string())?;
        *voice_guard = Some(VoiceListener { stop_flag });
    }

    Ok(())
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

    Ok(())
}

async fn refresh_access_token(
    app_handle: &AppHandle,
    refresh_token: &str,
) -> Result<TokenResponse, String> {
    let state = app_handle.state::<DiscordState>();

    let params = [
        ("client_id", state.client_id.as_str()),
        ("client_secret", state.client_secret.as_str()),
        ("grant_type", "refresh_token"),
        ("refresh_token", refresh_token),
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

    serde_json::from_str(&response_text)
        .map_err(|e| format!("Failed to parse refresh response: {}", e))
}

async fn authorize(app_handle: &AppHandle) -> Result<TokenResponse, String> {
    let state = app_handle.state::<DiscordState>();

    let code = {
        let mut client_guard = state.client.lock().map_err(|e| e.to_string())?;
        let client = client_guard
            .as_mut()
            .ok_or("Discord client is not initialized")?;

        client
            .send(
                json!({
                    "cmd": "AUTHORIZE",
                    "args": {
                        "client_id": state.client_id,
                        "scopes": ["rpc"]
                    },
                    "nonce": Uuid::new_v4().to_string()
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
        ("client_id", state.client_id.as_str()),
        ("client_secret", state.client_secret.as_str()),
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
pub async fn connect_discord(app_handle: AppHandle) -> Result<(), String> {
    let state = app_handle.state::<DiscordState>();

    connect_rpc(&state)?;

    let access_token = get_vault_item(&app_handle, "discord_access_token")?;
    let access_token_expires_at = get_vault_item(&app_handle, "discord_access_token_expires_at")?;
    let refresh_token = get_vault_item(&app_handle, "discord_refresh_token")?;
    let refresh_token_expires_at = get_vault_item(&app_handle, "discord_refresh_token_expires_at")?;

    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_millis() as u64;

    if let Some(ref token) = access_token {
        if let Some(ref expires_at_str) = access_token_expires_at {
            if let Ok(expires_at) = expires_at_str.parse::<u64>() {
                if expires_at > now {
                    authenticate(&state, token)?;
                    start_voice_listener(&app_handle)?;
                    return Ok(());
                }
            }
        }

        if let Some(ref refresh) = refresh_token {
            if let Some(ref expires_at_str) = refresh_token_expires_at {
                if let Ok(expires_at) = expires_at_str.parse::<u64>() {
                    if expires_at > now {
                        let token_response = refresh_access_token(&app_handle, refresh).await?;
                        save_tokens(&app_handle, &token_response)?;
                        authenticate(&state, &token_response.access_token)?;
                        start_voice_listener(&app_handle)?;
                        return Ok(());
                    }
                }
            }
        }
    }

    let token_response = authorize(&app_handle).await?;
    save_tokens(&app_handle, &token_response)?;
    authenticate(&state, &token_response.access_token)?;
    start_voice_listener(&app_handle)?;

    Ok(())
}

#[tauri::command]
pub fn disconnect_discord(app_handle: AppHandle) -> Result<(), String> {
    let state = app_handle.state::<DiscordState>();

    {
        let mut voice_guard = state.voice_listener.lock().map_err(|e| e.to_string())?;

        if let Some(listener) = voice_guard.as_ref() {
            listener.stop_flag.store(true, Ordering::Relaxed);
        }

        *voice_guard = None;
    }

    let empty = VoiceChannelState {
        channel_id: None,
        channel_name: None,
        guild_id: None,
        users: vec![],
        current_user_id: None,
    };

    let _ = app_handle.emit("voice-state", &empty);

    let mut client_guard = state.client.lock().map_err(|e| e.to_string())?;

    let client = client_guard
        .as_mut()
        .ok_or("Discord client is not initialized")?;

    client.close().map_err(|e| e.to_string())?;

    Ok(())
}
