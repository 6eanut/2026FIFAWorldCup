# Quickstart: 2026 FIFA World Cup Player Data Dashboard

**Date**: 2026-06-13

## Prerequisites

- Node.js 18+
- pnpm (or npm)

## Setup

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
# → http://localhost:5173
```

## Validation Scenarios

### 1. Dashboard renders all chart cards

```bash
pnpm dev
```

**Expected**: Open `http://localhost:5173`. Dashboard displays at least 6 chart cards in a responsive grid. Each card has a title bar and a rendered chart (bars, pie, or donut). No console errors.

### 2. Mobile responsive layout

```bash
pnpm dev
```

**Expected**: Resize browser to 375px width. All cards stack in a single column. Charts resize to fit. No horizontal scrollbar. Sticky nav collapses to hamburger menu. Tap targets are at least 44px.

### 3. Dark/light mode toggle

```bash
pnpm dev
```

**Expected**: Click the sun/moon icon in the nav bar. All charts, cards, and backgrounds transition to the alternate theme. Toggle again to switch back. Reload the page — the last selected mode persists.

### 4. National team analysis

```bash
pnpm dev
```

**Expected**: Scroll to "Team Analysis" section. Type a country name in the searchable dropdown. Select a team. The card updates to show that team's age range, average age, domestic/foreign ratio, and top 3 clubs.

### 5. Static deployment check

```bash
pnpm build
npx serve dist/
```

**Expected**: Open `http://localhost:3000`. Site renders identically to dev mode. No 404s, no API calls in network tab. All data comes from bundled JSON.

### 6. Error state

```bash
# Temporarily rename players.json to simulate failure
mv src/data/players.json src/data/players.json.bak
pnpm dev
```

**Expected**: Site displays a user-friendly error message with a reload suggestion. No blank white screen. Restore the file afterward: `mv src/data/players.json.bak src/data/players.json`.

### 7. Data integrity

```bash
# Validate JSON schema and data ranges
node scripts/validate-data.mjs
```

**Expected**: Script exits 0. Reports: total player count, teams count, null market value count, age range. No schema violations.

## Build & Deploy

```bash
pnpm build        # Outputs to dist/
pnpm preview      # Preview production build locally
```

For GitHub Pages deployment, configure the repository to serve from the `dist/` directory (or copy `dist/` contents to `docs/`).
