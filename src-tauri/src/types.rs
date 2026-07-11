use interprocess::local_socket::prelude::LocalSocketStream;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

#[derive(Debug, Deserialize, Serialize)]
pub struct OAuthTokenResponse {
    pub refresh_token: Option<String>,
    pub access_token: String,
    pub expires_in: u64,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DiscordConnectedUser {
    pub avatar: Option<String>,
    pub username: String,
    pub id: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct KickStreamerStream {
    pub category: String,
    pub is_live: bool,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct KickStreamer {
    pub stream: KickStreamerStream,
    pub profile_picture: String,
    pub name: String,
    pub slug: String,
    pub id: u64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemMemory {
    pub usage_percent: f64,
    pub total_gb: f64,
    pub used_gb: f64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemCpu {
    pub usage_percent: f64,
    pub active: usize,
    pub total: usize,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemBattery {
    pub percent: Option<u32>,
    pub is_charging: bool,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemNetwork {
    pub download: f64,
    pub upload: f64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct System {
    pub battery: Option<SystemBattery>,
    pub network: Option<SystemNetwork>,
    pub memory: Option<SystemMemory>,
    pub cpu: Option<SystemCpu>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VaultItemMetadata {
    pub created_at: u64,
    pub updated_at: u64,
    pub key: String,
}

pub struct ApiClient {
    pub client: reqwest::Client,
    pub base_url: String,
}

pub struct VaultState {
    pub stronghold: std::sync::Mutex<Option<tauri_plugin_stronghold::stronghold::Stronghold>>,
    pub store: std::sync::Mutex<Option<iota_stronghold::Store>>,
}

pub struct DiscordClient {
    pub stream: Option<LocalSocketStream>,
    pub http: reqwest::Client,
    pub client_id: String,
}

pub struct DiscordState {
    pub client: tokio::sync::Mutex<DiscordClient>,
}

pub struct NetworkPrev {
    pub download: u64,
    pub upload: u64,
}

pub struct SystemState {
    pub prev_network: Mutex<NetworkPrev>,
    pub sysinfo: Mutex<sysinfo::System>,
}
