#[derive(Clone)]
pub struct AppState {
    // DB pool, Redis, etc would go here
}

impl AppState {
    pub async fn new() -> anyhow::Result<Self> {
        Ok(Self {})
    }
}
