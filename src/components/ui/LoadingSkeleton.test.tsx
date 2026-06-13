import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { LoadingSkeleton } from "./LoadingSkeleton";

describe("LoadingSkeleton", () => {
  it("renders with default height of 300", () => {
    const { container } = render(<LoadingSkeleton />);
    const div = container.firstChild as HTMLElement;
    expect(div.style.height).toBe("300px");
  });

  it("renders with custom height", () => {
    const { container } = render(<LoadingSkeleton height={400} />);
    const div = container.firstChild as HTMLElement;
    expect(div.style.height).toBe("400px");
  });

  it("has animate-pulse class for loading animation", () => {
    const { container } = render(<LoadingSkeleton />);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain("animate-pulse");
  });

  it("renders inner placeholder elements", () => {
    const { container } = render(<LoadingSkeleton />);
    const children = (container.firstChild as HTMLElement).children;
    expect(children.length).toBeGreaterThanOrEqual(1);
  });
});