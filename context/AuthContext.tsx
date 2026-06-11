import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { pb, initPB, isLoggedIn } from "../lib/pb";

interface AuthState {
  userId: string | null;
  isGuest: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthState>({} as AuthState);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initPB().then(() => {
      if (isLoggedIn()) setUserId(pb.authStore.model?.id ?? null);
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const auth = await pb.collection("users").authWithPassword(email, password);
      setUserId(auth.record.id);
      setIsGuest(false);
    } catch (e: any) {
      throw new Error(e?.response?.message || e?.message || "Login failed");
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await pb.collection("users").create({
        email,
        password,
        passwordConfirm: password,
      });
      const auth = await pb.collection("users").authWithPassword(email, password);
      setUserId(auth.record.id);
      setIsGuest(false);
    } catch (e: any) {
      throw new Error(e?.response?.message || e?.message || "Registration failed");
    }
  }, []);

  const logout = useCallback(async () => {
    pb.authStore.clear();
    setUserId(null);
    setIsGuest(false);
  }, []);

  const continueAsGuest = useCallback(() => {
    setIsGuest(true);
  }, []);

  return (
    <AuthContext.Provider value={{
      userId, isGuest, loading,
      login, register, logout, continueAsGuest,
      error, clearError: () => setError(null),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
