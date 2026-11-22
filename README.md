# underhood

[![underhood: no magic](https://manunamz.github.io/underhood/badges/code-only.svg)](https://manunamz.github.io/underhood)

A README badge that says whether a project runs deterministic code, model inference, or both.

- ⚙ **mech**: deterministic code (Software 1.0)
- ✨ **magic**: inference from a trained model (Software 2.0 / 3.0)

Each item is ✓ (required), ~ (optional) or ✗ (absent), which gives six states: ⚙✓✨✗ code-only, ⚙✓✨~ model-optional, ⚙✓✨✓ fully-loaded, ⚙~✨✓ code-optional, ⚙✗✨✓ model-only, and ⚙~✨~ either (runs as pure code or pure inference). See [SPEC.md](SPEC.md) for the definitions and [the landing page](https://manunamz.github.io/underhood) for the explanation the badge links to.

## Layout

- `src/badge.js`: renders the badge SVG for a level and icon
- `src/build.js`: writes `docs/badges/*.svg` (`npm run build`)
- `docs/`: the GitHub Pages site (landing page, badges, `icons.html` icon comparison)

## Hosting

Serve `docs/` with GitHub Pages (Settings → Pages → branch `main`, folder `/docs`). The badge URLs assume `https://manunamz.github.io/underhood`.
