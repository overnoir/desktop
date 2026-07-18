use ::log::LevelFilter;
use std::env;
use std::panic;
use tauri::Manager;
use tauri_plugin_log::{Target, TargetKind};
mod api;
mod connectors;
mod logs;
mod nspanel;
mod types;
mod vault;
use api::init_api;
use connectors::discord::{
    connect_discord, disconnect_discord, discord_get_channel, discord_get_guild,
    discord_get_selected_voice_channel, discord_subscribe, discord_unsubscribe, init_discord,
};
use connectors::kick::get_kick_streamers;
use connectors::system::{get_system, init_system};
use logs::{clear_logs, get_logs};

#[cfg(target_os = "macos")]
use nspanel::{
    create_nspanel, destroy_nspanel, set_nspanel_always_on_top, set_nspanel_ignore_cursor,
};
use vault::{clear_vault, get_vault_metadata, init_vault};

pub fn run() {
    panic::set_hook(Box::new(|panic_info| {
        let location = panic_info
            .location()
            .map(|l| format!("{}:{}:{}", l.file(), l.line(), l.column()))
            .unwrap_or_else(|| "unknown".to_string());
        let payload = panic_info.payload();

        let message = if let Some(value) = payload.downcast_ref::<&str>() {
            *value
        } else if let Some(s) = payload.downcast_ref::<String>() {
            s.as_str()
        } else {
            "An unknown panic payload occurred."
        };

        let panic_message = format!("[PANIC] App panicked at {}, Message: {}", location, message);

        log::error!("{}", panic_message);
        eprintln!("{}", panic_message);
    }));

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            #[cfg(target_os = "macos")]
            set_nspanel_ignore_cursor,
            #[cfg(target_os = "macos")]
            set_nspanel_always_on_top,
            #[cfg(target_os = "macos")]
            destroy_nspanel,
            #[cfg(target_os = "macos")]
            create_nspanel,
            discord_get_selected_voice_channel,
            discord_get_channel,
            get_kick_streamers,
            get_vault_metadata,
            disconnect_discord,
            discord_get_guild,
            discord_subscribe,
            discord_unsubscribe,
            connect_discord,
            clear_vault,
            get_system,
            get_logs,
            clear_logs,
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
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_prevent_default::debug())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .clear_targets()
                .format(|out, message, record| {
                    out.finish(format_args!(
                        "[{}] [{}] [{}] {}",
                        chrono::Local::now().format("%d/%m/%Y"),
                        chrono::Local::now().format("%H:%M:%S"),
                        record.level(),
                        message
                    ))
                })
                .level(LevelFilter::Error)
                .target(Target::new(TargetKind::LogDir {
                    file_name: Some("logs".to_string()),
                }))
                .build(),
        )
        .setup(|app| {
            #[cfg(debug_assertions)]
            dotenvy::dotenv().unwrap();

            #[cfg(target_os = "macos")]
            {
                app.handle()
                    .set_activation_policy(tauri::ActivationPolicy::Accessory)
                    .unwrap();
                app.handle().plugin(tauri_nspanel::init()).unwrap();
            }

            app.handle()
                .plugin(
                    tauri_plugin_pinia::Builder::new()
                        .path(app.path().app_data_dir().unwrap().join("stores"))
                        .build(),
                )
                .unwrap();

            let api_url = env::var("API_URL").unwrap_or_else(|_| {
                option_env!("API_URL")
                    .expect("API_URL env not set")
                    .to_string()
            });
            let discord_client_id = env::var("DISCORD_CLIENT_ID").unwrap_or_else(|_| {
                option_env!("DISCORD_CLIENT_ID")
                    .expect("DISCORD_CLIENT_ID env not set")
                    .to_string()
            });

            init_discord(&app.app_handle(), &discord_client_id);
            init_api(&app.app_handle(), &api_url);
            init_system(&app.app_handle());
            init_vault(&app.app_handle());

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Error while running");
}
