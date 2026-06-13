import { useState, useRef, useEffect, useCallback, useId } from "react";

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
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder;

  const selectOption = useCallback(
    (val: string) => {
      onChange(val);
      setQuery("");
      setOpen(false);
      setHighlightIndex(-1);
      inputRef.current?.focus();
    },
    [onChange]
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setOpen(true);
        setHighlightIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < filtered.length) {
          selectOption(filtered[highlightIndex]!.value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setHighlightIndex(-1);
        break;
    }
  };

  // Reset highlight when query changes
  useEffect(() => {
    setHighlightIndex(-1);
  }, [query]);

  const activeDescendant =
    open && highlightIndex >= 0 && filtered[highlightIndex]
      ? `${listId}-option-${highlightIndex}`
      : undefined;

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <input
        ref={inputRef}
        type="text"
        value={open ? query : selectedLabel}
        placeholder={placeholder}
        onFocus={() => { setOpen(true); setQuery(""); }}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-colors duration-200"
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={activeDescendant}
        aria-autocomplete="list"
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] shadow-lg"
        >
          {filtered.map((o, i) => (
            <li
              key={o.value}
              id={`${listId}-option-${i}`}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors duration-100 ${
                i === highlightIndex
                  ? "bg-[var(--color-accent)] text-white"
                  : o.value === value
                    ? "bg-[var(--color-border)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-primary)] hover:bg-[var(--color-border)]"
              }`}
              role="option"
              aria-selected={o.value === value}
              onClick={() => selectOption(o.value)}
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