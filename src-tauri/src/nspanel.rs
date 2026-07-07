#![cfg(target_os = "macos")]
use tauri::{
    AppHandle, Emitter, LogicalPosition, LogicalSize, Manager, Position, Runtime, Size, WebviewUrl,
};
use tauri_nspanel::{
    tauri_panel, CollectionBehavior, FromWindow, ManagerExt, Panel as PanelTrait, PanelBuilder,
    PanelLevel, StyleMask,
};

tauri_panel! {
    panel!(Panel {
         config: {
            can_become_main_window: false,
            can_become_key_window: true,
            is_floating_panel: true
        }
    })

    panel!(NonKeyPanel {
         config: {
            can_become_main_window: false,
            can_become_key_window: false,
            is_floating_panel: true
        }
    })

    panel_event!(PanelEventHandler {
        window_did_move(notification: &NSNotification) -> ()
    })
}

fn build_nspanel<R: Runtime, T: PanelTrait<R> + FromWindow<R> + 'static>(
    app_handle: &AppHandle<R>,
    label: &str,
    url: &str,
    x: f64,
    y: f64,
    width: f64,
    height: f64,
    shadow: bool,
    radius: f64,
) -> Result<std::sync::Arc<dyn PanelTrait<R>>, String> {
    PanelBuilder::<R, T>::new(app_handle, label)
        .collection_behavior(
            CollectionBehavior::new()
                .full_screen_auxiliary()
                .can_join_all_spaces()
                .ignores_cycle()
                .stationary(),
        )
        .position(Position::Logical(LogicalPosition::<f64> { x, y }))
        .style_mask(StyleMask::empty().nonactivating_panel())
        .size(Size::Logical(LogicalSize::<f64> {
            height,
            width,
        }))
        .url(WebviewUrl::App((&url).into()))
        .with_window(|window| {
            window
                .background_throttling(
                    tauri::utils::config::BackgroundThrottlingPolicy::Disabled,
                )
                .accept_first_mouse(true)
                .decorations(false)
                .transparent(true)
                .focusable(false)
                .focused(false)
        })
        .hides_on_deactivate(false)
        .level(PanelLevel::Normal)
        .works_when_modal(true)
        .corner_radius(radius)
        .has_shadow(shadow)
        .transparent(true)
        .no_activate(true)
        .build()
        .map_err(|e| format!("Failed to create '{}' nspanel: {}", label, e))
}

#[tauri::command]
pub fn create_nspanel(
    app_handle: AppHandle,
    label: String,
    url: String,
    x: f64,
    y: f64,
    width: f64,
    height: f64,
    shadow: bool,
    radius: f64,
    can_become_key_window: Option<bool>,
    with_event_handler: bool,
) -> Result<(), String> {
    let panel = if can_become_key_window.unwrap_or(true) {
        build_nspanel::<_, Panel>(
            &app_handle, &label, &url, x, y, width, height, shadow, radius,
        )?
    } else {
        build_nspanel::<_, NonKeyPanel>(
            &app_handle, &label, &url, x, y, width, height, shadow, radius,
        )?
    };

    if with_event_handler {
        let handler = PanelEventHandler::new();
        let handle = app_handle.to_owned();

        handler.window_did_move(move |_| {
            let _ = handle.emit_to(&label, "nspanel-moved", ());
        });

        panel.set_event_handler(Some(handler.as_ref()));
    }

    Ok(())
}

#[tauri::command]
pub fn set_nspanel_ignore_cursor(
    app_handle: AppHandle,
    label: String,
    value: bool,
) -> Result<(), String> {
    let panel = app_handle
        .get_webview_panel(&label)
        .map_err(|e| format!("Panel '{}' not found: {:?}", label, e))?;
    panel.set_ignores_mouse_events(value);
    Ok(())
}

#[tauri::command]
pub fn set_nspanel_always_on_top(
    app_handle: AppHandle,
    label: String,
    value: bool,
) -> Result<(), String> {
    let panel = app_handle
        .get_webview_panel(&label)
        .map_err(|e| format!("Panel '{}' not found: {:?}", label, e))?;
    if value {
        panel.set_level(PanelLevel::ScreenSaver.value() + 1);
    } else {
        panel.set_level(PanelLevel::Normal.value());
    }
    Ok(())
}

#[tauri::command]
pub fn destroy_nspanel(app_handle: AppHandle, label: String) -> Result<(), String> {
    let panel = app_handle
        .get_webview_panel(&label)
        .map_err(|e| format!("Panel '{}' not found: {:?}", label, e))?;

    let window = panel
        .to_window()
        .ok_or_else(|| format!("Failed to convert panel '{}' to window", label))?;

    window
        .destroy()
        .map_err(|e| format!("Failed to destroy window '{}': {:?}", label, e))?;

    Ok(())
}
