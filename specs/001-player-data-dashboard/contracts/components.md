# Component Contracts: UI Interfaces

**Date**: 2026-06-13

This document defines the public TypeScript interfaces for all UI components. Components communicate exclusively through typed props — no global state, no context (except dark mode theme).

---

## Shared Types

```typescript
// src/types/index.ts

export type Position = "GK" | "DEF" | "MID" | "FWD";

export interface Player {
  id: string;
  name: string;
  age: number;
  nationality: string;
  position: Position;
  club: string | null;
  league: string | null;
  marketValueEUR: number | null;
  worldCupAppearances: number;
}

export interface AgeBracket {
  label: string;
  min: number | null;
  max: number | null;
  count: number;
}

export interface LeagueGroup {
  name: string;
  isBigFive: boolean;
  count: number;
}

export interface ClubRanking {
  rank: number;
  clubName: string;
  playerCount: number;
}

export interface ConfederationStats {
  code: "UEFA" | "CONMEBOL" | "CAF" | "AFC" | "CONCACAF";
  playerCount: number;
  percentage: number;
}

export interface TeamAnalysis {
  countryCode: string;
  countryName: string;
  playerCount: number;
  ageRange: [number, number];
  averageAge: number;
  domesticLeagueCount: number;
  foreignLeagueCount: number;
  topClubs: { name: string; count: number }[];
}

export interface ExperienceStats {
  firstTimers: number;
  veterans: number;
}

export interface MarketValueBand {
  label: string;
  min: number | null;
  max: number | null;
  count: number;
}

export interface RankingEntry {
  rank: number;
  name: string;
  nationality: string;
  value: string | number;
}

export interface RankingList {
  title: string;
  metric: string;
  entries: RankingEntry[];
}
```

---

## Layout Components

### AppShell

```typescript
interface AppShellProps {
  children: React.ReactNode;
}
```

Wraps all content. Manages dark mode class on `<html>`, applies base layout styles.

### StickyNav

```typescript
interface StickyNavProps {
  sections: { id: string; label: string }[];
}
```

Renders anchor links. Highlights active section based on scroll position. Collapses to hamburger menu below 640px.

### Footer

```typescript
// No props — renders static content
```

---

## UI Components

### Card

```typescript
interface CardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}
```

Consistent card wrapper: border radius, shadow, padding, title bar with optional subtitle.

### DarkModeToggle

```typescript
interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}
```

Sun/moon icon button. Positioned in nav bar.

### ErrorState

```typescript
interface ErrorStateProps {
  message: string;
}
```

Full-width centered error display with icon and message text.

### LoadingSkeleton

```typescript
interface LoadingSkeletonProps {
  height?: number; // default 300px
}
```

Animated placeholder rectangle matching card dimensions.

### SearchableDropdown

```typescript
interface SearchableDropdownProps {
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}
```

Text input that filters a dropdown list. Used for national team selection in TeamAnalysis.

---

## Chart Components

All chart components share this contract pattern:

```typescript
interface ChartProps {
  data: Player[];
}
```

Each chart internally calls the appropriate transformer and renders a Recharts component wrapped in a `Card`.

| Component | Chart Type | Transformer Output |
|---|---|---|
| `AgeDistribution` | Bar chart | `AgeBracket[]` |
| `LeagueDistribution` | Pie chart | `LeagueGroup[]` |
| `ClubTop20` | Horizontal bar chart | `ClubRanking[]` |
| `ConfederationDistribution` | Pie/donut chart | `ConfederationStats[]` |
| `TeamAnalysis` | Card with metrics + bar chart | `TeamAnalysis` (single) |
| `ExperienceStats` | Donut chart | `ExperienceStats` |
| `MarketValueHistogram` | Histogram (bar chart) | `MarketValueBand[]` + excludedCount |
| `TopRankings` | Ordered list cards | `RankingList[]` |

### Additional props for interactive charts

```typescript
interface TeamAnalysisProps {
  data: Player[];
  selectedTeam: string | null;
  onTeamChange: (countryCode: string) => void;
}
```

`TeamAnalysis` manages its own `SearchableDropdown` internally.

---

## Data Hooks Contract

### usePlayers

```typescript
interface UsePlayersResult {
  players: Player[] | null;
  isLoading: boolean;
  error: string | null;
}
```

Loads `players.json` via static import. Returns `{ players: null, isLoading: true, error: null }` during load, `{ players: Player[], isLoading: false, error: null }` on success, or `{ players: null, isLoading: false, error: string }` on failure.

### useDarkMode

```typescript
interface UseDarkModeResult {
  isDark: boolean;
  toggle: () => void;
}
```

Initializes from `prefers-color-scheme`, persists override to `localStorage`. Applies `dark` class to `<html>`.

### useChartDimensions

```typescript
interface UseChartDimensionsResult {
  width: number;
  height: number;
  ref: React.RefObject<HTMLDivElement>;
}
```

Returns container dimensions via ResizeObserver. Charts use this for responsive sizing.