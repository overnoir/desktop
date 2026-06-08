use iota_stronghold::{Client, Store};
use serde::Serialize;
use std::{
    sync::Mutex,
    time::{SystemTime, UNIX_EPOCH},
};
use tauri::{AppHandle, Manager};
use tauri_plugin_keyring::KeyringExt;
use tauri_plugin_stronghold::stronghold::Stronghold;
use uuid::Uuid;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VaultItemMetadata {
    created_at: u64,
    updated_at: u64,
    key: String,
}

pub struct VaultState {
    stronghold: Mutex<Option<Stronghold>>,
    store: Mutex<Option<Store>>,
}

pub fn init_vault(app_handle: &AppHandle) {
    let salt_path = app_handle
        .path()
        .app_local_data_dir()
        .unwrap()
        .join("salt.txt");

    app_handle
        .plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())
        .unwrap();

    let vault_path = app_handle.path().app_data_dir().unwrap().join("vault.hold");
    let name = &app_handle.package_info().name;
    let password: String;

    let current_password = app_handle.keyring().get_password(&name, &name).unwrap();

    if let Some(current_password) = current_password {
        password = current_password;
    } else {
        let new_password = Uuid::new_v4().simple().to_string();

        app_handle
            .keyring()
            .set_password(&name, &name, &new_password)
            .unwrap();

        password = new_password;
    }

    let stronghold = Stronghold::new(vault_path, password.into_bytes()).unwrap();
    let client: Client;

    if let Ok(loaded_client) = stronghold.load_client(name) {
        client = loaded_client;
    } else {
        client = stronghold.create_client(name).unwrap();
    }

    app_handle.manage(VaultState {
        stronghold: Mutex::new(Some(stronghold)),
        store: Mutex::new(Some(client.store())),
    });
}

#[tauri::command]
pub fn clear_vault(app_handle: AppHandle) -> Result<(), String> {
    let vault_state = app_handle.state::<VaultState>();

    {
        let store_guard = vault_state.store.lock().map_err(|e| e.to_string())?;
        let store = store_guard
            .as_ref()
            .ok_or("Vault store is not initialized")?;

        store
            .clear()
            .map_err(|e| format!("Failed to clear vault: {}", e))?;
    }

    {
        let stronghold_guard = vault_state.stronghold.lock().map_err(|e| e.to_string())?;

        let stronghold = stronghold_guard
            .as_ref()
            .ok_or("Vault stronghold is not initialized")?;

        stronghold
            .save()
            .map_err(|e| format!("Failed to save vault after reset: {}", e))?;
    }

    Ok(())
}

#[tauri::command]
pub fn get_vault_metadata(app_handle: AppHandle) -> Result<Vec<VaultItemMetadata>, String> {
    let vault_state = app_handle.state::<VaultState>();

    let store_guard = vault_state.store.lock().map_err(|e| e.to_string())?;
    let store = store_guard
        .as_ref()
        .ok_or("Vault store is not initialized")?;

    let keys = store.keys().map_err(|e| e.to_string())?;

    let mut metadata = Vec::new();

    for key in keys {
        let key_str = String::from_utf8_lossy(&key).to_string();

        if let Some(value) = store.get(&key).map_err(|e| e.to_string())? {
            if let Ok(parsed) = serde_json::from_slice::<serde_json::Value>(&value) {
                metadata.push(VaultItemMetadata {
                    created_at: parsed["createdAt"].as_u64().unwrap_or(0),
                    updated_at: parsed["updatedAt"].as_u64().unwrap_or(0),
                    key: key_str,
                });
            }
        }
    }

    Ok(metadata)
}

pub fn get_vault_item(app_handle: &AppHandle, key: &str) -> Result<Option<String>, String> {
    let vault_state = app_handle.state::<VaultState>();
    let store_guard = vault_state.store.lock().map_err(|e| e.to_string())?;
    let store = store_guard
        .as_ref()
        .ok_or("Vault store is not initialized")?;

    match store.get(key.as_bytes()) {
        Ok(Some(data)) => match serde_json::from_slice::<serde_json::Value>(&data) {
            Ok(parsed) => Ok(parsed["value"].as_str().map(|s| s.to_string())),
            Err(_) => Ok(None),
        },
        Ok(None) => Ok(None),
        Err(e) => Err(format!("Failed to read vault: {}", e)),
    }
}

pub fn update_vault(app_handle: &AppHandle, key: &str, value: String) -> Result<(), String> {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_millis() as u64;

    let vault_state = app_handle.state::<VaultState>();

    {
        let store_guard = vault_state.store.lock().map_err(|e| e.to_string())?;
        let store = store_guard
            .as_ref()
            .ok_or("Vault store is not initialized")?;

        let existing = store
            .get(key.as_bytes())
            .map_err(|e| e.to_string())?
            .and_then(|data| serde_json::from_slice::<serde_json::Value>(&data).ok());

        let item = if let Some(ref existing) = existing {
            let created_at = existing["createdAt"].as_u64().unwrap_or(now);

            serde_json::json!({
                "createdAt": created_at,
                "updatedAt": now,
                "value": value,
            })
        } else {
            serde_json::json!({
                "createdAt": now,
                "value": value,
            })
        };

        store
            .insert(key.as_bytes().to_vec(), item.to_string().into_bytes(), None)
            .map_err(|e| format!("Failed to update vault: {}", e))?;
    }

    Ok(())
}

pub fn save_vault(app_handle: &AppHandle) -> Result<(), String> {
    let vault_state = app_handle.state::<VaultState>();

    {
        let stronghold_guard = vault_state.stronghold.lock().map_err(|e| e.to_string())?;
        let stronghold = stronghold_guard
            .as_ref()
            .ok_or("Vault stronghold is not initialized")?;

        stronghold
            .save()
            .map_err(|e| format!("Failed to save vault: {}", e))?;
    }

    Ok(())
}
