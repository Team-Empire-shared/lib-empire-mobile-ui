# Contributing

## Branch Strategy

- `main` — production-ready code. Protected, requires 1 reviewer.
- `develop` — integration branch. All feature work merges here first.

## Workflow

1. Create a feature branch from `develop`:
   ```bash
   git checkout develop && git pull
   git checkout -b feature/your-feature-name
   ```

2. Make your changes, commit with clear messages:
   ```bash
   git commit -m "feat: add candidate search filter"
   ```

3. Push and open a PR to `develop`:
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. PR requirements:
   - CI must pass (lint + type-check + build)
   - 1 approving review required
   - No merge conflicts

5. After merge to `develop`, it will be promoted to `main` when ready for release.

## Commit Message Format

Use conventional commits:
- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — maintenance, deps, config
- `docs:` — documentation only
- `refactor:` — code change that neither fixes a bug nor adds a feature

## Code Standards

- TypeScript strict mode (no `any`)
- Tailwind CSS for styling (web) / StyleSheet for mobile
- All API calls through the shared API client (never raw axios/fetch)
- Environment variables for all config (never hardcode URLs)

## Before Submitting

```bash
npm run lint        # zero errors
npm run build       # must succeed (web)
npx tsc --noEmit    # zero type errors
```

