use crate::types::job::DeployJob;
use anyhow::Result;

#[async_trait::async_trait]
pub trait Deployer: Send + Sync {
    async fn deploy(&self, job: DeployJob) -> Result<String>; // Returns transaction hash or address
}
