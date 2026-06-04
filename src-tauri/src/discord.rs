use crate::vault::{get_vault_item, update_vault};
use discord_rich_presence::{DiscordIpc, DiscordIpcClient};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::{
    env,
    sync::Mutex,
    time::{SystemTime, UNIX_EPOCH},
};
use tauri::{AppHandle, Manager};
use uuid::Uuid;

#[derive(Deserialize, Serialize)]
pub struct TokenResponse {
    access_token: String,
    token_type: String,
    expires_in: u64,
    scope: String,
    refresh_token: Option<String>,
}

pub struct DiscordState {
    client: Mutex<Option<DiscordIpcClient>>,
    client_secret: String,
    client_id: String,
}

pub fn init_discord(app_handle: AppHandle) {
    let discord_client_secret = env::var("DISCORD_CLIENT_SECRET").unwrap().to_string();
    let discord_client_id = env::var("DISCORD_CLIENT_ID").unwrap().to_string();
    let discord_client = DiscordIpcClient::new(&discord_client_id);

    app_handle.manage(DiscordState {
        client: Mutex::new(Some(discord_client)),
        client_secret: discord_client_secret,
        client_id: discord_client_id,
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
                        return Ok(());
                    }
                }
            }
        }
    }

    let token_response = authorize(&app_handle).await?;
    save_tokens(&app_handle, &token_response)?;
    authenticate(&state, &token_response.access_token)?;

    Ok(())
}

#[tauri::command]
pub fn disconnect_discord(app_handle: AppHandle) -> Result<(), String> {
    let state = app_handle.state::<DiscordState>();

    let mut client_guard = state.client.lock().map_err(|e| e.to_string())?;

    let client = client_guard
        .as_mut()
        .ok_or("Discord client is not initialized")?;

    client.close().map_err(|e| e.to_string())?;

    Ok(())
}
