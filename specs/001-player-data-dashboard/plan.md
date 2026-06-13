# Implementation Plan: 2026 FIFA World Cup Player Data Dashboard

**Branch**: `001-player-data-dashboard` | **Date**: 2026-06-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-player-data-dashboard/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

A single-page static data visualization dashboard for the 2026 FIFA World Cup. The site presents 8 analysis sections — age distribution, league distribution, club top 20, confederation breakdown, national team analysis, World Cup experience stats, market value histogram, and Top N rankings — all rendered as interactive charts from a static JSON dataset. Dark/light mode, mobile-first responsive layout, sticky nav bar with anchor links, and zero backend dependencies.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode, no `any`)

**Primary Dependencies**: React 18+, Vite, Recharts, Tailwind CSS, React Router (HashRouter)

**Storage**: Static JSON file (`src/data/players.json`), no database

**Testing**: Vitest + React Testing Library

**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge — latest 2 versions), GitHub Pages

**Project Type**: Single-page web application (frontend only, static deployment)

**Performance Goals**: <3s initial load on 10 Mbps, <500KB gzipped bundle, charts render within 200ms on data change

**Constraints**: Zero backend, no API calls, all data precomputed, relative asset paths, HashRouter for GitHub Pages compatibility

**Scale/Scope**: ~48 teams × 26 players ≈ 1,248 player records, 8 chart sections, 1 page, ~20 components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|---|---|---|
| I. Static First | ✅ PASS | FR-013 mandates static JSON in repo; no API calls |
| II. Visualization First | ✅ PASS | FR-001–FR-008 each require a chart; Recharts chosen as single library |
| III. Minimal & Premium UI | ✅ PASS | Tailwind CSS, card-based layout, dark/light mode (FR-009) |
| IV. Mobile First | ✅ PASS | FR-010 mandates 375px–1440px+; single-column default; sticky nav (FR-014) |
| V. TypeScript Strict Mode | ✅ PASS | `strict: true`, no `any`; type definitions co-located with data |
| VI. Component Driven | ✅ PASS | ~20 components planned; each <200 lines; single-responsibility |
| VII. GitHub Pages Deploy Ready | ✅ PASS | HashRouter, relative paths, `dist/` output, no env vars |
| VIII. Data Integrity | ✅ PASS | Only FIFA-published dimensions; no race/ethnicity; SC-006 requires traceability |

**Gate Result**: ALL PASS — no violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-player-data-dashboard/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (UI component contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── data/
│   └── players.json          # Static player dataset
├── types/
│   └── index.ts              # TypeScript type definitions
├── utils/
│   ├── data-transformers.ts  # Pure functions: aggregate, filter, sort
│   └── chart-helpers.ts      # Color scales, formatters, label generators
├── hooks/
│   ├── usePlayers.ts         # Data loading hook
│   ├── useDarkMode.ts        # Dark/light mode toggle hook
│   └── useChartDimensions.ts # Responsive chart sizing hook
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx       # Root layout wrapper
│   │   ├── StickyNav.tsx      # Top navigation bar with anchor links
│   │   └── Footer.tsx         # Site footer
│   ├── ui/
│   │   ├── Card.tsx           # Reusable card container
│   │   ├── DarkModeToggle.tsx # Dark/light mode switch
│   │   ├── ErrorState.tsx     # Error display component
│   │   ├── LoadingSkeleton.tsx# Skeleton loading placeholder
│   │   └── SearchableDropdown.tsx # Team selector dropdown
│   └── charts/
│       ├── AgeDistribution.tsx
│       ├── LeagueDistribution.tsx
│       ├── ClubTop20.tsx
│       ├── ConfederationDistribution.tsx
│       ├── TeamAnalysis.tsx
│       ├── ExperienceStats.tsx
│       ├── MarketValueHistogram.tsx
│       └── TopRankings.tsx
├── App.tsx
├── main.tsx
└── index.css                 # Tailwind directives + custom tokens

public/
└── favicon.svg

index.html
package.json
tsconfig.json
vite.config.ts
tailwind.config.ts
postcss.config.js
```

**Structure Decision**: Single project (Option 1) — this is a frontend-only static site. No backend directory needed. Components split into `layout/`, `ui/`, and `charts/` subdirectories for clear separation of concerns.

## Complexity Tracking

> No violations — table intentionally empty.
