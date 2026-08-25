# Duello

> Find the true ranking of anything through the fewest possible head-to-head duels.

Duello is an adaptive pairwise-ranking tool that determines the best-to-worst order of any set of items using only the comparisons it actually needs.

## Features

- Adaptive head-to-head comparisons
- Transitivity-aware ranking
- Binary-search-based comparison scheduling
- Exact best-to-worst rankings
- Comparison count and efficiency estimates
- Bulk participant entry
- Fully client-side
- Accessible and keyboard-friendly

## How it works

Duello maintains a sorted list and uses binary search to determine where each new item belongs. Once a relationship can be inferred through transitivity, it never needs to be asked directly.

A full round-robin requires `n(n - 1) / 2` comparisons, while duello uses roughly `n log₂(n)`.

## Tech stack

- TypeScript
- React
- Vite
- Tailwind CSS
- lucide react
- pnpm
- Biome

## Development

```bash
pnpm install
pnpm dev
```

Typecheck and run the project's quality checks with:

```bash
pnpm typecheck
pnpm lint
```

Build for production with:

```bash
pnpm build
```

## Assumptions

Duello assumes a consistent total ordering. If your comparisons contain cycles or contradictions, the resulting ranking may not represent a meaningful ordering.

## Quality

The project uses GitHub Actions for automated type checking and code quality checks, with Lighthouse audits on production deployments.

## License

Apache 2.0
