use crate::routes;
use crate::state::AppState;
use axum::{Router, routing::get};
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;

pub fn create_router(state: AppState) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    Router::new()
        .route("/health", get(routes::health::health_check))
        .route("/ws", get(routes::ws::ws_handler))
        .nest("/api/v1", api_routes())
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(state)
}

fn api_routes() -> Router<AppState> {
    Router::new()
        .route(
            "/compile",
            axum::routing::post(routes::compile::compile_contract),
        )
        .route(
            "/deploy",
            axum::routing::post(routes::deploy::deploy_contract),
        )
}
