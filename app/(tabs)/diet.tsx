import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { C } from "../../constants/theme";
import { DIET, PROTEIN_TARGET } from "../../constants/diet";
import { today, fmtDate } from "../../lib/progress";
import { loadData, saveData } from "../../lib/storage";
import type { AppData } from "../../lib/storage";

export default function DietScreen() {
  const [data, setDataRaw] = useState<AppData>({ logs: {}, diet: {} });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadData().then(setDataRaw);
  }, []);

  const setData = useCallback((fn: (prev: AppData) => AppData) => {
    setDataRaw((prev) => {
      const next = fn(prev);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveData(next), 600);
      return next;
    });
  }, []);

  const tk = today();
  const day = data.diet?.[tk] || {};

  const toggle = (id: string) =>
    setData((d) => ({
      ...d,
      diet: { ...(d.diet || {}), [tk]: { ...day, [id]: !day[id] } },
    }));

  const protein = DIET.reduce((s, it) => s + (day[it.id] ? it.p : 0), 0);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.dateTag}>{fmtDate(tk)}</Text>
        <Text style={styles.heading}>Diet & supplements</Text>

        {/* Protein progress */}
        <View style={styles.card}>
          <View style={styles.proteinRow}>
            <Text style={styles.proteinLabel}>Protein today</Text>
            <Text style={[styles.proteinValue, { color: protein >= PROTEIN_TARGET ? C.green : C.amber }]}>
              {protein} / {PROTEIN_TARGET} g
            </Text>
          </View>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                {
                  width: `${Math.min(100, (protein / PROTEIN_TARGET) * 100)}%`,
                  backgroundColor: protein >= PROTEIN_TARGET ? C.green : C.amber,
                },
              ]}
            />
          </View>
        </View>

        {/* Diet items */}
        {DIET.map((it) => (
          <Pressable
            key={it.id}
            style={[styles.card, day[it.id] && { borderColor: C.green }]}
            onPress={() => toggle(it.id)}
          >
            <View style={styles.itemRow}>
              <View style={[styles.check, day[it.id] && styles.checkOn]}>
                <Text style={[styles.checkMark, { color: day[it.id] ? "#0B2414" : "transparent" }]}>✓</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{it.supp ? "💊 " : ""}{it.name}</Text>
                  <Text style={styles.itemTime}>{it.time}</Text>
                </View>
                <Text style={styles.itemNote}>
                  {it.note}{it.p ? ` · ~${it.p}g protein` : ""}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Daily target · ~1,900–2,100 kcal</Text>
          <Text style={styles.infoText}>
            Skip: fat burners, BCAAs, test boosters. Keep: whey, creatine (daily, even rest days), D3, omega-3.
            Push chicken/fish/paneer/soya to 3+ days a week. And get the sleep-apnea check — poor sleep stalls everything here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { padding: 14, paddingBottom: 20 },
  dateTag: { fontSize: 11, fontWeight: "700", letterSpacing: 1, color: C.faint, textTransform: "uppercase" },
  heading: { fontSize: 24, fontWeight: "800", color: C.text, marginTop: 4, marginBottom: 12 },

  card: {
    backgroundColor: C.panel, borderWidth: 1, borderColor: C.line,
    borderRadius: 14, padding: 14, marginBottom: 10,
  },
  proteinRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  proteinLabel: { fontWeight: "800", fontSize: 14, color: C.text },
  proteinValue: { fontSize: 14, fontWeight: "800" },
  track: { height: 8, borderRadius: 99, backgroundColor: C.panel2, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 99 },

  itemRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  check: {
    width: 22, height: 22, borderRadius: 7,
    borderWidth: 2, borderColor: C.line, backgroundColor: C.bg,
    alignItems: "center", justifyContent: "center",
  },
  checkOn: { backgroundColor: C.green, borderColor: C.green },
  checkMark: { fontSize: 13, fontWeight: "900" },
  itemHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  itemName: { fontWeight: "800", fontSize: 14, color: C.text, flex: 1 },
  itemTime: { fontSize: 11.5, color: C.teal, fontWeight: "700" },
  itemNote: { fontSize: 12, color: C.dim, marginTop: 3, lineHeight: 17 },

  infoCard: {
    backgroundColor: C.panel2, borderWidth: 1, borderColor: C.line,
    borderRadius: 14, padding: 14,
  },
  infoTitle: { fontSize: 11, fontWeight: "700", color: C.amber, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 },
  infoText: { fontSize: 12.5, color: C.dim, lineHeight: 19 },
});
