use crate::types::{DiscordClient, DiscordConnectedUser, OAuthTokenResponse};
use interprocess::local_socket::prelude::LocalSocketStream;
use interprocess::local_socket::traits::Stream;
use interprocess::TryClone;
use serde_json::json;
use std::io::{Read, Write};
use uuid::Uuid;

#[cfg(unix)]
use interprocess::local_socket::{GenericFilePath, ToFsName};

#[cfg(windows)]
use interprocess::local_socket::{GenericNamespaced, ToNsName};

impl DiscordClient {
    pub fn new(client_id: &str) -> Self {
        Self {
            client_id: client_id.to_string(),
            http: reqwest::Client::new(),
            stream: None,
        }
    }

    pub fn connect(&mut self) -> Result<(), String> {
        #[cfg(unix)]
        {
            const SUB_PATHS: [&str; 7] = [
                "",
                "app/com.discordapp.Discord/",
                "app/dev.vencord.Vesktop/",
                ".flatpak/com.discordapp.Discord/xdg-run/",
                ".flatpak/dev.vencord.Vesktop/xdg-run/",
                "snap.discord/",
                "snap.discord-canary/",
            ];

            let mut paths = vec![];
            for i in 0..10 {
                paths.push(format!("/tmp/discord-ipc-{i}"));
            }
            for key in ["XDG_RUNTIME_DIR", "TMPDIR", "TMP", "TEMP"] {
                let base_path = match std::env::var(key) {
                    Ok(value) => value,
                    Err(_) => continue,
                };
                for i in 0..10 {
                    for sub_path in &SUB_PATHS {
                        paths.push(format!("{base_path}/{sub_path}discord-ipc-{i}"));
                    }
                }
            }

            let stream = paths
                .iter()
                .find_map(|p| {
                    let name = p.clone().to_fs_name::<GenericFilePath>().ok()?;
                    LocalSocketStream::connect(name).ok()
                })
                .ok_or_else(|| "Discord is not running".to_string())?;
            self.stream = Some(stream);
        }

        #[cfg(windows)]
        {
            let stream = (0..10)
                .map(|i| format!("discord-ipc-{i}"))
                .find_map(|p| {
                    let ns_name = p.to_ns_name::<GenericNamespaced>().ok()?;
                    LocalSocketStream::connect(ns_name).ok()
                })
                .ok_or_else(|| "Discord is not running".to_string())?;
            self.stream = Some(stream);
        }

        let msg = json!({ "v": 1, "client_id": self.client_id }).to_string();
        self.write_frame(0, &msg).map_err(|e| e.to_string())?;
        self.read_frame().map_err(|e| e.to_string())?;

        Ok(())
    }

    pub fn clone_stream(&self) -> Result<Self, String> {
        let stream = self
            .stream
            .as_ref()
            .ok_or("not connected")?
            .try_clone()
            .map_err(|e| format!("clone stream failed: {e}"))?;
        Ok(Self {
            client_id: self.client_id.clone(),
            http: reqwest::Client::new(),
            stream: Some(stream),
        })
    }

    fn write_frame(&mut self, opcode: u32, payload: &str) -> std::io::Result<()> {
        let data = payload.as_bytes();
        let mut frame = Vec::with_capacity(8 + data.len());
        frame.extend_from_slice(&opcode.to_le_bytes());
        frame.extend_from_slice(&(data.len() as u32).to_le_bytes());
        frame.extend_from_slice(data);
        self.stream.as_mut().unwrap().write_all(&frame)
    }

    pub fn read_frame(&mut self) -> std::io::Result<(u32, String)> {
        let mut header = [0u8; 8];
        self.stream.as_mut().unwrap().read_exact(&mut header)?;

        let opcode = u32::from_le_bytes([header[0], header[1], header[2], header[3]]);
        let len = u32::from_le_bytes([header[4], header[5], header[6], header[7]]) as usize;

        let mut body = vec![0; len];
        self.stream.as_mut().unwrap().read_exact(&mut body)?;
        String::from_utf8(body)
            .map(|s| (opcode, s))
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidData, e))
    }

    fn send(&mut self, cmd: &str, extra: serde_json::Value) -> Result<(), String> {
        let payload = json!({
            "nonce": Uuid::new_v4().to_string(),
            "cmd": cmd,
        });
        let mut payload: serde_json::Map<_, _> = payload.as_object().unwrap().clone();
        for (k, v) in extra.as_object().unwrap() {
            payload.insert(k.clone(), v.clone());
        }
        self.write_frame(1, &serde_json::Value::Object(payload).to_string())
            .map_err(|e| e.to_string())
    }

    pub fn authenticate(&mut self, access_token: &str) -> Result<DiscordConnectedUser, String> {
        self.send(
            "AUTHENTICATE",
            json!({ "args": { "access_token": access_token } }),
        )?;

        let (_, payload) = self.read_frame().map_err(|e| e.to_string())?;
        let value: serde_json::Value =
            serde_json::from_str(&payload).map_err(|e| format!("bad json: {e}"))?;
        let user = &value["data"]["user"];

        Ok(DiscordConnectedUser {
            username: user["username"].as_str().unwrap_or("Unknown").into(),
            avatar: user["avatar"].as_str().map(Into::into),
            id: user["id"].as_str().ok_or("missing user id")?.into(),
        })
    }

    pub fn authorize(&mut self, challenge: &str) -> Result<String, String> {
        self.send(
            "AUTHORIZE",
            json!({
                "args": {
                    "client_id": self.client_id,
                    "code_challenge_method": "S256",
                    "code_challenge": challenge,
                    "scopes": ["rpc"],
                },
            }),
        )?;

        let (_, payload) = self.read_frame().map_err(|e| e.to_string())?;
        let value: serde_json::Value =
            serde_json::from_str(&payload).map_err(|e| format!("bad json: {e}"))?;

        if value["evt"] == "ERROR" {
            return Err(value["data"]["message"]
                .as_str()
                .unwrap_or("unknown")
                .into());
        }

        value["data"]["code"]
            .as_str()
            .map(Into::into)
            .ok_or_else(|| "no auth code in response".into())
    }

    pub fn subscribe(
        &mut self,
        event: &str,
        args: Option<serde_json::Value>,
    ) -> Result<(), String> {
        let mut body = json!({ "evt": event });
        if let Some(a) = args {
            body["args"] = a;
        }
        self.send("SUBSCRIBE", body)
    }

    pub fn unsubscribe(
        &mut self,
        event: &str,
        args: Option<serde_json::Value>,
    ) -> Result<(), String> {
        let mut body = json!({ "evt": event });
        if let Some(a) = args {
            body["args"] = a;
        }
        self.send("UNSUBSCRIBE", body)
    }

    pub fn get_selected_voice_channel(&mut self) -> Result<(), String> {
        self.send("GET_SELECTED_VOICE_CHANNEL", json!({}))
    }

    pub fn get_channel(&mut self, channel_id: &str) -> Result<(), String> {
        self.send(
            "GET_CHANNEL",
            json!({ "args": { "channel_id": channel_id } }),
        )
    }

    pub fn get_guild(&mut self, guild_id: &str) -> Result<(), String> {
        self.send("GET_GUILD", json!({ "args": { "guild_id": guild_id } }))
    }

    pub fn close(&mut self) {
        let _ = self.write_frame(2, "{}");
    }

    pub async fn exchange_code(
        &self,
        params: &[(&str, &str)],
    ) -> Result<OAuthTokenResponse, String> {
        let resp = self
            .http
            .post("https://discord.com/api/v10/oauth2/token")
            .form(params)
            .send()
            .await
            .map_err(|e| format!("Token request: {e}"))?
            .text()
            .await
            .map_err(|e| format!("Read response: {e}"))?;

        serde_json::from_str(&resp).map_err(|e| format!("Parse: {e}"))
    }
}
