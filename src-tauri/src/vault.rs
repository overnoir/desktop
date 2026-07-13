use crate::types::{VaultItemMetadata, VaultState};
use iota_stronghold::Client;
use keyring::Entry;
use rand::{rngs::OsRng, RngCore};
use std::{
    collections::HashMap,
    fs,
    io::Write,
    sync::Mutex,
    time::{SystemTime, UNIX_EPOCH},
};
use tauri::{AppHandle, Manager};
use tauri_plugin_stronghold::stronghold::Stronghold;
use uuid::Uuid;

pub fn init_vault(app_handle: &AppHandle) {
    let salt_path = app_handle
        .path()
        .app_data_dir()
        .unwrap()
        .join("vault/salt.txt");

    if let Some(parent_dir) = salt_path.parent() {
        fs::create_dir_all(parent_dir).unwrap();
    }

    if !salt_path.exists() {
        let mut salt = [0u8; 32];
        OsRng.fill_bytes(&mut salt);
        let mut file = fs::File::create(&salt_path).unwrap();
        file.write_all(&salt).unwrap();
    }

    app_handle
        .plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())
        .unwrap();

    let vault_path = app_handle.path().app_data_dir().unwrap().join("vault/vault.hold");
    let name = &app_handle.package_info().name;
    let entry = Entry::new(&name, &whoami::username()).expect("failed to create keyring entry");
    let password = entry.get_password().unwrap_or_else(|_| {
        let new = Uuid::new_v4().simple().to_string();
        entry
            .set_password(&new)
            .expect("failed to save keychain passwords");
        new
    });

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

    let store_guard = vault_state.store.lock().map_err(|e| e.to_string())?;
    let store = store_guard
        .as_ref()
        .ok_or("Vault store is not initialized")?;

    store
        .clear()
        .map_err(|e| format!("Failed to clear vault: {}", e))?;

    save_vault(&app_handle)?;

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

pub fn get_vault_items(
    app_handle: &AppHandle,
    keys: &[&str],
) -> Result<HashMap<String, Option<String>>, String> {
    let vault_state = app_handle.state::<VaultState>();
    let store_guard = vault_state.store.lock().map_err(|e| e.to_string())?;
    let store = store_guard
        .as_ref()
        .ok_or("Vault store is not initialized")?;

    let mut result = HashMap::new();

    for &key in keys {
        let value = match store.get(key.as_bytes()) {
            Ok(Some(data)) => match serde_json::from_slice::<serde_json::Value>(&data) {
                Ok(parsed) => parsed["value"].as_str().map(|s| s.to_string()),
                Err(_) => None,
            },
            Ok(None) => None,
            Err(e) => return Err(format!("Failed to read vault: {}", e)),
        };
        result.insert(key.to_string(), value);
    }

    Ok(result)
}

pub fn update_vault_items(
    app_handle: &AppHandle,
    items: Vec<(&str, String)>,
) -> Result<(), String> {
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

        for (key, value) in items {
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
                .insert(
                    key.as_bytes().to_vec(),
                    serde_json::to_vec(&item).map_err(|e| e.to_string())?,
                    None,
                )
                .map_err(|e| format!("Failed to update vault: {}", e))?;
        }
    }

    save_vault(app_handle)
}

pub fn delete_vault_items(app_handle: &AppHandle, keys: &[&str]) -> Result<(), String> {
    let vault_state = app_handle.state::<VaultState>();

    let store_guard = vault_state.store.lock().map_err(|e| e.to_string())?;
    let store = store_guard
        .as_ref()
        .ok_or("Vault store is not initialized")?;

    for &key in keys {
        store
            .delete(key.as_bytes())
            .map_err(|e| format!("Failed to delete vault item: {}", e))?;
    }

    save_vault(app_handle)
}

fn save_vault(app_handle: &AppHandle) -> Result<(), String> {
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
