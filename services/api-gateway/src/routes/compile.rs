use crate::state::AppState;
use axum::{Json, extract::State};
use orvyn_compiler::SolidityCompiler;
use orvyn_core::traits::Compiler;
use orvyn_core::types::job::CompileJob;
use serde_json::{Value, json};

pub async fn compile_contract(
    State(_state): State<AppState>,
    Json(payload): Json<CompileJob>,
) -> Json<Value> {
    tracing::info!(
        "Compilation request received for: {}",
        payload.contract_name
    );

    let compiler = SolidityCompiler;

    // For now we run it inline to demonstrate the flow.
    // In Phase 1.6 we'll move this to an async worker queue.
    match compiler.compile(payload.clone()).await {
        Ok(artifacts) => Json(json!({
            "job_id": payload.id,
            "status": "completed",
            "contract": payload.contract_name,
            "artifacts_count": artifacts.len(),
            "completed_at": chrono::Utc::now().to_rfc3339()
        })),
        Err(e) => Json(json!({
            "job_id": payload.id,
            "status": "failed",
            "error": e.to_string()
        })),
    }
}
