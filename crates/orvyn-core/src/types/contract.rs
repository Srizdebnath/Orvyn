
use serde::{Deserialize, Serialize};
use crate::types::chain::Chain;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Contract {
    pub name: String,
    pub source: String,
    pub hash: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Artifact {
    pub chain: Chain,
    pub bytecode: Bytecode,
    pub abi: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Bytecode {
    pub hex: String,
    pub size_bytes: usize,
}
