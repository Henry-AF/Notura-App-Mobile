import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type Mode = "login" | "register";

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useApp();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login(email);
    router.replace("/(tabs)");
    setLoading(false);
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#5341CD22", "#5341CD00"]}
        style={styles.topGradient}
      />

      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Platform.OS === "web" ? 80 : insets.top + 40,
              paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoWrap}>
            <View
              style={[
                styles.logoIcon,
                { backgroundColor: colors.primary },
              ]}
            >
              <Feather name="mic" size={28} color="#fff" />
            </View>
            <Text style={[styles.logoText, { color: colors.foreground }]}>
              Notura
            </Text>
            <Text style={[styles.logoTagline, { color: colors.gray500 }]}>
              AI Meeting Assistant
            </Text>
          </View>

          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.modeSwitcher}>
              {(["login", "register"] as Mode[]).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.modeTab,
                    {
                      backgroundColor:
                        mode === m ? colors.primary : "transparent",
                    },
                  ]}
                  onPress={() => setMode(m)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.modeTabText,
                      { color: mode === m ? "#fff" : colors.gray500 },
                    ]}
                  >
                    {m === "login" ? "Sign In" : "Sign Up"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {mode === "register" && (
              <View style={styles.fieldWrap}>
                <Text style={[styles.fieldLabel, { color: colors.gray600 }]}>
                  Full name
                </Text>
                <View
                  style={[
                    styles.inputWrap,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Feather name="user" size={16} color={colors.gray400} />
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Henry Costa"
                    placeholderTextColor={colors.gray300}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            <View style={styles.fieldWrap}>
              <Text style={[styles.fieldLabel, { color: colors.gray600 }]}>
                Email
              </Text>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Feather name="mail" size={16} color={colors.gray400} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.gray300}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={[styles.fieldLabel, { color: colors.gray600 }]}>
                Password
              </Text>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Feather name="lock" size={16} color={colors.gray400} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.gray300}
                  secureTextEntry={!showPw}
                />
                <TouchableOpacity
                  onPress={() => setShowPw(!showPw)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather
                    name={showPw ? "eye-off" : "eye"}
                    size={16}
                    color={colors.gray400}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {mode === "login" && (
              <TouchableOpacity style={styles.forgotWrap}>
                <Text style={[styles.forgotText, { color: colors.primary }]}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <Feather name="loader" size={20} color="#fff" />
              ) : (
                <Text style={styles.submitText}>
                  {mode === "login" ? "Sign In" : "Create account"}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <Text style={[styles.dividerText, { color: colors.gray400 }]}>
                or continue with
              </Text>
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
            </View>

            <View style={styles.socialRow}>
              {["Google", "Apple"].map((provider) => (
                <TouchableOpacity
                  key={provider}
                  style={[
                    styles.socialBtn,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={provider === "Apple" ? "smartphone" : "globe"}
                    size={18}
                    color={colors.gray600}
                  />
                  <Text
                    style={[styles.socialText, { color: colors.gray700 }]}
                  >
                    {provider}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity onPress={() => setMode(mode === "login" ? "register" : "login")}>
            <Text style={[styles.toggleText, { color: colors.gray500 }]}>
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <Text style={[{ color: colors.primary, fontWeight: "600" }]}>
                {mode === "login" ? "Sign up" : "Sign in"}
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  kav: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 24,
  },
  logoWrap: {
    alignItems: "center",
    gap: 8,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5341CD",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
  },
  logoTagline: {
    fontSize: 14,
  },
  card: {
    borderRadius: 24,
    borderWidth: 0.5,
    padding: 24,
    gap: 16,
  },
  modeSwitcher: {
    flexDirection: "row",
    backgroundColor: "rgba(83,65,205,0.08)",
    borderRadius: 12,
    padding: 3,
    gap: 2,
  },
  modeTab: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modeTabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  fieldWrap: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: -8,
  },
  forgotText: {
    fontSize: 13,
  },
  submitBtn: {
    height: 52,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
  },
  socialText: {
    fontSize: 14,
    fontWeight: "500",
  },
  toggleText: {
    fontSize: 13,
    textAlign: "center",
  },
});
