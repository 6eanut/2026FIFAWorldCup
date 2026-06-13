import { Card } from "../ui/Card";
import type { Player } from "../../types";
import { topRankings } from "../../utils/data-transformers";

interface TopRankingsProps {
  data: Player[];
}

export function TopRankings({ data }: TopRankingsProps) {
  const rankings = topRankings(data);

  return (
    <div className="space-y-4">
      {rankings.map((list) => (
        <Card key={list.title} title={list.title} subtitle={list.metric}>
          <ol className="space-y-1.5" role="list" aria-label={list.title}>
            {list.entries.map((entry) => (
              <li
                key={entry.rank}
                className="flex items-center gap-3 text-sm py-1 px-2 rounded-lg hover:bg-[var(--color-border)] transition-colors duration-100"
              >
                <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-white text-xs flex items-center justify-center font-semibold shrink-0">
                  {entry.rank}
                </span>
                <span className="text-[var(--color-text-primary)] font-medium flex-1">
                  {entry.name}
                </span>
                {entry.nationality && (
                  <span className="text-[var(--color-text-secondary)] text-xs">
                    {entry.nationality}
                  </span>
                )}
                <span className="text-[var(--color-accent)] font-semibold text-xs">
                  {entry.value}
                </span>
              </li>
            ))}
          </ol>
        </Card>
      ))}
    </div>
  );
}