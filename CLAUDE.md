# Playground Monorepo

## Structure

- `apps/web` - Next.js 15 fullstack app (App Router)
- `packages/ui` - Shared React components (`@playground/ui`)
- `packages/db` - Drizzle ORM + SQLite (`@playground/db`)
- `packages/utils` - Shared utilities (`@playground/utils`)
- `packages/typescript-config` - Shared TS configs
- `packages/eslint-config` - Shared ESLint configs
- `tooling/vitest` - Shared Vitest config

## Commands

- `pnpm dev` - Start all dev servers
- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all packages
- `pnpm typecheck` - Type-check all packages

## Conventions

- Package naming: `@playground/<name>`
- Use `catalog:` in pnpm-workspace.yaml for version management
- All packages use TypeScript strict mode
- Minimum 80% test coverage
- Immutable patterns only (no mutation)
- Validate all user input with Zod
