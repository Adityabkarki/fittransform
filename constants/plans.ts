export const ORDER = ["A", "B", "C", "D", "E", "F"] as const;
export type SessionKey = typeof ORDER[number];

export interface PlanItem {
  ex: string;
  sets: number;
  reps: string;
  wt?: string;
}

export interface DayPlan {
  title: string;
  items: PlanItem[];
}

export const PLAN: Record<"gym" | "home", Record<SessionKey, DayPlan>> = {
  gym: {
    A: {
      title: "Push — Chest & Shoulders",
      items: [
        { ex: "dbBench", sets: 4, reps: "8–10", wt: "10–12.5kg /hand" },
        { ex: "ohpSeated", sets: 3, reps: "8–10", wt: "7.5kg /hand" },
        { ex: "inclinePush", sets: 3, reps: "max" },
        { ex: "latRaise", sets: 3, reps: "12–15", wt: "5kg" },
        { ex: "facePull", sets: 3, reps: "15", wt: "light" },
        { ex: "plank", sets: 3, reps: "30–45s" },
      ],
    },
    B: {
      title: "Pull — Back & Biceps",
      items: [
        { ex: "latPulldown", sets: 4, reps: "10", wt: "35–40kg" },
        { ex: "cableRow", sets: 3, reps: "10–12", wt: "30–35kg" },
        { ex: "deadHang", sets: 3, reps: "20–30s" },
        { ex: "dbCurl", sets: 3, reps: "12", wt: "7.5kg" },
        { ex: "bandPullApart", sets: 3, reps: "20" },
        { ex: "deadBug", sets: 3, reps: "10 /side" },
      ],
    },
    C: {
      title: "Legs & Core",
      items: [
        { ex: "gobletSquat", sets: 4, reps: "10", wt: "12–16kg" },
        { ex: "rdl", sets: 3, reps: "8–10", wt: "20kg bar" },
        { ex: "legPress", sets: 3, reps: "12", wt: "start light" },
        { ex: "calfRaise", sets: 3, reps: "15" },
        { ex: "sidePlank", sets: 3, reps: "20–30s /side" },
        { ex: "inclineWalk", sets: 1, reps: "10 min" },
      ],
    },
    D: {
      title: "Shoulders & Pull-up Focus ★",
      items: [
        { ex: "ohpSeated", sets: 4, reps: "8", wt: "heavier than Day A" },
        { ex: "pullupNeg", sets: 4, reps: "4 slow", wt: "(wk 1–4: pulldown 4×8 heavy)" },
        { ex: "facePull", sets: 4, reps: "15" },
        { ex: "latRaise", sets: 3, reps: "12", wt: "5–7.5kg" },
        { ex: "shrugs", sets: 3, reps: "12", wt: "12.5kg /hand" },
        { ex: "hangKneeRaise", sets: 3, reps: "8" },
      ],
    },
    E: {
      title: "Cardio & Conditioning",
      items: [
        { ex: "treadmillInt", sets: 1, reps: "30–35 min" },
        { ex: "pushupMax", sets: 3, reps: "max" },
        { ex: "plank", sets: 3, reps: "30s" },
      ],
    },
    F: {
      title: "Optional — Recovery",
      items: [
        { ex: "inclineWalk", sets: 1, reps: "30–40 min" },
        { ex: "bandPullApart", sets: 3, reps: "20" },
      ],
    },
  },
  home: {
    A: {
      title: "Push — Chest & Shoulders",
      items: [
        { ex: "tablePush", sets: 4, reps: "10–15" },
        { ex: "pikePush", sets: 3, reps: "6–10" },
        { ex: "floorPushup", sets: 3, reps: "max" },
        { ex: "bpLatRaise", sets: 3, reps: "12 /arm", wt: "backpack 4–6kg" },
        { ex: "plank", sets: 3, reps: "30–45s" },
      ],
    },
    B: {
      title: "Pull — Back & Biceps",
      items: [
        { ex: "tableRow", sets: 4, reps: "8–12" },
        { ex: "bpRow", sets: 3, reps: "12 /arm", wt: "backpack 8–12kg" },
        { ex: "towelRow", sets: 3, reps: "12" },
        { ex: "bpCurl", sets: 3, reps: "15", wt: "backpack" },
        { ex: "superman", sets: 3, reps: "20s" },
        { ex: "deadBug", sets: 3, reps: "10 /side" },
      ],
    },
    C: {
      title: "Legs & Core",
      items: [
        { ex: "bwSquat", sets: 4, reps: "15–20" },
        { ex: "revLunge", sets: 3, reps: "10 /leg" },
        { ex: "slRdl", sets: 3, reps: "8 /leg", wt: "backpack" },
        { ex: "gluteBridge", sets: 3, reps: "15" },
        { ex: "stairCalf", sets: 3, reps: "20" },
        { ex: "plank", sets: 3, reps: "30s + side" },
      ],
    },
    D: {
      title: "Shoulders & Pull-up Prep ★",
      items: [
        { ex: "pikePush", sets: 4, reps: "6–10" },
        { ex: "towelRow", sets: 4, reps: "8 slow negatives" },
        { ex: "bpOhp", sets: 3, reps: "10–12", wt: "backpack" },
        { ex: "ytw", sets: 3, reps: "8 rounds" },
        { ex: "wallHandstand", sets: 3, reps: "15–20s" },
        { ex: "legRaise", sets: 3, reps: "10" },
      ],
    },
    E: {
      title: "Cardio & Conditioning",
      items: [
        { ex: "walkOutdoor", sets: 1, reps: "30–40 min" },
        { ex: "circuit", sets: 3, reps: "rounds" },
      ],
    },
    F: {
      title: "Optional — Recovery",
      items: [
        { ex: "walkOutdoor", sets: 1, reps: "45–60 min" },
        { ex: "ytw", sets: 2, reps: "6 rounds" },
      ],
    },
  },
};
