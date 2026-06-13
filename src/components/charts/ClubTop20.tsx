import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "../ui/Card";
import type { Player } from "../../types";
import { topClubs } from "../../utils/data-transformers";

interface ClubTop20Props {
  data: Player[];
}

export function ClubTop20({ data }: ClubTop20Props) {
  const clubs = topClubs(data, 20);

  return (
    <Card title="Top 20 Clubs" subtitle="Clubs with the most players at the tournament">
      <div className="h-[500px]" role="img" aria-label="Top 20 clubs by player representation">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={clubs} layout="vertical" margin={{ top: 8, right: 8, bottom: 8, left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis type="number" tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
            <YAxis
              dataKey="clubName"
              type="category"
              tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                color: "var(--color-text-primary)",
              }}
            />
            <Bar dataKey="playerCount" fill="var(--color-accent)" radius={[0, 4, 4, 0]} name="Players" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}