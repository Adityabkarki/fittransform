import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { C } from "../constants/theme";

interface Props {
  big: string | number;
  small: string;
  color?: string;
}

export default function StatBox({ big, small, color }: Props) {
  return (
    <View style={styles.box}>
      <Text style={[styles.big, { color: color || C.text }]}>{big}</Text>
      <Text style={styles.small}>{small}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: C.panel2,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  big: { fontSize: 20, fontWeight: "800" },
  small: { fontSize: 11, color: C.faint, fontWeight: "700", marginTop: 2 },
});
