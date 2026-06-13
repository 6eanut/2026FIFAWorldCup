import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TopRankings } from "./TopRankings";
import type { Player } from "../../types";

const p = (o: Partial<Player> = {}): Player => ({ id: "1", name: "Player One", age: 25, nationality: "ENG", position: "MID", height: 180, club: "Real Madrid", league: "La Liga", marketValueEUR: 50000000, worldCupAppearances: 1, source: "t", ...o });

describe("TopRankings", () => {
  it("renders all 5 ranking lists", () => {
    const players = Array.from({ length: 15 }, (_, i) => p({ id: String(i), name: `Player ${i}`, age: 20 + i }));
    render(<TopRankings data={players} />);
    expect(screen.getByText("Top 10 Oldest Players")).toBeInTheDocument();
    expect(screen.getByText("Top 10 Youngest Players")).toBeInTheDocument();
    expect(screen.getByText("Top 10 Most Valuable Players")).toBeInTheDocument();
    expect(screen.getByText("Top 10 Most Experienced Players")).toBeInTheDocument();
    expect(screen.getByText("Top 10 Most Represented Clubs")).toBeInTheDocument();
  });

  it("renders with single player", () => {
    render(<TopRankings data={[p()]} />);
    expect(screen.getByText("Top 10 Oldest Players")).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    render(<TopRankings data={[]} />);
    expect(screen.getByText("Top 10 Oldest Players")).toBeInTheDocument();
  });
});