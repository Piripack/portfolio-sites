# portfolio-sites

Production-grade Astro + Tailwind + React islands demos optimised for UK service businesses. Includes RapidFix Plumbing, La Terra Café, CareerLift Coaching, Nordic Threads, and Ramos Digital Studio experiences.

## Getting started

```bash
pnpm install
pnpm run dev
```

## Testing & quality

- `pnpm run typecheck` – strict TypeScript
- `pnpm run lint` – html-validate
- `pnpm run test` – Playwright smoke tests
- GitHub Actions for Pages deploy and Lighthouse CI with Core Web Vitals thresholds

## Deployment

The project outputs a static site ready for GitHub Pages under `/portfolio-sites/` base path. Update `astro.config.mjs` with your repository URL before deploying.

## Localisation

- Locale catalogues live in `public/locales/<code>.json`. Keep keys flat (`group.key`) so the client runtime can resolve them quickly.
- To add a new language, duplicate `public/locales/en.json`, translate the values, then include the ISO code in both `public/scripts/i18n.js` and `src/components/react/useTranslation.ts`.
- Page-specific strings sit under `serviceBusiness.*`, `restaurant.*`, `coaching.*`, `store.*`, and `agency.*`. Reuse existing keys where possible; any new key should be added to every locale file to avoid missing-string fallbacks.
- Components or Astro templates render translated copy via `data-i18n="key"` or the `useTranslation()` hook. When adding new UI strings, wire the same key into each view and update the locale JSON files in one commit to keep the catalogues in sync.
