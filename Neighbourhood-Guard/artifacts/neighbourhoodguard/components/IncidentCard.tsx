import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { Incident, IncidentType } from "@/context/AppContext";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export const INCIDENT_CONFIG: Record<
  IncidentType,
  { label: string; color: string; icon: string; iconLib: "feather" | "material" }
> = {
  suspicious: {
    label: "Suspicious",
    color: "#F6AD55",
    icon: "eye",
    iconLib: "feather",
  },
  "break-in": {
    label: "Break-in",
    color: "#E53E3E",
    icon: "alert-circle",
    iconLib: "feather",
  },
  protest: {
    label: "Protest",
    color: "#ED8936",
    icon: "users",
    iconLib: "feather",
  },
  "road-hazard": {
    label: "Road Hazard",
    color: "#ECC94B",
    icon: "alert-triangle",
    iconLib: "feather",
  },
  "load-shedding": {
    label: "Load Shedding",
    color: "#A0AEC0",
    icon: "zap-off",
    iconLib: "feather",
  },
  "all-clear": {
    label: "All Clear",
    color: "#27AE60",
    icon: "check-circle",
    iconLib: "feather",
  },
};

interface Props {
  incident: Incident;
  onPress?: () => void;
}

export default function IncidentCard({ incident, onPress }: Props) {
  const colors = useColors();
  const { upvoteIncident } = useApp();
  const config = INCIDENT_CONFIG[incident.type];

  const handleUpvote = () => {
    if (!incident.upvotedByMe) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      upvoteIncident(incident.id);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: config.color + "20" }]}>
          <Feather name={config.icon as any} size={14} color={config.color} />
          <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
        </View>
        <Text style={[styles.time, { color: colors.mutedForeground }]}>
          {timeAgo(incident.timestamp)}
        </Text>
      </View>

      <Text style={[styles.title, { color: colors.foreground }]}>{incident.title}</Text>
      <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
        {incident.description}
      </Text>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleUpvote}
          activeOpacity={0.7}
          style={styles.upvoteBtn}
        >
          <Feather
            name="chevrons-up"
            size={16}
            color={incident.upvotedByMe ? colors.primary : colors.mutedForeground}
          />
          <Text
            style={[
              styles.upvoteText,
              { color: incident.upvotedByMe ? colors.primary : colors.mutedForeground },
            ]}
          >
            {incident.upvotes}
          </Text>
        </TouchableOpacity>
        <View style={styles.nearbyBadge}>
          <Feather name="map-pin" size={11} color={colors.mutedForeground} />
          <Text style={[styles.nearbyText, { color: colors.mutedForeground }]}>Nearby</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  upvoteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  upvoteText: {
    fontSize: 13,
    fontWeight: "600",
  },
  nearbyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  nearbyText: {
    fontSize: 11,
  },
});
