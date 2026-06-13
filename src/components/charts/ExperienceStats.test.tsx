import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExperienceStats } from "./ExperienceStats";
import type { Player } from "../../types";

const p = (o: Partial<Player> = {}): Player => ({ id: "1", name: "P", age: 25, nationality: "ENG", position: "MID", height: 180, club: "C", league: "L", marketValueEUR: 1000, worldCupAppearances: 0, source: "t", ...o });

describe("ExperienceStats", () => {
  it("renders title and aria-label", () => {
    render(<ExperienceStats data={[p(), p({ worldCupAppearances: 2 })]} />);
    expect(screen.getByText("World Cup Experience")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /experience/i })).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    render(<ExperienceStats data={[]} />);
    expect(screen.getByText("World Cup Experience")).toBeInTheDocument();
  });
});