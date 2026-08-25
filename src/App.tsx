import { useState } from "react";
import { DuelScreen } from "./components/duel";
import { LedgerBar } from "./components/ledger";
import { ResultsScreen } from "./components/results";
import { SetupScreen } from "./components/setup";
import {
  estimatedDuels,
  minimumPossibleDuels,
  roundRobinDuels,
} from "./lib/sort-engine";
import { useRankEngine } from "./lib/use-rank-engine";
import { shuffled } from "./lib/utils";
import type { Participant, Stage } from "./types";

export default function App() {
  const [stage, setStage] = useState<Stage>("setup");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [entrantCount, setEntrantCount] = useState(0);

  const engine = useRankEngine();

  const beginDuels = () => {
    const order = shuffled(participants);
    setEntrantCount(order.length);
    engine.start(order);
    setStage("dueling");
  };

  const restart = () => {
    engine.reset();
    setParticipants([]);
    setEntrantCount(0);
    setStage("setup");
  };

  const isDone = engine.result !== null;
  const n = stage === "setup" ? participants.length : entrantCount;
  const estimate = Math.max(estimatedDuels(n), minimumPossibleDuels(n));
  const roundRobin = roundRobinDuels(n);

  return (
    <main className="flex min-h-screen flex-col bg-ink">
      <LedgerBar
        duelsSoFar={stage === "dueling" ? engine.duelsSoFar : undefined}
        estimate={stage === "dueling" ? estimate : undefined}
        roundRobin={stage === "dueling" ? roundRobin : undefined}
      />

      {stage === "setup" && (
        <SetupScreen
          participants={participants}
          onChange={setParticipants}
          onBegin={beginDuels}
        />
      )}

      {stage === "dueling" && !isDone && engine.currentDuel && (
        <DuelScreen
          a={engine.currentDuel.a}
          b={engine.currentDuel.b}
          onChoose={engine.choose}
          duelsSoFar={engine.duelsSoFar}
          estimate={estimate}
        />
      )}

      {stage === "dueling" && isDone && engine.result && (
        <ResultsScreen
          ranking={engine.result}
          duelsUsed={engine.duelsSoFar}
          onRestart={restart}
        />
      )}
    </main>
  );
}
