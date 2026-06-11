import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, ScrollView, Pressable, TextInput, Alert, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { C } from "../../constants/theme";
import { EX } from "../../constants/exercises";
import { PLAN, ORDER } from "../../constants/plans";
import { GAINS } from "../../constants/gains";
import { today, nextSession, fmtDate } from "../../lib/progress";
import { loadData, saveData } from "../../lib/storage";
import type { AppData, DayLog } from "../../lib/storage";
import { pushWorkoutLog, fetchAllWorkoutLogs } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import ExerciseSheet from "../../components/ExerciseSheet";
import type { PlanItem } from "../../constants/plans";

export default function TodayScreen() {
  const { userId } = useAuth();
  const [data, setDataRaw] = useState<AppData>({ logs: {}, diet: {} });
  const [loaded, setLoaded] = useState(false);
  const [sheet, setSheet] = useState<{ exId: string; meta?: PlanItem } | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadData().then(async (local) => {
      setDataRaw(local);
      setLoaded(true);
      // Background cloud sync — merges cloud logs into local without blocking UI
      if (userId) {
        try {
          const cloudLogs = await fetchAllWorkoutLogs();
          setDataRaw((prev) => {
            const merged = { ...prev.logs };
            for (const [date, log] of Object.entries(cloudLogs)) {
              if (!merged[date]) merged[date] = log;
            }
            const next = { ...prev, logs: merged };
            saveData(next);
            return next;
          });
        } catch {}
      }
    });
  }, [userId]);

  const setData = useCallback((fn: (prev: AppData) => AppData) => {
    setDataRaw((prev) => {
      const next = fn(prev);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        await saveData(next);
        // Push today's log to cloud after local save
        const tk = today();
        const todayLog = next.logs[tk];
        if (todayLog && userId) {
          pushWorkoutLog(tk, todayLog).catch(() => {});
        }
      }, 600);
      return next;
    });
  }, [userId]);

  const tk = today();
  const log: DayLog = data.logs?.[tk] || {
    mode: "gym",
    session: nextSession(data),
    sets: {},
    done: false,
  };

  const patch = (p: Partial<DayLog>) =>
    setData((d) => ({ ...d, logs: { ...(d.logs || {}), [tk]: { ...log, ...p } } }));

  const setSet = (exId: string, idx: number, field: "r" | "w", val: string) => {
    const arr = [...(log.sets[exId] || [])];
    arr[idx] = { ...(arr[idx] || {}), [field]: val };
    patch({ sets: { ...log.sets, [exId]: arr } });
  };

  if (!loaded) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.center}>
          <Text style={{ color: C.dim }}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const plan = PLAN[log.mode][log.session as keyof typeof PLAN["gym"]];
  const doneCount = plan.items.filter(
    (it) => (log.sets[it.ex] || []).some((s) => s && (s.r || s.w))
  ).length;

  const finish = () => {
    const g = GAINS[log.session as keyof typeof GAINS] || GAINS.A;
    const m = log.mode === "home" ? 0.8 : 1;
    patch({ done: true });
    setTimeout(() => {
      Alert.alert(
        "Workout logged! 💪",
        `≈ ${Math.round(g.kcal * (log.mode === "home" ? 0.85 : 1))} kcal burned\n` +
        `Strength +${(g.str * m).toFixed(1)}  ·  Stamina +${(g.sta * m).toFixed(1)}\n` +
        `Endurance +${(g.end * m).toFixed(1)}  ·  VO₂max +${(g.vo2 * m).toFixed(1)}\n\n` +
        `Now: whey + creatine, then dinner.`
      );
    }, 50);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.dateTag}>{fmtDate(tk)}</Text>
        <Text style={styles.heading}>Today's session</Text>

        {/* Mode selector */}
        <View style={styles.modeRow}>
          <Pressable
            style={[styles.modeBtn, log.mode === "gym" && styles.modeBtnOn]}
            onPress={() => patch({ mode: "gym" })}
          >
            <Text style={[styles.modeTxt, log.mode === "gym" && styles.modeTxtOn]}>🏋️ Gym</Text>
          </Pressable>
          <Pressable
            style={[styles.modeBtn, log.mode === "home" && styles.modeBtnTeal]}
            onPress={() => patch({ mode: "home" })}
          >
            <Text style={[styles.modeTxt, log.mode === "home" && styles.modeTxtTeal]}>🏠 Home</Text>
          </Pressable>
        </View>

        {/* Session selector */}
        <View style={styles.sessionRow}>
          {ORDER.map((s) => (
            <Pressable
              key={s}
              style={[styles.chip, log.session === s && styles.chipOn]}
              onPress={() => patch({ session: s })}
            >
              <Text style={[styles.chipTxt, log.session === s && styles.chipTxtOn]}>{s}</Text>
            </Pressable>
          ))}
        </View>

        {/* Day card */}
        <View style={[styles.card, log.done && { borderColor: C.green }]}>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTag}>Workout {log.session} · {log.mode === "gym" ? "Gym" : "Home"}</Text>
              <Text style={styles.cardTitle}>{plan.title}</Text>
            </View>
            {log.done && <Text style={styles.doneTag}>✓ Done</Text>}
          </View>
          <Text style={styles.cardHint}>
            Auto-picked from your rotation. Tap any exercise name for form & muscles.
          </Text>
        </View>

        {/* Exercise list */}
        {plan.items.map((it) => {
          const ex = EX[it.ex];
          if (!ex) return null;
          const sets = log.sets[it.ex] || [];
          const isTime = ex.unit === "min" || ex.unit === "rounds" || /s$|s \/side|min/.test(it.reps);
          const isBW = /Bodyweight|Floor|Wall|Outdoors|stair|table|Sturdy/i.test(ex.equip) && !/backpack/i.test(ex.equip);

          return (
            <View key={it.ex} style={styles.card}>
              <Pressable onPress={() => setSheet({ exId: it.ex, meta: it })}>
                <Text style={styles.exName}>{ex.name} <Text style={{ color: C.amber }}>›</Text></Text>
                <Text style={styles.exMeta}>
                  {it.sets} × {it.reps}{it.wt ? ` · ${it.wt}` : ""}
                  {"  ·  "}<Text style={{ color: C.teal }}>{ex.equip}</Text>
                </Text>
              </Pressable>

              {Array.from({ length: it.sets }).map((_, i) => (
                <View key={i} style={styles.setRow}>
                  <Text style={styles.setLabel}>Set {i + 1}</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder={isTime ? (ex.unit || "sec") : "reps"}
                    placeholderTextColor={C.faint}
                    value={sets[i]?.r || ""}
                    onChangeText={(v) => setSet(it.ex, i, "r", v)}
                  />
                  {!isBW && !isTime && (
                    <TextInput
                      style={styles.input}
                      keyboardType="decimal-pad"
                      placeholder="kg"
                      placeholderTextColor={C.faint}
                      value={sets[i]?.w || ""}
                      onChangeText={(v) => setSet(it.ex, i, "w", v)}
                    />
                  )}
                  <Text style={styles.setUnit}>
                    {isTime ? (ex.unit || "sec") : isBW ? "BW" : "kg"}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}

        {/* Finish button */}
        <Pressable
          style={[styles.finishBtn, log.done && styles.finishBtnDisabled]}
          onPress={finish}
          disabled={log.done}
        >
          <Text style={[styles.finishTxt, log.done && { color: C.faint }]}>
            {log.done
              ? "Workout complete ✓"
              : `Finish workout (${doneCount}/${plan.items.length} exercises logged)`}
          </Text>
        </Pressable>

        <Text style={styles.hint}>
          Progression rule: hit the top of a rep range comfortably → add 2.5 kg next time.
        </Text>
      </ScrollView>

      {sheet && (
        <ExerciseSheet exId={sheet.exId} meta={sheet.meta} onClose={() => setSheet(null)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 14, paddingBottom: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  dateTag: { fontSize: 11, fontWeight: "700", letterSpacing: 1, color: C.faint, textTransform: "uppercase" },
  heading: { fontSize: 24, fontWeight: "800", color: C.text, marginTop: 4, marginBottom: 12 },

  modeRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  modeBtn: {
    flex: 1, padding: 10, borderRadius: 999,
    borderWidth: 1, borderColor: C.line, backgroundColor: C.panel2,
    alignItems: "center",
  },
  modeBtnOn: { backgroundColor: C.amber, borderColor: C.amber },
  modeBtnTeal: { backgroundColor: C.teal, borderColor: C.teal },
  modeTxt: { color: C.dim, fontWeight: "600", fontSize: 13 },
  modeTxtOn: { color: "#1A1209" },
  modeTxtTeal: { color: "#06211F" },

  sessionRow: { flexDirection: "row", gap: 6, marginBottom: 12, flexWrap: "wrap" },
  chip: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999,
    borderWidth: 1, borderColor: C.line, backgroundColor: C.panel2,
  },
  chipOn: { backgroundColor: C.amber, borderColor: C.amber },
  chipTxt: { color: C.dim, fontSize: 13, fontWeight: "600" },
  chipTxtOn: { color: "#1A1209" },

  card: {
    backgroundColor: C.panel, borderWidth: 1, borderColor: C.line,
    borderRadius: 14, padding: 14, marginBottom: 10,
  },
  cardRow: { flexDirection: "row", alignItems: "flex-start" },
  cardTag: { fontSize: 11, fontWeight: "700", color: C.amber, letterSpacing: 0.5, textTransform: "uppercase" },
  cardTitle: { fontSize: 17, fontWeight: "800", color: C.text },
  doneTag: { color: C.green, fontWeight: "800", fontSize: 13 },
  cardHint: { fontSize: 12, color: C.faint, marginTop: 4, lineHeight: 17 },

  exName: { fontWeight: "800", fontSize: 15, color: C.text },
  exMeta: { fontSize: 12.5, color: C.dim, marginTop: 2 },

  setRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingTop: 6, marginTop: 6,
    borderTopWidth: 1, borderTopColor: C.line,
  },
  setLabel: { width: 42, fontSize: 12, color: C.faint, fontWeight: "700" },
  input: {
    width: 64, padding: 8, borderRadius: 8,
    borderWidth: 1, borderColor: C.line, backgroundColor: C.bg,
    color: C.text, fontSize: 15, textAlign: "center",
  },
  setUnit: { fontSize: 11, color: C.faint },

  finishBtn: {
    backgroundColor: C.amber, borderRadius: 12, padding: 14,
    alignItems: "center", marginTop: 4,
  },
  finishBtnDisabled: { backgroundColor: C.panel2 },
  finishTxt: { color: "#1A1209", fontWeight: "800", fontSize: 15 },

  hint: { fontSize: 11.5, color: C.faint, marginTop: 8, lineHeight: 17 },
});
