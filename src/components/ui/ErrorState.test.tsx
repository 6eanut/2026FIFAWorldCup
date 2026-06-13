import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("renders error heading", () => {
    render(<ErrorState message="Something went wrong" />);
    expect(screen.getByText("Unable to load data")).toBeInTheDocument();
  });

  it("renders error message", () => {
    render(<ErrorState message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("does not render reload button when onReload is omitted", () => {
    render(<ErrorState message="Error" />);
    expect(screen.queryByText("Reload")).toBeNull();
  });

  it("renders reload button when onReload is provided", () => {
    render(<ErrorState message="Error" onReload={vi.fn()} />);
    expect(screen.getByText("Reload")).toBeInTheDocument();
  });

  it("calls onReload when reload button is clicked", async () => {
    const onReload = vi.fn();
    const user = userEvent.setup();
    render(<ErrorState message="Error" onReload={onReload} />);
    await user.click(screen.getByText("Reload"));
    expect(onReload).toHaveBeenCalledOnce();
  });

  it("renders warning icon", () => {
    render(<ErrorState message="Error" />);
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});