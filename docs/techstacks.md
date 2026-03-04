# Orvyn — Tech Stack Architecture
> Full-stack architecture blueprint for the Rust-first multi-chain deployment platform.

---

## High-Level System Architecture

```mermaid
graph TB
    subgraph CLIENT["Client Layer"]
        WEB["Web App<br/>React + Vite"]
        DESKTOP["Desktop App<br/>Tauri + Rust"]
        MOBILE["Mobile App<br/>React Native"]
        SDK["TypeScript SDK<br/>@orvyn/sdk"]
    end

    subgraph GATEWAY["API Gateway Layer"]
        GW["API Gateway<br/>Nginx + Kong"]
        AUTH["Auth Service<br/>Rust + JWT"]
        WS["WebSocket Server<br/>Rust tokio-tungstenite"]
    end

    subgraph CORE["Core Services (Rust)"]
        COMPILER["Compiler Service<br/>Rust + LLVM"]
        DEPLOYER["Deployer Service<br/>Rust + ethers-rs"]
        VERIFIER["Verifier Service<br/>Rust"]
        GAS["Gas Oracle<br/>Rust"]
    end

    subgraph STORAGE["Storage Layer"]
        PG["PostgreSQL 16<br/>Main DB"]
        REDIS["Redis 7<br/>Cache + Queues"]
        S3["S3 / R2<br/>Artifacts + Bytecode"]
        IPFS["IPFS<br/>Contract Source"]
    end

    subgraph BLOCKCHAIN["Blockchain Layer"]
        EVM["EVM Chains<br/>Ethereum/Polygon/BSC"]
        SOLANA["Solana<br/>RPC Cluster"]
        COSMOS["Cosmos<br/>CosmWasm"]
        NEAR["Near Protocol"]
        POLKADOT["Polkadot<br/>Substrate"]
        ALGO["Algorand"]
    end

    CLIENT --> GATEWAY
    GATEWAY --> CORE
    CORE --> STORAGE
    CORE --> BLOCKCHAIN
```

---

## Frontend Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | React | 18.x | Ecosystem, concurrent features |
| Build Tool | Vite | 5.x | Fast HMR, ESM native |
| Language | TypeScript | 5.x | Type safety across codebase |
| Code Editor | Monaco Editor | 0.46.x | VSCode engine, Rust LSP support |
| State Management | Zustand | 4.x | Simple, minimal boilerplate |
| Server State | TanStack Query | 5.x | Cache, sync, background refetch |
| Routing | React Router | 6.x | Nested layouts |
| Styling | Tailwind CSS | 3.x | Utility-first, design system |
| UI Components | Radix UI | latest | Accessible primitives |
| Charts | Recharts | 2.x | Gas price timelines |
| WebSockets | native + zustand | — | Real-time compile output |
| Wallet | wagmi + viem | 2.x | EVM wallets |
| Solana Wallet | @solana/wallet-adapter | 0.15.x | Phantom, Backpack |
| Cosmos Wallet | @cosmos-kit/react | 2.x | Keplr, Leap |
| Forms | React Hook Form + Zod | latest | Validated forms |
| Testing | Vitest + RTL | latest | Unit + integration |
| E2E | Playwright | latest | Cross-browser |

### Monaco Editor Configuration
```typescript
// editor/config.ts
import * as monaco from 'monaco-editor';
import { configureMonacoRust } from './rust-language';

export function initEditor(container: HTMLElement) {
  configureMonacoRust(monaco); // Register Rust grammar + LSP

  return monaco.editor.create(container, {
    language: 'rust',
    theme: 'orvyn-dark',
    fontSize: 14,
    fontFamily: 'JetBrains Mono, Fira Code, monospace',
    minimap: { enabled: true },
    formatOnSave: true,
    suggestOnTriggerCharacters: true,
    quickSuggestions: { other: true, comments: false, strings: false },
  });
}
```

---

## Backend Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Language | Rust | 1.75+ | Performance, memory safety |
| Async Runtime | Tokio | 1.x | Industry standard async |
| Web Framework | Axum | 0.7.x | Ergonomic, tower middleware |
| ORM | SQLx | 0.7.x | Compile-time SQL verification |
| Auth | JWT (jsonwebtoken) | 9.x | Stateless auth |
| OAuth | OAuth2 crate | 4.x | GitHub, Google |
| Message Queue | Redis Streams | — | Job queues (compile/deploy) |
| Caching | Redis | 7.x | Session, gas prices, RPCs |
| File Storage | AWS S3 / CF R2 | — | Bytecode artifacts |
| Email | SendGrid | — | Transactional emails |
| Payments | Stripe | — | Subscription management |
| Observability | OpenTelemetry + Jaeger | — | Distributed tracing |
| Metrics | Prometheus + Grafana | — | System metrics |
| Logging | tracing + loki | — | Structured logs |
| Testing | cargo test + mockall | — | Unit + integration |

### Axum Service Example
```rust
// src/routes/compile.rs
use axum::{extract::State, Json, response::IntoResponse};
use crate::{AppState, CompileRequest, CompileResponse};

pub async fn compile_contract(
    State(state): State<AppState>,
    Json(req): Json<CompileRequest>,
) -> impl IntoResponse {
    let job_id = state.compiler_queue
        .enqueue(CompileJob {
            source: req.source,
            targets: req.targets,
            optimization_level: req.optimization_level.unwrap_or(OptLevel::O2),
        })
        .await?;

    Json(CompileResponse { job_id, status: "queued" })
}
```

---

## Compilation Pipeline Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Rust frontend | rustc (library) | Parse + type-check Rust source |
| IR generation | LLVM 17 (llvm-sys) | Rust → LLVM IR |
| EVM backend | revmc / revm | LLVM IR → EVM bytecode |
| Solana backend | solana-llvm-backend | LLVM IR → BPF bytecode |
| WASM backend | wasm-pack / wasm-bindgen | Rust → WASM (Near, Polkadot) |
| CosmWasm | cosmwasm-check | WASM validation for Cosmos |
| Algorand | py-algorand-sdk (sidecar) | TEAL compilation |
| Optimizer | solc optimizer / LLVM opts | Gas optimization passes |
| Sandbox | gVisor / Firecracker | Untrusted code execution |

---

## Deployment Layer Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| EVM deployment | ethers-rs 2.x | Sign + broadcast EVM txs |
| Solana deployment | solana-client (Rust) | Deploy BPF programs |
| Cosmos deployment | cosmos-sdk (Rust bindings) | CosmWasm contract upload |
| Near deployment | near-api-rs | WASM contract deployment |
| Polkadot deployment | subxt | ink! contract deployment |
| Algorand deployment | algonaut | TEAL deployment |
| RPC management | Custom RPC router | Failover, load balancing |
| Wallet adapters | Per-chain signer traits | Unified signing interface |

---

## Infrastructure Stack

| Layer | Technology | Configuration |
|-------|-----------|--------------|
| Container Runtime | Docker + containerd | Per-service containers |
| Orchestration | Kubernetes (K8s) | EKS / GKE |
| Service Mesh | Istio | mTLS, traffic management |
| Ingress | Nginx + Kong | Rate limiting, auth plugins |
| CI/CD | GitHub Actions | Build, test, deploy |
| GitOps | ArgoCD | K8s manifest sync |
| Secrets | HashiCorp Vault | API keys, private keys |
| CDN | Cloudflare | Static assets, edge caching |
| DNS | Cloudflare DNS | Global routing |
| TLS | Let's Encrypt (cert-manager) | Auto-renewal |

---

## Database Schema (PostgreSQL)

```sql
-- Users and auth
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT UNIQUE NOT NULL,
    github_id   TEXT UNIQUE,
    tier        TEXT NOT NULL DEFAULT 'free', -- free | pro | enterprise
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Organizations (enterprise)
CREATE TABLE organizations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    owner_id    UUID REFERENCES users(id),
    tier        TEXT NOT NULL DEFAULT 'enterprise',
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE projects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id),
    org_id      UUID REFERENCES organizations(id),
    name        TEXT NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Contracts (source code versions)
CREATE TABLE contracts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID REFERENCES projects(id),
    name        TEXT NOT NULL,
    source_code TEXT NOT NULL,
    source_hash TEXT NOT NULL,
    version     INTEGER NOT NULL DEFAULT 1,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Compile jobs
CREATE TABLE compile_jobs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id     UUID REFERENCES contracts(id),
    status          TEXT NOT NULL DEFAULT 'pending',  -- pending|running|success|failed
    target_chains   TEXT[] NOT NULL,
    artifacts       JSONB,   -- { "ethereum": { "bytecode": "...", "abi": [...] } }
    error_log       TEXT,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Deployments
CREATE TABLE deployments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    compile_job_id  UUID REFERENCES compile_jobs(id),
    chain           TEXT NOT NULL,
    network         TEXT NOT NULL,  -- mainnet | testnet
    contract_address TEXT,
    tx_hash         TEXT,
    deployer_address TEXT NOT NULL,
    gas_used        BIGINT,
    gas_price       NUMERIC,
    status          TEXT NOT NULL DEFAULT 'pending',
    verified        BOOLEAN DEFAULT false,
    deployed_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_deployments_chain ON deployments(chain);
CREATE INDEX idx_compile_jobs_status ON compile_jobs(status);
CREATE INDEX idx_contracts_project ON contracts(project_id);
```

---

## Environment Configuration

```bash
# .env.production
DATABASE_URL=postgresql://orvyn:***@db.orvyn.internal:5432/orvyn_prod
REDIS_URL=redis://redis.orvyn.internal:6379
S3_BUCKET=orvyn-artifacts-prod
S3_REGION=us-east-1

# Blockchain RPCs
ETH_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}
ETH_FALLBACK_RPC=https://cloudflare-eth.com
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
POLYGON_RPC_URL=https://polygon-rpc.com
BSC_RPC_URL=https://bsc-dataseed.binance.org

# Auth
JWT_SECRET=***
GITHUB_CLIENT_ID=***
GITHUB_CLIENT_SECRET=***

# Services
STRIPE_SECRET_KEY=***
SENDGRID_API_KEY=***
ETHERSCAN_API_KEY=***
SOLSCAN_API_KEY=***

# Compilation
LLVM_PATH=/usr/lib/llvm-17
COMPILER_WORKER_COUNT=8
MAX_COMPILE_TIMEOUT_SECS=120
SANDBOX_ENABLED=true
```