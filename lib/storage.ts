import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "fittransform:v1";

export interface SetLog {
  r?: string;
  w?: string;
}

export interface DayLog {
  cloudId?: string; // PocketBase record ID — set after first cloud sync
  mode: "gym" | "home";
  session: string;
  sets: Record<string, SetLog[]>;
  done: boolean;
}

export interface AppData {
  logs: Record<string, DayLog>;
  diet: Record<string, Record<string, boolean>>;
}

export const DEFAULT_DATA: AppData = { logs: {}, diet: {} };

export async function loadData(): Promise<AppData> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as AppData;
  } catch {}
  return { ...DEFAULT_DATA };
}

export async function saveData(data: AppData): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.error("save failed", e);
  }
}
