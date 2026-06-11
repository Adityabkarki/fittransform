import type { SessionKey } from "./plans";

export const GAINS: Record<SessionKey, { str: number; sta: number; end: number; vo2: number; kcal: number }> = {
  A: { str: 2.1, sta: 0.6, end: 0.6, vo2: 0.3, kcal: 280 },
  B: { str: 2.1, sta: 0.6, end: 0.6, vo2: 0.3, kcal: 290 },
  C: { str: 2.3, sta: 0.9, end: 1.0, vo2: 0.5, kcal: 330 },
  D: { str: 2.5, sta: 0.6, end: 0.7, vo2: 0.3, kcal: 285 },
  E: { str: 0.6, sta: 2.2, end: 2.2, vo2: 2.6, kcal: 360 },
  F: { str: 0.3, sta: 1.0, end: 1.0, vo2: 1.0, kcal: 240 },
};

export const DECAY = 0.35;
