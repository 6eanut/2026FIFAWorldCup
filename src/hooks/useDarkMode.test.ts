import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDarkMode } from "./useDarkMode";

describe("useDarkMode", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("defaults to light mode when no stored preference", () => {
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(false);
  });

  it("respects stored dark preference in localStorage", () => {
    localStorage.setItem("theme", "dark");
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(true);
  });

  it("respects stored light preference in localStorage", () => {
    localStorage.setItem("theme", "light");
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(false);
  });

  it("toggle switches from light to dark", () => {
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.isDark).toBe(true);
  });

  it("toggle switches from dark to light", () => {
    localStorage.setItem("theme", "dark");
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isDark).toBe(false);
  });

  it("adds dark class to documentElement when dark", () => {
    const { result } = renderHook(() => useDarkMode());
    act(() => result.current.toggle());
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes dark class from documentElement when light", () => {
    localStorage.setItem("theme", "dark");
    renderHook(() => useDarkMode());
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("persists preference to localStorage on toggle", () => {
    const { result } = renderHook(() => useDarkMode());
    act(() => result.current.toggle());
    expect(localStorage.getItem("theme")).toBe("dark");
    act(() => result.current.toggle());
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("toggle reference is stable across renders", () => {
    const { result, rerender } = renderHook(() => useDarkMode());
    const firstToggle = result.current.toggle;
    rerender();
    expect(result.current.toggle).toBe(firstToggle);
  });
});