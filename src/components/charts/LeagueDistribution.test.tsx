import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LeagueDistribution } from "./LeagueDistribution";
import type { Player } from "../../types";

const p = (o: Partial<Player> = {}): Player => ({ id: "1", name: "P", age: 25, nationality: "ENG", position: "MID", height: 180, club: "C", league: "Premier League", marketValueEUR: 1000, worldCupAppearances: 0, source: "t", ...o });

describe("LeagueDistribution", () => {
  it("renders title and aria-label", () => {
    render(<LeagueDistribution data={[p()]} />);
    expect(screen.getByText("League Distribution")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /league distribution/i })).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    render(<LeagueDistribution data={[]} />);
    expect(screen.getByText("League Distribution")).toBeInTheDocument();
  });
});