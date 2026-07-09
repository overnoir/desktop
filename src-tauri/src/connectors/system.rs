use crate::types::{
    NetworkPrev, System, SystemBattery, SystemCpu, SystemMemory, SystemNetwork, SystemState,
};
use std::sync::Mutex;
use sysinfo::{Networks, System as SysInfoSys};
use tauri::{AppHandle, Manager, State};

const GB: f64 = 1024.0 * 1024.0 * 1024.0;
const MB: f64 = 1_048_576.0;

pub fn init_system(app_handle: &AppHandle) {
    app_handle.manage(SystemState {
        sysinfo: Mutex::new(SysInfoSys::new_all()),
        prev_network: Mutex::new(NetworkPrev {
            download: 0,
            upload: 0,
        }),
    });
}

#[tauri::command]
pub fn get_system(
    state: State<'_, SystemState>,
    network: bool,
    battery: bool,
    memory: bool,
    cpu: bool,
) -> Result<System, String> {
    let mut sysinfo = state
        .sysinfo
        .lock()
        .map_err(|e| format!("Failed to lock sysinfo: {}", e))?;

    let memory_data = if memory {
        sysinfo.refresh_memory();
        let total_memory = sysinfo.total_memory();
        let used_memory = sysinfo.used_memory();
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
        let cpus = sysinfo.cpus();
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
    let networks = Networks::new_with_refreshed_list();
    for (_name, network_data) in &networks {
        total_download += network_data.total_received();
        total_upload += network_data.total_transmitted();
    }

    let mut prev = state
        .prev_network
        .lock()
        .map_err(|e| format!("Failed to lock: {}", e))?;

    let network_data = if network {
        let download = if prev.download == 0 {
            0.0
        } else {
            total_download.saturating_sub(prev.download) as f64 / MB
        };
        let upload = if prev.upload == 0 {
            0.0
        } else {
            total_upload.saturating_sub(prev.upload) as f64 / MB
        };
        Some(SystemNetwork { download, upload })
    } else {
        None
    };

    prev.download = total_download;
    prev.upload = total_upload;

    let battery_data = if battery {
        let manager = starship_battery::Manager::new()
            .map_err(|e| format!("Failed to probe battery: {}", e))?;
        let batteries: Vec<_> = manager
            .batteries()
            .map_err(|e| format!("Failed to access battery: {}", e))?
            .filter_map(|b| b.ok())
            .collect();

        if let Some(bat) = batteries.first() {
            Some(SystemBattery {
                is_charging: matches!(bat.state(), starship_battery::State::Charging),
                percent: Some((bat.state_of_charge().value * 100.0) as u32),
            })
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
