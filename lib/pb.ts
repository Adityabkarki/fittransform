import PocketBase from "pocketbase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PB_URL } from "../constants/config";

const AUTH_STORAGE_KEY = "pb:auth";

export const pb = new PocketBase(PB_URL);

// Restore saved auth token from AsyncStorage on startup.
export async function initPB(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const { token, model } = JSON.parse(raw);
      pb.authStore.save(token, model);
    }
  } catch {}
}

// Persist auth changes to AsyncStorage.
pb.authStore.onChange(async () => {
  try {
    if (pb.authStore.isValid) {
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ token: pb.authStore.token, model: pb.authStore.model })
      );
    } else {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {}
});

export const isLoggedIn = () => pb.authStore.isValid;
export const currentUserId = () => pb.authStore.model?.id as string | undefined;
