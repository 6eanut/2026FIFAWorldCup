# Research: 2026 FIFA World Cup Player Data Dashboard

**Date**: 2026-06-13

## Technology Decisions

### Decision 1: Recharts over D3

**Decision**: Recharts

**Rationale**: Recharts provides React-native chart components with built-in responsiveness, tooltips, and animations. D3 offers finer control but requires manual DOM manipulation and verbose configuration. Recharts aligns with the Component Driven principle — each chart type maps to a declarative JSX component. D3 would be justified if we needed force-directed graphs or geographic maps, neither of which is in scope.

**Alternatives considered**:
- D3: More powerful but requires imperative code, larger bundle, and reinvention of React patterns
- Chart.js: Canvas-based (not ideal for interactive tooltips), less React-native
- Nivo: Excellent but heavier bundle; Recharts sufficient for bar/pie/histogram/donut needs

### Decision 2: HashRouter over BrowserRouter

**Decision**: HashRouter

**Rationale**: GitHub Pages does not support SPA fallback routing. BrowserRouter would return 404 on direct URL access to any path other than `/`. HashRouter uses `/#/` prefix and works universally with static file servers — no server configuration needed.

**Alternatives considered**:
- BrowserRouter with 404.html hack: Fragile, breaks direct navigation
- No router (single page only): Not needed since spec confirms single-page design, but HashRouter still provides anchor-based section navigation

### Decision 3: Single JSON file vs multiple files

**Decision**: Single `players.json` array

**Rationale**: ~1,248 records is trivial for a single JSON file (~200KB uncompressed, ~30KB gzipped). Multiple files add complexity to the data loading hook with no performance benefit at this scale. A single file also simplifies data integrity verification (one source of truth).

**Alternatives considered**:
- Per-team JSON files: Adds 48+ network requests, complicates cross-team aggregation
- Pre-aggregated JSON: Duplicates data, harder to maintain

### Decision 4: Utility functions vs derived data files

**Decision**: Pure utility functions that compute derived data at runtime

**Rationale**: With only ~1,248 records, all aggregations (age brackets, league counts, confederation sums) complete in <10ms. Pre-computing derived JSON files adds maintenance burden and risk of stale data. Runtime computation from a single source file guarantees consistency.

**Alternatives considered**:
- Build-time data generation script: Adds a build step, useful at 10x scale but overkill here
- Pre-aggregated static JSON files: Duplicates data, risk of inconsistency

### Decision 5: Tailwind CSS for styling

**Decision**: Tailwind CSS with custom theme tokens

**Rationale**: Constitution mandates Tailwind (§Technical Constraints). Utility-first aligns with Minimal & Premium UI — encourages consistent spacing/sizing/color scales. Custom theme tokens for the restrained color palette (neutral backgrounds + 1-2 accent colors) ensure visual consistency. Dark mode via `class` strategy allows manual toggle.

**Alternatives considered**: None — constitution-mandated.

### Decision 6: Responsive breakpoint strategy

**Decision**: Mobile-first with two breakpoints: `sm` (640px) and `lg` (1024px)

**Rationale**: Spec requires 375px minimum and single-column default. Two breakpoints:
- `< 640px`: Single column, stacked cards, hamburger menu for nav
- `640–1024px`: 2-column grid for dashboard cards
- `> 1024px`: 3-column grid for dashboard, expanded nav

This covers the spec's 375px–1440px+ range without over-engineering intermediate breakpoints.

**Alternatives considered**:
- 4+ breakpoints: More granular but violates simplicity, harder to test consistently
- Fluid-only (no breakpoints): Charts need discrete width changes for axis/label adjustments

### Decision 7: Dark mode implementation

**Decision**: Tailwind `class` strategy with localStorage persistence

**Rationale**: The `class` strategy allows manual toggle (user preference) independent of OS setting. On first visit, respect `prefers-color-scheme`. On manual toggle, persist choice to `localStorage` and override OS preference. This satisfies FR-009 which requires both system-preference initialization and manual override.

**Alternatives considered**:
- `media` strategy (CSS-only): Cannot support manual toggle
- CSS variables approach: Works but Tailwind's `class` strategy is simpler and well-documented