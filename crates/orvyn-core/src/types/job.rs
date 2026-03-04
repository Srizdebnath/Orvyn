use crate::types::chain::Chain;
use crate::types::contract::Artifact;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompileJob {
    pub id: Uuid,
    pub contract_name: String,
    pub source: String,
    pub targets: Vec<Chain>,
    pub optimization_level: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeployJob {
    pub id: Uuid,
    pub compile_job_id: Uuid,
    pub chain: Chain,
    pub network: String,
    pub artifacts: Artifact,
    pub constructor_args: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload", rename_all = "snake_case")]
pub enum JobProgress {
    Started {
        job_id: Uuid,
        timestamp: u64,
    },
    Stage {
        job_id: Uuid,
        stage: String,
        message: String,
    },
    Completed {
        job_id: Uuid,
        result: serde_json::Value,
    },
    Failed {
        job_id: Uuid,
        error: String,
    },
}
