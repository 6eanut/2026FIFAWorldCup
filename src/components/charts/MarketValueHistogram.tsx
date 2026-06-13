import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "../ui/Card";
import type { Player } from "../../types";
import { marketValueBands, excludedMarketValueCount } from "../../utils/data-transformers";

interface MarketValueHistogramProps {
  data: Player[];
}

export function MarketValueHistogram({ data }: MarketValueHistogramProps) {
  const bands = marketValueBands(data);
  const excluded = excludedMarketValueCount(data);

  return (
    <Card title="Market Value Distribution" subtitle="Players grouped by transfer market value">
      <div className="h-72" role="img" aria-label="Market value bands from under 1M to over 100M euros">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bands} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }} />
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
      {excluded > 0 && (
        <p className="text-xs text-[var(--color-text-secondary)] mt-2 italic">
          * {excluded} player{excluded > 1 ? "s" : ""} excluded — market value unavailable
        </p>
      )}
    </Card>
  );
}