import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("renders title", () => {
    render(<Card title="Test Title">content</Card>);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<Card title="Title" subtitle="A subtitle">content</Card>);
    expect(screen.getByText("A subtitle")).toBeInTheDocument();
  });

  it("does not render subtitle when omitted", () => {
    render(<Card title="Title">content</Card>);
    const subtitle = screen.queryByText("A subtitle");
    expect(subtitle).toBeNull();
  });

  it("renders children", () => {
    render(<Card title="Title"><span data-testid="child">hello</span></Card>);
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Card title="Title" className="custom-class">content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("custom-class");
  });

  it("renders title as h3", () => {
    render(<Card title="Title">content</Card>);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Title");
  });
});