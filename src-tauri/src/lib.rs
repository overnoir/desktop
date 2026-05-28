use discord_rich_presence::{DiscordIpc, DiscordIpcClient};
use iota_stronghold::{Client, Store};
use serde_json::json;
use std::{env, sync::Mutex};
use tauri::{AppHandle, Manager};
#[cfg(target_os = "macos")]
use tauri_nspanel::{
    tauri_panel, CollectionBehavior, ManagerExt, PanelLevel, StyleMask, TrackingAreaOptions,
    WebviewWindowExt,
};
use tauri_plugin_keyring::KeyringExt;
use tauri_plugin_stronghold::stronghold::Stronghold;
use uuid::Uuid;

struct DiscordState {
    client: Mutex<Option<DiscordIpcClient>>,
    client_secret: String,
    client_id: String,
}

struct VaultState {
    stronghold: Mutex<Option<Stronghold>>,
    store: Mutex<Option<Store>>,
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            authenticate_discord,
            authorize_discord,
            connect_discord,
            #[cfg(target_os = "macos")]
            set_nspanel_ignore_cursor,
            #[cfg(target_os = "macos")]
            init_macos
        ])
        .plugin(tauri_plugin_single_instance::init(|app, _, _| {
            if let Some(window) = app.get_webview_window("updater") {
                window.show().unwrap();
                window.unminimize().unwrap();
                window.set_focus().unwrap();
            } else if let Some(window) = app.get_webview_window("main") {
                window.show().unwrap();
                window.unminimize().unwrap();
                window.set_focus().unwrap();
            }
        }))
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .plugin(tauri_plugin_prevent_default::debug())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_keyring::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_pinia::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_os::init())
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                app.handle()
                    .plugin(
                        tauri_plugin_log::Builder::default()
                            .level(log::LevelFilter::Info)
                            .build(),
                    )
                    .unwrap();
                dotenvy::dotenv().unwrap();
            }

            #[cfg(target_os = "macos")]
            app.handle().plugin(tauri_nspanel::init()).unwrap();

            let salt_path = app.path().app_local_data_dir().unwrap().join("salt.txt");

            app.handle()
                .plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())?;

            let discord_client_secret = env::var("DISCORD_CLIENT_SECRET").unwrap().to_string();
            let discord_client_id = env::var("DISCORD_CLIENT_ID").unwrap().to_string();
            let discord_client = DiscordIpcClient::new(&discord_client_id);

            app.manage(DiscordState {
                client: Mutex::new(Some(discord_client)),
                client_secret: discord_client_secret,
                client_id: discord_client_id,
            });

            let vault_path = app.path().app_data_dir().unwrap().join("vault.hold");
            let name = &app.package_info().name;
            let password: String;

            let current_password = app
                .app_handle()
                .keyring()
                .get_password(&name, &name)
                .unwrap();

            if let Some(current_password) = current_password {
                password = current_password;
            } else {
                let new_password = Uuid::new_v4().simple().to_string();

                app.app_handle()
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

            app.manage(VaultState {
                stronghold: Mutex::new(Some(stronghold)),
                store: Mutex::new(Some(client.store())),
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(target_os = "macos")]
#[tauri::command]
fn init_macos(app_handle: AppHandle) {
    app_handle
        .set_activation_policy(tauri::ActivationPolicy::Accessory)
        .unwrap();

    tauri_panel! {
        panel!(HoverActivatePanel {
            config: {
                becomes_key_only_if_needed: true,
                can_become_main_window: false,
                can_become_key_window: true,
                is_floating_panel: true
            }
            with: {
                tracking_area: {
                    options: TrackingAreaOptions::new()
                        .active_always()
                        .mouse_entered_and_exited(),
                    auto_resize: true
                }
            }
        })

        panel_event!(MyPanelEventHandler {})
    }

    let window = app_handle.get_webview_window("overlay").unwrap();
    let panel = window.to_panel::<HoverActivatePanel>().unwrap();

    let handler = MyPanelEventHandler::new();

    let handle_enter = app_handle.clone();
    handler.on_mouse_entered(move |_| {
        if let Ok(panel) = handle_enter.get_webview_panel("overlay") {
            panel.make_key_window();
        }
    });

    let handle_exit = app_handle.clone();
    handler.on_mouse_exited(move |_| {
        if let Ok(panel) = handle_exit.get_webview_panel("overlay") {
            panel.resign_key_window();
        }
    });

    panel.set_level(PanelLevel::Custom(1001).value());

    panel.set_style_mask(StyleMask::empty().nonactivating_panel().into());

    panel.set_collection_behavior(
        CollectionBehavior::new()
            .full_screen_auxiliary()
            .can_join_all_spaces()
            .into(),
    );

    panel.set_hides_on_deactivate(false);
    panel.set_works_when_modal(true);

    panel.set_event_handler(Some(handler.as_ref()));
}

#[cfg(target_os = "macos")]
#[tauri::command]
fn set_nspanel_ignore_cursor(app_handle: AppHandle, value: bool) {
    if let Ok(panel) = app_handle.get_webview_panel("overlay") {
        panel.set_ignores_mouse_events(value);
    }
}

#[tauri::command]
fn connect_discord(app_handle: AppHandle) {
    let state = app_handle.state::<DiscordState>();

    let mut client_guard = state.client.lock().unwrap();

    let client = client_guard.as_mut().unwrap();

    client.connect().unwrap();
}

#[tauri::command]
fn authorize_discord(app_handle: AppHandle) {
    let state = app_handle.state::<DiscordState>();

    let mut client_guard = state.client.lock().unwrap();

    let client = client_guard.as_mut().unwrap();

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
        .unwrap();
}

#[tauri::command]
fn authenticate_discord(app_handle: AppHandle) {
    let state = app_handle.state::<DiscordState>();

    let mut client_guard = state.client.lock().unwrap();

    let client = client_guard.as_mut().unwrap();

    client
        .send(
            json!({
                "cmd": "AUTHENTICATE",
                "args": {
                    "access_token": ""
                },
                "nonce": Uuid::new_v4().to_string()
            }),
            1,
        )
        .unwrap();
}
