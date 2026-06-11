import { GAINS, DECAY } from "../constants/gains";
import { ORDER } from "../constants/plans";
import type { AppData } from "./storage";

const dkey = (d: Date) => d.toISOString().slice(0, 10);
export const today = () => dkey(new Date());

export function computeProgress(data: AppData) {
  const logs = data.logs || {};
  const days = Object.keys(logs)
    .filter((k) => logs[k].done)
    .sort();

  let str = 18, sta = 14, end = 14, vo2 = 10, kcal = 0, workouts = 0;

  if (days.length) {
    const start = new Date(days[0] + "T12:00:00");
    const now = new Date(today() + "T12:00:00");
    for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
      const k = dkey(d);
      const log = logs[k];
      if (log && log.done) {
        const g = GAINS[log.session as keyof typeof GAINS] || GAINS.A;
        const m = log.mode === "home" ? 0.8 : 1;
        str = Math.min(100, str + g.str * m);
        sta = Math.min(100, sta + g.sta * m);
        end = Math.min(100, end + g.end * m);
        vo2 = Math.min(100, vo2 + g.vo2 * m);
        kcal += Math.round(g.kcal * (log.mode === "home" ? 0.85 : 1));
        workouts++;
      } else if (k !== today()) {
        str = Math.max(10, str - DECAY);
        sta = Math.max(8, sta - DECAY);
        end = Math.max(8, end - DECAY);
        vo2 = Math.max(6, vo2 - DECAY);
      }
    }
  }

  let streak = 0;
  for (let i = 0; ; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (logs[dkey(d)]?.done) streak++;
    else if (i > 0 && streak > 0) break;
    else if (i > 1) break;
  }

  return {
    str, sta, end, vo2, kcal, workouts, streak,
    fatKg: kcal / 7700,
    vo2ml: Math.min(46, 30 + vo2 * 0.12),
    pushupEst: Math.min(22, 8 + Math.round(str / 6)),
    pullupEst: Math.min(4, str / 28).toFixed(1),
  };
}

export function nextSession(data: AppData): string {
  const logs = data.logs || {};
  const done = Object.keys(logs).filter((k) => logs[k].done).sort();
  if (!done.length) return "A";
  const last = logs[done[done.length - 1]].session;
  const i = ORDER.indexOf(last as any);
  return ORDER[(i + 1) % 5];
}

export function fmtDate(k: string): string {
  return new Date(k + "T12:00:00").toLocaleDateString(undefined, {
    weekday: "long", day: "numeric", month: "short",
  });
}
