use crate::error::AppError;
use axum::Json;
use serde_json::{Value, json};

pub async fn health_check() -> Result<Json<Value>, AppError> {
    Ok(Json(json!({
        "status": "ok",
        "service": "api-gateway",
        "version": env!("CARGO_PKG_VERSION")
    })))
}
