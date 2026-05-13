import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import SafetyMap from "@/components/SafetyMap";
import type { IncidentType } from "@/context/AppContext";

export default function MapScreen() {
  const [filter, setFilter] = useState<IncidentType | "all">("all");

  return (
    <View style={styles.container}>
      <SafetyMap
        filter={filter}
        onFilterChange={setFilter}
        onReportPress={() => router.push("/(tabs)/report")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
