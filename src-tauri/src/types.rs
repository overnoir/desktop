use serde::{Deserialize, Serialize};
use std::sync::{atomic::AtomicBool, Arc, Mutex};

#[derive(Debug, Deserialize, Serialize)]
pub struct TokenResponse {
    pub refresh_token: Option<String>,
    pub access_token: String,
    pub expires_in: u64,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct User {
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
pub struct Channel {
    pub users: Vec<User>,
    pub name: String,
    pub id: String,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Guild {
    pub icon_url: Option<String>,
    pub channel: Channel,
    pub name: String,
    pub id: String,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ConnectedUser {
    pub avatar: Option<String>,
    pub username: String,
    pub id: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct KickUser {
    pub profile_picture: String,
    pub name: String,
    pub id: u64,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct KickChannelStream {
    pub is_live: bool,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct KickChannelCategory {
    pub name: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct KickChannel {
    pub category: KickChannelCategory,
    pub stream: KickChannelStream,
    pub slug: String,
    pub id: u64,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct KickStreamer {
    pub channel: KickChannel,
    pub user: KickUser,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MemoryPayload {
    pub usage_percent: f64,
    pub total_gb: f64,
    pub used_gb: f64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CpuPayload {
    pub usage_percent: f64,
    pub active: usize,
    pub total: usize,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BatteryPayload {
    pub percent: Option<u32>,
    pub is_charging: bool,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NetworkPayload {
    pub download: f64,
    pub upload: f64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemPayload {
    pub battery: BatteryPayload,
    pub network: NetworkPayload,
    pub memory: MemoryPayload,
    pub cpu: CpuPayload,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VaultItemMetadata {
    pub created_at: u64,
    pub updated_at: u64,
    pub key: String,
}

pub struct VaultState {
    pub stronghold: std::sync::Mutex<Option<tauri_plugin_stronghold::stronghold::Stronghold>>,
    pub store: std::sync::Mutex<Option<iota_stronghold::Store>>,
}

pub struct Discord {
    pub stop_flag: Mutex<Option<Arc<AtomicBool>>>,
    pub client: Mutex<Option<discord_rich_presence::DiscordIpcClient>>,
    pub client_id: String,
}

pub struct ApiClient {
    pub client: reqwest::Client,
    pub base_url: String,
}

pub struct System {
    pub stop_flag: Mutex<Option<Arc<AtomicBool>>>,
}
