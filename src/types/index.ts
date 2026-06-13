export type Position = "GK" | "DEF" | "MID" | "FWD";

export interface Player {
  id: string;
  name: string;
  age: number;
  nationality: string;
  position: Position;
  height: number | null;
  club: string | null;
  league: string | null;
  marketValueEUR: number | null;
  worldCupAppearances: number;
  source: string;
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

export interface NavSection {
  id: string;
  label: string;
}