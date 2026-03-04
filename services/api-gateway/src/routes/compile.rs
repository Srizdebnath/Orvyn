use crate::state::AppState;
use axum::{Json, extract::State};
use chrono;
use orvyn_core::types::job::CompileJob;
use redis::AsyncCommands;
use serde_json::{Value, json};
use sqlx;

pub async fn compile_contract(
    State(state): State<AppState>,
    Json(payload): Json<CompileJob>,
) -> Json<Value> {
    tracing::info!(
        "Compilation request received for: {}",
        payload.contract_name
    );

    let job_id = payload.id;

    // 1. Persist Build Metadata to Postgres
    let db_result = sqlx::query("INSERT INTO builds (id, status, targets) VALUES ($1, $2, $3)")
        .bind(job_id)
        .bind("pending")
        .bind(
            &payload
                .targets
                .iter()
                .map(|c| c.to_string())
                .collect::<Vec<_>>(),
        )
        .execute(&state.db)
        .await;

    if let Err(e) = db_result {
        tracing::error!("Failed to persist build: {}", e);
        return Json(json!({ "error": "Database error" }));
    }

    // 2. Queue Job to Redis
    let mut redis_conn = match state.redis.get_multiplexed_async_connection().await {
        Ok(conn) => conn,
        Err(e) => {
            tracing::error!("Failed to connect to Redis: {}", e);
            return Json(json!({ "error": "Redis connection error" }));
        }
    };

    let job_json = serde_json::to_string(&payload).unwrap();
    let redis_result: Result<(), redis::RedisError> =
        redis_conn.lpush("compile_jobs", job_json).await;

    if let Err(e) = redis_result {
        tracing::error!("Failed to queue job: {}", e);
        return Json(json!({ "error": "Queue error" }));
    }

    Json(json!({
        "job_id": job_id,
        "status": "queued",
        "contract": payload.contract_name,
        "submitted_at": chrono::Utc::now().to_rfc3339()
    }))
}
