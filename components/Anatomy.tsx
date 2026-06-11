import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { C } from "../constants/theme";
import { SHAPES_F, SHAPES_B } from "../constants/anatomy";
import { ML } from "../constants/exercises";
import BodyView from "./BodyView";

interface Props {
  muscles: string[];
}

export default function Anatomy({ muscles }: Props) {
  const frontKeys = Object.keys(SHAPES_F);
  const backKeys = Object.keys(SHAPES_B);
  const showFront = muscles.some((m) => frontKeys.includes(m));
  const showBack = muscles.some((m) => backKeys.includes(m));

  return (
    <View>
      <View style={styles.row}>
        {(showFront || !showBack) && <BodyView side="front" active={muscles} />}
        {showBack && <BodyView side="back" active={muscles} />}
      </View>
      <View style={styles.chips}>
        {muscles.map((m) => (
          <View key={m} style={styles.chip}>
            <Text style={styles.chipText}>{ML[m] || m}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center", gap: 18 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 8 },
  chip: { backgroundColor: C.amber, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99 },
  chipText: { fontSize: 12, fontWeight: "700", color: "#1A1209" },
});
