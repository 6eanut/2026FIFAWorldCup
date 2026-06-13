interface LoadingSkeletonProps {
  height?: number;
}

export function LoadingSkeleton({ height = 300 }: LoadingSkeletonProps) {
  return (
    <div
      className="rounded-2xl shadow-sm border border-[var(--color-border)] bg-[var(--color-card)] p-5 animate-pulse"
      style={{ height }}
    >
      <div className="h-5 w-1/3 bg-[var(--color-border)] rounded mb-4" />
      <div className="h-full w-full bg-[var(--color-border)] rounded-lg" />
    </div>
  );
}