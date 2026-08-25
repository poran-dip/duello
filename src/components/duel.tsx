import { useEffect } from "react";
import type { Participant } from "../types";

interface DuelScreenProps {
  a: Participant;
  b: Participant;
  onChoose: (winnerIsA: boolean) => void;
  duelsSoFar: number;
  estimate: number;
}

export function DuelScreen({
  a,
  b,
  onChoose,
  duelsSoFar,
  estimate,
}: DuelScreenProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onChoose(true);
      if (e.key === "ArrowRight") onChoose(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onChoose]);

  const progressPct = Math.min(
    100,
    Math.round((duelsSoFar / Math.max(1, estimate)) * 100),
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10">
      <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-gold">
        which one wins?
      </p>
      <p className="mb-10 font-body text-xs text-paper/60">
        use ← / → or click a card
      </p>

      <div className="flex w-full max-w-3xl items-stretch justify-center gap-4 sm:gap-8">
        <DuelCard
          participant={a}
          onClick={() => onChoose(true)}
          align="right"
        />

        <div className="flex shrink-0 flex-col items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-ink font-mono text-xs font-semibold text-gold">
            VS
          </div>
        </div>

        <DuelCard
          participant={b}
          onClick={() => onChoose(false)}
          align="left"
        />
      </div>

      <div className="mt-12 w-full max-w-md">
        <div className="h-1 w-full overflow-hidden rounded-full bg-paper/10">
          <div
            className="h-full rounded-full bg-gold transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-2 text-center font-mono text-[11px] text-paper/60">
          roughly {Math.max(0, estimate - duelsSoFar)} duels likely remain
        </p>
      </div>
    </div>
  );
}

function DuelCard({
  participant,
  onClick,
  align,
}: {
  participant: Participant;
  onClick: () => void;
  align: "left" | "right";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group paper-texture flex min-h-55 flex-1 flex-col justify-center rounded-xl border-2 border-paper-line/25 bg-paper px-6 py-8 text-center transition hover:-translate-y-1 hover:border-gold hover:shadow-2xl hover:shadow-gold/10 active:translate-y-0 sm:min-h-65 sm:px-8"
    >
      <span
        className={`mb-3 self-center font-mono text-[10px] uppercase tracking-widest text-graphite/50`}
      >
        {align === "right" ? "contender A" : "contender B"}
      </span>
      <h2 className="font-display text-2xl font-semibold leading-snug text-ink transition group-hover:text-ink sm:text-3xl">
        {participant.name}
      </h2>
      {participant.notes && (
        <p className="mt-3 text-sm leading-relaxed text-graphite">
          {participant.notes}
        </p>
      )}
      <span className="mt-6 inline-block self-center rounded-full border border-ink/10 px-3 py-1 font-mono text-[10px] text-graphite/60 opacity-0 transition group-hover:opacity-100">
        pick this one
      </span>
    </button>
  );
}
