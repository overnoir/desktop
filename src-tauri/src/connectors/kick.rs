use crate::types::{ApiClient, KickStreamer};
use tauri::{AppHandle, Manager};

#[tauri::command]
pub async fn get_kick_streamers(
    app_handle: AppHandle,
    slugs: Vec<String>,
) -> Result<Vec<KickStreamer>, String> {
    app_handle
        .state::<ApiClient>()
        .get_kick_streamers(slugs)
        .await
}
