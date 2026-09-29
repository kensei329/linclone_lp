# LinClone site redesign (v3)

`SPEC.md` is the build spec this site was implemented from: routes, design tokens, section-by-section
motion specs, mockup blueprints, SEO, the copy-lint rules, and the owner decisions that constrain what the
site may claim (§1.4, §9.6, §9.8). Copy lives in `src/i18n/dictionaries/{ja,en}/*.json`
(source: `assets-src/dictionaries/`, split with `npm run dict:split`).

Launch gates (SPEC §9.8): fan app v3 public on both stores; App Store listing localized to Japanese;
production `public/.well-known/*` preserved (production deploys from the Abhishek-089 fork, which has
newer association files than this branch). Flip `STUDIO_LIVE` in `src/lib/site-config.ts` when
LC Studio is public on the stores.
