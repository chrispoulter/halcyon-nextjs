# Repository Guidelines

## Project Structure & Module Organization
- `src/app` hosts the Next.js App Router routes, layouts, and server components.
- `src/components` contains shared UI components; `src/lib` holds utilities and helpers.
- `src/db` and `drizzle/` contain database schema, migrations, and Drizzle metadata.
- `src/emails` stores React Email templates; `public/` holds static assets.
- `src/instrumentation.ts` is used for observability hooks.

## Build, Test, and Development Commands
- `npm run dev`: start the local Next.js dev server at `http://localhost:3000`.
- `npm run build`: create a production build in `.next/`.
- `npm run start`: run the built production server.
- `npm run lint`: run ESLint (Next.js + TypeScript config).
- `npm run format`: apply Prettier (includes Tailwind class sorting).
- `npm run db:generate` / `npm run db:migrate`: generate and apply Drizzle migrations.
- `npm run docker:up` / `npm run docker:down`: start/stop Postgres and Mailpit via Docker Compose.
- `npm run email`: run the React Email dev server at `http://localhost:3001`.

## Coding Style & Naming Conventions
- TypeScript-first codebase; prefer `*.ts`/`*.tsx` and keep modules cohesive.
- Prettier defaults: 4-space indentation, single quotes, trailing commas (ES5).
- ESLint is configured in `eslint.config.mjs`; fix lint errors before opening a PR.
- Use clear, descriptive names: `PascalCase` for components, `camelCase` for functions/vars.

## Testing Guidelines
- No test runner is configured yet. If adding tests, follow common Next.js patterns:
  `src/**/__tests__/*.test.tsx` or `*.test.ts` alongside modules.
- Ensure new behavior is covered by tests when introducing logic-heavy changes.

## Commit & Pull Request Guidelines
- Commits in history use short, imperative messages (e.g., "update dependencies").
- Include a PR number or issue reference when relevant.
- PRs should include: a concise description, how to test, and screenshots for UI changes.
- Document schema changes and include generated migrations when touching `src/db`.

## Security & Configuration Tips
- Local secrets live in `.env` (not committed). Use `docker:up` for local Postgres/Mailpit.
- Avoid committing credentials, encryption keys, or real emails; use placeholders for examples.
