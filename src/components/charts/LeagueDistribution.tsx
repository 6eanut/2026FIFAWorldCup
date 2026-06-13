import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card } from "../ui/Card";
import type { Player } from "../../types";
import { leagueGroups } from "../../utils/data-transformers";
import { chartColors, isDarkMode } from "../../utils/chart-helpers";

interface LeagueDistributionProps {
  data: Player[];
}

export function LeagueDistribution({ data }: LeagueDistributionProps) {
  const groups = leagueGroups(data);
  const colors = chartColors(isDarkMode());

  return (
    <Card title="League Distribution" subtitle="Big Five leagues shown individually, others aggregated">
      <div className="h-72" role="img" aria-label="League distribution: Big Five leagues plus Other Leagues">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={groups}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => (name && percent !== undefined) ? `${name} ${(percent * 100).toFixed(0)}%` : ""}
              labelLine={{ stroke: "var(--color-text-secondary)" }}
            >
              {groups.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                color: "var(--color-text-primary)",
              }}
            />
            <Legend
              formatter={(value: string) => (
                <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}