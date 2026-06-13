import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ClubTop20 } from "./ClubTop20";
import type { Player } from "../../types";

const p = (o: Partial<Player> = {}): Player => ({ id: "1", name: "P", age: 25, nationality: "ENG", position: "MID", height: 180, club: "Real Madrid", league: "La Liga", marketValueEUR: 1000, worldCupAppearances: 0, source: "t", ...o });

describe("ClubTop20", () => {
  it("renders title and aria-label", () => {
    render(<ClubTop20 data={[p()]} />);
    expect(screen.getByText("Top 20 Clubs")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /top 20 clubs/i })).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    render(<ClubTop20 data={[]} />);
    expect(screen.getByText("Top 20 Clubs")).toBeInTheDocument();
  });
});