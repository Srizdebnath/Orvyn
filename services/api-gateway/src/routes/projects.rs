use crate::state::AppState;
use axum::{Json, extract::State};
use serde::{Deserialize, Serialize};
use serde_json::{Value, json};
use uuid::Uuid;

#[derive(Deserialize, Serialize)]
pub struct CreateProjectRequest {
    pub name: String,
    pub description: Option<String>,
    pub template: String,
    pub main_chain: String,
}

pub async fn create_project(
    State(state): State<AppState>,
    Json(payload): Json<CreateProjectRequest>,
) -> Json<Value> {
    let id = Uuid::new_v4();

    let result = sqlx::query(
        "INSERT INTO projects (id, name, description, template, main_chain) VALUES ($1, $2, $3, $4, $5)"
    )
    .bind(id)
    .bind(&payload.name)
    .bind(&payload.description)
    .bind(&payload.template)
    .bind(&payload.main_chain)
    .execute(&state.db)
    .await;

    match result {
        Ok(_) => Json(json!({ "id": id, "status": "created" })),
        Err(e) => {
            tracing::error!("Failed to create project: {}", e);
            Json(json!({ "error": "Database error" }))
        }
    }
}

pub async fn list_projects(State(state): State<AppState>) -> Json<Value> {
    let result = sqlx::query_as::<_, ProjectRow>("SELECT id, name, description, template, main_chain, created_at FROM projects ORDER BY created_at DESC")
        .fetch_all(&state.db)
        .await;

    match result {
        Ok(projects) => Json(json!(projects)),
        Err(e) => {
            tracing::error!("Failed to list projects: {}", e);
            Json(json!({ "error": "Database error" }))
        }
    }
}

#[derive(sqlx::FromRow, Serialize)]
struct ProjectRow {
    id: Uuid,
    name: String,
    description: Option<String>,
    template: String,
    main_chain: String,
    created_at: chrono::DateTime<chrono::Utc>,
}
