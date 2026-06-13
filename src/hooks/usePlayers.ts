import { useState, useEffect } from "react";
import type { Player } from "../types";
import playersData from "../data/players.json";

export interface UsePlayersResult {
  players: Player[] | null;
  isLoading: boolean;
  error: string | null;
}

export function usePlayers(): UsePlayersResult {
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = playersData as Player[];
      const seen = new Set<string>();
      const deduped = data.filter((p) => {
        if (seen.has(p.id)) {
          console.warn(`Duplicate player ID: ${p.id} — keeping first occurrence`);
          return false;
        }
        seen.add(p.id);
        return true;
      });
      setPlayers(deduped);
      setError(null);
    } catch (e) {
      setError("Unable to load data. Please check your connection and reload the page.");
      setPlayers(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { players, isLoading, error };
}