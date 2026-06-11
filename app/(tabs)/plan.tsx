import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { C } from "../../constants/theme";
import { EX } from "../../constants/exercises";
import { PLAN, ORDER } from "../../constants/plans";
import ExerciseSheet from "../../components/ExerciseSheet";
import type { PlanItem } from "../../constants/plans";

export default function PlanScreen() {
  const [mode, setMode] = useState<"gym" | "home">("gym");
  const [sheet, setSheet] = useState<{ exId: string; meta?: PlanItem } | null>(null);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Weekly plan</Text>

        <View style={styles.modeRow}>
          <Pressable
            style={[styles.modeBtn, mode === "gym" && styles.modeBtnOn]}
            onPress={() => setMode("gym")}
          >
            <Text style={[styles.modeTxt, mode === "gym" && styles.modeTxtOn]}>🏋️ Gym</Text>
          </Pressable>
          <Pressable
            style={[styles.modeBtn, mode === "home" && styles.modeBtnTeal]}
            onPress={() => setMode("home")}
          >
            <Text style={[styles.modeTxt, mode === "home" && styles.modeTxtTeal]}>🏠 Home</Text>
          </Pressable>
        </View>

        <Text style={styles.hint}>
          Rotate A → B → C → D → E in order, 5–6 days/week. Miss a day? Just do the next letter — nothing is "lost". F is optional recovery.
        </Text>

        {ORDER.map((s) => (
          <View key={s} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.badge, s === "F" && styles.badgeDim]}>
                <Text style={[styles.badgeTxt, s === "F" && styles.badgeTxtDim]}>{s}</Text>
              </View>
              <Text style={styles.cardTitle}>{PLAN[mode][s].title}</Text>
            </View>
            {PLAN[mode][s].items.map((it) => (
              <Pressable
                key={it.ex}
                style={styles.exRow}
                onPress={() => setSheet({ exId: it.ex, meta: it })}
              >
                <Text style={styles.exName}>
                  {EX[it.ex]?.name ?? it.ex} <Text style={{ color: C.amber }}>›</Text>
                </Text>
                <Text style={styles.exMeta}>
                  {it.sets}×{it.reps}{it.wt ? ` · ${it.wt}` : ""}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}

        <View style={styles.warmupCard}>
          <Text style={styles.warmupTitle}>Every session warmup (5 min)</Text>
          <Text style={styles.warmupText}>
            Treadmill walk or spot-march 3 min · band pull-aparts or arm circles 2×20 · cat-cow ×10 · bodyweight squats ×15
          </Text>
        </View>
      </ScrollView>

      {sheet && (
        <ExerciseSheet exId={sheet.exId} meta={sheet.meta} onClose={() => setSheet(null)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { padding: 14, paddingBottom: 20 },
  heading: { fontSize: 24, fontWeight: "800", color: C.text, marginBottom: 12 },

  modeRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
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

  hint: { fontSize: 12.5, color: C.dim, marginBottom: 12, lineHeight: 18 },

  card: {
    backgroundColor: C.panel, borderWidth: 1, borderColor: C.line,
    borderRadius: 14, padding: 14, marginBottom: 10,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  badge: {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: C.amber, alignItems: "center", justifyContent: "center",
  },
  badgeDim: { backgroundColor: C.panel2 },
  badgeTxt: { color: "#1A1209", fontWeight: "900", fontSize: 14 },
  badgeTxtDim: { color: C.dim },
  cardTitle: { flex: 1, fontWeight: "800", fontSize: 15, color: C.text },

  exRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 7, borderTopWidth: 1, borderTopColor: C.line,
  },
  exName: { fontSize: 13.5, color: C.text, flex: 1 },
  exMeta: { fontSize: 12, color: C.dim, textAlign: "right" },

  warmupCard: {
    backgroundColor: C.panel2, borderWidth: 1, borderColor: C.line,
    borderRadius: 14, padding: 14,
  },
  warmupTitle: { fontSize: 11, fontWeight: "700", color: C.amber, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 },
  warmupText: { fontSize: 13, color: C.dim, lineHeight: 20 },
});
