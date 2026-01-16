# Repository Guidelines

## Purpose

- This file guides agentic coding assistants working in this repo.
- Follow these conventions to stay consistent with the codebase.

## Project Structure

- `src/app`: Next.js App Router routes, layouts, and server components.
- `src/components`: shared UI components.
- `src/components/ui`: shadcn/ui primitives and wrappers.
- `src/lib`: utilities, config, and server helpers.
- `src/db` + `drizzle/`: schema, migrations, Drizzle metadata.
- `src/emails`: React Email templates.
- `public/`: static assets.
- `src/instrumentation.ts`: observability hooks.

## Install & Runtime Commands

- `npm install`: install dependencies.
- `npm run dev`: start Next.js dev server at `http://localhost:3000`.
- `npm run build`: build production output into `.next/`.
- `npm run start`: serve the built production app.
- `npm run email`: start React Email dev server at `http://localhost:3001`.

## Linting & Formatting

- `npm run lint`: run ESLint (Next.js + TypeScript presets).
- `npm run lint -- <file>`: lint a specific file.
- `npm run format`: run Prettier with Tailwind class sorting.
- `npm run format -- <file>`: format a specific file.

## Database & Infrastructure

- `npm run db:generate`: generate Drizzle migrations.
- `npm run db:migrate`: apply Drizzle migrations.
- `npm run docker:up`: start Postgres + Mailpit via Docker Compose.
- `npm run docker:down`: stop the Docker Compose services.

## Testing

- No automated test runner is configured yet.
- If you add tests, follow Next.js patterns:
    - `src/**/__tests__/*.test.tsx` or colocated `*.test.ts`.
- After adding a runner, add scripts for:
    - `npm run test`: run all tests.
    - `npm run test -- <file>`: run a single test file.
- Until a runner exists, use `npm run lint` and `npm run build` for validation.

## Environment & Configuration

- Local secrets live in `.env` and must never be committed.
- Example env vars are documented in `README.md`.
- Email uses SMTP settings from env and Mailpit via Docker Compose.
- Use `config` in `src/lib/config.ts` for env access.

## TypeScript & Language Conventions

- TypeScript is strict; avoid `any` and unsafe casts.
- Prefer `type` imports with `import type { ... }` for types.
- Keep types local to files when possible; export shared types from `src/lib/definitions.ts`.
- Favor `const` and `readonly` data structures.
- Use `async`/`await`; avoid mixing with `.then()` chains.

## React & Next.js Conventions

- App Router uses server components by default.
- Add `'use client'` only when hooks or browser APIs are required.
- Use `server-only` imports in server utility modules.
- Prefer `redirect`, `notFound`, and `forbidden` from Next.js for flow control.
- Keep route components focused; move reusable UI to `src/components`.

## Imports & Module Boundaries

- Prefer absolute imports via `@/` alias for `src/*`.
- Order imports: external packages → `@/` imports → relative imports → styles.
- Keep import groups separated by a blank line.
- Avoid circular dependencies; keep modules cohesive.

## Naming Conventions

- `PascalCase` for React components and component files.
- `camelCase` for functions, variables, and hooks.
- `SCREAMING_SNAKE_CASE` for module-level constants.
- File names are lowercase with dashes (except component files).

## Styling & Tailwind

- Tailwind CSS is the default styling approach.
- Use `cn` from `src/lib/utils.ts` to merge class names.
- Keep class lists readable; rely on Prettier + tailwind plugin for ordering.

## Error Handling & Validation

- Use `ActionError` from `src/lib/safe-action.ts` for actionable server errors.
- Throw `ActionError` with status codes for auth/permission failures.
- In `next-safe-action`, keep error messages user-safe; log details server-side.
- Validate inputs with `zod` schemas before acting on user data.

## Auth & Session Patterns

- `getSession` in `src/lib/session.ts` provides session data.
- `verifySession` in `src/lib/dal.ts` handles role checks + redirects.
- Use `authActionClient` for role-gated server actions.

## Data Access & Caching

- Server data access should remain in `src/lib` or `src/db`.
- Use `cache` from React for memoizing session lookups or expensive reads.
- Avoid fetching data in client components unless necessary.

## Formatting & Lint Notes

- Prettier defaults: 4-space indent, single quotes, trailing commas (ES5).
- ESLint config lives in `eslint.config.mjs` and extends Next.js presets.
- Run formatting after large UI changes to keep Tailwind classes ordered.

## UI Components

- shadcn/ui components live under `src/components/ui`.
- Wrap shared UI in descriptive components instead of repeating markup.
- Favor composition over prop-heavy monolith components.

## Documentation & Comments

- Avoid inline comments unless they explain non-obvious intent.
- Update README or feature docs only when behavior changes.

## Security & Secrets

- Never commit `.env` or secrets; use placeholders in docs.
- Avoid logging sensitive information, especially in error handlers.

## Git & PR Expectations

- Commit messages are short, imperative (e.g., "update dependencies").
- PRs should include summary, testing steps, and UI screenshots if relevant.
- Include Drizzle migrations whenever schema changes.

## Cursor/Copilot Rules

- No `.cursorrules`, `.cursor/rules`, or `.github/copilot-instructions.md` files found.
- If these files appear later, follow them with higher priority.

## Quick Reference Checklist

- Use `@/` imports for internal modules.
- Ensure server utilities include `server-only`.
- Keep components small and composable.
- Use `zod` for validation, `ActionError` for action failures.
- Run `npm run lint` and `npm run format` before PRs.
- Confirm DB migrations are generated for schema changes.
- Keep Tailwind classes sorted (Prettier handles this).

## Notes for Future Test Setup

- Add `npm run test` when a runner is introduced.
- Add `npm run test -- <file>` for single-test runs.
- Prefer colocated tests for utilities and components.
- Keep test data minimal and deterministic.

## Agent Behavior Tips

- Read existing patterns before introducing new abstractions.
- Minimize diff size; avoid stylistic-only refactors.
- Verify any env changes are documented in `.env.example` if added.
- Ask before adding new dependencies.
- Avoid modifying generated files except migrations.

## Support

- Reach out to repo owner for unclear conventions.
- Keep changes consistent with the template's purpose.
