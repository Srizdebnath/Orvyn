use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    response::IntoResponse,
};
use serde_json::json;
use std::time::Duration;

pub async fn ws_handler(ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket))
}

async fn handle_socket(mut socket: WebSocket) {
    tracing::info!("New WebSocket connection");

    while let Some(msg) = socket.recv().await {
        if let Ok(msg) = msg {
            match msg {
                Message::Text(text) => {
                    tracing::debug!("Received text: {}", text);
                    // Assume client sends a JSON like {"action": "subscribe", "job_id": "..."}
                    if let Ok(val) = serde_json::from_str::<serde_json::Value>(&text) {
                        if val["action"] == "subscribe" {
                            let job_id = val["job_id"].as_str().unwrap_or("unknown");
                            stream_mock_progress(&mut socket, job_id).await;
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
            tracing::error!("WebSocket error");
            break;
        }
    }
}

async fn stream_mock_progress(socket: &mut WebSocket, job_id: &str) {
    let stages = vec![
        ("parsing", "Parsing Rust source code..."),
        ("ir_gen", "Generating LLVM Intermediate Representation..."),
        ("optimize", "Running optimization passes..."),
        ("codegen_evm", "Generating EVM Bytecode..."),
        ("codegen_solana", "Generating Solana BPF..."),
        ("finalizing", "Uploading artifacts to storage..."),
        ("done", "Compilation successful!"),
    ];

    for (stage, msg) in stages {
        tokio::time::sleep(Duration::from_millis(800)).await;
        let event = json!({
            "type": "progress",
            "job_id": job_id,
            "stage": stage,
            "message": msg,
            "timestamp": chrono::Utc::now().to_rfc3339()
        });

        if socket.send(Message::Text(event.to_string())).await.is_err() {
            break;
        }
    }
}
