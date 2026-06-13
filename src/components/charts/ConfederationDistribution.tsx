import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "../ui/Card";
import type { Player } from "../../types";
import { confederationStats } from "../../utils/data-transformers";
import { confederationColor } from "../../utils/chart-helpers";

interface ConfederationDistributionProps {
  data: Player[];
}

export function ConfederationDistribution({ data }: ConfederationDistributionProps) {
  const stats = confederationStats(data);

  return (
    <Card title="Confederation Distribution" subtitle="Players per FIFA confederation">
      <div className="h-72" role="img" aria-label="Confederation distribution: UEFA, CONMEBOL, CAF, AFC, CONCACAF">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={stats}
              dataKey="playerCount"
              nameKey="code"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              label={({ name, value }) => `${name} ${value}`}
            >
              {stats.map((s) => (
                <Cell key={s.code} fill={confederationColor(s.code, false)} />
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
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}