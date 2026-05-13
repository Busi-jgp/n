import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { INCIDENT_CONFIG } from "@/components/IncidentCard";
import type { IncidentType } from "@/context/AppContext";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const CATEGORIES: { type: IncidentType; label: string; description: string }[] = [
  { type: "suspicious", label: "Suspicious Activity", description: "Person or vehicle acting suspiciously" },
  { type: "break-in", label: "Break-in / Crime", description: "Active crime or vehicle break-in" },
  { type: "protest", label: "Protest / Blockade", description: "Road blocked or demonstrations" },
  { type: "road-hazard", label: "Road Hazard", description: "Potholes, accidents, floods" },
  { type: "load-shedding", label: "Load Shedding", description: "Power outage in the area" },
  { type: "all-clear", label: "All Clear", description: "Area checked and safe" },
];

const TITLES: Record<IncidentType, string[]> = {
  suspicious: ["Suspicious person", "Slow-moving vehicle", "Unusual activity"],
  "break-in": ["Car break-in in progress", "Smash and grab", "House break-in"],
  protest: ["Road blocked", "Service delivery protest", "Traffic disruption"],
  "road-hazard": ["Large pothole", "Accident on road", "Flooded road"],
  "load-shedding": ["Stage 2 load-shedding", "Stage 4 load-shedding", "Unplanned outage"],
  "all-clear": ["All clear — area safe", "Neighbourhood watch patrolled", "Situation resolved"],
};

export default function ReportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addIncident } = useApp();

  const [selectedType, setSelectedType] = useState<IncidentType | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const topPadding = Platform.OS === "web" ? insets.top + 67 : insets.top;

  const handleSubmit = async () => {
    if (!selectedType) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitting(true);

    let latitude = -25.7831;
    let longitude = 28.2756;

    if (Platform.OS !== "web") {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          latitude = loc.coords.latitude;
          longitude = loc.coords.longitude;
        }
      } catch {}
    }

    const titles = TITLES[selectedType];
    const title = titles[0];

    addIncident({
      type: selectedType,
      title,
      description: description.trim() || INCIDENT_CONFIG[selectedType].label + " reported in the area.",
      latitude,
      longitude,
    });

    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedType(null);
      setDescription("");
      router.push("/(tabs)/alerts");
    }, 1800);
  };

  if (submitted) {
    return (
      <View style={[styles.successContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.successIcon, { backgroundColor: colors.success + "20" }]}>
          <Feather name="check-circle" size={48} color={colors.success} />
        </View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>Alert Sent</Text>
        <Text style={[styles.successText, { color: colors.mutedForeground }]}>
          Your alert has been shared with nearby residents. Thank you for keeping the neighbourhood safe.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.container, { paddingTop: topPadding + 16, paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 90 }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.heading, { color: colors.foreground }]}>Quick Report</Text>
      <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
        What's happening in your area?
      </Text>

      <View style={styles.grid}>
        {CATEGORIES.map((cat) => {
          const cfg = INCIDENT_CONFIG[cat.type];
          const isSelected = selectedType === cat.type;
          return (
            <TouchableOpacity
              key={cat.type}
              activeOpacity={0.8}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedType(cat.type);
              }}
              style={[
                styles.categoryCard,
                {
                  backgroundColor: isSelected ? cfg.color + "15" : colors.card,
                  borderColor: isSelected ? cfg.color : colors.border,
                },
              ]}
            >
              <View style={[styles.categoryIcon, { backgroundColor: cfg.color + "20" }]}>
                <Feather name={cfg.icon as any} size={22} color={cfg.color} />
              </View>
              <Text style={[styles.categoryLabel, { color: colors.foreground }]} numberOfLines={2}>
                {cat.label}
              </Text>
              <Text style={[styles.categoryDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                {cat.description}
              </Text>
              {isSelected && (
                <View style={[styles.selectedCheck, { backgroundColor: cfg.color }]}>
                  <Feather name="check" size={12} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedType && (
        <View style={{ marginTop: 8 }}>
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
            Add details (optional)
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.foreground,
              },
            ]}
            placeholder="Describe what you see..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
            maxLength={200}
          />

          <View style={[styles.disclaimer, { backgroundColor: colors.muted }]}>
            <Feather name="info" size={14} color={colors.mutedForeground} />
            <Text style={[styles.disclaimerText, { color: colors.mutedForeground }]}>
              Reports are shared with verified users within 2km. Please only report what you've personally witnessed.
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.85}
            style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: submitting ? 0.7 : 1 }]}
          >
            {submitting ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <>
                <Feather name="send" size={18} color={colors.primaryForeground} />
                <Text style={[styles.submitText, { color: colors.primaryForeground }]}>
                  Send Alert
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  heading: { fontSize: 26, fontWeight: "800", marginBottom: 4 },
  subheading: { fontSize: 14, marginBottom: 24 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "47%",
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    position: "relative",
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  categoryLabel: { fontSize: 14, fontWeight: "700", marginBottom: 4 },
  categoryDesc: { fontSize: 11, lineHeight: 15 },
  selectedCheck: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: { fontSize: 15, fontWeight: "700", marginBottom: 10, marginTop: 4 },
  textInput: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    fontSize: 14,
    minHeight: 90,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  disclaimer: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  disclaimerText: { fontSize: 12, lineHeight: 17, flex: 1 },
  submitBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitText: { fontSize: 16, fontWeight: "800" },
  successContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 16 },
  successIcon: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center" },
  successTitle: { fontSize: 24, fontWeight: "800" },
  successText: { fontSize: 14, textAlign: "center", lineHeight: 20 },
});
