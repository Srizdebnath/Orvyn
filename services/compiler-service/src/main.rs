use orvyn_compiler::SolidityCompiler;
use orvyn_core::traits::Compiler;
use orvyn_core::types::CompileJob;
use redis::AsyncCommands;
use sqlx;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();

    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "compiler_service=debug,info".into()),
        )
        .init();

    tracing::info!("Compiler Service starting...");

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let redis_url = std::env::var("REDIS_URL").expect("REDIS_URL must be set");

    let db = sqlx::PgPool::connect(&database_url).await?;
    let redis_client = redis::Client::open(redis_url)?;
    let mut redis_conn = redis_client.get_multiplexed_async_connection().await?;

    let compiler = SolidityCompiler;

    tracing::info!("Compiler Service ready and listening for jobs...");

    loop {
        // BLPOP returns (key, value)
        let result: Result<(String, String), redis::RedisError> =
            redis_conn.blpop("compile_jobs", 0.0).await;

        match result {
            Ok((_, job_json)) => {
                let job: CompileJob = serde_json::from_str(&job_json)?;
                tracing::info!("Processing job: {}", job.id);

                // Update status to "compiling"
                sqlx::query("UPDATE builds SET status = $1, updated_at = NOW() WHERE id = $2")
                    .bind("compiling")
                    .bind(job.id)
                    .execute(&db)
                    .await?;

                match compiler.compile(job.clone()).await {
                    Ok(artifacts) => {
                        let artifacts_json = serde_json::to_value(artifacts)?;
                        sqlx::query(
                            "UPDATE builds SET status = $1, artifacts = $2, updated_at = NOW() WHERE id = $3"
                        )
                        .bind("completed")
                        .bind(artifacts_json)
                        .bind(job.id)
                        .execute(&db)
                        .await?;
                        tracing::info!("Job {} completed successfully", job.id);
                    }
                    Err(e) => {
                        sqlx::query(
                            "UPDATE builds SET status = $1, error_message = $2, updated_at = NOW() WHERE id = $3"
                        )
                        .bind("failed")
                        .bind(e.to_string())
                        .bind(job.id)
                        .execute(&db)
                        .await?;
                        tracing::error!("Job {} failed: {}", job.id, e);
                    }
                }
            }
            Err(e) => {
                tracing::error!("Redis error: {}", e);
                tokio::time::sleep(std::time::Duration::from_secs(5)).await;
            }
        }
    }
}
