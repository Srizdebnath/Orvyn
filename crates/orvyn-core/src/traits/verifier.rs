use crate::types::chain::Chain;
use anyhow::Result;

#[async_trait::async_trait]
pub trait Verifier: Send + Sync {
    async fn verify(&self, chain: Chain, address: &str, source: &str) -> Result<bool>;
}
