import { useCallback, useMemo, useRef, useState } from "react";
import type { Participant } from "../types";
import { type Duel, rankGenerator } from "./sort-engine";

interface EngineState {
  currentDuel: Duel<Participant> | null;
  result: Participant[] | null;
  duelsSoFar: number;
}

export function useRankEngine() {
  const genRef = useRef<Generator<
    Duel<Participant>,
    Participant[],
    boolean
  > | null>(null);
  const [state, setState] = useState<EngineState>({
    currentDuel: null,
    result: null,
    duelsSoFar: 0,
  });

  const start = useCallback((participants: Participant[]) => {
    const gen = rankGenerator(participants);
    genRef.current = gen;
    const first = gen.next();
    setState({
      currentDuel: first.done ? null : first.value,
      result: first.done ? (first.value as Participant[]) : null,
      duelsSoFar: 0,
    });
  }, []);

  const choose = useCallback((winnerIsA: boolean) => {
    const gen = genRef.current;
    if (!gen) return;
    const next = gen.next(winnerIsA);
    setState((prev) => ({
      currentDuel: next.done ? null : next.value,
      result: next.done ? (next.value as Participant[]) : null,
      duelsSoFar: prev.duelsSoFar + 1,
    }));
  }, []);

  const reset = useCallback(() => {
    genRef.current = null;
    setState({ currentDuel: null, result: null, duelsSoFar: 0 });
  }, []);

  return useMemo(
    () => ({
      currentDuel: state.currentDuel,
      result: state.result,
      duelsSoFar: state.duelsSoFar,
      start,
      choose,
      reset,
    }),
    [state, start, choose, reset],
  );
}
