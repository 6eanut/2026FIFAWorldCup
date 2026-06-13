import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConfederationDistribution } from "./ConfederationDistribution";
import type { Player } from "../../types";

const p = (o: Partial<Player> = {}): Player => ({ id: "1", name: "P", age: 25, nationality: "ENG", position: "MID", height: 180, club: "C", league: "L", marketValueEUR: 1000, worldCupAppearances: 0, source: "t", ...o });

describe("ConfederationDistribution", () => {
  it("renders title and aria-label", () => {
    render(<ConfederationDistribution data={[p()]} />);
    expect(screen.getByText("Confederation Distribution")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /confederation/i })).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    render(<ConfederationDistribution data={[]} />);
    expect(screen.getByText("Confederation Distribution")).toBeInTheDocument();
  });
});