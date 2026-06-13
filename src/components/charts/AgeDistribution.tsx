import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "../ui/Card";
import type { Player } from "../../types";
import { ageBrackets } from "../../utils/data-transformers";

interface AgeDistributionProps {
  data: Player[];
}

export function AgeDistribution({ data }: AgeDistributionProps) {
  const brackets = ageBrackets(data);

  return (
    <Card title="Age Distribution" subtitle="Players grouped by age bracket">
      <div className="h-72" role="img" aria-label="Age distribution chart: Under 20, 21–25, 26–30, 31–35, Over 35">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={brackets} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
            <YAxis tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                color: "var(--color-text-primary)",
              }}
            />
            <Bar dataKey="count" fill="var(--color-accent)" radius={[4, 4, 0, 0]} name="Players" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}