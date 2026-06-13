# Data Model: 2026 FIFA World Cup Player Data Dashboard

**Date**: 2026-06-13

## Entity Definitions

### Player

The core entity. One record per selected player.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✅ | Unique identifier (e.g., `"ARG-001"`) |
| `name` | `string` | ✅ | Full display name |
| `age` | `number` | ✅ | Age in years at tournament start |
| `nationality` | `string` | ✅ | ISO 3166-1 alpha-3 country code (e.g., `"ARG"`) |
| `position` | `Position` | ✅ | One of: `"GK"`, `"DEF"`, `"MID"`, `"FWD"` |
| `height` | `number \| null` | ❌ | Height in centimeters; `null` if unavailable |
| `club` | `string \| null` | ✅ | Club name; `null` for free agents |
| `league` | `string \| null` | ✅ | League name; `null` for free agents |
| `marketValueEUR` | `number \| null` | ❌ | Market value in euros; `null` if unavailable |
| `worldCupAppearances` | `number` | ✅ | Count of prior World Cup tournaments participated in (0 = first-timer) |
| `source` | `string` | ✅ | Data source identifier (e.g., `"FIFA"`, `"Transfermarkt"`) |

**Uniqueness**: `id` is the primary key. `name` + `nationality` is a natural key but not enforced at the data layer.

**Validation rules**:
- `age`: integer, 15–50
- `nationality`: must be a valid 3-letter country code of a participating nation
- `position`: enum as above
- `height`: positive integer (cm) or `null`
- `marketValueEUR`: positive integer or `null`
- `worldCupAppearances`: non-negative integer

### Derived Entities (computed at runtime)

These are not stored in JSON — they are computed by utility functions from the Player array.

#### AgeBracket

| Field | Type | Description |
|---|---|---|
| `label` | `string` | e.g., `"Under 20"`, `"21-25"`, `"26-30"`, `"31-35"`, `"Over 35"` |
| `min` | `number \| null` | Lower bound; inclusive; `null` for "Under 20" |
| `max` | `number \| null` | Upper bound; inclusive; `null` for "Over 35" |
| `count` | `number` | Number of players in bracket |

**Edge case**: Both bounds are inclusive. "Under 20" = age ≤ 20; "21-25" = 21 ≤ age ≤ 25; "26-30" = 26 ≤ age ≤ 30; "31-35" = 31 ≤ age ≤ 35; "Over 35" = age ≥ 36.

#### LeagueGroup

| Field | Type | Description |
|---|---|---|
| `name` | `string` | League name or `"Other Leagues"` |
| `isBigFive` | `boolean` | True for Premier League, La Liga, Serie A, Bundesliga, Ligue 1 |
| `count` | `number` | Number of players |

#### ClubRanking

| Field | Type | Description |
|---|---|---|
| `rank` | `number` | 1–20 |
| `clubName` | `string` | Club name |
| `playerCount` | `number` | Players from this club in tournament |

#### ConfederationStats

| Field | Type | Description |
|---|---|---|
| `code` | `string` | `"UEFA"`, `"CONMEBOL"`, `"CAF"`, `"AFC"`, `"CONCACAF"` |
| `playerCount` | `number` | Total players from this confederation |
| `percentage` | `number` | Percentage of total players |

#### TeamAnalysis

| Field | Type | Description |
|---|---|---|
| `countryCode` | `string` | ISO 3166-1 alpha-3 |
| `countryName` | `string` | Display name |
| `playerCount` | `number` | Squad size |
| `ageRange` | `[number, number]` | [min, max] age in squad |
| `averageAge` | `number` | Mean age (1 decimal) |
| `domesticLeagueCount` | `number` | Players in home country's league |
| `foreignLeagueCount` | `number` | Players in foreign leagues |
| `topClubs` | `{ name: string; count: number }[]` | Top 3 clubs by player count |

#### ExperienceStats

| Field | Type | Description |
|---|---|---|
| `firstTimers` | `number` | Players with `worldCupAppearances === 0` |
| `veterans` | `number` | Players with `worldCupAppearances > 0` |

#### MarketValueBand

| Field | Type | Description |
|---|---|---|
| `label` | `string` | e.g., `"<€1M"`, `"€1M–<€5M"`, `"€5M–<€20M"`, `"€20M–<€50M"`, `"€50M–<€100M"`, `"≥€100M"` |
| `min` | `number \| null` | Inclusive lower bound; `null` for lowest band |
| `max` | `number \| null` | Exclusive upper bound; `null` for highest band |
| `count` | `number` | Players in band |
| `excludedCount` | `number` | Players with null market value (shown as footnote) |

#### RankingList

| Field | Type | Description |
|---|---|---|
| `title` | `string` | e.g., `"Top 10 Oldest Players"` |
| `metric` | `string` | What is being ranked |
| `entries` | `{ rank: number; name: string; nationality: string; value: string \| number }[]` | Ranked entries |

## Data Flow

```text
players.json ──► usePlayers() hook ──► data-transformers.ts ──► Chart Components
                     │                        │
                     ▼                        ▼
              ErrorState.tsx          chart-helpers.ts
              LoadingSkeleton.tsx     (colors, formatters)
```

1. `usePlayers` hook loads `src/data/players.json` via static import (Vite bundles it)
2. On success, passes raw `Player[]` to components
3. Each chart component calls the appropriate transformer function from `data-transformers.ts`
4. Transformer returns the derived entity array
5. Chart component maps derived data to Recharts props

## Confederation Mapping

Static lookup table in `data-transformers.ts`:

```text
UEFA:     AUT, BEL, CRO, CZE, DEN, ENG, FRA, GER, HUN, ITA, NED, POL, POR, ROU, SCO, SRB, SVK, SLO, ESP, SUI, TUR, UKR, WAL, ...
CONMEBOL: ARG, BOL, BRA, CHI, COL, ECU, PAR, PER, URU, VEN
CAF:      ALG, CMR, COD, EGY, GHA, CIV, MLI, MAR, NGA, SEN, RSA, TUN, ...
AFC:      AUS, CHN, IRN, IRQ, JPN, JOR, KOR, KSA, QAT, UAE, UZB, ...
CONCACAF: CAN, CRC, HON, JAM, MEX, PAN, USA, ...
OFC:      NZL, ... → Merged into "Other" per spec assumption
```

## Big Five League Mapping

```text
Premier League → England
La Liga        → Spain
Serie A        → Italy
Bundesliga     → Germany
Ligue 1        → France
```

All other leagues → `"Other Leagues"` category.
