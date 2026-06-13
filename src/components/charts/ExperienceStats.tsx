import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "../ui/Card";
import type { Player } from "../../types";
import { experienceStats } from "../../utils/data-transformers";

interface ExperienceStatsProps {
  data: Player[];
}

export function ExperienceStats({ data }: ExperienceStatsProps) {
  const stats = experienceStats(data);
  const chartData = [
    { name: "First Timers", value: stats.firstTimers },
    { name: "Veterans", value: stats.veterans },
  ];

  return (
    <Card title="World Cup Experience" subtitle="First-time participants vs multi-tournament veterans">
      <div className="h-72" role="img" aria-label={`Experience breakdown: ${stats.firstTimers} first-timers, ${stats.veterans} veterans`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              label={({ name, value }) => `${name}: ${value}`}
            >
              <Cell fill="oklch(65% 0.18 150)" />
              <Cell fill="oklch(65% 0.18 250)" />
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