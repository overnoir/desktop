use tauri::{AppHandle, Manager};
use tauri_nspanel::{
    tauri_panel, CollectionBehavior, ManagerExt, PanelLevel, StyleMask, TrackingAreaOptions,
    WebviewWindowExt,
};

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![update_ignore_cursor])
        .plugin(tauri_plugin_single_instance::init(|app, _, _| {
            if let Some(window) = app.get_webview_window("main") {
                window.show().unwrap();
                window.unminimize().unwrap();
                window.set_focus().unwrap();
            }
        }))
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .plugin(tauri_plugin_prevent_default::debug())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_pinia::init())
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
            }

            #[cfg(target_os = "macos")]
            {
                app.set_activation_policy(tauri::ActivationPolicy::Accessory);
                app.handle().plugin(tauri_nspanel::init()).unwrap();
                init_nspanel(&app.app_handle());
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn init_nspanel(app_handle: &AppHandle) {
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

#[tauri::command]
fn update_ignore_cursor(app_handle: AppHandle, value: bool) {
    if let Ok(panel) = app_handle.get_webview_panel("overlay") {
        panel.set_ignores_mouse_events(value);
    }
}
