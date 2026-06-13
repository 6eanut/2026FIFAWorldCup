import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeamAnalysis } from "./TeamAnalysis";
import type { Player } from "../../types";

const p = (o: Partial<Player> = {}): Player => ({ id: "1", name: "P", age: 25, nationality: "ENG", position: "MID", height: 180, club: "Club A", league: "Premier League", marketValueEUR: 50000000, worldCupAppearances: 0, source: "t", ...o });

describe("TeamAnalysis", () => {
  it("renders title and placeholder text", () => {
    render(<TeamAnalysis data={[p({ nationality: "ENG" }), p({ id: "2", nationality: "BRA" })]} />);
    expect(screen.getByText("National Team Analysis")).toBeInTheDocument();
    expect(screen.getByText(/choose a national team/i)).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<TeamAnalysis data={[p()]} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    render(<TeamAnalysis data={[]} />);
    expect(screen.getByText("National Team Analysis")).toBeInTheDocument();
  });
});