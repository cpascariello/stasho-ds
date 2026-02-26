# Aleph Cloud Design System

Tokens-first design system for [Aleph Cloud](https://aleph.im), built with Tailwind CSS 4, OKLCH color scales, and CSS custom properties. Ships as a component library (`@aleph-front/ds`) with a Next.js preview app for visual reference.

**Status:** Pre-release (`0.0.0`). Not yet published to npm.

## Quick Start

```bash
pnpm install
pnpm dev          # http://localhost:3000 — preview app with theme switcher
pnpm check        # lint + typecheck + test
```

## Documentation

| You need to... | Go here |
|----------------|---------|
| Use tokens (colors, fonts, shadows, gradients, transitions) | [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) |
| Use or build components (Button, Spinner, ThemeSwitcher) | [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) § Components |
| Add a new semantic token | [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) § Patterns |
| Understand token architecture, patterns, or recipes | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| Know why a decision was made | [`docs/DECISIONS.md`](docs/DECISIONS.md) |
| See planned or deferred work | [`docs/BACKLOG.md`](docs/BACKLOG.md) |
| Read implementation plans for existing features | [`docs/plans/`](docs/plans/) |
| Understand project workflow, commands, and conventions | [`CLAUDE.md`](CLAUDE.md) |
| See raw token values (CSS custom properties) | [`src/styles/tokens.css`](src/styles/tokens.css) |

## Import Alias

All source imports use `@ac/*` which resolves to `./src/*` (configured in `tsconfig.json` and `vitest.config.ts`).

```tsx
import { Button } from "@ac/components/button/button";
import { Spinner } from "@ac/components/ui/spinner";
import { cn } from "@ac/lib/cn";
```

CSS imports use relative paths — PostCSS does not resolve tsconfig aliases. See [Decision #5](docs/DECISIONS.md).

## License

MIT — see [LICENSE](LICENSE)
