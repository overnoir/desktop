use std::path::PathBuf;
use tauri::AppHandle;
use tauri::Manager;
use tokio::fs;

fn get_logs_path(app_handle: &AppHandle) -> Result<PathBuf, String> {
    Ok(app_handle
        .path()
        .app_log_dir()
        .map_err(|e| format!("Failed to get log dir: {}", e))?
        .join("logs.log"))
}

#[tauri::command]
pub async fn get_logs(app_handle: AppHandle) -> Result<Vec<String>, String> {
    let path = get_logs_path(&app_handle)?;

    let content = match fs::read_to_string(&path).await {
        Ok(c) => c,
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => return Ok(vec![]),
        Err(e) => return Err(format!("Failed to read log file: {}", e)),
    };

    let lines: Vec<String> = content.lines().rev().map(String::from).collect();

    Ok(lines.into_iter().rev().collect())
}

#[tauri::command]
pub async fn clear_logs(app_handle: AppHandle) -> Result<(), String> {
    let path = get_logs_path(&app_handle)?;

    match fs::OpenOptions::new().write(true).truncate(true).open(&path).await {
        Ok(_) => Ok(()),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(()),
        Err(e) => Err(format!("Failed to clear logs: {}", e)),
    }
}
