import { Scale } from "lucide-react";

interface LedgerBarProps {
  duelsSoFar?: number;
  estimate?: number;
  roundRobin?: number;
}

export function LedgerBar({
  duelsSoFar,
  estimate,
  roundRobin,
}: LedgerBarProps) {
  const showTally =
    typeof duelsSoFar === "number" && typeof estimate === "number";

  return (
    <header className="flex items-center justify-between border-b border-paper-line/40 px-6 py-4 sm:px-10">
      <div className="flex items-center gap-2.5">
        <Scale className="h-5 w-5 text-gold" strokeWidth={1.75} />
        <span className="font-display text-xl font-semibold tracking-tight text-paper">
          Duello
        </span>
      </div>

      {showTally && (
        <div className="flex items-baseline gap-3 font-mono text-xs text-paper/70">
          <span className="hidden sm:inline text-paper/40">duels logged</span>
          <span className="text-sm text-gold">
            {String(duelsSoFar).padStart(2, "0")}
          </span>
          <span className="text-paper/30">/ ~{estimate}</span>
          {typeof roundRobin === "number" && (
            <span className="hidden text-paper/30 md:inline">
              (round robin would take {roundRobin})
            </span>
          )}
        </div>
      )}
    </header>
  );
}
