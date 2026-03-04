use crate::state::AppState;
use axum::{
    extract::{
        State,
        ws::{Message, WebSocket, WebSocketUpgrade},
    },
    response::IntoResponse,
};
use serde_json::json;
use sqlx::Row;
use std::time::Duration;

pub async fn ws_handler(ws: WebSocketUpgrade, State(state): State<AppState>) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}

async fn handle_socket(mut socket: WebSocket, state: AppState) {
    tracing::info!("New WebSocket connection");

    while let Some(msg) = socket.recv().await {
        if let Ok(msg) = msg {
            match msg {
                Message::Text(text) => {
                    tracing::debug!("Received text: {}", text);
                    if let Ok(val) = serde_json::from_str::<serde_json::Value>(&text) {
                        if val["action"] == "subscribe" {
                            if let Some(job_id_str) = val["job_id"].as_str() {
                                if let Ok(job_id) = uuid::Uuid::parse_str(job_id_str) {
                                    stream_build_progress(socket, state, job_id).await;
                                    return;
                                }
                            }
                        }
                    }
                }
                Message::Close(_) => {
                    tracing::info!("WebSocket closed");
                    break;
                }
                _ => {}
            }
        } else {
            break;
        }
    }
}

async fn stream_build_progress(mut socket: WebSocket, state: AppState, job_id: uuid::Uuid) {
    let mut last_status = String::new();

    loop {
        let build =
            sqlx::query("SELECT status, artifacts, error_message FROM builds WHERE id = $1")
                .bind(job_id)
                .fetch_optional(&state.db)
                .await;

        match build {
            Ok(Some(row)) => {
                let status: String = row.get("status");

                if status != last_status {
                    last_status = status.clone();
                    let msg = json!({
                        "type": "progress",
                        "stage": status,
                        "message": format!("Build status updated: {}", status),
                        "job_id": job_id.to_string()
                    });

                    if socket.send(Message::Text(msg.to_string())).await.is_err() {
                        break;
                    }

                    if status == "completed" || status == "failed" {
                        if status == "completed" {
                            let artifacts: serde_json::Value = row.get("artifacts");
                            let _ = socket
                                .send(Message::Text(
                                    json!({
                                        "type": "completed",
                                        "artifacts": artifacts
                                    })
                                    .to_string(),
                                ))
                                .await;
                        } else {
                            let error: Option<String> = row.get("error_message");
                            let _ = socket
                                .send(Message::Text(
                                    json!({
                                        "type": "failed",
                                        "error": error
                                    })
                                    .to_string(),
                                ))
                                .await;
                        }
                        break;
                    }
                }
            }
            Ok(None) => {
                // Job not found yet, maybe wait?
            }
            Err(e) => {
                tracing::error!("DB error in WS stream: {}", e);
                break;
            }
        }

        tokio::time::sleep(Duration::from_millis(1000)).await;
    }
}
