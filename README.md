# Playground

Fullstack side project monorepo for rapid prototyping and experimentation.

## Tech Stack

| Category | Tools |
|----------|-------|
| Package Manager | pnpm 10 + Turborepo 2 |
| Frontend | Next.js 15 + React 19 + Tailwind CSS 4 |
| DB / ORM | Drizzle ORM + SQLite |
| Validation | Zod 3 |
| Testing | Vitest 3 + Playwright |
| Code Quality | ESLint 9 + Prettier 3 + TypeScript 5.7 strict |
| Git Hooks | Lefthook (pre-commit: lint + typecheck) |

## Project Structure

```
playground/
├── apps/
│   └── web/                    # Next.js 15 fullstack app (App Router)
├── packages/
│   ├── ui/                     # Shared React components (Button, Input, Card)
│   ├── db/                     # Drizzle ORM + SQLite schema & client
│   ├── utils/                  # Shared utilities (validation, errors, formatting)
│   ├── typescript-config/      # Shared TypeScript configs (base, nextjs, react-library)
│   └── eslint-config/          # Shared ESLint 9 flat configs (base, next, react)
├── tooling/
│   └── vitest/                 # Shared Vitest config (80% coverage threshold)
├── turbo.json
├── pnpm-workspace.yaml         # catalog: for centralized version management
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Opens the Next.js dev server at [http://localhost:3000](http://localhost:3000).

### Build

```bash
pnpm build
```

### Testing

```bash
# Run all unit tests
pnpm test

# Run E2E tests (apps/web)
pnpm --filter @playground/web test:e2e
```

### Code Quality

```bash
# Type-check all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Format code
pnpm format
```

## Packages

### `@playground/web`

Next.js 15 fullstack app with App Router, Tailwind CSS 4, and Turbopack dev server.

- `/` - Home page
- `/api/health` - Health check endpoint

### `@playground/ui`

Shared React component library.

| Component | Props |
|-----------|-------|
| `Button` | `variant` (primary / secondary / outline), `size` (sm / md / lg) |
| `Input` | `label`, `error`, standard input attributes |
| `Card` | `title`, `description`, `footer`, `children` |

```tsx
import { Button, Input, Card } from '@playground/ui'
```

### `@playground/db`

Drizzle ORM with SQLite (better-sqlite3).

```ts
import { db, users } from '@playground/db'
```

### `@playground/utils`

Shared utility functions.

```ts
import {
  createPaginationSchema,
  createIdSchema,
  AppError,
  ValidationError,
  NotFoundError,
  formatDate,
  formatCurrency,
  truncate,
  slugify,
} from '@playground/utils'
```

## Version Management

All dependency versions are centralized in `pnpm-workspace.yaml` using pnpm's `catalog:` protocol. To update a dependency version, change it once in the catalog and all packages will pick it up.

## Adding a New App

1. Create a new directory under `apps/`
2. Add a `package.json` referencing shared packages with `workspace:*`
3. Use `catalog:` for external dependency versions
4. Extend shared configs (`@playground/typescript-config`, `@playground/eslint-config`, `@playground/vitest-config`)
