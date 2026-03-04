use orvyn_compiler::SolidityCompiler;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "compiler_service=debug,info".into()),
        )
        .init();

    tracing::info!("Compiler Service starting...");

    // In a real scenario, this would be a worker loop consuming from a queue.
    // For this phase, we'll demonstrate that the compiler crate works.

    let _compiler = SolidityCompiler;

    tracing::info!("Compiler Service ready.");

    // Keep alive for now (in future this will be the worker loop)
    loop {
        tokio::time::sleep(std::time::Duration::from_secs(3600)).await;
    }
}
