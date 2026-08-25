import { ClipboardPaste, Plus, Swords, X } from "lucide-react";
import { useState } from "react";
import { minimumPossibleDuels, roundRobinDuels } from "../lib/sort-engine";
import { makeId } from "../lib/utils";
import type { Participant } from "../types";

interface SetupScreenProps {
  participants: Participant[];
  onChange: (p: Participant[]) => void;
  onBegin: () => void;
}

export function SetupScreen({
  participants,
  onChange,
  onBegin,
}: SetupScreenProps) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");

  const addOne = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onChange([
      ...participants,
      { id: makeId(), name: trimmed, notes: notes.trim() || undefined },
    ]);
    setName("");
    setNotes("");
  };

  const addFromPaste = () => {
    const lines = pasteText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return;
    const added = lines.map((line) => ({ id: makeId(), name: line }));
    onChange([...participants, ...added]);
    setPasteText("");
    setPasteOpen(false);
  };

  const remove = (id: string) =>
    onChange(participants.filter((p) => p.id !== id));

  const canBegin = participants.length >= 2;
  const n = participants.length;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-10 sm:px-10">
      <div className="mb-8">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">
          the entrants
        </p>
        <h1 className="font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
          Who's competing for the ranking?
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-paper/80">
          Add everything you want ranked. You'll then judge a short series of
          one-on-one duels — no ballots, no scores, just "which one wins."
          Duello works out the full order from as few duels as the math allows.
        </p>
      </div>

      {/* entry form */}
      <div className="rounded-lg border border-paper-line/40 bg-ink-soft/60 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="participant" className="sr-only">
            Participant name
          </label>
          <input
            id="participant"
            name="participant"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addOne()}
            placeholder="Name"
            className="flex-1 rounded-md border border-paper-line/30 bg-paper/95 px-3.5 py-2.5 font-body text-sm text-ink placeholder:text-graphite/60 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
          <label htmlFor="description" className="sr-only">
            Description / notes
          </label>
          <input
            id="description"
            name="description"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addOne()}
            placeholder="Notes (optional)"
            className="flex-1 rounded-md border border-paper-line/30 bg-paper/95 px-3.5 py-2.5 font-body text-sm text-ink placeholder:text-graphite/60 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
          <button
            type="button"
            onClick={addOne}
            disabled={!name.trim()}
            className="flex items-center justify-center gap-1.5 rounded-md bg-gold px-4 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" strokeWidth={2.25} />
            Add
          </button>
        </div>

        <button
          type="button"
          onClick={() => setPasteOpen((v) => !v)}
          className="mt-3 flex items-center gap-1.5 font-mono text-xs text-paper/60 transition hover:text-gold"
        >
          <ClipboardPaste className="h-3.5 w-3.5" />
          {pasteOpen ? "hide paste box" : "paste a whole list instead"}
        </button>

        {pasteOpen && (
          <div className="mt-3 flex flex-col gap-2">
            <label htmlFor="bulk-participants" className="sr-only">
              Bulk add participants
            </label>
            <textarea
              id="bulk-participants"
              name="bulk-participants"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={
                "One entrant per line\ne.g.\nThe Godfather\nCasablanca\nParasite"
              }
              rows={4}
              className="w-full resize-none rounded-md border border-paper-line/30 bg-paper/95 px-3.5 py-2.5 font-body text-sm text-ink placeholder:text-graphite/50 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
            <button
              type="button"
              onClick={addFromPaste}
              disabled={!pasteText.trim()}
              className="self-start rounded-md border border-gold/50 px-3.5 py-1.5 font-mono text-xs text-gold transition hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              add these lines
            </button>
          </div>
        )}
      </div>

      {/* entrant ledger list */}
      <div className="mt-6 flex-1">
        {participants.length === 0 ? (
          <p className="rounded-lg border border-dashed border-paper-line/30 px-4 py-8 text-center font-mono text-xs text-paper/60">
            no entrants yet — add at least two to begin
          </p>
        ) : (
          <ol className="divide-y divide-paper-line/15">
            {participants.map((p, i) => (
              <li key={p.id} className="group flex items-center gap-4 py-2.5">
                <span className="w-6 shrink-0 text-right font-mono text-xs text-paper/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-body text-sm text-paper">
                    {p.name}
                  </p>
                  {p.notes && (
                    <p className="truncate font-body text-xs text-paper/60">
                      {p.notes}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  className="shrink-0 rounded p-1 text-paper/60 opacity-0 transition hover:text-gold group-hover:opacity-100"
                  aria-label={`Remove ${p.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* footer / begin */}
      <div className="sticky bottom-0 mt-8 flex items-center justify-between gap-4 border-t border-paper-line/20 bg-ink pt-5">
        <p className="font-mono text-xs text-paper/60">
          {n >= 2
            ? `${n} entrants · expect ~${minimumPossibleDuels(n)}-${estimatedRoundUp(n)} duels, worlds away from the ${roundRobinDuels(n)} a round robin needs`
            : "add at least two entrants"}
        </p>
        <button
          type="button"
          onClick={onBegin}
          disabled={!canBegin}
          className="flex shrink-0 items-center gap-2 rounded-md bg-gold px-5 py-2.5 font-body text-sm font-semibold text-ink shadow-lg shadow-gold/10 transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Swords className="h-4 w-4" strokeWidth={2.25} />
          Begin duels
        </button>
      </div>
    </div>
  );
}

function estimatedRoundUp(n: number) {
  let total = 0;
  for (let k = 2; k <= n; k++) total += Math.ceil(Math.log2(k));
  return total;
}
