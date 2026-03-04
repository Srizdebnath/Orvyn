use crate::types::contract::Artifact;
use crate::types::job::CompileJob;
use anyhow::Result;

#[async_trait::async_trait]
pub trait Compiler: Send + Sync {
    async fn compile(&self, job: CompileJob) -> Result<Vec<Artifact>>;
}
