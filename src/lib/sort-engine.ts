/**
 * Adaptive pairwise-comparison ranking engine.
 *
 * We assume a total order (full transitivity, no rock-paper-scissors loops)
 * and want to recover the exact ranking of n participants using as few
 * head-to-head duels as possible.
 *
 * Algorithm: binary insertion sort. We keep a growing sorted list; each new
 * participant is placed into it via binary search, so each insertion costs
 * O(log k) duels instead of O(k). This never asks a question that
 * transitivity has already answered, and totals ~n*log2(n) duels instead of
 * the n*(n-1)/2 duels a full round robin would need.
 *
 * It's implemented as a generator so a UI can drive it one duel at a time:
 * call .next() with no args to get the next duel request, then call
 * .next(didAWin) with the human's answer to resume.
 */

export interface Duel<T> {
  a: T;
  b: T;
}

export type DuelResult = { winnerIsA: boolean };

/**
 * Yields Duel<T> requests and expects a boolean back via generator.next():
 * true if `a` beat `b`, false if `b` beat `a`.
 * Returns the fully sorted array, best (index 0) to worst.
 */
export function* rankGenerator<T>(
  items: T[],
): Generator<Duel<T>, T[], boolean> {
  if (items.length <= 1) return [...items];

  const sorted: T[] = [items[0]];

  for (let i = 1; i < items.length; i++) {
    const candidate = items[i];
    let lo = 0;
    let hi = sorted.length; // insertion index range [lo, hi)

    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      // Ask: does candidate outrank sorted[mid]?
      const candidateWins: boolean = yield { a: candidate, b: sorted[mid] };
      if (candidateWins) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }

    sorted.splice(lo, 0, candidate);
  }

  return sorted;
}

/** Theoretical minimum duels needed in the worst case: ceil(log2(n!)). */
export function minimumPossibleDuels(n: number): number {
  if (n <= 1) return 0;
  let logFactorial = 0;
  for (let k = 2; k <= n; k++) logFactorial += Math.log2(k);
  return Math.ceil(logFactorial);
}

/** What a naive full round-robin would have cost: n*(n-1)/2. */
export function roundRobinDuels(n: number): number {
  return (n * (n - 1)) / 2;
}

/** A practical estimate of what our binary-insertion approach will use: sum ceil(log2(k)) for k=1..n. */
export function estimatedDuels(n: number): number {
  let total = 0;
  for (let k = 2; k <= n; k++) total += Math.ceil(Math.log2(k));
  return total;
}
