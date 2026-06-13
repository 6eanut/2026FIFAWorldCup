import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarketValueHistogram } from "./MarketValueHistogram";
import type { Player } from "../../types";

const p = (o: Partial<Player> = {}): Player => ({ id: "1", name: "P", age: 25, nationality: "ENG", position: "MID", height: 180, club: "C", league: "L", marketValueEUR: 50000000, worldCupAppearances: 0, source: "t", ...o });

describe("MarketValueHistogram", () => {
  it("renders title and aria-label", () => {
    render(<MarketValueHistogram data={[p()]} />);
    expect(screen.getByText("Market Value Distribution")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /market value/i })).toBeInTheDocument();
  });

  it("shows excluded footnote when players have null market values", () => {
    render(<MarketValueHistogram data={[p({ marketValueEUR: null })]} />);
    expect(screen.getByText(/excluded/i)).toBeInTheDocument();
  });

  it("does not show footnote when all players have values", () => {
    render(<MarketValueHistogram data={[p({ marketValueEUR: 1000000 })]} />);
    expect(screen.queryByText(/excluded/i)).toBeNull();
  });

  it("renders with empty data", () => {
    render(<MarketValueHistogram data={[]} />);
    expect(screen.getByText("Market Value Distribution")).toBeInTheDocument();
  });
});