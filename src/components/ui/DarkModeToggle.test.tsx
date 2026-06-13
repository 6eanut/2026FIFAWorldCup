import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DarkModeToggle } from "./DarkModeToggle";

describe("DarkModeToggle", () => {
  it("renders dark mode toggle button", () => {
    render(<DarkModeToggle isDark={false} onToggle={vi.fn()} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows switch-to-dark aria-label in light mode", () => {
    render(<DarkModeToggle isDark={false} onToggle={vi.fn()} />);
    expect(screen.getByLabelText("Switch to dark mode")).toBeInTheDocument();
  });

  it("shows switch-to-light aria-label in dark mode", () => {
    render(<DarkModeToggle isDark={true} onToggle={vi.fn()} />);
    expect(screen.getByLabelText("Switch to light mode")).toBeInTheDocument();
  });

  it("calls onToggle when clicked", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(<DarkModeToggle isDark={false} onToggle={onToggle} />);
    await user.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("renders an SVG icon inside the button", () => {
    render(<DarkModeToggle isDark={false} onToggle={vi.fn()} />);
    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});