#![cfg(target_os = "macos")]
use tauri::{AppHandle, Emitter, Manager};
use tauri_nspanel::{
    tauri_panel, CollectionBehavior, ManagerExt, PanelLevel, StyleMask, WebviewWindowExt,
};

tauri_panel! {
    panel!(Panel {})

    panel_event!(PanelEventHandler {
        window_did_move(notification: &NSNotification) -> ()
    })
}

#[tauri::command]
pub fn convert_webview_window_to_nspanel(
    app_handle: AppHandle,
    label: String,
    with_event_handler: Option<bool>,
) {
    let window = app_handle.get_webview_window(&label).unwrap();
    let panel = window.to_panel::<Panel>().unwrap();

    panel.set_style_mask(StyleMask::empty().nonactivating_panel().into());
    panel.set_hides_on_deactivate(false);
    panel.set_works_when_modal(true);
    panel.set_collection_behavior(
        CollectionBehavior::new()
            .full_screen_auxiliary()
            .can_join_all_spaces()
            .into(),
    );

    if with_event_handler.unwrap_or(false) {
        let handler = PanelEventHandler::new();
        let handle_move = app_handle.clone();

        handler.window_did_move(move |_| {
            let _ = handle_move.emit_to(&label, "nspanel-moved", ());
        });

        panel.set_event_handler(Some(handler.as_ref()));
    }
}

#[tauri::command]
pub fn convert_nspanel_to_webview_window(app_handle: AppHandle, label: String) {
    let panel = app_handle.get_webview_panel(&label).unwrap();
    panel.to_window().unwrap();
}

#[tauri::command]
pub fn set_nspanel_ignore_cursor(app_handle: AppHandle, label: String, value: bool) {
    if let Ok(panel) = app_handle.get_webview_panel(&label) {
        panel.set_ignores_mouse_events(value);
    }
}

#[tauri::command]
pub fn set_nspanel_always_on_top(app_handle: AppHandle, label: String, value: bool) {
    if let Ok(panel) = app_handle.get_webview_panel(&label) {
        if value {
            panel.set_level(PanelLevel::ScreenSaver.value() + 1);
        } else {
            panel.set_level(PanelLevel::Normal.value());
        }
    }
}
