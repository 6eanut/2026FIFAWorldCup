import type { ReactNode } from "react";

interface CardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, subtitle, children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl shadow-sm border border-[var(--color-border)] bg-[var(--color-card)] p-5 transition-colors duration-200 ${className}`}
    >
      <div className="mb-3">
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}