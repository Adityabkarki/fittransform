import React from "react";
import Svg, { Circle, Path, Ellipse } from "react-native-svg";
import { View, Text, StyleSheet } from "react-native";
import { C } from "../constants/theme";
import { SHAPES_F, SHAPES_B, BODY_PATH } from "../constants/anatomy";
import { ML } from "../constants/exercises";

interface Props {
  side: "front" | "back";
  active: string[];
}

export default function BodyView({ side, active }: Props) {
  const shapes = side === "front" ? SHAPES_F : SHAPES_B;

  return (
    <View style={styles.wrap}>
      <Svg viewBox="0 0 100 198" width={110} height={218}>
        <Circle cx={50} cy={16} r={9} fill="#26303E" />
        <Path d={BODY_PATH} fill="#26303E" />
        {Object.entries(shapes).map(([key, list]) => {
          const hot = active.includes(key);
          return list.map(([cx, cy, rx, ry], i) => (
            <Ellipse
              key={key + i}
              cx={cx} cy={cy} rx={rx} ry={ry}
              fill={hot ? C.muscleHot : C.muscle}
              opacity={hot ? 0.95 : 0.5}
            />
          ));
        })}
      </Svg>
      <Text style={styles.label}>{side === "front" ? "FRONT" : "BACK"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center" },
  label: { fontSize: 10, fontWeight: "700", color: C.faint, marginTop: 2, letterSpacing: 1 },
});
