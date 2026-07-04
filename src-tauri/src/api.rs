use crate::types::{ApiClient, KickStreamer};
use tauri::AppHandle;
use tauri::Manager;

impl ApiClient {
    fn join_query_values<T: std::fmt::Display>(key: &str, values: &[T]) -> String {
        values
            .iter()
            .map(|v| format!("{}={}", key, v))
            .collect::<Vec<_>>()
            .join("&")
    }

    async fn get_with_query<T: serde::de::DeserializeOwned>(
        &self,
        path: &str,
        key: &str,
        values: &[String],
    ) -> Result<T, String> {
        let query = Self::join_query_values(key, values);
        let url = format!("{}{}?{}", self.base_url, path, query);
        self.client
            .get(&url)
            .send()
            .await
            .map_err(|e| format!("API request failed: {}", e))?
            .json()
            .await
            .map_err(|e| format!("Failed to parse API response: {}", e))
    }

    pub async fn get_kick_streamers(
        &self,
        slugs: Vec<String>,
    ) -> Result<Vec<KickStreamer>, String> {
        self.get_with_query("/kick/streamers", "slug", &slugs).await
    }
}

pub fn init_api(app_handle: &AppHandle, base_url: &str) {
    app_handle.manage(ApiClient {
        base_url: base_url.to_string(),
        client: reqwest::Client::new(),
    });
}
