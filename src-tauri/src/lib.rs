use tauri::{Manager, WebviewUrl};

#[tauri::command]
fn open_main(app: tauri::AppHandle) {
    if let Some(main) = app.get_webview_window("main") {
        main.show().unwrap();
        main.unminimize().unwrap();
        main.set_focus().unwrap();
    } else {
        tauri::WebviewWindowBuilder::new(&app, "main", WebviewUrl::App("/".into()))
            .build()
            .unwrap();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_main])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
