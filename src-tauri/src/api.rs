use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tauri::Manager;

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct KickChannel {
    pub profile_picture: String,
    pub slug: String,
    pub id: u64,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct KickLivestream {
    pub category: String,
    pub slug: String,
}

pub struct ApiClient {
    client: reqwest::Client,
    base_url: String,
}

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

    pub async fn fetch_kick_channels(
        &self,
        slugs: Vec<String>,
    ) -> Result<Vec<KickChannel>, String> {
        self.get_with_query("/kick/channels", "slug", &slugs).await
    }

    pub async fn fetch_kick_livestreams(
        &self,
        ids: Vec<u64>,
    ) -> Result<Vec<KickLivestream>, String> {
        let ids_str: Vec<String> = ids.iter().map(|id| id.to_string()).collect();
        self.get_with_query("/kick/livestreams", "id", &ids_str)
            .await
    }
}

pub fn init_api(app_handle: &AppHandle, base_url: &str) {
    app_handle.manage(ApiClient {
        base_url: base_url.to_string(),
        client: reqwest::Client::new(),
    });
}

#[tauri::command]
pub async fn api_fetch_kick_channels(
    app_handle: AppHandle,
    slugs: Vec<String>,
) -> Result<Vec<KickChannel>, String> {
    app_handle
        .state::<ApiClient>()
        .fetch_kick_channels(slugs)
        .await
}

#[tauri::command]
pub async fn api_fetch_kick_livestreams(
    app_handle: AppHandle,
    ids: Vec<u64>,
) -> Result<Vec<KickLivestream>, String> {
    app_handle
        .state::<ApiClient>()
        .fetch_kick_livestreams(ids)
        .await
}
