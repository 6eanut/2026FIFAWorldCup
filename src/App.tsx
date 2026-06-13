import { usePlayers } from "./hooks/usePlayers";
import { useDarkMode } from "./hooks/useDarkMode";
import { AppShell } from "./components/layout/AppShell";
import { StickyNav } from "./components/layout/StickyNav";
import { Footer } from "./components/layout/Footer";
import { DarkModeToggle } from "./components/ui/DarkModeToggle";
import { ErrorState } from "./components/ui/ErrorState";
import { LoadingSkeleton } from "./components/ui/LoadingSkeleton";
import { AgeDistribution } from "./components/charts/AgeDistribution";
import { LeagueDistribution } from "./components/charts/LeagueDistribution";
import { ClubTop20 } from "./components/charts/ClubTop20";
import { ConfederationDistribution } from "./components/charts/ConfederationDistribution";
import { ExperienceStats } from "./components/charts/ExperienceStats";
import { MarketValueHistogram } from "./components/charts/MarketValueHistogram";
import { TeamAnalysis } from "./components/charts/TeamAnalysis";
import { TopRankings } from "./components/charts/TopRankings";
import type { NavSection } from "./types";

const SECTIONS: NavSection[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "age", label: "Age" },
  { id: "league", label: "Leagues" },
  { id: "club", label: "Top Clubs" },
  { id: "confederation", label: "Confederations" },
  { id: "experience", label: "Experience" },
  { id: "value", label: "Market Value" },
  { id: "team", label: "Team Analysis" },
  { id: "ranking", label: "Rankings" },
];

export default function App() {
  const { players, isLoading, error } = usePlayers();
  const { isDark, toggle } = useDarkMode();

  if (error) {
    return (
      <AppShell>
        <ErrorState message={error} onReload={() => window.location.reload()} />
      </AppShell>
    );
  }

  if (isLoading || !players) {
    return (
      <AppShell>
        <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingSkeleton key={i} height={300} />
          ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <StickyNav sections={SECTIONS} />
      <div className="flex justify-end max-w-7xl mx-auto px-4 pt-2">
        <DarkModeToggle isDark={isDark} onToggle={toggle} />
      </div>
      <main className="max-w-7xl mx-auto p-4 space-y-12">
        <section id="dashboard" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          <AgeDistribution data={players} />
          <LeagueDistribution data={players} />
          <ConfederationDistribution data={players} />
          <ExperienceStats data={players} />
          <ClubTop20 data={players} />
          <MarketValueHistogram data={players} />
        </section>

        <section id="age"><AgeDistribution data={players} /></section>
        <section id="league"><LeagueDistribution data={players} /></section>
        <section id="club"><ClubTop20 data={players} /></section>
        <section id="confederation"><ConfederationDistribution data={players} /></section>
        <section id="experience"><ExperienceStats data={players} /></section>
        <section id="value"><MarketValueHistogram data={players} /></section>

        <section id="team" className="max-w-2xl mx-auto">
          <TeamAnalysis data={players} />
        </section>

        <section id="ranking" className="max-w-2xl mx-auto">
          <TopRankings data={players} />
        </section>
      </main>
      <Footer />
    </AppShell>
  );
}