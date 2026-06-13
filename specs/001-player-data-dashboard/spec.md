# Feature Specification: 2026 FIFA World Cup Player Data Dashboard

**Feature Branch**: `001-player-data-dashboard`

**Created**: 2026-06-13

**Status**: Draft

**Input**: User description: "构建一个 2026 FIFA World Cup 球员数据分析网站，功能包括：球员年龄分布、球员所属联赛分布、球员俱乐部分布 Top 20、各国家队球员结构分析、各洲球员分布、世界杯经验统计、球员身价分布、有趣数据排行。GitHub Pages 静态部署。"

## Clarifications

### Session 2026-06-13

- Q: How does the user select a national team in the team analysis view? → A: Searchable dropdown at top of the section.
- Q: Navigation model — single scroll page vs multi-section with nav? → A: Sticky top nav bar with anchor links to each section.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dashboard Overview (Priority: P1)

A football fan opens the website and lands on a visually rich dashboard that presents
key tournament insights at a glance — age profile, continental spread, top clubs, and
league dominance — without needing to navigate or scroll extensively.

**Why this priority**: This is the first impression and the primary entry point.
A compelling dashboard immediately delivers value and encourages exploration.

**Independent Test**: Open the site. Verify the dashboard renders all summary
cards and charts without errors. Confirm each chart is interactive (tooltips,
hover states) and readable at 375px viewport width. All data visible without
scrolling past the initial viewport on desktop.

**Acceptance Scenarios**:

1. **Given** the site is deployed with valid player data JSON, **When** a user visits the homepage, **Then** the dashboard displays at least 6 chart cards arranged in a responsive grid layout within 3 seconds.
2. **Given** a user on a mobile device (375px width), **When** they view the dashboard, **Then** all chart cards stack in a single column, each chart is fully readable, and labels/tooltips are not clipped.

---

### User Story 2 - Player Distribution Analytics (Priority: P2)

A user wants to understand how players are distributed across different dimensions — by
age bracket, by league (Big Five vs others), by top 20 clubs, and by FIFA confederation
(UEFA, CONMEBOL, CAF, AFC, CONCACAF).

**Why this priority**: These four dimensions form the core analytical value of
the site. Users come to understand the tournament's composition.

**Independent Test**: Navigate to or scroll to each of the four distribution
sections. Verify each chart renders correctly with accurate data counts, proper
labels, and color-coded segments/legends.

**Acceptance Scenarios**:

1. **Given** player data includes age and league fields, **When** a user views the age distribution chart, **Then** age brackets (e.g., Under 20, 21-25, 26-30, 31-35, Over 35) are displayed with accurate player counts per bracket.
2. **Given** player data includes league affiliation, **When** a user views the league distribution chart, **Then** the Big Five leagues (Premier League, La Liga, Serie A, Bundesliga, Ligue 1) are shown as distinct segments with an "Other" category aggregating all remaining leagues.
3. **Given** player data includes club affiliation, **When** a user views the club distribution, **Then** the top 20 clubs by player count are shown in a horizontal bar chart with accurate counts.
4. **Given** player data includes national team and confederation mapping, **When** a user views the confederation distribution, **Then** five segments (UEFA, CONMEBOL, CAF, AFC, CONCACAF) display with accurate player counts and percentage labels.

---

### User Story 3 - Deep Dive & Rankings (Priority: P3)

A user wants to explore specific insights: how each national team's squad is
structured (age mix, domestic vs foreign leagues), how experienced the
tournament's players are (first-timers vs veterans), how player market values
distribute across price bands, and fun Top N rankings (oldest/youngest players,
most represented leagues, highest-valued squads, etc.).

**Why this priority**: These features add depth and storytelling that
differentiate the site from basic stat pages. They reward curious users who
scroll beyond the dashboard.

**Independent Test**: Access each deep-dive section. Verify national team
analysis shows per-team breakdowns, experience stats show first-timer vs
multi-tournament counts, market value histogram shows price bands, and Top N
lists render with correct ordering.

**Acceptance Scenarios**:

1. **Given** a user selects a national team via a searchable dropdown, **When** the team analysis view loads, **Then** it displays the team's age range, average age, home-league vs foreign-league player ratio, and top 3 clubs represented.
2. **Given** player data includes prior World Cup participation flags, **When** a user views the experience statistics section, **Then** the ratio of first-time participants vs players with prior World Cup experience is displayed as a donut chart with exact counts.
3. **Given** player data includes market value in euros, **When** a user views the market value distribution, **Then** players are grouped into price bands (e.g., <€1M, €1-5M, €5-20M, €20-50M, €50-100M, >€100M) and displayed as a histogram.
4. **Given** the full player dataset, **When** a user views the "Interesting Rankings" section, **Then** 5 Top N lists are displayed: Top 10 oldest players, Top 10 youngest players, Top 10 most valuable players, Top 10 most experienced, and Top 10 most represented clubs — each with rank, name, nationality, and relevant metric.

---

### Edge Cases

- What happens when a player has no club listed (free agent)? → Display as "Unattached" / "Free Agent" in club/league charts.
- What happens when a player has no market value available? → Exclude from market value charts; show count of excluded players in a footnote.
- What happens when the JSON data file fails to load or is malformed? → Display a graceful error state with a user-friendly message and a retry suggestion (reload the page).
- What happens when all players belong to a single confederation or league? → Chart still renders correctly with the single dominant category (edge case for data integrity — should not occur with real 2026 data but must not crash).
- What happens when a user navigates with a very slow connection? → Show a skeleton placeholder state while data loads; the entire site loads as a single static page so once loaded, all interactions are instant.
- What happens when the JSON file contains duplicate player IDs? → Validation script MUST flag duplicates; the application MUST deduplicate by `id` (keep first occurrence) and log a console warning.
- What happens when a player's age falls exactly on an age bracket boundary? → Brackets are inclusive lower bound: a 25-year-old goes into "21-25", a 30-year-old into "26-30", etc. (see FR-001 for full boundary rules).
- What happens when a club has no league mapping? → Display the club name and count as normal; the club's league field is `null` and the player is assigned to "Other Leagues" in the league distribution chart.
- What happens when a user resizes the browser between mobile and desktop breakpoints? → Charts resize responsively without losing data or requiring a page reload.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display an age distribution chart grouping players into predefined age brackets (Under 20: age ≤20, 21-25: 21–25, 26-30: 26–30, 31-35: 31–35, Over 35: age ≥36) with accurate counts per bracket.
- **FR-002**: System MUST display a league distribution chart showing the Big Five European leagues (Premier League, La Liga, Serie A, Bundesliga, Ligue 1) individually, plus an aggregated "Other Leagues" category merging all other leagues into a single segment with a distinct color.
- **FR-003**: System MUST display a horizontal bar chart of the top 20 clubs by number of players represented in the tournament.
- **FR-004**: System MUST display a confederation distribution chart breaking down players by UEFA, CONMEBOL, CAF, AFC, and CONCACAF.
- **FR-005**: System MUST provide a per-national-team analysis view showing age range, average age, domestic/foreign league ratio, and top 3 clubs.
- **FR-006**: System MUST display World Cup experience statistics as a first-timer vs veteran ratio with exact counts.
- **FR-007**: System MUST display market value distribution as a histogram across predefined price bands with inclusive lower bounds and exclusive upper bounds: <€1M, €1M–<€5M, €5M–<€20M, €20M–<€50M, €50M–<€100M, ≥€100M.
- **FR-008**: System MUST display exactly 5 "Top N" ranking lists: (1) Top 10 oldest players, (2) Top 10 youngest players, (3) Top 10 most valuable players, (4) Top 10 most experienced players (most World Cup appearances), (5) Top 10 most represented clubs.
- **FR-009**: System MUST support dark mode and light mode with a user-toggleable switch placed in the sticky navigation bar; initial mode MUST respect the user's OS-level preference (`prefers-color-scheme`). Charts MUST use distinct color palettes per mode: a neutral white/gray background with muted accent colors in light mode, dark gray/black background with brighter accent colors in dark mode.
- **FR-010**: System MUST render all charts and cards correctly at viewport widths from 375px (mobile) to 1440px+ (desktop). Dashboard grid MUST use single column at <640px, 2 columns at 640–1024px, 3 columns at ≥1024px.
- **FR-011**: System MUST display an error state with a centered card containing a warning icon, heading "Unable to load data", body text "Please check your connection and reload the page", and a reload button if the data JSON file cannot be loaded.
- **FR-012**: System MUST display skeleton placeholder cards matching the dashboard card dimensions while data is being fetched.
- **FR-013**: All data MUST be stored as static JSON files within the project repository — no API calls, no backend. A data validation script MUST verify schema correctness (required fields present, types match, values in range) before deployment.
- **FR-014**: System MUST provide a sticky top navigation bar with anchor links to each of the 8 analysis sections; the nav bar MUST collapse to a hamburger menu below 640px and remain functional at all viewport widths. Active section MUST be highlighted based on scroll position.
- **FR-015**: All interactive elements (nav links, dark mode toggle, searchable dropdown) MUST be keyboard-navigable via Tab/Enter. Chart data summaries MUST be exposed via `aria-label` attributes for screen reader accessibility.

### Key Entities

- **Player**: Represents an individual footballer selected for the 2026 World Cup. Key attributes: name, age, nationality (country), club, league, position, height (cm), market value (EUR), prior World Cup appearances (count), confederation.
- **Team (National Team)**: Represents a participating nation. Key attributes: country name, confederation, roster of players.
- **Club**: Represents a professional football club. Key attributes: club name, league, count of players in tournament.
- **League**: Represents a professional league. Key attributes: league name, country, tier classification (Big Five or other).
- **Confederation**: Represents a FIFA confederation. Key attributes: name (UEFA/CONMEBOL/CAF/AFC/CONCACAF), member nations, player count.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user visiting the site for the first time can correctly answer 3 factual questions about the tournament (e.g., which confederation has the most players, which league sends the most players, what is the age range of the oldest player) within 15 seconds of the page loading.
- **SC-002**: The full dashboard page loads and renders all chart cards in under 3 seconds on a 10 Mbps connection.
- **SC-003**: All 8 chart/analysis sections are fully functional and readable at 375px viewport width without horizontal scrolling, label truncation, or font sizes falling below 12px.
- **SC-004**: A user can toggle between dark and light mode and see all charts, cards, and backgrounds update styling within 200ms via a smooth color transition (CSS transition on background and text color properties).
- **SC-005**: The site deploys to GitHub Pages using only static files (HTML, CSS, JS, JSON) with zero server-side dependencies — verifiable by running `npx serve dist/` locally with identical results.
- **SC-006**: 100% of displayed data points are traceable to publicly verifiable sources (FIFA official squad lists, Transfermarkt, or equivalent) — no estimated or fabricated values.

## Assumptions

- Player data (names, ages, clubs, leagues, market values, height) will be manually compiled from publicly available sources (FIFA official announcements, Transfermarkt) and stored as a single JSON file. Each data point's source will be noted in a `source` field on the player record.
- The 2026 World Cup final squad lists (26 players per team) will be available prior to development completion. Provisional or preliminary squad data is acceptable for initial development.
- "Big Five leagues" refers to: English Premier League, Spanish La Liga, Italian Serie A, German Bundesliga, French Ligue 1.
- Market values are approximate and sourced from publicly available estimates; "unavailable" values are acceptable for players in less-covered leagues.
- The site has a single page with scrolling sections linked by a sticky top navigation bar; no multi-page routing needed.
- Dark mode follows system preference by default but can be manually toggled.
- OFC (Oceania) confederation players are included under a general "Other" bucket since representation is minimal in the tournament.