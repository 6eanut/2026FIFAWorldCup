import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AgeDistribution } from "./AgeDistribution";
import type { Player } from "../../types";

const p = (o: Partial<Player> = {}): Player => ({ id: "1", name: "P", age: 25, nationality: "ENG", position: "MID", height: 180, club: "C", league: "L", marketValueEUR: 1000, worldCupAppearances: 0, source: "t", ...o });

describe("AgeDistribution", () => {
  it("renders title and aria-label", () => {
    render(<AgeDistribution data={[p()]} />);
    expect(screen.getByText("Age Distribution")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /age distribution/i })).toBeInTheDocument();
  });

  it("renders with empty data without crashing", () => {
    render(<AgeDistribution data={[]} />);
    expect(screen.getByText("Age Distribution")).toBeInTheDocument();
  });
});