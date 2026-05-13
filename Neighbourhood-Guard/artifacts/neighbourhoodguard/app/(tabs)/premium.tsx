import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { SubscriptionTier } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

interface Plan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  tagline: string;
  color: string;
  gradient: [string, string];
  features: string[];
  securityTeam: boolean;
  sos: boolean;
  news: boolean;
}

const PLANS: Plan[] = [
  {
    tier: "neighbourhood",
    name: "Neighbourhood Watch",
    price: 149,
    tagline: "Stay informed about your area",
    color: "#2980B9",
    gradient: ["#2980B9", "#1A5276"],
    securityTeam: false,
    sos: false,
    news: true,
    features: [
      "Local suburb news feed (updated hourly)",
      "5 km radius alert coverage",
      "Up to 10 trusted contacts",
      "Weather & load-shedding schedule",
      "Ad-free experience",
    ],
  },
  {
    tier: "estate",
    name: "Estate Pro",
    price: 349,
    tagline: "Full estate protection suite",
    color: "#0B7A8A",
    gradient: ["#0B7A8A", "#064A56"],
    securityTeam: true,
    sos: true,
    news: true,
    features: [
      "Everything in Neighbourhood Watch",
      "Link your security company as a contact",
      "SOS panic button — instant alert to security",
      "10 km radius alert coverage",
      "Priority alert notifications",
      "Unlimited trusted contacts",
    ],
  },
  {
    tier: "family",
    name: "Family Guardian",
    price: 599,
    tagline: "Complete family safety cover",
    color: "#6B3FA0",
    gradient: ["#8E44AD", "#5B2C6F"],
    securityTeam: true,
    sos: true,
    news: true,
    features: [
      "Everything in Estate Pro",
      "Track up to 5 family members (coming soon)",
      "Dedicated 24/7 support line",
      "Advanced safest route planning",
      "Monthly suburb safety report",
      "Early access to new features",
    ],
  },
];

function SecurityTeamModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const colors = useColors();
  const { setSecurityTeam } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) return;
    await setSecurityTeam({ name: name.trim(), phone: phone.trim() });
    setName("");
    setPhone("");
    onClose();
    Alert.alert("Security team linked!", "They'll receive your SOS alerts instantly.");
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[secStyles.container, { backgroundColor: colors.background }]}>
        <View style={[secStyles.header, { borderBottomColor: colors.border }]}>
          <Text style={[secStyles.title, { color: colors.foreground }]}>Link Security Team</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={secStyles.content} keyboardShouldPersistTaps="handled">
          <View style={[secStyles.iconBox, { backgroundColor: colors.danger + "15" }]}>
            <Feather name="shield" size={36} color={colors.danger} />
          </View>
          <Text style={[secStyles.desc, { color: colors.mutedForeground }]}>
            Add your private security company or armed response team. In an SOS situation, they'll receive an instant SMS with your name and location.
          </Text>

          <View style={secStyles.fields}>
            <View style={secStyles.field}>
              <Text style={[secStyles.label, { color: colors.foreground }]}>Company / team name</Text>
              <View style={[secStyles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="shield" size={16} color={colors.mutedForeground} />
                <TextInput
                  style={[secStyles.input, { color: colors.foreground }]}
                  placeholder="e.g. ADT, Fidelity, Blue Security"
                  placeholderTextColor={colors.mutedForeground}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>
            <View style={secStyles.field}>
              <Text style={[secStyles.label, { color: colors.foreground }]}>Emergency number</Text>
              <View style={[secStyles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="phone" size={16} color={colors.mutedForeground} />
                <TextInput
                  style={[secStyles.input, { color: colors.foreground }]}
                  placeholder="e.g. 0800 12 3456"
                  placeholderTextColor={colors.mutedForeground}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          <View style={[secStyles.tip, { backgroundColor: colors.warningLight, borderColor: colors.warning + "40" }]}>
            <Feather name="info" size={14} color={colors.warning} />
            <Text style={[secStyles.tipText, { color: colors.mutedForeground }]}>
              Always verify the number with your security company before saving. Keep it up to date.
            </Text>
          </View>

          <TouchableOpacity
            style={[secStyles.saveBtn, { backgroundColor: colors.danger, opacity: (!name || !phone) ? 0.5 : 1 }]}
            onPress={handleSave}
            disabled={!name || !phone}
          >
            <Feather name="link" size={18} color="#fff" />
            <Text style={secStyles.saveBtnText}>Link Security Team</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function PremiumScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { subscription, activateSubscription, cancelSubscription, contacts, removeSecurityTeam } = useAuth();
  const [showSecModal, setShowSecModal] = useState(false);
  const [activating, setActivating] = useState<SubscriptionTier | null>(null);

  const securityTeam = contacts.find((c) => c.isSecurityTeam);
  const isActive = (tier: SubscriptionTier) => subscription.tier === tier;
  const topPadding = Platform.OS === "web" ? insets.top + 67 : insets.top;

  const openYoco = (plan: Plan) => {
    const amounts: Record<string, string> = {
      neighbourhood: "14900",
      estate: "34900",
      family: "59900",
    };
    const url = `https://pay.yoco.com/neighbourhoodguard?amount=${amounts[plan.tier] ?? "14900"}&description=${encodeURIComponent(plan.name + " subscription")}`;
    Linking.openURL(url).catch(() =>
      Linking.openURL("https://www.yoco.com/za/")
    );
  };

  const handleActivate = (plan: Plan) => {
    Alert.alert(
      `Activate ${plan.name}`,
      `R${plan.price}/month · Cancel any time`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Pay with Yoco",
          onPress: () => openYoco(plan),
        },
        {
          text: "Activate (Demo)",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await activateSubscription(plan.tier);
            if (plan.securityTeam && !securityTeam) {
              setTimeout(() => setShowSecModal(true), 600);
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert("Cancel subscription?", "You'll lose access to premium features.", [
      { text: "Keep Plan", style: "cancel" },
      { text: "Cancel", style: "destructive", onPress: cancelSubscription },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: topPadding + 16, paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={[styles.heading, { color: colors.foreground }]}>Premium Plans</Text>
          <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
            Upgrade for location-specific news, security team integration, and more
          </Text>

          {subscription.tier !== "free" && (
            <>
              <View style={[styles.currentBadge, { backgroundColor: colors.success + "18", borderColor: colors.success + "40" }]}>
                <Feather name="check-circle" size={14} color={colors.success} />
                <Text style={[styles.currentBadgeText, { color: colors.success }]}>
                  Active: {PLANS.find((p) => p.tier === subscription.tier)?.name}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.reportBtn, { backgroundColor: "#0B7A8A" }]}
                onPress={() => router.push("/safety-report")}
                activeOpacity={0.85}
              >
                <Feather name="bar-chart-2" size={17} color="#fff" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reportBtnTitle}>View Monthly Safety Report</Text>
                  <Text style={styles.reportBtnSub}>Score, peak times, routes &amp; recommendations</Text>
                </View>
                <Feather name="chevron-right" size={17} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {subscription.tier === "free" && (
          <View style={[styles.freeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.freePlanRow}>
              <View>
                <Text style={[styles.freePlanName, { color: colors.foreground }]}>Free</Text>
                <Text style={[styles.freePlanPrice, { color: colors.mutedForeground }]}>R0/month · Current plan</Text>
              </View>
              <View style={[styles.freeCheck, { backgroundColor: colors.muted }]}>
                <Feather name="check" size={14} color={colors.mutedForeground} />
              </View>
            </View>
            <View style={styles.freeFeatures}>
              {["Safety map with community markers", "Basic alerts feed", "Quick incident reporting", "2 trusted contacts", "Walk-home check-in"].map((f) => (
                <View key={f} style={styles.featureRow}>
                  <Feather name="check" size={13} color={colors.success} />
                  <Text style={[styles.featureText, { color: colors.mutedForeground }]}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Upgrade your plan</Text>

        {PLANS.map((plan, idx) => {
          const active = isActive(plan.tier);
          return (
            <View key={plan.tier} style={[styles.planCard, { borderColor: active ? plan.color : colors.border }]}>
              {idx === 1 && (
                <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}
              <LinearGradient
                colors={plan.gradient}
                style={styles.planHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planTagline}>{plan.tagline}</Text>
                </View>
                <View style={styles.priceBox}>
                  <Text style={styles.pricePrefix}>R</Text>
                  <Text style={styles.priceAmount}>{plan.price}</Text>
                  <Text style={styles.pricePeriod}>/mo</Text>
                </View>
              </LinearGradient>

              <View style={[styles.planBody, { backgroundColor: colors.card }]}>
                {plan.sos && (
                  <View style={[styles.sosHighlight, { backgroundColor: colors.dangerLight, borderColor: colors.danger + "30" }]}>
                    <Feather name="alert-circle" size={14} color={colors.danger} />
                    <Text style={[styles.sosHighlightText, { color: colors.danger }]}>
                      Includes SOS panic button + security team link
                    </Text>
                  </View>
                )}
                {plan.news && !plan.sos && (
                  <View style={[styles.sosHighlight, { backgroundColor: "#EBF8FF", borderColor: "#BEE3F8" }]}>
                    <Feather name="rss" size={14} color="#2980B9" />
                    <Text style={[styles.sosHighlightText, { color: "#2980B9" }]}>
                      Includes local suburb news feed
                    </Text>
                  </View>
                )}

                <View style={styles.features}>
                  {plan.features.map((f) => (
                    <View key={f} style={styles.featureRow}>
                      <Feather name="check-circle" size={14} color={plan.color} />
                      <Text style={[styles.featureText, { color: colors.foreground }]}>{f}</Text>
                    </View>
                  ))}
                </View>

                {active ? (
                  <View style={styles.activeActions}>
                    {plan.securityTeam && (
                      <TouchableOpacity
                        style={[styles.secBtn, { borderColor: colors.danger, backgroundColor: colors.dangerLight }]}
                        onPress={() => setShowSecModal(true)}
                      >
                        <Feather name="shield" size={16} color={colors.danger} />
                        <Text style={[styles.secBtnText, { color: colors.danger }]}>
                          {securityTeam ? `Security: ${securityTeam.name}` : "Link Security Team"}
                        </Text>
                        {securityTeam && <Feather name="edit-2" size={13} color={colors.danger} />}
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.cancelBtn, { borderColor: colors.border }]}
                      onPress={handleCancel}
                    >
                      <Text style={[styles.cancelBtnText, { color: colors.mutedForeground }]}>Cancel Plan</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.activateBtn, { backgroundColor: plan.color }]}
                    onPress={() => handleActivate(plan)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.activateBtnText}>Activate — R{plan.price}/month</Text>
                    <Feather name="arrow-right" size={16} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="lock" size={16} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Secure payments via PayFast · Cancel anytime · Full POPIA compliance · No hidden fees
          </Text>
        </View>
      </ScrollView>

      <SecurityTeamModal visible={showSecModal} onClose={() => setShowSecModal(false)} />
    </View>
  );
}

const secStyles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
  },
  title: { fontSize: 18, fontWeight: "800" },
  content: { padding: 24, gap: 20, alignItems: "center" },
  iconBox: { width: 80, height: 80, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  desc: { fontSize: 14, lineHeight: 20, textAlign: "center" },
  fields: { width: "100%", gap: 14 },
  field: { gap: 8 },
  label: { fontSize: 14, fontWeight: "700" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15 },
  tip: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  tipText: { flex: 1, fontSize: 12, lineHeight: 17 },
  saveBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 15,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  headerSection: { marginBottom: 20, gap: 6 },
  heading: { fontSize: 26, fontWeight: "800" },
  subheading: { fontSize: 14, lineHeight: 20 },
  currentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  currentBadgeText: { fontSize: 13, fontWeight: "700" },
  freeCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 20 },
  freePlanRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  freePlanName: { fontSize: 16, fontWeight: "800" },
  freePlanPrice: { fontSize: 12, marginTop: 2 },
  freeCheck: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  freeFeatures: { gap: 8 },
  sectionLabel: { fontSize: 15, fontWeight: "700", marginBottom: 12 },
  planCard: { borderRadius: 20, borderWidth: 1.5, overflow: "hidden", marginBottom: 16 },
  popularBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignItems: "center",
  },
  popularText: { color: "#fff", fontSize: 12, fontWeight: "800" },
  planHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 18,
  },
  planName: { fontSize: 17, fontWeight: "900", color: "#fff", marginBottom: 4 },
  planTagline: { fontSize: 12, color: "rgba(255,255,255,0.75)" },
  priceBox: { flexDirection: "row", alignItems: "flex-end" },
  pricePrefix: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 4 },
  priceAmount: { fontSize: 36, fontWeight: "900", color: "#fff", lineHeight: 40 },
  pricePeriod: { fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 4 },
  planBody: { padding: 18, gap: 14 },
  sosHighlight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  sosHighlightText: { fontSize: 13, fontWeight: "700", flex: 1 },
  features: { gap: 10 },
  featureRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  featureText: { fontSize: 13, lineHeight: 18, flex: 1 },
  activeActions: { gap: 10 },
  secBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  secBtnText: { fontSize: 13, fontWeight: "700", flex: 1 },
  cancelBtn: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 11,
  },
  cancelBtnText: { fontSize: 13, fontWeight: "600" },
  activateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
  },
  activateBtnText: { fontSize: 14, fontWeight: "800", color: "#fff" },
  infoBox: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
    alignItems: "flex-start",
  },
  infoText: { fontSize: 12, lineHeight: 17, flex: 1 },
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 4,
  },
  reportBtnTitle: { fontSize: 14, fontWeight: "800", color: "#fff" },
  reportBtnSub: { fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 1 },
});
