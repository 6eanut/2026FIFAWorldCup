import { describe, it, expect } from "vitest";
import {
  ageBrackets,
  leagueGroups,
  topClubs,
  confederationStats,
  teamData,
  experienceStats,
  marketValueBands,
  excludedMarketValueCount,
  topRankings,
  distinctTeams,
  countryName,
  getConfederation,
} from "../utils/data-transformers";
import type { Player } from "../types";

function makePlayer(overrides: Partial<Player> = {}): Player {
  return {
    id: "1",
    name: "Test Player",
    age: 25,
    nationality: "ENG",
    position: "MID",
    height: 180,
    club: "Test Club",
    league: "Premier League",
    marketValueEUR: 50000000,
    worldCupAppearances: 1,
    source: "test",
    ...overrides,
  };
}

// ============================================================
// countryName
// ============================================================

describe("countryName", () => {
  it("returns full name for known country code", () => {
    expect(countryName("BRA")).toBe("Brazil");
  });

  it("returns code as-is for unknown country", () => {
    expect(countryName("XYZ")).toBe("XYZ");
  });
});

// ============================================================
// getConfederation
// ============================================================

describe("getConfederation", () => {
  it("returns UEFA for European countries", () => {
    expect(getConfederation("ENG")).toBe("UEFA");
    expect(getConfederation("FRA")).toBe("UEFA");
  });

  it("returns CONMEBOL for South American countries", () => {
    expect(getConfederation("ARG")).toBe("CONMEBOL");
    expect(getConfederation("BRA")).toBe("CONMEBOL");
  });

  it("returns CAF for African countries", () => {
    expect(getConfederation("SEN")).toBe("CAF");
  });

  it("returns AFC for Asian countries", () => {
    expect(getConfederation("JPN")).toBe("AFC");
  });

  it("returns CONCACAF for North American countries", () => {
    expect(getConfederation("USA")).toBe("CONCACAF");
  });

  it("defaults to UEFA for unknown code", () => {
    expect(getConfederation("XYZ")).toBe("UEFA");
  });
});

// ============================================================
// ageBrackets
// ============================================================

describe("ageBrackets", () => {
  it("returns all five brackets with correct labels", () => {
    const result = ageBrackets([]);
    const labels = result.map((b) => b.label);
    expect(labels).toEqual(["Under 20", "21–25", "26–30", "31–35", "Over 35"]);
  });

  it("counts 17-year-old as Under 20", () => {
    const result = ageBrackets([makePlayer({ id: "a", age: 17 })]);
    expect(result[0]!.count).toBe(1);
  });

  it("counts 20-year-old as Under 20 (inclusive upper bound)", () => {
    const result = ageBrackets([makePlayer({ id: "a", age: 20 })]);
    expect(result[0]!.count).toBe(1);
  });

  it("counts 21-year-old as 21–25", () => {
    const result = ageBrackets([makePlayer({ id: "a", age: 21 })]);
    expect(result[1]!.count).toBe(1);
  });

  it("counts 25-year-old as 21–25 (inclusive upper bound)", () => {
    const result = ageBrackets([makePlayer({ id: "a", age: 25 })]);
    expect(result[1]!.count).toBe(1);
  });

  it("counts 26-year-old as 26–30 (inclusive lower bound)", () => {
    const result = ageBrackets([makePlayer({ id: "a", age: 26 })]);
    expect(result[2]!.count).toBe(1);
  });

  it("counts 30-year-old as 26–30 (inclusive upper bound)", () => {
    const result = ageBrackets([makePlayer({ id: "a", age: 30 })]);
    expect(result[2]!.count).toBe(1);
  });

  it("counts 31-year-old as 31–35 (inclusive lower bound)", () => {
    const result = ageBrackets([makePlayer({ id: "a", age: 31 })]);
    expect(result[3]!.count).toBe(1);
  });

  it("counts 35-year-old as 31–35 (inclusive upper bound)", () => {
    const result = ageBrackets([makePlayer({ id: "a", age: 35 })]);
    expect(result[3]!.count).toBe(1);
  });

  it("counts 36-year-old as Over 35 (inclusive lower bound)", () => {
    const result = ageBrackets([makePlayer({ id: "a", age: 36 })]);
    expect(result[4]!.count).toBe(1);
  });

  it("distributes multiple players across brackets", () => {
    const players = [
      makePlayer({ id: "1", age: 18 }),
      makePlayer({ id: "2", age: 22 }),
      makePlayer({ id: "3", age: 28 }),
      makePlayer({ id: "4", age: 33 }),
      makePlayer({ id: "5", age: 38 }),
    ];
    const result = ageBrackets(players);
    expect(result[0]!.count).toBe(1);
    expect(result[1]!.count).toBe(1);
    expect(result[2]!.count).toBe(1);
    expect(result[3]!.count).toBe(1);
    expect(result[4]!.count).toBe(1);
  });

  it("each player is counted exactly once", () => {
    const players = Array.from({ length: 100 }, (_, i) =>
      makePlayer({ id: String(i), age: 10 + i })
    );
    const result = ageBrackets(players);
    const total = result.reduce((sum, b) => sum + b.count, 0);
    expect(total).toBe(100);
  });
});

// ============================================================
// leagueGroups
// ============================================================

describe("leagueGroups", () => {
  it("separates Big Five leagues individually", () => {
    const players = [
      makePlayer({ id: "1", league: "Premier League" }),
      makePlayer({ id: "2", league: "La Liga" }),
      makePlayer({ id: "3", league: "Serie A" }),
      makePlayer({ id: "4", league: "Bundesliga" }),
      makePlayer({ id: "5", league: "Ligue 1" }),
    ];
    const result = leagueGroups(players);
    const bigFive = result.filter((g) => g.isBigFive);
    expect(bigFive.length).toBe(5);
  });

  it("aggregates non-Big Five leagues into Other Leagues", () => {
    const players = [
      makePlayer({ id: "1", league: "Eredivisie" }),
      makePlayer({ id: "2", league: "Primeira Liga" }),
    ];
    const result = leagueGroups(players);
    const other = result.find((g) => g.name === "Other Leagues");
    expect(other).toBeDefined();
    expect(other!.count).toBe(2);
    expect(other!.isBigFive).toBe(false);
  });

  it("treats null league as Free Agent and groups into Other Leagues", () => {
    const result = leagueGroups([makePlayer({ id: "1", league: null })]);
    const other = result.find((g) => g.name === "Other Leagues");
    expect(other).toBeDefined();
    expect(other!.count).toBe(1);
  });

  it("returns counts correctly for mixed leagues", () => {
    const players = [
      makePlayer({ id: "1", league: "Premier League" }),
      makePlayer({ id: "2", league: "Premier League" }),
      makePlayer({ id: "3", league: "Eredivisie" }),
    ];
    const result = leagueGroups(players);
    const pl = result.find((g) => g.name === "Premier League");
    expect(pl!.count).toBe(2);
    const other = result.find((g) => g.name === "Other Leagues");
    expect(other!.count).toBe(1);
  });

  it("omits Other Leagues when all players are in Big Five", () => {
    const players = [
      makePlayer({ id: "1", league: "Premier League" }),
      makePlayer({ id: "2", league: "La Liga" }),
    ];
    const result = leagueGroups(players);
    expect(result.find((g) => g.name === "Other Leagues")).toBeUndefined();
  });

  it("returns empty array for no players", () => {
    expect(leagueGroups([])).toEqual([]);
  });
});

// ============================================================
// topClubs
// ============================================================

describe("topClubs", () => {
  it("returns top 20 clubs by default", () => {
    const players = Array.from({ length: 30 }, (_, i) =>
      makePlayer({ id: String(i), club: `Club ${i}` })
    );
    const result = topClubs(players);
    expect(result.length).toBe(20);
  });

  it("returns limited number when fewer clubs exist", () => {
    const result = topClubs([makePlayer({ club: "Only Club" })]);
    expect(result.length).toBe(1);
    expect(result[0]!.clubName).toBe("Only Club");
  });

  it("sorts by player count descending", () => {
    const players = [
      makePlayer({ id: "1", club: "Club A" }),
      makePlayer({ id: "2", club: "Club A" }),
      makePlayer({ id: "3", club: "Club B" }),
    ];
    const result = topClubs(players);
    expect(result[0]!.clubName).toBe("Club A");
    expect(result[0]!.playerCount).toBe(2);
    expect(result[1]!.clubName).toBe("Club B");
    expect(result[1]!.playerCount).toBe(1);
  });

  it("treats null club as Unattached", () => {
    const result = topClubs([makePlayer({ club: null })]);
    expect(result[0]!.clubName).toBe("Unattached");
  });

  it("respects custom n parameter", () => {
    const players = Array.from({ length: 10 }, (_, i) =>
      makePlayer({ id: String(i), club: `Club ${i}` })
    );
    const result = topClubs(players, 5);
    expect(result.length).toBe(5);
  });

  it("ranks are sequential starting from 1", () => {
    const result = topClubs([makePlayer({ club: "A" }), makePlayer({ club: "B" })]);
    expect(result[0]!.rank).toBe(1);
    expect(result[1]!.rank).toBe(2);
  });

  it("returns empty array for no players", () => {
    expect(topClubs([])).toEqual([]);
  });
});

// ============================================================
// confederationStats
// ============================================================

describe("confederationStats", () => {
  it("returns all five confederations", () => {
    const result = confederationStats([]);
    expect(result.length).toBe(5);
    expect(result.map((c) => c.code)).toEqual(["UEFA", "CONMEBOL", "CAF", "AFC", "CONCACAF"]);
  });

  it("counts players per confederation", () => {
    const players = [
      makePlayer({ id: "1", nationality: "ENG" }),
      makePlayer({ id: "2", nationality: "BRA" }),
    ];
    const result = confederationStats(players);
    expect(result.find((c) => c.code === "UEFA")!.playerCount).toBe(1);
    expect(result.find((c) => c.code === "CONMEBOL")!.playerCount).toBe(1);
  });

  it("calculates percentages correctly", () => {
    const players = [
      makePlayer({ id: "1", nationality: "ENG" }),
      makePlayer({ id: "2", nationality: "FRA" }),
      makePlayer({ id: "3", nationality: "GER" }),
      makePlayer({ id: "4", nationality: "BRA" }),
    ];
    const result = confederationStats(players);
    expect(result.find((c) => c.code === "UEFA")!.percentage).toBe(75);
    expect(result.find((c) => c.code === "CONMEBOL")!.percentage).toBe(25);
  });

  it("returns zero for empty confederations", () => {
    const result = confederationStats([]);
    for (const c of result) {
      expect(c.playerCount).toBe(0);
      expect(c.percentage).toBe(0);
    }
  });
});

// ============================================================
// teamData
// ============================================================

describe("teamData", () => {
  it("returns null for non-existent team", () => {
    const result = teamData([], "NONEXISTENT");
    expect(result).toBeNull();
  });

  it("returns correct player count", () => {
    const players = [
      makePlayer({ id: "1", nationality: "BRA" }),
      makePlayer({ id: "2", nationality: "BRA" }),
      makePlayer({ id: "3", nationality: "ARG" }),
    ];
    const result = teamData(players, "BRA");
    expect(result!.playerCount).toBe(2);
  });

  it("calculates age range correctly", () => {
    const players = [
      makePlayer({ id: "1", nationality: "BRA", age: 20 }),
      makePlayer({ id: "2", nationality: "BRA", age: 35 }),
    ];
    const result = teamData(players, "BRA");
    expect(result!.ageRange).toEqual([20, 35]);
  });

  it("calculates average age correctly", () => {
    const players = [
      makePlayer({ id: "1", nationality: "BRA", age: 20 }),
      makePlayer({ id: "2", nationality: "BRA", age: 30 }),
    ];
    const result = teamData(players, "BRA");
    expect(result!.averageAge).toBe(25);
  });

  it("distinguishes domestic vs foreign leagues", () => {
    const players = [
      makePlayer({ id: "1", nationality: "ENG", league: "Premier League" }),
      makePlayer({ id: "2", nationality: "ENG", league: "La Liga" }),
    ];
    const result = teamData(players, "ENG");
    expect(result!.domesticLeagueCount).toBe(1);
    expect(result!.foreignLeagueCount).toBe(1);
  });

  it("counts null league as foreign", () => {
    const players = [makePlayer({ id: "1", nationality: "ENG", league: null })];
    const result = teamData(players, "ENG");
    expect(result!.foreignLeagueCount).toBe(1);
    expect(result!.domesticLeagueCount).toBe(0);
  });

  it("counts all players in domestic league", () => {
    const players = [
      makePlayer({ id: "1", nationality: "ENG", league: "Premier League" }),
      makePlayer({ id: "2", nationality: "ENG", league: "Premier League" }),
    ];
    const result = teamData(players, "ENG");
    expect(result!.domesticLeagueCount).toBe(2);
    expect(result!.foreignLeagueCount).toBe(0);
  });

  it("counts all players in foreign leagues", () => {
    const players = [
      makePlayer({ id: "1", nationality: "ENG", league: "La Liga" }),
      makePlayer({ id: "2", nationality: "ENG", league: "Serie A" }),
    ];
    const result = teamData(players, "ENG");
    expect(result!.domesticLeagueCount).toBe(0);
    expect(result!.foreignLeagueCount).toBe(2);
  });

  it("returns top 3 clubs for the team", () => {
    const players = [
      makePlayer({ id: "1", nationality: "BRA", club: "Club A" }),
      makePlayer({ id: "2", nationality: "BRA", club: "Club A" }),
      makePlayer({ id: "3", nationality: "BRA", club: "Club B" }),
      makePlayer({ id: "4", nationality: "BRA", club: "Club C" }),
      makePlayer({ id: "5", nationality: "BRA", club: "Club D" }),
    ];
    const result = teamData(players, "BRA");
    expect(result!.topClubs.length).toBe(3);
    expect(result!.topClubs[0]!.name).toBe("Club A");
    expect(result!.topClubs[0]!.count).toBe(2);
  });

  it("returns country name from code", () => {
    const result = teamData([makePlayer({ nationality: "BRA" })], "BRA");
    expect(result!.countryName).toBe("Brazil");
  });
});

// ============================================================
// experienceStats
// ============================================================

describe("experienceStats", () => {
  it("counts first-timers and veterans", () => {
    const players = [
      makePlayer({ id: "1", worldCupAppearances: 0 }),
      makePlayer({ id: "2", worldCupAppearances: 2 }),
    ];
    const result = experienceStats(players);
    expect(result.firstTimers).toBe(1);
    expect(result.veterans).toBe(1);
  });

  it("counts all players with zero appearances as first-timers", () => {
    const players = [makePlayer({ id: "1", worldCupAppearances: 0 })];
    const result = experienceStats(players);
    expect(result.firstTimers).toBe(1);
    expect(result.veterans).toBe(0);
  });

  it("counts all players with non-zero appearances as veterans", () => {
    const players = [makePlayer({ id: "1", worldCupAppearances: 1 })];
    const result = experienceStats(players);
    expect(result.firstTimers).toBe(0);
    expect(result.veterans).toBe(1);
  });

  it("handles empty array", () => {
    const result = experienceStats([]);
    expect(result.firstTimers).toBe(0);
    expect(result.veterans).toBe(0);
  });
});

// ============================================================
// marketValueBands
// ============================================================

describe("marketValueBands", () => {
  it("returns all six bands with correct labels", () => {
    const result = marketValueBands([]);
    expect(result.map((b) => b.label)).toEqual([
      "<€1M",
      "€1M–<€5M",
      "€5M–<€20M",
      "€20M–<€50M",
      "€50M–<€100M",
      "≥€100M",
    ]);
  });

  it("places value into correct band", () => {
    const result = marketValueBands([makePlayer({ marketValueEUR: 500_000 })]);
    expect(result[0]!.count).toBe(1); // <€1M
  });

  it("places €1M exactly into €1M–<€5M band", () => {
    const result = marketValueBands([makePlayer({ marketValueEUR: 1_000_000 })]);
    expect(result[1]!.count).toBe(1);
  });

  it("places €100M exactly into ≥€100M band", () => {
    const result = marketValueBands([makePlayer({ marketValueEUR: 100_000_000 })]);
    expect(result[5]!.count).toBe(1);
  });

  it("places €0 into <€1M band", () => {
    const result = marketValueBands([makePlayer({ marketValueEUR: 0 })]);
    expect(result[0]!.count).toBe(1);
  });

  it("places €4,999,999 into €1M–<€5M band (upper bound)", () => {
    const result = marketValueBands([makePlayer({ marketValueEUR: 4_999_999 })]);
    expect(result[1]!.count).toBe(1);
  });

  it("places €5,000,000 into €5M–<€20M band (lower bound)", () => {
    const result = marketValueBands([makePlayer({ marketValueEUR: 5_000_000 })]);
    expect(result[2]!.count).toBe(1);
  });

  it("places €19,999,999 into €5M–<€20M band (upper bound)", () => {
    const result = marketValueBands([makePlayer({ marketValueEUR: 19_999_999 })]);
    expect(result[2]!.count).toBe(1);
  });

  it("places €20,000,000 into €20M–<€50M band (lower bound)", () => {
    const result = marketValueBands([makePlayer({ marketValueEUR: 20_000_000 })]);
    expect(result[3]!.count).toBe(1);
  });

  it("places €49,999,999 into €20M–<€50M band (upper bound)", () => {
    const result = marketValueBands([makePlayer({ marketValueEUR: 49_999_999 })]);
    expect(result[3]!.count).toBe(1);
  });

  it("places €50,000,000 into €50M–<€100M band (lower bound)", () => {
    const result = marketValueBands([makePlayer({ marketValueEUR: 50_000_000 })]);
    expect(result[4]!.count).toBe(1);
  });

  it("places €99,999,999 into €50M–<€100M band (upper bound)", () => {
    const result = marketValueBands([makePlayer({ marketValueEUR: 99_999_999 })]);
    expect(result[4]!.count).toBe(1);
  });

  it("excludes players with null market value", () => {
    const result = marketValueBands([makePlayer({ marketValueEUR: null })]);
    const total = result.reduce((sum, b) => sum + b.count, 0);
    expect(total).toBe(0);
  });

  it("distributes multiple values correctly", () => {
    const players = [
      makePlayer({ id: "1", marketValueEUR: 500_000 }),
      makePlayer({ id: "2", marketValueEUR: 3_000_000 }),
      makePlayer({ id: "3", marketValueEUR: 15_000_000 }),
      makePlayer({ id: "4", marketValueEUR: 30_000_000 }),
      makePlayer({ id: "5", marketValueEUR: 75_000_000 }),
      makePlayer({ id: "6", marketValueEUR: 150_000_000 }),
    ];
    const result = marketValueBands(players);
    expect(result[0]!.count).toBe(1);
    expect(result[1]!.count).toBe(1);
    expect(result[2]!.count).toBe(1);
    expect(result[3]!.count).toBe(1);
    expect(result[4]!.count).toBe(1);
    expect(result[5]!.count).toBe(1);
  });
});

// ============================================================
// excludedMarketValueCount
// ============================================================

describe("excludedMarketValueCount", () => {
  it("returns count of players with null market value", () => {
    const players = [
      makePlayer({ id: "1", marketValueEUR: null }),
      makePlayer({ id: "2", marketValueEUR: null }),
      makePlayer({ id: "3", marketValueEUR: 10_000_000 }),
    ];
    expect(excludedMarketValueCount(players)).toBe(2);
  });

  it("returns 0 when all players have values", () => {
    expect(excludedMarketValueCount([makePlayer({ marketValueEUR: 1000 })])).toBe(0);
  });

  it("returns 0 for empty array", () => {
    expect(excludedMarketValueCount([])).toBe(0);
  });
});

// ============================================================
// topRankings
// ============================================================

describe("topRankings", () => {
  it("returns exactly 5 ranking lists", () => {
    const result = topRankings([makePlayer()]);
    expect(result.length).toBe(5);
  });

  it("returns expected titles", () => {
    const result = topRankings([makePlayer()]);
    const titles = result.map((r) => r.title);
    expect(titles).toEqual([
      "Top 10 Oldest Players",
      "Top 10 Youngest Players",
      "Top 10 Most Valuable Players",
      "Top 10 Most Experienced Players",
      "Top 10 Most Represented Clubs",
    ]);
  });

  it("oldest players sorted by age descending", () => {
    const players = [
      makePlayer({ id: "1", age: 20 }),
      makePlayer({ id: "2", age: 35 }),
      makePlayer({ id: "3", age: 30 }),
    ];
    const result = topRankings(players);
    const oldest = result[0]!;
    expect(oldest.entries[0]!.value).toBe("35 years");
    expect(oldest.entries[1]!.value).toBe("30 years");
  });

  it("youngest players sorted by age ascending", () => {
    const players = [
      makePlayer({ id: "1", age: 20 }),
      makePlayer({ id: "2", age: 35 }),
      makePlayer({ id: "3", age: 30 }),
    ];
    const result = topRankings(players);
    const youngest = result[1]!;
    expect(youngest.entries[0]!.value).toBe("20 years");
  });

  it("most valuable sorted by value descending", () => {
    const players = [
      makePlayer({ id: "1", marketValueEUR: 10_000_000, name: "Mid" }),
      makePlayer({ id: "2", marketValueEUR: 100_000_000, name: "Expensive" }),
      makePlayer({ id: "3", marketValueEUR: 1_000_000, name: "Cheap" }),
    ];
    const result = topRankings(players);
    const mv = result[2]!;
    expect(mv.entries[0]!.name).toBe("Expensive");
  });

  it("excludes players with null market value from rankings", () => {
    const result = topRankings([makePlayer({ marketValueEUR: null })]);
    const mv = result[2]!;
    expect(mv.entries.length).toBe(0);
  });

  it("limits each list to 10 entries", () => {
    const players = Array.from({ length: 20 }, (_, i) =>
      makePlayer({ id: String(i), age: 20 + i })
    );
    const result = topRankings(players);
    for (const list of result) {
      expect(list.entries.length).toBeLessThanOrEqual(10);
    }
  });

  it("club rankings aggregate counts correctly", () => {
    const players = [
      makePlayer({ id: "1", club: "Club A" }),
      makePlayer({ id: "2", club: "Club A" }),
      makePlayer({ id: "3", club: "Club B" }),
    ];
    const result = topRankings(players);
    const clubs = result[4]!;
    expect(clubs.entries[0]!.name).toBe("Club A");
    expect(clubs.entries[0]!.value).toBe(2);
    expect(clubs.entries[1]!.name).toBe("Club B");
    expect(clubs.entries[1]!.value).toBe(1);
  });

  it("treats null club as Unattached", () => {
    const result = topRankings([makePlayer({ club: null })]);
    const clubs = result[4]!;
    expect(clubs.entries[0]!.name).toBe("Unattached");
  });
});

// ============================================================
// distinctTeams
// ============================================================

describe("distinctTeams", () => {
  it("returns unique teams sorted alphabetically", () => {
    const players = [
      makePlayer({ id: "1", nationality: "BRA" }),
      makePlayer({ id: "2", nationality: "ARG" }),
      makePlayer({ id: "3", nationality: "BRA" }),
    ];
    const result = distinctTeams(players);
    expect(result.length).toBe(2);
    expect(result[0]!.value).toBe("ARG");
    expect(result[1]!.value).toBe("BRA");
  });

  it("returns value/label pairs with country names", () => {
    const result = distinctTeams([makePlayer({ nationality: "BRA" })]);
    expect(result[0]).toEqual({ value: "BRA", label: "Brazil" });
  });

  it("returns empty array for no players", () => {
    expect(distinctTeams([])).toEqual([]);
  });

  it("falls back to code for unknown country names", () => {
    const result = distinctTeams([makePlayer({ nationality: "XYZ" })]);
    expect(result[0]!.label).toBe("XYZ");
  });
});