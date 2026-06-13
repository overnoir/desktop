#![cfg(target_os = "macos")]
use tauri::{AppHandle, Emitter, Manager};
use tauri_nspanel::{
    tauri_panel, CollectionBehavior, ManagerExt, PanelLevel, StyleMask, WebviewWindowExt,
};

#[tauri::command]
pub fn init_nspanel(app_handle: AppHandle) {
    app_handle.plugin(tauri_nspanel::init()).unwrap();

    tauri_panel! {
        panel!(HoverActivatePanel {})

        panel_event!(MyPanelEventHandler {
            window_did_move(notification: &NSNotification) -> ()
        })
    }

    let window = app_handle.get_webview_window("overlay").unwrap();
    let panel = window.to_panel::<HoverActivatePanel>().unwrap();
    let handler = MyPanelEventHandler::new();
    let handle_move = app_handle.clone();

    handler.window_did_move(move |_| {
        let _ = handle_move.emit_to("overlay", "nspanel-moved", ());
    });

    panel.set_style_mask(StyleMask::empty().nonactivating_panel().into());
    panel.set_level(PanelLevel::MainMenu.value());
    panel.set_hides_on_deactivate(false);
    panel.set_works_when_modal(true);
    panel.set_collection_behavior(
        CollectionBehavior::new()
            .full_screen_auxiliary()
            .can_join_all_spaces()
            .into(),
    );

    panel.set_event_handler(Some(handler.as_ref()));
}

#[tauri::command]
pub fn set_nspanel_ignore_cursor(app_handle: AppHandle, value: bool) {
    if let Ok(panel) = app_handle.get_webview_panel("overlay") {
        panel.set_ignores_mouse_events(value);
    }
}
