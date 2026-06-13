# Tasks: 2026 FIFA World Cup Player Data Dashboard

**Input**: Design documents from `specs/001-player-data-dashboard/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/components.md, quickstart.md

**Tests**: Tests are OPTIONAL — not included in this task list. Run `/speckit.checklist` if test tasks are desired.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project: `src/` at repository root
- Components: `src/components/layout/`, `src/components/ui/`, `src/components/charts/`
- Data: `src/data/`, utils: `src/utils/`, hooks: `src/hooks/`, types: `src/types/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and tooling configuration

- [x] T001 Create Vite + React 18 + TypeScript 5 project via `pnpm create vite` in repository root
- [x] T002 [P] Install core dependencies: react, react-dom, react-router-dom, recharts
- [x] T003 [P] Install dev dependencies: tailwindcss, postcss, autoprefixer, @types/react, @types/react-dom, typescript, vitest, @testing-library/react, eslint, @typescript-eslint/parser, @typescript-eslint/eslint-plugin, prettier, eslint-config-prettier
- [x] T004 Configure Tailwind CSS with custom theme tokens (neutral palette, accent colors, dark mode `class` strategy) in `tailwind.config.ts`
- [x] T005 Configure PostCSS with Tailwind and Autoprefixer plugins in `postcss.config.js`
- [x] T006 Configure TypeScript strict mode (`strict: true`, `noImplicitAny: true`) in `tsconfig.json`
- [x] T007 [P] Configure ESLint with `@typescript-eslint` strict rules and Prettier integration in `eslint.config.js` and `.prettierrc`
- [x] T008 Configure Vite for GitHub Pages: set `base` to repo name path, output to `dist/`, relative asset paths in `vite.config.ts`
- [x] T009 Create project directory structure: `src/{components/{layout,ui,charts},hooks,utils,types,data}`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T010 Create TypeScript type definitions for all entities and derived types (Player with height field, Position, AgeBracket, LeagueGroup, ClubRanking, ConfederationStats, TeamAnalysis, ExperienceStats, MarketValueBand, RankingList, RankingEntry) in `src/types/index.ts`
- [x] T011 [P] Create sample player data JSON (at least 100 players across 10+ teams to exercise all charts) in `src/data/players.json`
- [x] T012 [P] Implement all data transformation utility functions (ageBrackets, leagueGroups, topClubs, confederationStats, teamAnalysis, experienceStats, marketValueBands, topRankings, countryNames lookup) in `src/utils/data-transformers.ts`
- [x] T013 [P] Implement chart helper utilities (color scales for dark/light mode, currency/number formatters, chart label generators, confederation color mapping) in `src/utils/chart-helpers.ts`
- [x] T014 [P] Implement `usePlayers` hook (static JSON import, loading/error/success states) in `src/hooks/usePlayers.ts`
- [x] T015 [P] Implement `useDarkMode` hook (OS preference detection, manual toggle, localStorage persistence, `dark` class on `<html>`) in `src/hooks/useDarkMode.ts`
- [x] T016 [P] Implement `useChartDimensions` hook (ResizeObserver-based container sizing) in `src/hooks/useChartDimensions.ts`
- [x] T017 [P] Implement `Card` UI component (title, optional subtitle, children, consistent styling) in `src/components/ui/Card.tsx`
- [x] T018 [P] Implement `DarkModeToggle` UI component (sun/moon icon button, receives isDark + onToggle props) in `src/components/ui/DarkModeToggle.tsx`
- [x] T019 [P] Implement `ErrorState` UI component (centered icon + message text) in `src/components/ui/ErrorState.tsx`
- [x] T020 [P] Implement `LoadingSkeleton` UI component (animated placeholder rectangle, configurable height) in `src/components/ui/LoadingSkeleton.tsx`
- [x] T021 [P] Implement `StickyNav` layout component (anchor links array, active section highlight, scroll-spy, hamburger menu below 640px) in `src/components/layout/StickyNav.tsx`
- [x] T022 [P] Implement `Footer` layout component (static site footer) in `src/components/layout/Footer.tsx`
- [x] T023 [P] Implement `AppShell` layout component (wraps children, applies dark mode class, base layout styles) in `src/components/layout/AppShell.tsx`
- [x] T024 Set up Tailwind directives and custom CSS tokens in `src/index.css`

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Dashboard Overview (Priority: P1) 🎯 MVP

**Goal**: A football fan opens the site and sees a visually rich dashboard with at least 6 chart cards summarizing key tournament insights at a glance.

**Independent Test**: Open `http://localhost:5173`. Verify the dashboard renders at least 6 chart cards in a responsive grid. Each card has a title and interactive chart (tooltips on hover). All data visible without scrolling past the initial viewport on desktop. Works at 375px width (single column).

### Implementation for User Story 1

- [x] T025 [P] [US1] Implement `AgeDistribution` chart component (bar chart, 5 age brackets, responsive) in `src/components/charts/AgeDistribution.tsx`
- [x] T026 [P] [US1] Implement `LeagueDistribution` chart component (pie chart, Big Five + Other, percentage labels) in `src/components/charts/LeagueDistribution.tsx`
- [x] T027 [P] [US1] Implement `ClubTop20` chart component (horizontal bar chart, top 20 clubs by player count) in `src/components/charts/ClubTop20.tsx`
- [x] T028 [P] [US1] Implement `ConfederationDistribution` chart component (donut/pie chart, 5 confederations, color-coded) in `src/components/charts/ConfederationDistribution.tsx`
- [x] T029 [P] [US1] Implement `ExperienceStats` chart component (donut chart, first-timers vs veterans, count labels) in `src/components/charts/ExperienceStats.tsx`
- [x] T030 [P] [US1] Implement `MarketValueHistogram` chart component (bar chart, 6 price bands, footnote for excluded null-value players) in `src/components/charts/MarketValueHistogram.tsx`
- [x] T031 [US1] Wire `App.tsx`: compose AppShell + StickyNav (with anchor links for all 6 US1 sections) + all 6 chart components in a responsive grid with section `id` attributes, handle loading/error states from usePlayers, apply dark mode via useDarkMode
- [x] T032 [US1] Create `main.tsx` entry point (render App with HashRouter) and verify all styles load via `src/index.css`

**Checkpoint**: Dashboard is fully functional — 6 chart cards displayed, dark/light toggle works, mobile responsive, error and loading states handled

---

## Phase 4: User Story 2 - Player Distribution Analytics (Priority: P2)

**Goal**: User navigates to dedicated distribution sections showing age brackets, league split (Big Five vs others), top 20 clubs, and confederation breakdown with richer detail.

**Independent Test**: Using the sticky nav, scroll to each of the 4 distribution sections. Verify charts render with accurate counts, proper labels, and color-coded legends. Confirm sections are independently scrollable via nav anchor links.

### Implementation for User Story 2

- [x] T033 [P] [US2] Implement `SearchableDropdown` UI component (text input filters dropdown list, keyboard navigation, empty/no-results states) in `src/components/ui/SearchableDropdown.tsx`
- [x] T034 [US2] Add dedicated section containers for each of the 4 distribution dimensions with section `id` attributes matching StickyNav anchor links, wrapping existing chart components from Phase 3
- [x] T035 [US2] Add dedicated section containers with `id` attributes for the 4 distribution dimensions, and add their anchor links to StickyNav (US1 sections already linked)

**Checkpoint**: User can navigate via sticky nav to 4 distribution sections. Charts are already functional from US1 — this phase adds navigation and section structure.

---

## Phase 5: User Story 3 - Deep Dive & Rankings (Priority: P3)

**Goal**: User explores national team squad structure (via searchable dropdown), World Cup experience stats, market value bands, and at least 5 Top N ranking lists.

**Independent Test**: Select a team from the dropdown in the Team Analysis section — verify age range, average age, domestic/foreign ratio, top 3 clubs update. Scroll to Rankings section — verify at least 5 lists with correct ordering.

### Implementation for User Story 3

- [x] T036 [P] [US3] Implement `TeamAnalysis` chart component (uses SearchableDropdown, displays team metrics: age range, avg age, domestic/foreign league ratio, top 3 clubs; includes bar chart of age distribution for selected team) in `src/components/charts/TeamAnalysis.tsx`
- [x] T037 [P] [US3] Implement `TopRankings` component (renders at least 5 ranking lists: oldest players, youngest players, most valuable, most experienced, most represented clubs; each list as a numbered card with rank, name, nationality, value) in `src/components/charts/TopRankings.tsx`
- [x] T038 [US3] Wire TeamAnalysis and TopRankings into `App.tsx` with section `id` attributes, integrate into the sticky nav scroll flow

**Checkpoint**: All 8 analysis sections functional. Full feature complete — dashboard + 4 distributions + 4 deep-dive sections.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T039 [P] Verify all charts render correctly at 375px, 640px, 1024px, and 1440px widths — fix any label truncation or overflow
- [x] T040 [P] Verify dark mode applies consistently to all chart components (axes, labels, tooltips, legends)
- [x] T041 Run `pnpm build` and verify `dist/` output serves correctly via `npx serve dist/` — all paths relative, no 404s
- [x] T042 [P] Verify bundle size <500KB gzipped (`pnpm build && npx vite-bundle-visualizer` or `ls -lh dist/assets/`)
- [x] T043 [P] Run TypeScript strict check (`tsc --noEmit`) and ESLint (`eslint src/`) — fix all errors
- [x] T045 [P] Add keyboard navigation support (Tab order, Enter to activate) to StickyNav, DarkModeToggle, and SearchableDropdown in their respective component files
- [x] T046 [P] Add `aria-label` attributes to all chart components for screen reader data summaries in `src/components/charts/`
- [x] T044 Run through all quickstart.md validation scenarios and confirm expected outcomes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational — delivers MVP dashboard
- **User Story 2 (Phase 4)**: Depends on Foundational + US1 (reuses chart components) — adds navigation
- **User Story 3 (Phase 5)**: Depends on Foundational + US2 (uses SearchableDropdown) — adds deep dive
- **Polish (Phase 6)**: Depends on all user stories being complete

### Within Each User Story

- Chart components marked [P] can be built in parallel (different files)
- App.tsx wiring depends on all chart components for that phase being complete

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- All 6 US1 chart components (T025–T030) can be built in parallel
- US3 chart components (T036, T037) can be built in parallel
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all 6 chart components in parallel:
Task: "Implement AgeDistribution chart in src/components/charts/AgeDistribution.tsx"
Task: "Implement LeagueDistribution chart in src/components/charts/LeagueDistribution.tsx"
Task: "Implement ClubTop20 chart in src/components/charts/ClubTop20.tsx"
Task: "Implement ConfederationDistribution chart in src/components/charts/ConfederationDistribution.tsx"
Task: "Implement ExperienceStats chart in src/components/charts/ExperienceStats.tsx"
Task: "Implement MarketValueHistogram chart in src/components/charts/MarketValueHistogram.tsx"

# After all charts complete, wire App.tsx:
Task: "Wire App.tsx with all components and routing"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test dashboard at `http://localhost:5173` — verify 6+ chart cards, dark mode toggle, mobile responsive, loading/error states
5. Deploy to GitHub Pages for demo

### Incremental Delivery

1. Setup + Foundational → Types, data, hooks, UI components ready
2. Add User Story 1 → MVP dashboard with 6 charts → Deploy/Demo
3. Add User Story 2 → Sticky nav with 4 dedicated sections → Deploy/Demo
4. Add User Story 3 → Team analysis + Top N rankings → Deploy/Demo
5. Polish → Cross-browser validation, bundle size check, lint pass

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Chart components from US1 are reused directly in US2 (no duplication)
- Sample JSON (`players.json`) must include at least 100 players across 10+ nations for meaningful chart rendering
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
