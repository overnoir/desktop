use crate::types::{
    DiscordClient, DiscordConnectedUser, DiscordState, DiscordSubscribe, OAuthTokenResponse,
};
use crate::vault::{
    delete_vault_items as delete_vault_items_fn, get_vault_items, update_vault_items,
};
use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine as _};
use rand::rngs::OsRng;
use rand::RngCore;
use serde_json::Value;
use sha2::{Digest, Sha256};
use std::sync::{atomic::AtomicBool, Arc};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Emitter, Manager};

pub fn init_discord(app_handle: &AppHandle) {
    app_handle.manage(DiscordState {
        client: tokio::sync::Mutex::new(DiscordClient::new()),
        expected_closed: Arc::new(AtomicBool::new(false)),
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

fn save_tokens(app_handle: &AppHandle, token_response: &OAuthTokenResponse) -> Result<(), String> {
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

#[tauri::command]
pub async fn connect_discord(
    app_handle: AppHandle,
    client_id: String,
) -> Result<DiscordConnectedUser, String> {
    let discord = app_handle.state::<DiscordState>();
    let mut client = discord.client.lock().await;

    client.set_client_id(&client_id);

    client.connect()?;
    discord
        .expected_closed
        .store(false, std::sync::atomic::Ordering::SeqCst);

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

    let user = if let Some(ref token) = access_token {
        if expires_at
            .and_then(|e| e.parse::<u64>().ok())
            .map_or(false, |e| e > now)
        {
            client.authenticate(token)?
        } else if let Some(ref refresh) = refresh_token {
            let token_response = client
                .exchange_code(&[
                    ("client_id", &client.client_id),
                    ("refresh_token", refresh.as_str()),
                    ("grant_type", "refresh_token"),
                ])
                .await?;
            save_tokens(&app_handle, &token_response)?;
            client.authenticate(&token_response.access_token)?
        } else {
            let verifier = generate_code_verifier()?;
            let challenge = derive_code_challenge(&verifier);

            let code = client.authorize(&challenge)?;
            let token_response = client
                .exchange_code(&[
                    ("client_id", &client.client_id),
                    ("grant_type", "authorization_code"),
                    ("code_verifier", verifier.as_str()),
                    ("code", code.as_str()),
                ])
                .await?;
            save_tokens(&app_handle, &token_response)?;
            client.authenticate(&token_response.access_token)?
        }
    } else {
        let verifier = generate_code_verifier()?;
        let challenge = derive_code_challenge(&verifier);

        let code = client.authorize(&challenge)?;
        let token_response = client
            .exchange_code(&[
                ("client_id", &client.client_id),
                ("grant_type", "authorization_code"),
                ("code_verifier", verifier.as_str()),
                ("code", code.as_str()),
            ])
            .await?;
        save_tokens(&app_handle, &token_response)?;
        client.authenticate(&token_response.access_token)?
    };

    let mut event_client = client
        .clone_stream()
        .map_err(|e| format!("Failed to clone stream: {}", e))?;
    let event_app_handle = app_handle.clone();
    let expected_closed = Arc::clone(&discord.expected_closed);

    tokio::task::spawn_blocking(move || loop {
        match event_client.read_frame() {
            Ok((1, payload)) => match serde_json::from_str::<Value>(&payload) {
                Ok(value) => {
                    if let Err(e) = event_app_handle.emit("discord-event", &value) {
                        log::error!("[DISCORD] Discord event emit failed: {}", e);
                    }
                }
                Err(e) => log::error!("[DISCORD] Discord event parse failed: {}", e),
            },
            Ok((2, _)) => {
                if !expected_closed.load(std::sync::atomic::Ordering::SeqCst) {
                    log::error!("[DISCORD] Discord closed the connection");
                }
                let _ = event_app_handle.emit("discord-disconnected", ());
                return;
            }
            Ok(_) => {}
            Err(e) => {
                if !expected_closed.load(std::sync::atomic::Ordering::SeqCst) {
                    log::error!("[DISCORD] Discord event thread error: {}", e);
                }
                let _ = event_app_handle.emit("discord-disconnected", ());
                return;
            }
        }
    });

    Ok(user)
}

#[tauri::command]
pub async fn disconnect_discord(
    app_handle: AppHandle,
    delete_vault_items: bool,
) -> Result<(), String> {
    let discord = app_handle.state::<DiscordState>();
    let mut client = discord.client.lock().await;

    discord
        .expected_closed
        .store(true, std::sync::atomic::Ordering::SeqCst);
    if let Err(e) = client.close() {
        log::error!("[DISCORD] Failed to send close frame: {}", e);
    }

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

#[tauri::command]
pub async fn discord_subscribe(
    app_handle: AppHandle,
    events: Vec<DiscordSubscribe>,
) -> Result<(), String> {
    let discord = app_handle.state::<DiscordState>();
    let mut client = discord.client.lock().await;

    for item in &events {
        client.subscribe(&item.event, item.args.clone())?;
    }

    Ok(())
}

#[tauri::command]
pub async fn discord_unsubscribe(
    app_handle: AppHandle,
    events: Vec<DiscordSubscribe>,
) -> Result<(), String> {
    let discord = app_handle.state::<DiscordState>();
    let mut client = discord.client.lock().await;

    for item in &events {
        client.unsubscribe(&item.event, item.args.clone())?;
    }

    Ok(())
}

#[tauri::command]
pub async fn discord_get_selected_voice_channel(app_handle: AppHandle) -> Result<(), String> {
    let discord = app_handle.state::<DiscordState>();
    let mut client = discord.client.lock().await;

    client.get_selected_voice_channel()
}

#[tauri::command]
pub async fn discord_get_channel(app_handle: AppHandle, channel_id: String) -> Result<(), String> {
    let discord = app_handle.state::<DiscordState>();
    let mut client = discord.client.lock().await;

    client.get_channel(&channel_id)
}

#[tauri::command]
pub async fn discord_get_guild(app_handle: AppHandle, guild_id: String) -> Result<(), String> {
    let discord = app_handle.state::<DiscordState>();
    let mut client = discord.client.lock().await;

    client.get_guild(&guild_id)
}
