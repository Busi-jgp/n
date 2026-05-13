import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const SA_SUBURBS = [
  "Waterkloof",
  "Lynnwood",
  "Centurion",
  "Menlyn",
  "Brooklyn",
  "Hatfield",
  "Faerie Glen",
  "Garsfontein",
  "Moreleta Park",
  "Sandton",
  "Midrand",
  "Fourways",
  "Other",
];

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();

  const [step, setStep] = useState<"welcome" | "form">("welcome");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [suburb, setSuburb] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) errs.name = "Please enter your full name";
    if (!phone.trim() || phone.replace(/\s/g, "").length < 9)
      errs.phone = "Please enter a valid phone number";
    if (!suburb) errs.suburb = "Please select your suburb";
    return errs;
  };

  const handleGetStarted = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const cleanPhone = phone.startsWith("0")
      ? "+27" + phone.slice(1).replace(/\s/g, "")
      : phone.replace(/\s/g, "");
    await signIn(name.trim(), cleanPhone, suburb);
    setLoading(false);
    router.replace("/(tabs)");
  };

  if (step === "welcome") {
    return (
      <LinearGradient
        colors={["#0B7A8A", "#064A56"]}
        style={[styles.welcomeContainer, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}
      >
        <View style={styles.welcomeContent}>
          <View style={styles.logoCircle}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logoImage}
              contentFit="contain"
            />
          </View>
          <Text style={styles.appName}>NeighbourhoodGuard</Text>
          <Text style={styles.tagline}>Hyper-local safety awareness{"\n"}for your neighbourhood</Text>

          <View style={styles.featureList}>
            {[
              { icon: "map", text: "Live safety map for your area" },
              { icon: "bell", text: "Real-time community alerts" },
              { icon: "navigation", text: "Safe route guidance" },
              { icon: "user-check", text: "Walk-home check-in" },
            ].map((f) => (
              <View key={f.icon} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Feather name={f.icon as any} size={16} color="#fff" />
                </View>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.welcomeFooter}>
          <TouchableOpacity
            style={styles.welcomeBtn}
            activeOpacity={0.85}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setStep("form");
            }}
          >
            <Text style={styles.welcomeBtnText}>Get Started</Text>
            <Feather name="arrow-right" size={20} color="#0B7A8A" />
          </TouchableOpacity>
          <Text style={styles.disclaimer}>
            By continuing, you agree to our Privacy Policy and POPIA compliance terms. Community alerts are user-generated and not officially verified.
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={[
          styles.formContainer,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => setStep("welcome")} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>

        <View style={styles.formHeader}>
          <Text style={[styles.formTitle, { color: colors.foreground }]}>Create your profile</Text>
          <Text style={[styles.formSubtitle, { color: colors.mutedForeground }]}>
            This helps verify you're a real neighbour. Your details stay private.
          </Text>
        </View>

        <View style={styles.fields}>
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.foreground }]}>Full name</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: errors.name ? colors.danger : colors.border }]}>
              <Feather name="user" size={18} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="e.g. Sarah van der Berg"
                placeholderTextColor={colors.mutedForeground}
                value={name}
                onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: "" })); }}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
            {errors.name ? <Text style={[styles.error, { color: colors.danger }]}>{errors.name}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.foreground }]}>Phone number</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: errors.phone ? colors.danger : colors.border }]}>
              <View style={[styles.prefix, { borderRightColor: colors.border }]}>
                <Text style={[styles.prefixText, { color: colors.mutedForeground }]}>🇿🇦</Text>
              </View>
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="082 123 4567"
                placeholderTextColor={colors.mutedForeground}
                value={phone}
                onChangeText={(t) => { setPhone(t); setErrors((e) => ({ ...e, phone: "" })); }}
                keyboardType="phone-pad"
                returnKeyType="next"
              />
            </View>
            {errors.phone ? <Text style={[styles.error, { color: colors.danger }]}>{errors.phone}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.foreground }]}>Your suburb / area</Text>
            {errors.suburb ? <Text style={[styles.error, { color: colors.danger }]}>{errors.suburb}</Text> : null}
            <View style={styles.suburbGrid}>
              {SA_SUBURBS.map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => { setSuburb(s); setErrors((e) => ({ ...e, suburb: "" })); }}
                  style={[
                    styles.suburbChip,
                    {
                      backgroundColor: suburb === s ? colors.primary : colors.card,
                      borderColor: suburb === s ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={{ color: suburb === s ? colors.primaryForeground : colors.foreground, fontSize: 13, fontWeight: "600" }}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleGetStarted}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Feather name="shield" size={20} color="#fff" />
              <Text style={styles.submitText}>Join NeighbourhoodGuard</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: { flex: 1, justifyContent: "space-between" },
  welcomeContent: { flex: 1, alignItems: "center", paddingHorizontal: 32, paddingTop: 20 },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  logoImage: { width: 70, height: 70 },
  appName: { fontSize: 28, fontWeight: "900", color: "#fff", marginBottom: 8 },
  tagline: { fontSize: 15, color: "rgba(255,255,255,0.75)", textAlign: "center", lineHeight: 22, marginBottom: 40 },
  featureList: { width: "100%", gap: 14 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: { fontSize: 15, color: "rgba(255,255,255,0.9)", fontWeight: "500" },
  welcomeFooter: { paddingHorizontal: 24, gap: 16 },
  welcomeBtn: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  welcomeBtnText: { fontSize: 17, fontWeight: "800", color: "#0B7A8A" },
  disclaimer: {
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 10,
  },
  formContainer: { paddingHorizontal: 24 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  formHeader: { marginBottom: 28 },
  formTitle: { fontSize: 26, fontWeight: "800", marginBottom: 6 },
  formSubtitle: { fontSize: 14, lineHeight: 20 },
  fields: { gap: 20, marginBottom: 28 },
  field: { gap: 8 },
  label: { fontSize: 14, fontWeight: "700" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15 },
  prefix: { paddingRight: 10, borderRightWidth: 1, marginRight: 4 },
  prefixText: { fontSize: 18 },
  error: { fontSize: 12, marginTop: -4 },
  suburbGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  suburbChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  submitBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  submitText: { fontSize: 16, fontWeight: "800", color: "#fff" },
});
