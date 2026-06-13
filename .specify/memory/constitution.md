<!--
  Sync Impact Report
  ==================
  Version change: (none) → 1.0.0
  Rationale: Initial constitution ratification — establishing all 8 core principles,
             technical constraints, development workflow, and governance rules.

  Modified principles: N/A (initial creation)

  Added sections:
    - All 8 Core Principles (Static First, Visualization First, Minimal & Premium UI,
      Mobile First, TypeScript Strict Mode, Component Driven, GitHub Pages Deploy Ready,
      Data Integrity)
    - Technical Constraints (technology stack, bundle size, browser support)
    - Development Workflow (branch naming, commit conventions, review gates)
    - Governance (amendment procedure, versioning, compliance review)

  Removed sections: None

  Templates requiring updates:
    - .specify/templates/plan-template.md         ✅ No changes needed (Constitution Check is dynamic)
    - .specify/templates/spec-template.md         ✅ No changes needed (generic structure)
    - .specify/templates/tasks-template.md        ✅ No changes needed (generic structure)
    - .specify/templates/checklist-template.md    ✅ No changes needed (generic structure)

  Follow-up TODOs: None — all placeholders resolved.
-->
# 2026 FIFA World Cup Data Visualization Constitution

## Core Principles

### I. Static First

All data MUST be served as static JSON files. No backend server, no API calls at
runtime. Every data file MUST be precomputed and checked into the repository under
`src/data/`. This guarantees zero-latency data access, full offline capability,
and trivial GitHub Pages deployment. Dynamic features that would require a server
MUST be rearchitected to work with static data or deferred.

**Rationale**: Eliminates backend complexity, deployment burden, and runtime
dependency chains — enabling a purely static site deployable anywhere.

### II. Visualization First

All information MUST be presented through charts, graphs, maps, or diagrams
before falling back to text. Text-heavy tables or paragraphs are acceptable
only as secondary supplements to visualizations. Every data dimension
(e.g., player age distribution, country representation, match results) MUST
have a corresponding visual representation. Use a single charting library
(Recharts or D3) consistently across the project.

**Rationale**: The project's core value is making FIFA World Cup data
immediately comprehensible through visual analysis. Text-heavy presentations
defeat this purpose.

### III. Minimal & Premium UI

The interface MUST follow a minimal, premium aesthetic inspired by Apple,
Stripe, and Linear. This means:
- Generous whitespace and clear visual hierarchy
- Card-based layout with subtle shadows and rounded corners
- Restrained color palette: neutral backgrounds with one or two accent colors
- Sans-serif typography with consistent sizing scale
- Subtle animations and transitions — never gaudy
- Dark/light mode support is encouraged but not mandatory for v1

**Rationale**: A premium feel builds trust and keeps the user focused on the
data, not the chrome.

### IV. Mobile First

Every page and component MUST be designed for mobile screens first, then
progressively enhanced for tablet and desktop. This means:
- Single-column layout as the default
- Touch-friendly tap targets (minimum 44px)
- Responsive chart resizing — charts MUST remain readable at 375px viewport width
- No hover-dependent interactions for critical functionality
- Navigation MUST work with a hamburger menu or bottom tab bar on mobile

**Rationale**: A significant portion of users will access the site on mobile
devices. Mobile-first ensures no user is left behind.

### V. TypeScript Strict Mode

All code MUST be written in TypeScript with `strict: true` in `tsconfig.json`.
The `any` type is forbidden. All function signatures, component props, and data
structures MUST have explicit type annotations. Type definitions for data
entities MUST be co-located with the static JSON schemas.

**Rationale**: Static typing catches entire classes of bugs at compile time
and serves as living documentation for the data structures used throughout
the project.

### VI. Component Driven

UI MUST be decomposed into small, reusable components. No single file may
exceed 200 lines without justification. Components MUST follow the
single-responsibility principle: a component does one thing well. Use
composition over inheritance — complex UIs are assembled from simple building
blocks. Every component MUST have a clear, descriptive name reflecting its purpose.

**Rationale**: Component-driven architecture enables parallel development,
easier testing, and long-term maintainability.

### VII. GitHub Pages Deploy Ready

The project MUST support pure static deployment to GitHub Pages without any
build-time environment variables or server-side rendering. The production build
MUST be output to a `docs/` or `dist/` directory configurable in GitHub Pages
settings. All asset paths MUST be relative. The `homepage` field in
`package.json` MUST be set appropriately for the deployment URL path.

**Rationale**: GitHub Pages is the simplest, zero-cost deployment target for
static sites. The project MUST remain deployable at any commit.

### VIII. Data Integrity

Only publicly verifiable data dimensions may be used. Specifically FORBIDDEN:
- Race, ethnicity, or other sensitive demographic categories
- Estimated or fabricated statistics
- Personally identifiable information beyond what is already publicly available
  (e.g., player names and ages from official FIFA rosters)

Permitted dimensions include: country, league/club affiliation, age, position,
match statistics, tournament history, and other FIFA-published data.

**Rationale**: The project's credibility depends on trustworthy data.
Unverifiable or sensitive dimensions risk misrepresentation and ethical harm.

## Technical Constraints

| Constraint | Requirement |
|---|---|
| Language | TypeScript 5.x (strict mode) |
| Framework | React 18+ with Vite |
| UI Library | Tailwind CSS (utility-first, consistent with premium minimal aesthetic) |
| Charting | Recharts or D3 (one library, project-wide) |
| Routing | React Router (HashRouter for GitHub Pages compatibility) |
| Package Manager | pnpm (preferred) or npm |
| Deployment | GitHub Pages via `docs/` or `dist/` directory |
| Browser Support | Latest 2 versions of Chrome, Firefox, Safari, Edge |
| Bundle Size | <500KB gzipped initial load (all pages, lazy-loaded) |

## Development Workflow

- **Branch naming**: `feature/<short-description>` or `fix/<short-description>`
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`)
- **Linting**: ESLint with `@typescript-eslint` strict rules; Prettier for formatting
- **Pre-commit**: `lint-staged` with `eslint --fix` and `prettier --write`
- **Review gates**: Every PR MUST pass typecheck (`tsc --noEmit`) and lint before merge
- **No backend**: Under no circumstances may a backend server be introduced

## Governance

This constitution supersedes all other project practices and conventions.
All feature specifications, pull requests, and code reviews MUST verify
compliance with the Core Principles listed above.

**Amendment procedure**:
1. Propose change via PR against `.specify/memory/constitution.md`
2. Document rationale and impact assessment
3. Obtain approval from project owner
4. Increment version per semantic versioning rules:
   - MAJOR: Principle removal or redefinition (backward incompatible)
   - MINOR: New principle or section added
   - PATCH: Clarifications, wording, typo fixes

**Compliance review**: Every feature specification created via
`/speckit.specify` MUST include a Constitution Check section verifying
alignment with all eight principles. Any violation requires explicit
justification in the Complexity Tracking table.

**Version**: 1.0.0 | **Ratified**: 2026-06-13 | **Last Amended**: 2026-06-13