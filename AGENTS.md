# Team Empire — agent instructions

When working from **this package repo alone**, use this file plus `DESIGN.md` and `src/lib/theme.ts`. For the full monorepo, also follow the workspace copy at the monorepo root (if present).

## Open the full monorepo (recommended for cross-app work)

- Open **`Team-Empire.code-workspace`** in Cursor or VS Code, or **File → Open Folder** → the monorepo root (not a single app subfolder only), so **`.cursor/rules/`** applies everywhere.

## UI and design (default workflow)

1. **Entry point (monorepo):** `Shared/DESIGN.md` → default `awesome-design-md-main/design-md/vercel/DESIGN.md`, alternates under `design-md/<site>/`.
2. **This package:** **`DESIGN.md`** and **`src/lib/theme.ts`** are authoritative. Prefer exports from **`@empireoe/mobile-ui`**. Do not swap in random hex from external specs without updating `theme.ts`.
3. **Overrides:** Read the matching **`awesome-design-md-main/design-md/<name>/DESIGN.md`** when a product asks for a different look—still reconcile with `theme.ts` and existing components.
4. **Web reference (monorepo):** `Shared/team-empire-web`.

## Product-specific design anchors

- **LWE (Learn With Empire)** — **Stripe** palette for `lwe-web`, `lwe-dashboard`, `lwe-app`, `lwe-app-internal`. See **`lwe-web` repo:** `docs/LWE_DESIGN.md`; spec: `awesome-design-md-main/design-md/stripe/DESIGN.md`; tokens: **`lweTheme`** / `productColors.lwe` in this package’s `src/lib/theme.ts`.

## When app code disagrees with a markdown spec

Existing **themes, tokens, or brand CSS in the target app** win. Use `DESIGN.md` files to extend or harmonize, not to ignore checked-in design code.

## Per-app builds and tests

Each product app has its own **`package.json`** scripts (`dev`, `build`, `test`, `lint`). For this library: use **`npm run build`**, **`npm test`**, **`npm run lint`**.
