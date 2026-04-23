import { Feather, FontAwesome5 } from "@expo/vector-icons";
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

import { useColors } from "@/hooks/useColors";
import { LoginApiError, loginWithPassword } from "./(auth)/login-api";
import { RegisterApiError, registerWithPassword } from "./(auth)/register-api";

type Mode = "login" | "register";

const TRUST_METRICS = [
  { value: "Privado", label: "acesso seguro" },
  { value: "IA", label: "memória organizada" },
  { value: "Sync", label: "fluxo contínuo" },
];

function getAuthErrorMessage(error: unknown) {
  if (error instanceof LoginApiError || error instanceof RegisterApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível autenticar agora. Tente novamente.";
}

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit() {
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (mode === "login") {
        await loginWithPassword({ email, password });
        router.replace("/(tabs)");
        return;
      }

      const result = await registerWithPassword({ name, email, password });
      if (result.requiresEmailConfirmation) {
        setSuccessMessage("Conta criada. Verifique seu email para confirmar o acesso.");
        return;
      }

      router.replace("/(tabs)");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: "#FBFBFE" }]}>
      <LinearGradient
        colors={["rgba(94,76,235,0.12)", "rgba(94,76,235,0.03)", "rgba(251,251,254,0)"]}
        locations={[0, 0.38, 1]}
        style={styles.topGradient}
      />
      <View style={styles.ambientOrb} />

      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Platform.OS === "web" ? 72 : insets.top + 28,
              paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandRow}>
            <Text style={[styles.brandText, { color: colors.heading }]}>NOTURA</Text>
            <View style={styles.brandPill}>
              <Text style={[styles.brandPillText, { color: colors.primary }]}>Executive Access</Text>
            </View>
          </View>

          <View style={styles.heroPanel}>
            <Text style={[styles.heroTitle, { color: colors.heading }]}>Entre com clareza.</Text>
            <Text style={[styles.heroSubtitle, { color: colors.bodyText }]}>
              Workspace de reuniões com memória organizada para decisões rápidas, contexto confiável e execução sem ruído.
            </Text>

            <View style={styles.metricRow}>
              {TRUST_METRICS.map((metric) => (
                <View key={metric.label} style={styles.metricCard}>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View
            style={[
              styles.card,
              Platform.OS === "ios" && styles.cardShadowIos,
              Platform.OS === "android" && styles.cardShadowAndroid,
              Platform.OS === "web" && styles.cardShadowWeb,
            ]}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={[styles.cardEyebrow, { color: colors.primary }]}>
                  {mode === "login" ? "Entrar" : "Criar conta"}
                </Text>
                <Text style={[styles.cardTitle, { color: colors.heading }]}>
                  {mode === "login" ? "Acesse seu workspace" : "Crie seu acesso"}
                </Text>
              </View>
              <View style={styles.modeSwitcher}>
                {(["login", "register"] as Mode[]).map((currentMode) => (
                  <TouchableOpacity
                    key={currentMode}
                    style={[
                      styles.modeTab,
                      currentMode === mode && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setMode(currentMode)}
                    activeOpacity={0.84}
                  >
                    <Text
                      style={[
                        styles.modeTabText,
                        { color: currentMode === mode ? "#FFFFFF" : colors.gray600 },
                      ]}
                    >
                      {currentMode === "login" ? "Entrar" : "Criar conta"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {mode === "register" ? (
              <View style={styles.fieldWrap}>
                <Text style={[styles.fieldLabel, { color: colors.gray600 }]}>Nome completo</Text>
                <View style={styles.inputWrap}>
                  <Feather name="user" size={16} color={colors.gray400} />
                  <TextInput
                    style={[styles.input, { color: colors.heading }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Henry Costa"
                    placeholderTextColor={colors.gray400}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            ) : null}

            <View style={styles.fieldWrap}>
              <Text style={[styles.fieldLabel, { color: colors.gray600 }]}>Email</Text>
              <View style={styles.inputWrap}>
                <Feather name="mail" size={16} color={colors.gray400} />
                <TextInput
                  style={[styles.input, { color: colors.heading }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="voce@empresa.com"
                  placeholderTextColor={colors.gray400}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={[styles.fieldLabel, { color: colors.gray600 }]}>Senha</Text>
              <View style={styles.inputWrap}>
                <Feather name="lock" size={16} color={colors.gray400} />
                <TextInput
                  style={[styles.input, { color: colors.heading }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.gray400}
                  secureTextEntry={!showPw}
                />
                <TouchableOpacity
                  onPress={() => setShowPw((current) => !current)}
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

            {mode === "login" ? (
              <TouchableOpacity style={styles.forgotWrap} activeOpacity={0.8}>
                <Text style={[styles.forgotText, { color: colors.primary }]}>Esqueceu sua senha?</Text>
              </TouchableOpacity>
            ) : null}

            {errorMessage.length > 0 ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            {successMessage.length > 0 ? (
              <Text style={styles.successText}>{successMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleSubmit}
              activeOpacity={0.9}
              disabled={loading}
            >
              {loading ? (
                <Feather name="loader" size={18} color="#FFFFFF" />
              ) : (
                <Text style={styles.submitText}>
                  {mode === "login" ? "Continuar" : "Criar conta"}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={[styles.divider, { backgroundColor: "rgba(28,28,30,0.08)" }]} />
              <Text style={[styles.dividerText, { color: colors.gray400 }]}>ou continue com</Text>
              <View style={[styles.divider, { backgroundColor: "rgba(28,28,30,0.08)" }]} />
            </View>

            <View style={styles.socialRow}>
              {[
                { name: "Google", icon: "google", disabled: false },
                { name: "Apple", icon: "apple", disabled: true, suffix: " em breve" },
              ].map((provider) => (
                <TouchableOpacity
                  key={provider.name}
                  style={[
                    styles.socialBtn,
                    provider.disabled && { opacity: 0.55 },
                  ]}
                  activeOpacity={0.84}
                  disabled={provider.disabled}
                >
                  <FontAwesome5 name={provider.icon} size={16} color={colors.gray700} />
                  <Text style={[styles.socialText, { color: colors.gray700 }]}>
                    {provider.name}{provider.suffix ?? ""}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setMode(mode === "login" ? "register" : "login")}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, { color: colors.gray500 }]}>
              {mode === "login" ? "Ainda não tem acesso? " : "Já possui uma conta? "}
              <Text style={[styles.toggleLink, { color: colors.primary }]}>
                {mode === "login" ? "Criar conta" : "Entrar"}
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
    height: 340,
  },
  ambientOrb: {
    position: "absolute",
    top: 54,
    right: -26,
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: "rgba(94,76,235,0.07)",
  },
  kav: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 24,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2.2,
  },
  brandPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(94,76,235,0.08)",
  },
  brandPillText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  heroPanel: {
    gap: 12,
    paddingTop: 8,
  },
  heroTitle: {
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "700",
    letterSpacing: -1.5,
    maxWidth: 280,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 330,
  },
  metricRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  metricCard: {
    flex: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "rgba(255,255,255,0.74)",
    borderWidth: 1,
    borderColor: "rgba(28,28,30,0.04)",
  },
  metricValue: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: "#1C1C1E",
  },
  metricLabel: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 14,
    color: "#6D6D72",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(28,28,30,0.05)",
  },
  cardShadowIos: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
  },
  cardShadowAndroid: {
    elevation: 3,
  },
  cardShadowWeb: {
    boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
  } as any,
  cardHeader: {
    gap: 14,
  },
  cardEyebrow: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "700",
    letterSpacing: -0.6,
  },
  modeSwitcher: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 16,
    backgroundColor: "rgba(94,76,235,0.08)",
    gap: 4,
  },
  modeTab: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: "600",
  },
  fieldWrap: {
    gap: 7,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.55,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 16,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: -2,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 12,
    color: "#C92727",
  },
  successText: {
    fontSize: 12,
    color: "#1D9E75",
  },
  submitBtn: {
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  submitText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.1,
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
    gap: 10,
  },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: "#F2F2F7",
  },
  socialText: {
    fontSize: 13,
    fontWeight: "500",
  },
  toggleText: {
    fontSize: 13,
    textAlign: "center",
  },
  toggleLink: {
    fontWeight: "600",
  },
});
