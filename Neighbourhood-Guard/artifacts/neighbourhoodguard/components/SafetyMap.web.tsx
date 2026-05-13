import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { INCIDENT_CONFIG } from "@/components/IncidentCard";
import type { Incident, IncidentType } from "@/context/AppContext";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const FILTERS: { key: IncidentType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "suspicious", label: "Suspicious" },
  { key: "break-in", label: "Break-ins" },
  { key: "all-clear", label: "All Clear" },
  { key: "load-shedding", label: "Eskom" },
  { key: "road-hazard", label: "Roads" },
  { key: "protest", label: "Protests" },
];

interface Props {
  filter: IncidentType | "all";
  onFilterChange: (f: IncidentType | "all") => void;
  onReportPress: () => void;
}

export default function SafetyMap({ filter, onFilterChange }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { incidents } = useApp();

  const filtered = filter === "all" ? incidents : incidents.filter((i) => i.type === filter);
  const sorted = [...filtered].sort((a, b) => b.timestamp - a.timestamp);

  const recent = incidents.filter(
    (i) => Date.now() - i.timestamp < 2 * 60 * 60 * 1000
  );
  const dangerous = recent.filter(
    (i) => i.type === "break-in" || i.type === "suspicious"
  ).length;
  const score = dangerous === 0 ? "High" : dangerous < 3 ? "Medium" : "Low";
  const scoreColor =
    score === "High" ? colors.success : score === "Medium" ? colors.warning : colors.danger;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 67 + 12, backgroundColor: colors.background }]}>
        <View style={[styles.scoreRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.mapIcon, { backgroundColor: colors.primary + "15" }]}>
            <Feather name="map" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.mapLabel, { color: colors.mutedForeground }]}>Safety Map — Pretoria</Text>
            <Text style={[styles.mapSub, { color: colors.mutedForeground }]}>Interactive map available in the mobile app</Text>
          </View>
          <View style={[styles.scorePill, { backgroundColor: scoreColor + "20" }]}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>{score}</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          style={{ maxHeight: 50 }}
        >
          {FILTERS.map((f) => {
            const isActive = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => onFilterChange(f.key)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? colors.primary : colors.card,
                    borderColor: isActive ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={{ color: isActive ? colors.primaryForeground : colors.foreground, fontSize: 13, fontWeight: "600" }}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 34 + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {sorted.map((inc) => {
          const cfg = INCIDENT_CONFIG[inc.type];
          return (
            <View
              key={inc.id}
              style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.itemDot, { backgroundColor: cfg.color + "25" }]}>
                <Feather name={cfg.icon as any} size={16} color={cfg.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemTitle, { color: colors.foreground }]}>{inc.title}</Text>
                  <View style={[styles.itemBadge, { backgroundColor: cfg.color + "15" }]}>
                    <Text style={{ color: cfg.color, fontSize: 11, fontWeight: "600" }}>{cfg.label}</Text>
                  </View>
                </View>
                <Text style={[styles.itemDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                  {inc.description}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  mapIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  mapLabel: { fontSize: 13, fontWeight: "700" },
  mapSub: { fontSize: 11, marginTop: 1 },
  scorePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: "auto",
  },
  scoreText: { fontSize: 12, fontWeight: "700" },
  filterRow: { gap: 8, paddingBottom: 8, alignItems: "center" },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  list: { paddingHorizontal: 16, paddingTop: 4 },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  itemDot: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" },
  itemTitle: { fontSize: 14, fontWeight: "700", flex: 1 },
  itemBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  itemDesc: { fontSize: 12, lineHeight: 17 },
});
