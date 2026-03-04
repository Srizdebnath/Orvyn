# Orvyn: Agent Understandings

Last updated: 2026-03-04

## 1) Product Intent

Orvyn is a Rust-first smart contract platform with a clear promise:
"Write Rust once. Deploy to multiple blockchains."

The intended end-to-end developer flow is:
1. Write contract code in a Monaco-based editor.
2. Compile in real time through a Rust -> LLVM -> chain-target pipeline.
3. Inspect artifacts (bytecode/ABI/IDL/schema) per chain.
4. Deploy to multiple chains from one deploy action.
5. Track live deploy progress, then verify contracts on explorers.
6. Automate deployments through SDK + CI/CD.

## 2) Current Repository Reality

This repository currently contains planning and architecture documentation (under `docs/`), not the full executable monorepo described in those docs.

Agents must treat these docs as the source of truth for:
1. Product direction.
2. Expected service boundaries.
3. Naming conventions and workflows.
4. Quality expectations for future implementation.

## 3) Architecture Understanding (From Docs)

Planned system shape:
1. Client layer: Web (React + Vite), Desktop (Tauri), Mobile (React Native), TypeScript SDK.
2. API/gateway layer: API Gateway, Auth service, WebSocket server.
3. Core services: Compiler service, Deployer service, Verifier service, Gas oracle.
4. Storage: PostgreSQL, Redis, object storage (S3/R2), optional IPFS.
5. Blockchain targets: EVM chains, Solana, Near, Polkadot, Cosmos, Algorand, later L2s.

## 4) Critical Functional Flows To Preserve

1. Compilation lifecycle:
   POST compile job -> queue -> worker stages -> artifact storage -> WebSocket status updates.
2. Deployment lifecycle:
   Request deploy -> gas preview/approval -> chain-specific jobs in parallel -> confirmations -> verification.
3. Wallet model:
   Unified wallet adapter supports browser wallets, encrypted private keys, and hardware wallet flows.
4. Reliability model:
   Per-chain RPC provider pools with health checks + failover.
5. Security model:
   Sandboxed compilation with strict resource and timeout limits.

## 5) Engineering Conventions

1. Naming:
   Rust files/functions `snake_case`, Rust types `PascalCase`, React components `PascalCase`, hooks `useCamelCase`.
2. API route style:
   `kebab-case` where applicable.
3. DB tables:
   `snake_case`.
4. Env vars:
   `SCREAMING_SNAKE_CASE`.
5. Commit message convention:
   `type(scope): description`
   Example: `feat(compiler): add wasm target artifact metadata`

## 6) Non-Negotiable Agent Workflow

Agents must follow this sequence before committing:
1. Understand context first:
   Read relevant docs and existing code paths before changing anything.
2. Implement fully:
   Do not leave partial/stub functions. Handle expected errors and edge cases.
3. Validate behavior:
   Add or update tests for the new/changed function.
4. Run checks locally:
   Run lint, type-check, unit/integration tests, and build steps relevant to changed files.
5. Verify no regressions:
   Confirm existing behavior is preserved unless intentionally changed.
6. Commit only after passing validation:
   Never commit broken or unverified code.
7. Push after successful commit:
   Push branch to GitHub after commit is created.

## 7) Commit + Push Policy (Required)

Remote target:
`https://github.com/Srizdebnath/Orvyn`

Recommended commit format:

```text
type(scope): short summary

Why:
- reason for change

What:
- key implementation points

Validation:
- commands run and outcomes
```

Push sequence:
```bash
git add <files>
git commit -m "type(scope): short summary"
git push origin <branch>
```

If `origin` is not configured:
```bash
git remote add origin https://github.com/Srizdebnath/Orvyn.git
git push -u origin <branch>
```

## 8) Definition Of Done For Any New Function

A function is done only when all are true:
1. Behavior is correct for happy path and edge cases.
2. Error handling is explicit and meaningful.
3. Tests cover the intended behavior.
4. Code passes relevant lint/type/test/build checks.
5. Change is documented when behavior or interface changes.
6. Commit message is clear and follows the convention.
7. Branch is pushed to the GitHub remote.

## 9) Source Docs Used

1. `docs/codebase_architecture.md`
2. `docs/compilation_pipeline.md`
3. `docs/deployment architecture.md`
4. `docs/developer_experience.md`
5. `docs/techstacks.md`
6. `docs/roadmap.md`
