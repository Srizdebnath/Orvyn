# Orvyn — Codebase Structure
> Monorepo layout, module organization, Rust crates, and naming conventions.

---

## Monorepo Strategy

Orvyn uses a **Cargo + npm workspaces monorepo** managed via [Turborepo](https://turbo.build/) for JS and Cargo workspaces for Rust. All code lives in a single Git repository.

```
orvyn/
├── Cargo.toml                  # Workspace root (Rust)
├── package.json                # Workspace root (JS/TS)
├── turbo.json                  # Turborepo pipeline config
├── docker-compose.yml          # Local dev environment
├── .github/
│   └── workflows/
│       ├── ci.yml              # Test + lint on PR
│       ├── deploy-staging.yml
│       └── deploy-prod.yml
│
├── apps/                       # Deployable applications
│   ├── web/                    # React web app
│   ├── desktop/                # Tauri desktop app
│   ├── mobile/                 # React Native app
│   └── docs/                   # Developer docs site (Docusaurus)
│
├── services/                   # Backend microservices (Rust)
│   ├── api-gateway/            # Main HTTP API (Axum)
│   ├── auth-service/           # Auth + JWT + OAuth
│   ├── compiler-service/       # Rust → bytecode compiler
│   ├── deployer-service/       # Multi-chain deployer
│   ├── verifier-service/       # Contract verification
│   └── gas-oracle/             # Gas price aggregation
│
├── crates/                     # Shared Rust library crates
│   ├── orvyn-core/             # Core types + traits
│   ├── orvyn-compiler/         # Compilation pipeline
│   ├── orvyn-chains/           # Chain-specific adapters
│   ├── orvyn-wallet/           # Wallet signing abstractions
│   └── orvyn-sdk-rust/         # Rust SDK (for CI/CD)
│
├── packages/                   # Shared JS/TS packages
│   ├── ui/                     # React component library
│   ├── sdk/                    # TypeScript SDK (@orvyn/sdk)
│   ├── eslint-config/          # Shared ESLint config
│   └── tsconfig/               # Shared TS configs
│
├── contracts/                  # Example/template contracts
│   ├── templates/
│   │   ├── erc20.rs
│   │   ├── erc721.rs
│   │   ├── spl-token.rs
│   │   └── cw20.rs
│   └── tests/
│
├── infra/                      # Infrastructure as code
│   ├── k8s/                    # Kubernetes manifests
│   ├── terraform/              # AWS/GCP provisioning
│   └── helm/                   # Helm charts
│
└── scripts/                    # Dev tooling scripts
    ├── setup.sh
    ├── seed-db.sh
    └── gen-types.sh
```

---

## Rust Workspace (`Cargo.toml`)

```toml
[workspace]
members = [
    "services/api-gateway",
    "services/auth-service",
    "services/compiler-service",
    "services/deployer-service",
    "services/verifier-service",
    "services/gas-oracle",
    "crates/orvyn-core",
    "crates/orvyn-compiler",
    "crates/orvyn-chains",
    "crates/orvyn-wallet",
    "crates/orvyn-sdk-rust",
]
resolver = "2"

[workspace.dependencies]
tokio        = { version = "1", features = ["full"] }
axum         = { version = "0.7", features = ["macros"] }
serde        = { version = "1", features = ["derive"] }
serde_json   = "1"
sqlx         = { version = "0.7", features = ["postgres", "runtime-tokio", "uuid"] }
uuid         = { version = "1", features = ["v4", "serde"] }
tracing      = "0.1"
anyhow       = "1"
thiserror    = "1"
```

---

## Core Services — Detailed Layout

### `services/api-gateway/`
```
api-gateway/
├── Cargo.toml
└── src/
    ├── main.rs              # Server bootstrap
    ├── router.rs            # Route registration
    ├── state.rs             # AppState (DB pool, Redis, etc.)
    ├── middleware/
    │   ├── auth.rs          # JWT extractor
    │   ├── rate_limit.rs    # Token bucket rate limiter
    │   └── cors.rs
    ├── routes/
    │   ├── auth.rs          # POST /auth/login, /auth/callback
    │   ├── projects.rs      # CRUD /projects
    │   ├── contracts.rs     # CRUD /contracts
    │   ├── compile.rs       # POST /compile, GET /compile/:id
    │   ├── deploy.rs        # POST /deploy, GET /deploy/:id
    │   └── health.rs        # GET /health
    ├── models/              # Request/Response types
    │   ├── compile.rs
    │   ├── deploy.rs
    │   └── user.rs
    └── error.rs             # AppError → HTTP response
```

### `services/compiler-service/`
```
compiler-service/
├── Cargo.toml
└── src/
    ├── main.rs              # Worker loop (Redis queue consumer)
    ├── worker.rs            # Job dispatch
    ├── pipeline/
    │   ├── mod.rs
    │   ├── parse.rs         # rustc source validation
    │   ├── ir_gen.rs        # Rust → LLVM IR
    │   ├── optimize.rs      # LLVM optimization passes
    │   └── codegen/
    │       ├── evm.rs       # IR → EVM bytecode
    │       ├── bpf.rs       # IR → Solana BPF
    │       ├── wasm.rs      # IR → WASM
    │       ├── cosmwasm.rs  # WASM → CosmWasm validated
    │       └── teal.rs      # Rust → TEAL (via AST transpiler)
    ├── sandbox/
    │   ├── mod.rs
    │   └── gvisor.rs        # Sandboxed execution
    └── artifacts.rs         # Artifact serialization + S3 upload
```

### `services/deployer-service/`
```
deployer-service/
├── Cargo.toml
└── src/
    ├── main.rs
    ├── worker.rs
    ├── chains/
    │   ├── mod.rs           # ChainDeployer trait
    │   ├── ethereum.rs      # ethers-rs EVM deployer
    │   ├── solana.rs        # solana-client deployer
    │   ├── polygon.rs       # EVM (reuses ethereum.rs)
    │   ├── bsc.rs           # EVM (reuses ethereum.rs)
    │   ├── near.rs          # near-api-rs deployer
    │   ├── cosmos.rs        # cosmrs deployer
    │   ├── polkadot.rs      # subxt deployer
    │   └── algorand.rs      # algonaut deployer
    ├── wallet/
    │   ├── mod.rs
    │   ├── keystore.rs      # Encrypted key storage
    │   └── signer.rs        # Per-chain signing
    └── monitor.rs           # Transaction confirmation polling
```

---

## Shared Crates — Detailed Layout

### `crates/orvyn-core/`
```
orvyn-core/
├── Cargo.toml
└── src/
    ├── lib.rs
    ├── types/
    │   ├── chain.rs         # Chain enum, ChainConfig
    │   ├── contract.rs      # Contract, ABI, Bytecode types
    │   ├── job.rs           # CompileJob, DeployJob
    │   └── error.rs         # OrvynError enum
    └── traits/
        ├── compiler.rs      # Compiler trait
        ├── deployer.rs      # Deployer trait
        └── verifier.rs      # Verifier trait
```

**Chain enum:**
```rust
// crates/orvyn-core/src/types/chain.rs
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum Chain {
    Ethereum,
    Polygon,
    BinanceSmartChain,
    Solana,
    Near,
    Polkadot,
    Cosmos,
    Algorand,
    // Phase 6
    Arbitrum,
    Optimism,
    Base,
    ZkSync,
    StarkNet,
}

impl Chain {
    pub fn vm_target(&self) -> VmTarget {
        match self {
            Chain::Ethereum | Chain::Polygon | Chain::BinanceSmartChain => VmTarget::Evm,
            Chain::Solana => VmTarget::SolanaBpf,
            Chain::Near | Chain::Polkadot => VmTarget::Wasm,
            Chain::Cosmos => VmTarget::CosmWasm,
            Chain::Algorand => VmTarget::Teal,
            Chain::Arbitrum | Chain::Optimism | Chain::Base => VmTarget::Evm,
            Chain::ZkSync => VmTarget::ZkEvm,
            Chain::StarkNet => VmTarget::Cairo,
        }
    }
}
```

---

## Frontend App Layout

### `apps/web/`
```
web/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── router.tsx           # React Router config
    │
    ├── pages/
    │   ├── Landing.tsx
    │   ├── Dashboard.tsx
    │   ├── Editor.tsx       # Main editor page
    │   ├── Deploy.tsx       # Chain selector + deploy
    │   ├── History.tsx      # Deployment history
    │   ├── Settings.tsx
    │   └── auth/
    │       ├── Login.tsx
    │       └── Callback.tsx
    │
    ├── components/
    │   ├── editor/
    │   │   ├── CodeEditor.tsx      # Monaco wrapper
    │   │   ├── CompilePanel.tsx    # Real-time compile output
    │   │   ├── BytecodeViewer.tsx  # Per-chain bytecode
    │   │   └── AbiViewer.tsx
    │   ├── deploy/
    │   │   ├── ChainSelector.tsx
    │   │   ├── GasEstimate.tsx
    │   │   ├── WalletConnect.tsx
    │   │   └── DeployProgress.tsx
    │   ├── layout/
    │   │   ├── Sidebar.tsx
    │   │   ├── Header.tsx
    │   │   └── CommandPalette.tsx
    │   └── common/
    │       ├── Button.tsx
    │       ├── Modal.tsx
    │       └── StatusBadge.tsx
    │
    ├── hooks/
    │   ├── useCompile.ts
    │   ├── useDeploy.ts
    │   ├── useWebSocket.ts
    │   └── useWallet.ts
    │
    ├── stores/
    │   ├── editorStore.ts
    │   ├── deployStore.ts
    │   └── authStore.ts
    │
    ├── lib/
    │   ├── api.ts           # API client (TanStack Query)
    │   ├── ws.ts            # WebSocket client
    │   └── chains.ts        # Chain metadata
    │
    └── styles/
        ├── globals.css
        └── editor-theme.ts  # Monaco dark theme
```

---

## JS Packages Layout

### `packages/sdk/`
```
sdk/
├── package.json             # name: @orvyn/sdk
├── tsconfig.json
├── src/
│   ├── index.ts             # Public API exports
│   ├── client.ts            # OrvynClient class
│   ├── compile.ts           # compile() method
│   ├── deploy.ts            # deploy() method
│   ├── verify.ts            # verify() method
│   ├── types.ts             # Shared types
│   └── errors.ts
└── dist/                    # Built output (CJS + ESM)
```

---

## Naming Conventions

| Domain | Convention | Example |
|--------|-----------|---------|
| Rust files | `snake_case` | `deploy_job.rs` |
| Rust types | `PascalCase` | `CompileJob` |
| Rust functions | `snake_case` | `compile_contract()` |
| React components | `PascalCase` | `ChainSelector.tsx` |
| React hooks | `camelCase` with `use` prefix | `useCompile.ts` |
| TS types/interfaces | `PascalCase` | `DeployResult` |
| API routes | `kebab-case` | `/compile-jobs/:id` |
| DB tables | `snake_case` | `compile_jobs` |
| Env vars | `SCREAMING_SNAKE_CASE` | `ETH_RPC_URL` |
| Docker images | `orvyn/<service>` | `orvyn/compiler-service` |
| K8s namespaces | `orvyn-<env>` | `orvyn-production` |

---

## Key `package.json` (workspace root)

```json
{
  "name": "orvyn",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check"
  },
  "devDependencies": {
    "turbo": "^1.13.0",
    "typescript": "^5.4.0"
  }
}
```

---

## Git Branch Strategy

```
main          ← production-ready, auto-deploys to prod
staging       ← pre-release, auto-deploys to staging
develop       ← integration branch
feature/*     ← feature branches (PR → develop)
fix/*         ← bug fixes
release/*     ← release prep branches
```

**Commit convention:** `type(scope): description`  
Examples: `feat(compiler): add WASM backend`, `fix(deploy): handle Solana timeout`