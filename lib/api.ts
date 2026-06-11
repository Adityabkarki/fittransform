/**
 * Cloud sync layer — offline-first.
 * Every function silently no-ops if the user is not logged in or has no network.
 * Local AsyncStorage is always the source of truth; cloud is the backup/sync layer.
 */
import { pb, currentUserId } from "./pb";
import type { DayLog } from "./storage";

// ── Workout logs ──────────────────────────────────────────────────────────────

export async function pushWorkoutLog(date: string, log: DayLog): Promise<string | null> {
  const uid = currentUserId();
  if (!uid) return null;
  try {
    const existing = await findWorkoutLog(date, uid);
    const payload = {
      user_id: uid,
      date,
      mode: log.mode,
      session: log.session,
      sets: log.sets,
      done: log.done,
    };
    if (existing) {
      await pb.collection("workout_logs").update(existing.id, payload);
      return existing.id;
    } else {
      const rec = await pb.collection("workout_logs").create(payload);
      return rec.id;
    }
  } catch {
    return null;
  }
}

async function findWorkoutLog(date: string, uid: string) {
  try {
    const res = await pb.collection("workout_logs").getFirstListItem(
      `user_id = "${uid}" && date = "${date}"`
    );
    return res;
  } catch {
    return null;
  }
}

export async function fetchAllWorkoutLogs(): Promise<Record<string, DayLog>> {
  const uid = currentUserId();
  if (!uid) return {};
  try {
    const records = await pb.collection("workout_logs").getFullList({
      filter: `user_id = "${uid}"`,
      sort: "date",
    });
    const out: Record<string, DayLog> = {};
    for (const r of records) {
      out[r.date] = {
        cloudId: r.id,
        mode: r.mode,
        session: r.session,
        sets: r.sets || {},
        done: r.done,
      };
    }
    return out;
  } catch {
    return {};
  }
}

// ── Diet logs ─────────────────────────────────────────────────────────────────

export async function pushDietLog(date: string, items: Record<string, boolean>): Promise<void> {
  const uid = currentUserId();
  if (!uid) return;
  try {
    const existing = await findDietLog(date, uid);
    const payload = { user_id: uid, date, items };
    if (existing) {
      await pb.collection("diet_logs").update(existing.id, payload);
    } else {
      await pb.collection("diet_logs").create(payload);
    }
  } catch {}
}

async function findDietLog(date: string, uid: string) {
  try {
    return await pb.collection("diet_logs").getFirstListItem(
      `user_id = "${uid}" && date = "${date}"`
    );
  } catch {
    return null;
  }
}

export async function fetchAllDietLogs(): Promise<Record<string, Record<string, boolean>>> {
  const uid = currentUserId();
  if (!uid) return {};
  try {
    const records = await pb.collection("diet_logs").getFullList({
      filter: `user_id = "${uid}"`,
    });
    const out: Record<string, Record<string, boolean>> = {};
    for (const r of records) out[r.date] = r.items || {};
    return out;
  } catch {
    return {};
  }
}
