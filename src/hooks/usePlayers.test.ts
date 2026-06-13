import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import type { Player } from "../types";

const mockPlayers: Player[] = [
  {
    id: "1",
    name: "Player One",
    age: 25,
    nationality: "ENG",
    position: "MID",
    height: 180,
    club: "Test Club",
    league: "Premier League",
    marketValueEUR: 50000000,
    worldCupAppearances: 1,
    source: "test",
  },
  {
    id: "2",
    name: "Player Two",
    age: 30,
    nationality: "BRA",
    position: "FWD",
    height: 175,
    club: "Other Club",
    league: "La Liga",
    marketValueEUR: 80000000,
    worldCupAppearances: 2,
    source: "test",
  },
];

vi.mock("../data/players.json", () => ({
  default: mockPlayers,
}));

async function importUsePlayers() {
  const mod = await import("./usePlayers");
  return mod.usePlayers;
}

describe("usePlayers", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("resolves loading and returns players", async () => {
    const usePlayers = await importUsePlayers();
    const { result } = renderHook(() => usePlayers());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.players).toEqual(mockPlayers);
    expect(result.current.error).toBeNull();
  });

  it("deduplicates players with same id", async () => {
    const dupedData: Player[] = [
      { ...mockPlayers[0]!, id: "1", name: "First" },
      { ...mockPlayers[0]!, id: "1", name: "Duplicate" },
    ];
    vi.doMock("../data/players.json", () => ({ default: dupedData }));

    const usePlayers = await importUsePlayers();
    const { result } = renderHook(() => usePlayers());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.players).toHaveLength(1);
    expect(result.current.players![0]!.name).toBe("First");
  });

  it("handles empty player array", async () => {
    vi.doMock("../data/players.json", () => ({ default: [] }));
    const usePlayers = await importUsePlayers();
    const { result } = renderHook(() => usePlayers());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.players).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});