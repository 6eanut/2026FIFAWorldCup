import { useState } from "react";
import { Card } from "../ui/Card";
import { SearchableDropdown } from "../ui/SearchableDropdown";
import type { Player } from "../../types";
import { distinctTeams, teamData } from "../../utils/data-transformers";

interface TeamAnalysisProps {
  data: Player[];
}

export function TeamAnalysis({ data }: TeamAnalysisProps) {
  const teams = distinctTeams(data);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const analysis = selectedTeam ? teamData(data, selectedTeam) : null;

  return (
    <Card title="National Team Analysis" subtitle="Select a team to view squad structure">
      <SearchableDropdown
        options={teams}
        value={selectedTeam}
        onChange={setSelectedTeam}
        placeholder="Search for a team..."
      />

      {analysis && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBox label="Squad Size" value={analysis.playerCount.toString()} />
            <StatBox label="Avg Age" value={analysis.averageAge.toString()} />
            <StatBox label="Age Range" value={`${analysis.ageRange[0]}–${analysis.ageRange[1]}`} />
            <StatBox
              label="Domestic / Foreign"
              value={`${analysis.domesticLeagueCount} / ${analysis.foreignLeagueCount}`}
            />
          </div>

          {analysis.topClubs.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">Top Clubs</h4>
              <ul className="space-y-1">
                {analysis.topClubs.map((c) => (
                  <li key={c.name} className="text-sm text-[var(--color-text-primary)] flex justify-between">
                    <span>{c.name}</span>
                    <span className="text-[var(--color-text-secondary)]">{c.count} players</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!analysis && (
        <p className="text-sm text-[var(--color-text-secondary)] mt-4">
          Choose a national team to see detailed squad analysis.
        </p>
      )}
    </Card>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] p-3 text-center">
      <p className="text-xs text-[var(--color-text-secondary)]">{label}</p>
      <p className="text-lg font-semibold text-[var(--color-text-primary)]">{value}</p>
    </div>
  );
}