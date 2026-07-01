use std::env;
use tauri::Manager;
mod api;
mod discord;
mod nspanel;
mod system;
mod vault;
use api::{api_get_kick_streamers, init_api};
use discord::{connect_discord, disconnect_discord, init_discord};
#[cfg(target_os = "macos")]
use nspanel::{init_nspanel, set_nspanel_always_on_top, set_nspanel_ignore_cursor};
use system::{connect_system, disconnect_system, init_system};
use vault::{clear_vault, get_vault_metadata, init_vault};

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            api_get_kick_streamers,
            get_vault_metadata,
            disconnect_discord,
            connect_discord,
            clear_vault,
            connect_system,
            disconnect_system,
            #[cfg(target_os = "macos")]
            init_nspanel,
            #[cfg(target_os = "macos")]
            set_nspanel_ignore_cursor,
            #[cfg(target_os = "macos")]
            set_nspanel_always_on_top
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
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_system_info::init())
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
            {
                app.handle()
                    .set_activation_policy(tauri::ActivationPolicy::Accessory)
                    .unwrap();
            }

            app.handle()
                .plugin(
                    tauri_plugin_pinia::Builder::new()
                        .path(app.path().app_data_dir().unwrap())
                        .build(),
                )
                .unwrap();

            let api_url =
                env::var("API_URL").unwrap_or_else(|_| option_env!("API_URL").unwrap().to_string());
            let discord_client_id = env::var("DISCORD_CLIENT_ID")
                .unwrap_or_else(|_| option_env!("DISCORD_CLIENT_ID").unwrap().to_string());

            init_discord(&app.app_handle(), &discord_client_id);
            init_api(&app.app_handle(), &api_url);
            init_system(&app.app_handle());
            init_vault(&app.app_handle());

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
