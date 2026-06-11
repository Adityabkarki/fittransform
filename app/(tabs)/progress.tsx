import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { C } from "../../constants/theme";
import { GAINS } from "../../constants/gains";
import { computeProgress, today } from "../../lib/progress";
import { loadData } from "../../lib/storage";
import type { AppData } from "../../lib/storage";
import Metric from "../../components/Metric";
import StatBox from "../../components/StatBox";

const dkey = (d: Date) => d.toISOString().slice(0, 10);

export default function ProgressScreen() {
  const [data, setData] = useState<AppData>({ logs: {}, diet: {} });

  useEffect(() => {
    loadData().then(setData);
  }, []);

  const p = useMemo(() => computeProgress(data), [data]);

  const logs = data.logs || {};
  const last14 = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const k = dkey(d);
    const l = logs[k];
    return {
      k,
      kcal: l?.done ? Math.round((GAINS[l.session as keyof typeof GAINS]?.kcal || 0) * (l.mode === "home" ? 0.85 : 1)) : 0,
    };
  });
  const maxK = Math.max(360, ...last14.map((x) => x.kcal));

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Your transformation</Text>

        <View style={styles.statRow}>
          <StatBox big={`${p.fatKg.toFixed(2)} kg`} small="EST. FAT BURNED" color={C.amber} />
          <StatBox big={p.kcal.toLocaleString()} small="KCAL FROM TRAINING" />
        </View>
        <View style={[styles.statRow, { marginBottom: 14 }]}>
          <StatBox big={p.workouts} small="WORKOUTS DONE" color={C.teal} />
          <StatBox big={`${p.streak}🔥`} small="DAY STREAK" />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Fitness scores (0–100 · 3-month goal scale)</Text>
          <Metric label="Strength" value={p.str.toFixed(0)} max={100} color={C.amber} />
          <Metric label="Stamina" value={p.sta.toFixed(0)} max={100} color={C.teal} />
          <Metric label="Endurance" value={p.end.toFixed(0)} max={100} color={C.green} />
          <Metric label={`VO₂max — est. ${p.vo2ml.toFixed(1)} ml/kg/min`} value={p.vo2.toFixed(0)} max={100} color={C.red} />
          <Text style={styles.hint}>
            Scores rise with every logged workout and slowly fall on missed days — consistency is everything.
          </Text>
        </View>

        {/* Bar chart */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Last 14 days · training calories</Text>
          <View style={styles.chartRow}>
            {last14.map((x) => (
              <View
                key={x.k}
                style={[
                  styles.bar,
                  {
                    height: Math.max(4, (x.kcal / maxK) * 80),
                    backgroundColor: x.kcal ? C.amber : C.panel2,
                  },
                ]}
              />
            ))}
          </View>
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabel}>2 weeks ago</Text>
            <Text style={styles.chartLabel}>today</Text>
          </View>
        </View>

        <View style={styles.projCard}>
          <Text style={styles.projTitle}>Projected milestones</Text>
          <Text style={styles.projText}>
            Pushups now: ~<Text style={{ color: C.text, fontWeight: "700" }}>{p.pushupEst}</Text> reps {"·"} Pull-up progress:{" "}
            <Text style={{ color: C.text, fontWeight: "700" }}>{p.pullupEst} / 3</Text>{"\n"}
            Diet does most of the fat loss — training kcal above is the bonus on top of your food deficit.
          </Text>
        </View>

        <Text style={styles.disclaimer}>
          All numbers are motivational estimates from your logs, not medical measurements. Weigh yourself weekly (same time, same scale) for the real fat-loss number.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { padding: 14, paddingBottom: 20 },
  heading: { fontSize: 24, fontWeight: "800", color: C.text, marginBottom: 12 },

  statRow: { flexDirection: "row", gap: 8, marginBottom: 8 },

  card: {
    backgroundColor: C.panel, borderWidth: 1, borderColor: C.line,
    borderRadius: 14, padding: 14, marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 11, fontWeight: "700", letterSpacing: 1,
    textTransform: "uppercase", color: C.faint, marginBottom: 10,
  },
  hint: { fontSize: 11.5, color: C.faint, lineHeight: 16, marginTop: 4 },

  chartRow: { flexDirection: "row", alignItems: "flex-end", gap: 3, height: 80 },
  bar: { flex: 1, borderRadius: 4 },
  chartLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  chartLabel: { fontSize: 10.5, color: C.faint },

  projCard: {
    backgroundColor: C.panel2, borderWidth: 1, borderColor: C.line,
    borderRadius: 14, padding: 14, marginBottom: 10,
  },
  projTitle: { fontSize: 11, fontWeight: "700", color: C.amber, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 },
  projText: { fontSize: 13, lineHeight: 20, color: C.dim },

  disclaimer: { fontSize: 11, color: C.faint, lineHeight: 16 },
});
