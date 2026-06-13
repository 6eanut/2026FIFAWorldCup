# 2026 FIFA World Cup · Player Data Dashboard

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8)](https://tailwindcss.com/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-brightgreen)](https://6eanut.github.io/2026FIFAWorldCup/)

Interactive data visualization dashboard for the 2026 FIFA World Cup. Explore player statistics through 8 dynamic chart sections — all from static JSON data, deployable to GitHub Pages with zero backend.

## Features

- **Age Distribution** — Players grouped by age brackets
- **League Distribution** — Big Five leagues (Premier League, La Liga, Serie A, Bundesliga, Ligue 1) vs others
- **Top 20 Clubs** — Clubs with most players at the tournament
- **Confederation Breakdown** — UEFA / CONMEBOL / CAF / AFC / CONCACAF
- **National Team Analysis** — Per-team squad structure with domestic/foreign league ratio
- **World Cup Experience** — First-timers vs multi-tournament veterans
- **Market Value Bands** — Player value distribution histogram
- **Top Rankings** — Top 10 oldest, youngest, most valuable, most experienced players

## Tech Stack

| Layer | Choice |
|---|---|
| Language | TypeScript 5.x (strict mode, no `any`) |
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Charts | Recharts |
| Deployment | GitHub Pages (static) |

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173

# Production build
npm run build
# → Output in dist/

# Preview production build
npm run preview
```

## Data

All data is stored as static JSON in `src/data/players.json`. Data sourced from publicly verifiable FIFA squad lists and Transfermarkt.

## License

MIT
