import { useState, useEffect, useRef, useCallback } from "react";

export interface UseChartDimensionsResult {
  width: number;
  height: number;
  ref: React.RefCallback<HTMLDivElement>;
}

export function useChartDimensions(height: number = 300): UseChartDimensionsResult {
  const [width, setWidth] = useState(0);
  const observerRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect();
      if (node) {
        observerRef.current = new ResizeObserver((entries) => {
          const entry = entries[0];
          if (entry) {
            setWidth(entry.contentRect.width);
          }
        });
        observerRef.current.observe(node);
        setWidth(node.clientWidth);
      }
    },
    []
  );

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return { width, height, ref };
}