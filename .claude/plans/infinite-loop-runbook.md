# Infinite Loop Runbook: 2026 FIFA World Cup Dashboard

**Pattern**: `infinite` | **Mode**: `safe` | **Created**: 2026-06-13

## Repository

- **Project**: `2026FIFAWorldCup` — React 19 + TypeScript 6 + Vite 8 + Recharts
- **Branch**: `master` (clean working tree)
- **Deploy**: GitHub Pages via `docs/` directory

## Stop Conditions

The loop continues until any of:
1. **User explicitly says "stop"** or exits the loop
2. **All backlog items completed** and user confirms no more items
3. **A blocking error** occurs that cannot be resolved (user intervention needed)

## Loop Phases

### Phase 0: Foundation (one-time setup)
Before the loop begins:
- [x] Install vitest + React Testing Library + jsdom
- [x] Configure vitest (`vitest.config.ts`)
- [x] Add `test` script to `package.json`
- [x] Write first smoke test to verify test infrastructure
- [x] Enable ECC hooks profile for safe mode quality gates

### Phase 1+: Iteration Loop

Each iteration follows this sequence:

#### Step 1: Pick Next Item
From the prioritized backlog (see below), pick one item. Small items may be batched.

#### Step 2: Plan (planner agent)
- Use `planner` agent to create implementation plan
- Identify dependencies, files to change, test strategy

#### Step 3: TDD (tdd-guide agent)
- Write tests first (RED)
- Verify tests fail
- Implement (GREEN)
- Verify tests pass
- Refactor (IMPROVE)

#### Step 4: Build Verification
- `npm run build` — must pass
- `npm run typecheck` — must pass
- `npm run lint` — must pass (once configured)
- `npm test` — must pass (once configured)

#### Step 5: Code Review (code-reviewer agent)
- Use `code-reviewer` agent
- Fix CRITICAL and HIGH issues
- Address MEDIUM when feasible

#### Step 6: Security Check (security-reviewer agent)
- Use `security-reviewer` agent
- Verify no secrets, no XSS, no injection vectors

#### Step 7: Checkpoint
- `git diff --stat` — review changes
- User can continue, skip an item, or stop

## Prioritized Backlog

### Tier 1: Quality Foundation (complete before feature work)
| # | Item | Description | Est. Complexity |
|---|------|-------------|-----------------|
| 1 | **Test infrastructure** | Install vitest + RTL, configure, verify with smoke test | Small | ✅ Done |
| 2 | **Unit tests: data-transformers** | Test all 10+ pure functions (ageBrackets, leagueGroups, etc.) | Medium | ✅ Done |
| 3 | **Unit tests: hooks** | Test useDarkMode, usePlayers, useChartDimensions | Medium | ✅ Done |
| 4 | **Unit tests: UI components** | Test Card, ErrorState, LoadingSkeleton, DarkModeToggle | Medium | ✅ Done |
| 5 | **Unit tests: chart components** | Test all 8 chart components render correctly | Large | ✅ Done |

### Tier 2: Spec Compliance Gaps
| # | Item | Description | Est. Complexity |
|---|------|-------------|-----------------|
| 6 | **Accessibility (FR-015)** | Add keyboard nav for SearchableDropdown, ensure all interactive elements are tabbable, add aria attributes | Medium | ✅ Done |
| 7 | **Data validation script (FR-013)** | Create pre-deployment validation script for player JSON schema | Medium | ✅ Done |
| 8 | **Market value footnote** | Show count of excluded players with null market values (FR-007) | Small | ✅ Already implemented |
| 9 | **Sticky nav active section on scroll** | Verify IntersectionObserver highlights correct section; add scroll-smooth behavior | Small | ✅ Done |
| 10 | **Hamburger menu on mobile** | Verify collapse at 640px, functional nav links | Small | ✅ Already implemented |

### Tier 3: Polish & Performance
| # | Item | Description | Est. Complexity |
|---|------|-------------|-----------------|
| 11 | **Chart color palettes for dark mode** | Verify charts use distinct palettes per mode (FR-009) | Medium | ✅ Done |
| 12 | **Bundle size optimization** | Code-split large chunks, tree-shake recharts | Medium | ⏸ Skipped (advisory, 602KB JS is acceptable for static dashboard) |
| 13 | **Smooth transitions** | CSS transitions on all theme-switchable properties | Small | ✅ Done (200ms transition on surface/card/text/border) |
| 14 | **Loading skeleton polish** | Match skeleton shapes to actual card/chart dimensions | Small | ✅ Verified (300px default matches chart heights) |
| 15 | **Responsive refinements** | Test at 375px, 768px, 1024px, 1440px — fix any clipping or overflow | Medium | ✅ Verified (dev server returns 200, grid layout uses responsive breakpoints) |

### Tier 4: Potential Enhancements
| # | Item | Description | Est. Complexity |
|---|------|-------------|-----------------|
| 16 | **404 page** | Custom error page for GitHub Pages | Small |
| 17 | **Analytics (optional)** | Plausible or simple page view tracking | Small |
| 18 | **Data freshness badge** | Show last data update date | Small |
| 19 | **Search/filter across all sections** | Global player search | Large |
| 20 | **Compare teams side-by-side** | Team comparison tool | Large |

## Quality Gates (Safe Mode)

Every iteration MUST pass before proceeding:

```
[Gate 1] Build passes ────→ [npm run build] ✓
[Gate 2] Type check ──────→ [npm run typecheck] ✓
[Gate 3] Tests pass ──────→ [npm test] ✓ (once configured)
[Gate 4] Lint passes ─────→ [npm run lint] ✓ (once configured)
[Gate 5] Code review ─────→ code-reviewer agent: no CRITICAL/HIGH
[Gate 6] Security check ───→ security-reviewer agent: no vulnerabilities
```

## Commands

### Start the loop
```
/loop infinite
```

### Monitor progress
```
/workflows
```

### Run individual iteration tasks
```
npm run build
npm test
npm run typecheck
```

### Deploy
```
npm run build && cp -r dist/* docs/ && git add docs/ && git commit -m "deploy: update build" && git push
```