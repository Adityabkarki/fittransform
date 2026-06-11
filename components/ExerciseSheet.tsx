import React from "react";
import {
  Modal, View, Text, ScrollView, Pressable, StyleSheet,
} from "react-native";
import { C } from "../constants/theme";
import { EX } from "../constants/exercises";
import type { PlanItem } from "../constants/plans";
import Anatomy from "./Anatomy";
import VideoLink from "./VideoLink";

interface Props {
  exId: string | null;
  meta?: PlanItem;
  onClose: () => void;
}

export default function ExerciseSheet({ exId, meta, onClose }: Props) {
  if (!exId) return null;
  const ex = EX[exId];
  if (!ex) return null;

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.sheet}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{ex.name}</Text>
              <Text style={styles.equip}>{ex.equip}</Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {meta && (
            <Text style={styles.meta}>
              {meta.sets} sets × {meta.reps}{meta.wt ? ` · start ${meta.wt}` : ""}
            </Text>
          )}

          {/* Video */}
          <Text style={styles.sectionLabel}>Watch the form — video tutorial</Text>
          <VideoLink exId={exId} name={ex.name} />

          {/* Anatomy */}
          <Text style={styles.sectionLabel}>Muscles you should feel</Text>
          <Anatomy muscles={ex.muscles} />

          {/* Feel it here */}
          <View style={styles.feelCard}>
            <Text style={styles.feelText}>
              <Text style={{ color: C.amber, fontWeight: "800" }}>Feel it here: </Text>
              {ex.feel}
            </Text>
          </View>

          {/* Steps */}
          <Text style={styles.sectionLabel}>How to do it</Text>
          {ex.steps.map((s, i) => (
            <View key={i} style={styles.step}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{s}</Text>
            </View>
          ))}

          {/* Mistakes */}
          <Text style={[styles.sectionLabel, { color: C.red }]}>Avoid</Text>
          {ex.mistakes.map((m, i) => (
            <Text key={i} style={styles.mistake}>✕ {m}</Text>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(8,11,16,0.72)" },
  sheet: {
    backgroundColor: C.panel,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: C.line,
    maxHeight: "88%",
  },
  content: { padding: 18, paddingBottom: 32 },
  row: { flexDirection: "row", alignItems: "flex-start", marginBottom: 4 },
  title: { fontSize: 21, fontWeight: "800", color: C.text },
  equip: { fontSize: 13, fontWeight: "700", color: C.teal, marginTop: 2 },
  closeBtn: {
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 999, borderWidth: 1, borderColor: C.line,
    backgroundColor: C.panel2,
  },
  closeText: { color: C.dim, fontWeight: "700", fontSize: 13 },
  meta: { color: C.dim, fontSize: 13, marginBottom: 4 },
  sectionLabel: {
    fontSize: 11, fontWeight: "700", letterSpacing: 1,
    textTransform: "uppercase", color: C.faint, marginTop: 14, marginBottom: 6,
  },
  feelCard: {
    backgroundColor: C.panel2, borderRadius: 12, padding: 12, marginTop: 12,
  },
  feelText: { fontSize: 13.5, lineHeight: 20, color: C.text },
  step: { flexDirection: "row", gap: 10, marginBottom: 8 },
  stepNum: {
    width: 22, height: 22, borderRadius: 99,
    backgroundColor: C.amber, alignItems: "center", justifyContent: "center",
  },
  stepNumText: { color: "#1A1209", fontWeight: "900", fontSize: 12 },
  stepText: { flex: 1, fontSize: 13.5, lineHeight: 20, color: C.text },
  mistake: { fontSize: 13.5, lineHeight: 20, color: C.dim, marginBottom: 6 },
});
