import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { C } from "../constants/theme";

interface Props {
  label: string;
  value: string | number;
  max: number;
  suffix?: string;
  color: string;
}

export default function Metric({ label, value, max, suffix, color }: Props) {
  const pct = Math.min(100, (parseFloat(String(value)) / max) * 100);
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}{suffix || ""}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  label: { fontSize: 13, fontWeight: "700", color: C.text },
  value: { fontSize: 13, color: C.dim },
  track: { height: 8, borderRadius: 99, backgroundColor: C.panel2, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 99 },
});
