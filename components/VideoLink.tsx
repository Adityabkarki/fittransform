import React from "react";
import { Pressable, Text, StyleSheet, Linking } from "react-native";
import { C } from "../constants/theme";

const VID: Record<string, string> = {
  floorPushup: "IODxDxX7oi4", inclinePush: "IODxDxX7oi4", tablePush: "IODxDxX7oi4", pushupMax: "IODxDxX7oi4",
  dbBench: "J-gWN5hYwRU",
  ohpSeated: "fuQpuu--bMI", bpOhp: "fuQpuu--bMI",
  latRaise: "3VcKaXpzqRo", bpLatRaise: "3VcKaXpzqRo",
  facePull: "0Po47vvj9g4",
  latPulldown: "SALxEARiMkw",
  cableRow: "vwHG9Jfu4sw",
  pullupNeg: "R4XbkMXGXaI",
  dbCurl: "XE_pHwbst04", bpCurl: "XE_pHwbst04",
  bandPullApart: "LoBBo1dtY6I",
  deadBug: "bxn9FBrt4-A",
  gobletSquat: "6mf0oa2GGUc",
  bwSquat: "C_VtOYc6j5c",
  rdl: "uhghy9pFIPY",
  slRdl: "Zfr6wizR8rs",
  legPress: "CHPHn-OnTqE",
  calfRaise: "3UWi44yN-wM", stairCalf: "3UWi44yN-wM",
  shrugs: "yqzRYcOMx2Q",
  plank: "A2b2EmIg0dA", sidePlank: "DjEN3SKl0Eg",
  deadHang: "M25ibDAVhMQ",
  hangKneeRaise: "KhPTiWP6lB4",
  legRaise: "xqTh6NqbAtM",
  tableRow: "Fl0UMfdEzsE", towelRow: "Fl0UMfdEzsE",
  superman: "MJ8zx3vHXwA",
  revLunge: "u_zSfK5ZFU4",
  gluteBridge: "KI6fjDqGZh4",
  ytw: "CFt3WjCBbpc",
  wallHandstand: "9TKfShDYax4",
  pikePush: "66x0qQiJ-MA",
  treadmillInt: "lD4CAi7lNGY", inclineWalk: "lD4CAi7lNGY", walkOutdoor: "lD4CAi7lNGY",
};

interface Props {
  exId: string;
  name: string;
}

export default function VideoLink({ exId, name }: Props) {
  const id = VID[exId];
  const url = id
    ? `https://www.youtube.com/watch?v=${id}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " proper form")}`;

  return (
    <Pressable style={styles.btn} onPress={() => Linking.openURL(url)}>
      <Text style={styles.text}>▶ Watch form tutorial on YouTube</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: C.panel2,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  text: { color: C.amber, fontWeight: "800", fontSize: 14 },
});
