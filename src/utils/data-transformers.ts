import type {
  Player,
  AgeBracket,
  LeagueGroup,
  ClubRanking,
  ConfederationStats,
  TeamAnalysis,
  ExperienceStats,
  MarketValueBand,
  RankingList,
} from "../types";

const BIG_FIVE = new Set([
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
]);

export function countryName(code: string): string {
  const names: Record<string, string> = {
    ARG: "Argentina",
    BRA: "Brazil",
    FRA: "France",
    ENG: "England",
    GER: "Germany",
    ESP: "Spain",
    POR: "Portugal",
    NED: "Netherlands",
    JPN: "Japan",
    USA: "United States",
    MAR: "Morocco",
    KOR: "South Korea",
    SEN: "Senegal",
    MEX: "Mexico",
  };
  return names[code] ?? code;
}

const CONFEDERATION_MAP: Record<string, "UEFA" | "CONMEBOL" | "CAF" | "AFC" | "CONCACAF"> = {
  // UEFA
  FRA: "UEFA", ENG: "UEFA", GER: "UEFA", ESP: "UEFA", POR: "UEFA", NED: "UEFA",
  // CONMEBOL
  ARG: "CONMEBOL", BRA: "CONMEBOL",
  // CAF
  MAR: "CAF", SEN: "CAF",
  // AFC
  JPN: "AFC", KOR: "AFC",
  // CONCACAF
  USA: "CONCACAF", MEX: "CONCACAF",
};

export function getConfederation(nationality: string): "UEFA" | "CONMEBOL" | "CAF" | "AFC" | "CONCACAF" {
  return CONFEDERATION_MAP[nationality] ?? "UEFA";
}

export function ageBrackets(players: Player[]): AgeBracket[] {
  const brackets: AgeBracket[] = [
    { label: "Under 20", min: null, max: 20, count: 0 },
    { label: "21–25", min: 21, max: 25, count: 0 },
    { label: "26–30", min: 26, max: 30, count: 0 },
    { label: "31–35", min: 31, max: 35, count: 0 },
    { label: "Over 35", min: 36, max: null, count: 0 },
  ];
  for (const p of players) {
    for (const b of brackets) {
      const aboveMin = b.min === null || p.age >= b.min;
      const belowMax = b.max === null || p.age <= b.max;
      if (aboveMin && belowMax) {
        b.count++;
        break;
      }
    }
  }
  return brackets;
}

export function leagueGroups(players: Player[]): LeagueGroup[] {
  const map = new Map<string, { isBigFive: boolean; count: number }>();
  let otherCount = 0;
  for (const p of players) {
    const league = p.league ?? "Free Agent";
    if (BIG_FIVE.has(league)) {
      const entry = map.get(league) ?? { isBigFive: true, count: 0 };
      entry.count++;
      map.set(league, entry);
    } else {
      otherCount++;
    }
  }
  const result: LeagueGroup[] = [];
  for (const [name, entry] of map) {
    result.push({ name, isBigFive: entry.isBigFive, count: entry.count });
  }
  if (otherCount > 0) {
    result.push({ name: "Other Leagues", isBigFive: false, count: otherCount });
  }
  return result;
}

export function topClubs(players: Player[], n: number = 20): ClubRanking[] {
  const map = new Map<string, number>();
  for (const p of players) {
    const club = p.club ?? "Unattached";
    map.set(club, (map.get(club) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([clubName, playerCount], i) => ({ rank: i + 1, clubName, playerCount }));
}

export function confederationStats(players: Player[]): ConfederationStats[] {
  const codes = ["UEFA", "CONMEBOL", "CAF", "AFC", "CONCACAF"] as const;
  const map = new Map<string, number>();
  let total = 0;
  for (const p of players) {
    const conf = getConfederation(p.nationality);
    map.set(conf, (map.get(conf) ?? 0) + 1);
    total++;
  }
  return codes.map((code) => ({
    code,
    playerCount: map.get(code) ?? 0,
    percentage: total > 0 ? Math.round(((map.get(code) ?? 0) / total) * 1000) / 10 : 0,
  }));
}

export function teamData(players: Player[], nationality: string): TeamAnalysis | null {
  const squad = players.filter((p) => p.nationality === nationality);
  if (squad.length === 0) return null;

  const ages = squad.map((p) => p.age);
  const ageRange: [number, number] = [Math.min(...ages), Math.max(...ages)];
  const averageAge = Math.round((ages.reduce((a, b) => a + b, 0) / ages.length) * 10) / 10;

  const CONFED_LEAGUES: Record<string, string[]> = {
    ARG: ["Argentine Primera"],
    BRA: ["Brasileirão"],
    FRA: ["Ligue 1"],
    ENG: ["Premier League"],
    GER: ["Bundesliga"],
    ESP: ["La Liga"],
    POR: ["Primeira Liga"],
    NED: ["Eredivisie"],
    JPN: ["J1 League"],
    USA: ["MLS"],
    MAR: ["Botola Pro"],
    KOR: ["K League 1"],
    SEN: ["Senegal Ligue 1"],
    MEX: ["Liga MX"],
  };
  const homeLeagues = CONFED_LEAGUES[nationality] ?? [];

  let domesticCount = 0;
  let foreignCount = 0;
  for (const p of squad) {
    if (p.league && homeLeagues.includes(p.league)) {
      domesticCount++;
    } else {
      foreignCount++;
    }
  }

  const clubMap = new Map<string, number>();
  for (const p of squad) {
    const club = p.club ?? "Unattached";
    clubMap.set(club, (clubMap.get(club) ?? 0) + 1);
  }
  const topClubsList = Array.from(clubMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }));

  return {
    countryCode: nationality,
    countryName: countryName(nationality),
    playerCount: squad.length,
    ageRange,
    averageAge,
    domesticLeagueCount: domesticCount,
    foreignLeagueCount: foreignCount,
    topClubs: topClubsList,
  };
}

export function experienceStats(players: Player[]): ExperienceStats {
  let firstTimers = 0;
  let veterans = 0;
  for (const p of players) {
    if (p.worldCupAppearances === 0) {
      firstTimers++;
    } else {
      veterans++;
    }
  }
  return { firstTimers, veterans };
}

const MV_BOUNDS: { label: string; min: number | null; max: number | null }[] = [
  { label: "<€1M", min: null, max: 999999 },
  { label: "€1M–<€5M", min: 1000000, max: 4999999 },
  { label: "€5M–<€20M", min: 5000000, max: 19999999 },
  { label: "€20M–<€50M", min: 20000000, max: 49999999 },
  { label: "€50M–<€100M", min: 50000000, max: 99999999 },
  { label: "≥€100M", min: 100000000, max: null },
];

export function marketValueBands(players: Player[]): MarketValueBand[] {
  const bands: MarketValueBand[] = MV_BOUNDS.map((b) => ({ ...b, count: 0 }));
  for (const p of players) {
    if (p.marketValueEUR === null) continue;
    for (const b of bands) {
      const aboveMin = b.min === null || p.marketValueEUR >= b.min;
      const belowMax = b.max === null || p.marketValueEUR <= b.max;
      if (aboveMin && belowMax) {
        b.count++;
        break;
      }
    }
  }
  return bands;
}

export function excludedMarketValueCount(players: Player[]): number {
  return players.filter((p) => p.marketValueEUR === null).length;
}

export function topRankings(players: Player[]): RankingList[] {
  const byAge = [...players].sort((a, b) => b.age - a.age);
  const byMV = [...players].filter((p) => p.marketValueEUR !== null).sort((a, b) => (b.marketValueEUR ?? 0) - (a.marketValueEUR ?? 0));
  const byWC = [...players].sort((a, b) => b.worldCupAppearances - a.worldCupAppearances);

  const top10 = <T extends Player>(list: T[], fn: (p: T) => string | number): RankingList["entries"] =>
    list.slice(0, 10).map((p, i) => ({
      rank: i + 1,
      name: p.name,
      nationality: countryName(p.nationality),
      value: fn(p),
    }));

  const clubCountMap = new Map<string, number>();
  for (const p of players) {
    const club = p.club ?? "Unattached";
    clubCountMap.set(club, (clubCountMap.get(club) ?? 0) + 1);
  }
  const clubEntries = Array.from(clubCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count], i) => ({
      rank: i + 1,
      name,
      nationality: "",
      value: count,
    }));

  return [
    {
      title: "Top 10 Oldest Players",
      metric: "Age",
      entries: top10(byAge, (p) => `${p.age} years`),
    },
    {
      title: "Top 10 Youngest Players",
      metric: "Age",
      entries: top10(byAge.reverse(), (p) => `${p.age} years`),
    },
    {
      title: "Top 10 Most Valuable Players",
      metric: "Market Value",
      entries: top10(byMV, (p) => `€${((p.marketValueEUR ?? 0) / 1000000).toFixed(0)}M`),
    },
    {
      title: "Top 10 Most Experienced Players",
      metric: "World Cups",
      entries: top10(byWC, (p) => `${p.worldCupAppearances} tournaments`),
    },
    {
      title: "Top 10 Most Represented Clubs",
      metric: "Players in Squad",
      entries: clubEntries,
    },
  ];
}

export function distinctTeams(players: Player[]): { value: string; label: string }[] {
  const seen = new Set<string>();
  for (const p of players) {
    seen.add(p.nationality);
  }
  return Array.from(seen)
    .sort()
    .map((code) => ({ value: code, label: countryName(code) }));
}
