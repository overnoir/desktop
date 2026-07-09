use serde::{Deserialize, Serialize};
use std::sync::{atomic::AtomicBool, Arc, Mutex};

#[derive(Debug, Deserialize, Serialize)]
pub struct OAuthTokenResponse {
    pub refresh_token: Option<String>,
    pub access_token: String,
    pub expires_in: u64,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DiscordUser {
    pub global_name: Option<String>,
    pub avatar: Option<String>,
    pub is_self_deafened: bool,
    pub discriminator: String,
    pub nick: Option<String>,
    pub is_self_muted: bool,
    pub is_suppress: bool,
    pub is_deafened: bool,
    pub is_speaking: bool,
    pub username: String,
    pub is_muted: bool,
    pub is_bot: bool,
    pub id: String,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DiscordChannel {
    pub users: Vec<DiscordUser>,
    pub name: String,
    pub id: String,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DiscordGuild {
    pub icon_url: Option<String>,
    pub channel: DiscordChannel,
    pub name: String,
    pub id: String,
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

pub struct DiscordState {
    pub client: Mutex<Option<discord_rich_presence::DiscordIpcClient>>,
    pub stop_flag: Mutex<Option<Arc<AtomicBool>>>,
    pub client_id: String,
}

pub struct NetworkPrev {
    pub download: u64,
    pub upload: u64,
}

pub struct SystemState {
    pub prev_network: Mutex<NetworkPrev>,
    pub sysinfo: Mutex<sysinfo::System>,
}
