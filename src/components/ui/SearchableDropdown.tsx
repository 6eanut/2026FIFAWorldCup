import { useState, useRef, useEffect } from "react";

interface SearchableDropdownProps {
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Search...",
}: SearchableDropdownProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder;

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={open ? query : selectedLabel}
        placeholder={placeholder}
        onFocus={() => { setOpen(true); setQuery(""); }}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-colors duration-200"
        role="combobox"
        aria-expanded={open}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] shadow-lg">
          {filtered.map((o) => (
            <li
              key={o.value}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors duration-100 hover:bg-[var(--color-border)] text-[var(--color-text-primary)] ${
                o.value === value ? "bg-[var(--color-border)]" : ""
              }`}
              role="option"
              aria-selected={o.value === value}
              onClick={() => {
                onChange(o.value);
                setQuery("");
                setOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onChange(o.value);
                  setQuery("");
                  setOpen(false);
                }
              }}
              tabIndex={0}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
      {open && query && filtered.length === 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] shadow-lg px-3 py-2 text-sm text-[var(--color-text-secondary)]">
          No teams found
        </div>
      )}
    </div>
  );
}