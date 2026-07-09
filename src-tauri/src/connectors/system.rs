use crate::types::{System, SystemBattery, SystemCpu, SystemMemory, SystemNetwork, SystemState};
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};
use tauri_plugin_system_info::SysInfoState;

const GB: f64 = 1024.0 * 1024.0 * 1024.0;

pub fn init_system(app_handle: &AppHandle) {
    app_handle.manage(SystemState {
        last_network_download: Mutex::new(0),
        last_network_upload: Mutex::new(0),
    });
}

#[tauri::command]
pub fn get_system(
    system_state: State<'_, SystemState>,
    sys_state: State<'_, SysInfoState>,
    network: bool,
    battery: bool,
    memory: bool,
    cpu: bool,
) -> Result<System, String> {
    let mut sysinfo = sys_state
        .sysinfo
        .lock()
        .map_err(|e| format!("Failed to lock sysinfo: {}", e))?;

    let memory_data = if memory {
        sysinfo.refresh_memory();
        let total_memory = sysinfo.sys.total_memory();
        let used_memory = sysinfo.sys.used_memory();
        Some(SystemMemory {
            usage_percent: if total_memory > 0 {
                used_memory as f64 / total_memory as f64 * 100.0
            } else {
                0.0
            },
            total_gb: total_memory as f64 / GB,
            used_gb: used_memory as f64 / GB,
        })
    } else {
        None
    };

    let cpu_data = if cpu {
        sysinfo.refresh_cpu();
        let cpus = sysinfo.sys.cpus();
        let cpu_count = cpus.len();
        let cpu_sum: f64 = cpus.iter().map(|c| c.cpu_usage() as f64).sum();
        let cpu_avg = if cpu_count > 0 {
            cpu_sum / cpu_count as f64
        } else {
            0.0
        };
        let cpu_active = cpus.iter().filter(|c| c.cpu_usage() > 0.5).count();
        Some(SystemCpu {
            usage_percent: cpu_avg,
            active: cpu_active,
            total: cpu_count,
        })
    } else {
        None
    };

    let mut total_download: u64 = 0;
    let mut total_upload: u64 = 0;
    for network in sysinfo.networks().iter() {
        if let Ok(value) = serde_json::to_value(network) {
            total_download += value
                .get("total_received")
                .and_then(|x| x.as_u64())
                .unwrap_or(0);
            total_upload += value
                .get("total_transmitted")
                .and_then(|x| x.as_u64())
                .unwrap_or(0);
        }
    }

    let mut last_download = system_state
        .last_network_download
        .lock()
        .map_err(|e| format!("Failed to lock: {}", e))?;
    let mut last_upload = system_state
        .last_network_upload
        .lock()
        .map_err(|e| format!("Failed to lock: {}", e))?;

    let network_data = if network {
        let download = if *last_download == 0 {
            0.0
        } else {
            total_download.saturating_sub(*last_download) as f64 / 1_048_576.0
        };
        let upload = if *last_upload == 0 {
            0.0
        } else {
            total_upload.saturating_sub(*last_upload) as f64 / 1_048_576.0
        };
        Some(SystemNetwork { download, upload })
    } else {
        None
    };

    *last_download = total_download;
    *last_upload = total_upload;

    let battery_data = if battery {
        let batteries = sysinfo.batteries().unwrap_or_default();
        if let Some(battery) = batteries.first() {
            if let Ok(value) = serde_json::to_value(battery) {
                Some(SystemBattery {
                    is_charging: value.get("state").and_then(|x| x.as_str()) == Some("Charging"),
                    percent: value
                        .get("state_of_charge")
                        .and_then(|x| x.as_f64())
                        .map(|c| (c * 100.0) as u32),
                })
            } else {
                Some(SystemBattery {
                    is_charging: false,
                    percent: None,
                })
            }
        } else {
            Some(SystemBattery {
                is_charging: false,
                percent: None,
            })
        }
    } else {
        None
    };

    Ok(System {
        network: network_data,
        battery: battery_data,
        memory: memory_data,
        cpu: cpu_data,
    })
}
