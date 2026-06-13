import { useState, useEffect } from "react";
import type { NavSection } from "../../types";

interface StickyNavProps {
  sections: NavSection[];
}

export function StickyNav({ sections }: StickyNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-border)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12">
        <span className="text-sm font-semibold text-[var(--color-text-primary)] whitespace-nowrap">
          2026 WC Dashboard
        </span>

        <button
          className="sm:hidden p-2 rounded-lg hover:bg-[var(--color-border)]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg className="w-5 h-5 text-[var(--color-text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className="hidden sm:flex gap-1 overflow-x-auto">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors duration-200 ${
                activeId === s.id
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)]"
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-[var(--color-border)] px-4 py-2 flex flex-col gap-1">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                activeId === s.id
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}