use crate::types::{System, SystemBattery, SystemCpu, SystemMemory, SystemNetwork, SystemState};
use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc, Mutex,
};
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_system_info::SysInfoState;

const GB: f64 = 1024.0 * 1024.0 * 1024.0;

pub fn init_system(app_handle: &AppHandle) {
    app_handle.manage(SystemState {
        stop_flag: Mutex::new(None),
    });
}

#[tauri::command]
pub async fn connect_system(app_handle: AppHandle) -> Result<(), String> {
    let app_handle_clone = app_handle.clone();
    let system = app_handle.state::<SystemState>();

    {
        let mut flag_guard = system
            .stop_flag
            .lock()
            .map_err(|e| format!("Failed to acquire lock: {}", e))?;
        if let Some(flag) = flag_guard.as_ref() {
            flag.store(true, Ordering::Relaxed);
        }
        *flag_guard = None;
    }

    let stop_flag = Arc::new(AtomicBool::new(false));
    let listener_stop = stop_flag.clone();

    tokio::spawn(async move {
        let mut prev_net_rx: u64 = 0;
        let mut prev_net_tx: u64 = 0;

        loop {
            tokio::time::sleep(Duration::from_secs(1)).await;

            if listener_stop.load(Ordering::Relaxed) {
                break;
            }

            let sys_state = app_handle_clone.state::<SysInfoState>();
            let mut sysinfo = sys_state.sysinfo.lock().unwrap_or_else(|e| e.into_inner());

            sysinfo.refresh_cpu();
            sysinfo.refresh_memory();

            let mem_total = sysinfo.sys.total_memory();
            let mem_used = sysinfo.sys.used_memory();

            let cpus = sysinfo.sys.cpus();
            let cpu_count = cpus.len();
            let cpu_sum: f64 = cpus.iter().map(|c| c.cpu_usage() as f64).sum();
            let cpu_avg = if cpu_count > 0 {
                cpu_sum / cpu_count as f64
            } else {
                0.0
            };
            let cpu_active = cpus.iter().filter(|c| c.cpu_usage() > 0.5).count();

            let mut total_rx: u64 = 0;
            let mut total_tx: u64 = 0;
            for n in sysinfo.networks().iter() {
                if let Ok(v) = serde_json::to_value(n) {
                    total_rx += v
                        .get("total_received")
                        .and_then(|x| x.as_u64())
                        .unwrap_or(0);
                    total_tx += v
                        .get("total_transmitted")
                        .and_then(|x| x.as_u64())
                        .unwrap_or(0);
                }
            }
            let download = if prev_net_rx == 0 {
                0.0
            } else {
                total_rx.saturating_sub(prev_net_rx) as f64 / 1_048_576.0
            };
            let upload = if prev_net_tx == 0 {
                0.0
            } else {
                total_tx.saturating_sub(prev_net_tx) as f64 / 1_048_576.0
            };
            prev_net_rx = total_rx;
            prev_net_tx = total_tx;

            let bats = sysinfo.batteries().unwrap_or_default();
            let battery = if let Some(b) = bats.first() {
                if let Ok(v) = serde_json::to_value(b) {
                    SystemBattery {
                        percent: v
                            .get("state_of_charge")
                            .and_then(|x| x.as_f64())
                            .map(|c| (c * 100.0) as u32),
                        is_charging: v.get("state").and_then(|x| x.as_str()) == Some("Charging"),
                    }
                } else {
                    SystemBattery {
                        is_charging: false,
                        percent: None,
                    }
                }
            } else {
                SystemBattery {
                    is_charging: false,
                    percent: None,
                }
            };

            let _ = app_handle_clone.emit_to(
                "overlay",
                "system-update",
                serde_json::to_value(System {
                    network: SystemNetwork { download, upload },
                    memory: SystemMemory {
                        usage_percent: if mem_total > 0 {
                            mem_used as f64 / mem_total as f64 * 100.0
                        } else {
                            0.0
                        },
                        total_gb: mem_total as f64 / GB,
                        used_gb: mem_used as f64 / GB,
                    },
                    cpu: SystemCpu {
                        usage_percent: cpu_avg,
                        active: cpu_active,
                        total: cpu_count,
                    },
                    battery,
                })
                .unwrap_or_default(),
            );
        }
    });

    {
        let mut flag_guard = system
            .stop_flag
            .lock()
            .map_err(|e| format!("Failed to acquire lock: {}", e))?;
        *flag_guard = Some(stop_flag);
    }

    Ok(())
}

#[tauri::command]
pub fn disconnect_system(app_handle: AppHandle) -> Result<(), String> {
    let system = app_handle.state::<SystemState>();

    let mut flag_guard = system
        .stop_flag
        .lock()
        .map_err(|e| format!("Failed to acquire lock: {}", e))?;

    if let Some(flag) = flag_guard.as_ref() {
        flag.store(true, Ordering::Relaxed);
    }

    *flag_guard = None;

    let _ = app_handle.emit_to("overlay", "system-update", serde_json::Value::Null);

    Ok(())
}
