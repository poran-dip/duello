import { Award, Check, Copy, Medal, RotateCcw, Trophy } from "lucide-react";
import { useState } from "react";
import type { Participant } from "../types";

interface ResultsScreenProps {
  ranking: Participant[];
  duelsUsed: number;
  onRestart: () => void;
}

export function ResultsScreen({
  ranking,
  duelsUsed,
  onRestart,
}: ResultsScreenProps) {
  const [copied, setCopied] = useState(false);

  const copyList = async () => {
    const text = ranking.map((p, i) => `${i + 1}. ${p.name}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-10 sm:px-10">
      <div className="mb-8">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">
          final ledger
        </p>
        <h1 className="font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
          The full order, decided.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-paper/60">
          Settled in {duelsUsed} duel{duelsUsed === 1 ? "" : "s"} — every
          remaining relationship followed from transitivity, so nothing else
          needed to be asked.
        </p>
      </div>

      <ol className="flex-1 divide-y divide-paper-line/15">
        {ranking.map((p, i) => (
          <li key={p.id} className="flex items-center gap-4 py-3.5">
            <span className="flex w-8 shrink-0 justify-center">
              <RankBadge rank={i + 1} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg font-medium text-paper">
                {p.name}
              </p>
              {p.notes && (
                <p className="truncate font-body text-xs text-paper/45">
                  {p.notes}
                </p>
              )}
            </div>
            <span className="shrink-0 font-mono text-xs text-paper/30">
              #{String(i + 1).padStart(2, "0")}
            </span>
          </li>
        ))}
      </ol>

      <div className="sticky bottom-0 mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-paper-line/20 bg-ink pt-5">
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-2 rounded-md border border-paper-line/30 px-4 py-2.5 font-body text-sm text-paper/80 transition hover:border-gold hover:text-gold"
        >
          <RotateCcw className="h-4 w-4" />
          Start a new ranking
        </button>
        <button
          type="button"
          onClick={copyList}
          className="flex items-center gap-2 rounded-md bg-gold px-4 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-gold-soft"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "Copied" : "Copy list"}
        </button>
      </div>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return <Trophy className="h-5 w-5 text-gold" strokeWidth={1.75} />;
  if (rank === 2)
    return <Medal className="h-5 w-5 text-paper/70" strokeWidth={1.75} />;
  if (rank === 3)
    return <Award className="h-5 w-5 text-[#B08D57]" strokeWidth={1.75} />;
  return <span className="font-mono text-xs text-paper/30">{rank}</span>;
}
