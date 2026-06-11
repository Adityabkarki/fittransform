import React, { useState } from "react";
import {
  View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { C } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

export default function AuthScreen() {
  const { login, register, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "login") await login(email.trim(), password);
      else await register(email.trim(), password);
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}><Text style={{ color: C.amber }}>●</Text> 93 → STRONG</Text>
            <Text style={styles.title}>
              {mode === "login" ? "Welcome back" : "Create account"}
            </Text>
            <Text style={styles.sub}>
              {mode === "login"
                ? "Sign in to sync your workouts across devices."
                : "Your data syncs to the cloud — never lose a log."}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@email.com"
              placeholderTextColor={C.faint}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!busy}
            />

            <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Min. 8 characters"
              placeholderTextColor={C.faint}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!busy}
              onSubmitEditing={submit}
              returnKeyType="go"
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable style={[styles.btn, busy && styles.btnBusy]} onPress={submit} disabled={busy}>
              {busy
                ? <ActivityIndicator color="#1A1209" />
                : <Text style={styles.btnTxt}>{mode === "login" ? "Sign in" : "Create account"}</Text>
              }
            </Pressable>

            <Pressable onPress={() => { setError(null); setMode(m => m === "login" ? "register" : "login"); }}>
              <Text style={styles.toggle}>
                {mode === "login" ? "No account yet? " : "Already have one? "}
                <Text style={{ color: C.amber, fontWeight: "800" }}>
                  {mode === "login" ? "Register" : "Sign in"}
                </Text>
              </Text>
            </Pressable>
          </View>

          {/* Guest divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerTxt}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable style={styles.guestBtn} onPress={continueAsGuest}>
            <Text style={styles.guestTxt}>Continue without account</Text>
            <Text style={styles.guestSub}>Your data stays on this device only.</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { padding: 24, paddingTop: 40 },

  header: { marginBottom: 32 },
  logo: { fontSize: 13, fontWeight: "800", color: C.text, letterSpacing: 1, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "800", color: C.text, marginBottom: 8 },
  sub: { fontSize: 14, color: C.dim, lineHeight: 20 },

  form: {
    backgroundColor: C.panel, borderWidth: 1, borderColor: C.line,
    borderRadius: 16, padding: 16,
  },
  label: { fontSize: 12, fontWeight: "700", color: C.faint, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 },
  input: {
    backgroundColor: C.bg, borderWidth: 1, borderColor: C.line,
    borderRadius: 10, padding: 12, color: C.text, fontSize: 15,
  },
  error: { color: C.red, fontSize: 13, marginTop: 10, fontWeight: "600" },

  btn: {
    backgroundColor: C.amber, borderRadius: 12, padding: 14,
    alignItems: "center", marginTop: 16,
  },
  btnBusy: { opacity: 0.7 },
  btnTxt: { color: "#1A1209", fontWeight: "800", fontSize: 15 },

  toggle: { textAlign: "center", color: C.dim, fontSize: 13, marginTop: 14 },

  dividerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.line },
  dividerTxt: { color: C.faint, fontSize: 12, fontWeight: "600" },

  guestBtn: {
    backgroundColor: C.panel2, borderWidth: 1, borderColor: C.line,
    borderRadius: 14, padding: 16, alignItems: "center",
  },
  guestTxt: { color: C.text, fontWeight: "700", fontSize: 14 },
  guestSub: { color: C.faint, fontSize: 12, marginTop: 4 },
});
