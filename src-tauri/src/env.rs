use std::env;

pub struct Env {
    pub discord_client_id: String,
}

impl Env {
    pub fn init() -> Self {
        let discord_client_id = env::var("DISCORD_CLIENT_ID").unwrap_or_else(|_| {
            option_env!("DISCORD_CLIENT_ID")
                .expect("DISCORD_CLIENT_ID must be set")
                .to_string()
        });

        Self { discord_client_id }
    }
}
