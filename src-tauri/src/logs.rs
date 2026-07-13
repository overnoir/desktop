use std::fs;
use tauri::AppHandle;
use tauri::Manager;

#[tauri::command]
pub fn get_logs(app_handle: AppHandle) -> Result<Vec<String>, String> {
    let path = app_handle
        .path()
        .app_log_dir()
        .map_err(|e| format!("Failed to get log dir: {}", e))?
        .join("logs.log");

    let content = match fs::read_to_string(&path) {
        Ok(c) => c,
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => return Ok(vec![]),
        Err(e) => return Err(format!("Failed to read log file: {}", e)),
    };

    let lines: Vec<String> = content.lines().rev().map(String::from).collect();

    Ok(lines.into_iter().rev().collect())
}
