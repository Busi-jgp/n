import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { INCIDENT_CONFIG } from "@/components/IncidentCard";
import type { Incident, IncidentType } from "@/context/AppContext";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const PRETORIA_CENTER = {
  latitude: -25.7831,
  longitude: 28.2756,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const FILTERS: { key: IncidentType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "suspicious", label: "Suspicious" },
  { key: "break-in", label: "Break-ins" },
  { key: "all-clear", label: "All Clear" },
  { key: "load-shedding", label: "Eskom" },
  { key: "road-hazard", label: "Roads" },
  { key: "protest", label: "Protests" },
];

function SafetyScore({ incidents }: { incidents: Incident[] }) {
  const colors = useColors();
  const recent = incidents.filter(
    (i) => Date.now() - i.timestamp < 2 * 60 * 60 * 1000
  );
  const dangerous = recent.filter(
    (i) => i.type === "break-in" || i.type === "suspicious"
  ).length;
  const score = dangerous === 0 ? "High" : dangerous < 3 ? "Medium" : "Low";
  const scoreColor =
    score === "High"
      ? colors.success
      : score === "Medium"
      ? colors.warning
      : colors.danger;

  return (
    <View style={[styles.scoreCard, { backgroundColor: colors.card }]}>
      <View>
        <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>
          Safety Level
        </Text>
        <Text style={[styles.scoreValue, { color: scoreColor }]}>{score}</Text>
      </View>
      <View style={[styles.scoreDot, { backgroundColor: scoreColor + "25" }]}>
        <View style={[styles.scoreDotInner, { backgroundColor: scoreColor }]} />
      </View>
    </View>
  );
}

interface Props {
  filter: IncidentType | "all";
  onFilterChange: (f: IncidentType | "all") => void;
  onReportPress: () => void;
}

export default function SafetyMap({ filter, onFilterChange, onReportPress }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { incidents } = useApp();
  const [selected, setSelected] = useState<Incident | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView>(null);
  const slideAnim = useRef(new Animated.Value(200)).current;

  const filtered = filter === "all" ? incidents : incidents.filter((i) => i.type === filter);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      }
    })();
  }, []);

  const handleMarkerPress = (incident: Incident) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(incident);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  };

  const closeDetail = () => {
    Animated.timing(slideAnim, {
      toValue: 200,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSelected(null));
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={PRETORIA_CENTER}
        showsUserLocation={!!userLocation}
        showsMyLocationButton={false}
      >
        {filtered.map((incident) => {
          const cfg = INCIDENT_CONFIG[incident.type];
          return (
            <Marker
              key={incident.id}
              coordinate={{ latitude: incident.latitude, longitude: incident.longitude }}
              onPress={() => handleMarkerPress(incident)}
            >
              <View style={[styles.markerContainer, { backgroundColor: cfg.color }]}>
                <Feather name={cfg.icon as any} size={14} color="#fff" />
              </View>
              <Callout tooltip>
                <View style={[styles.callout, { backgroundColor: colors.card }]}>
                  <Text style={[styles.calloutTitle, { color: colors.foreground }]}>
                    {incident.title}
                  </Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <View style={[styles.topOverlay, { top: insets.top + 12 }]}>
        <SafetyScore incidents={incidents} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingTop: 10 }}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => {
                Haptics.selectionAsync();
                onFilterChange(f.key);
              }}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filter === f.key ? colors.primary : colors.card,
                  borderColor: filter === f.key ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={{
                  color: filter === f.key ? colors.primaryForeground : colors.foreground,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[
          styles.myLocationBtn,
          { bottom: insets.bottom + 110, backgroundColor: colors.card },
        ]}
        onPress={() => {
          if (userLocation) {
            mapRef.current?.animateToRegion(
              { ...userLocation, latitudeDelta: 0.02, longitudeDelta: 0.02 },
              800
            );
          }
        }}
      >
        <Feather name="navigation" size={20} color={colors.primary} />
      </TouchableOpacity>

      {selected && (
        <Animated.View
          style={[
            styles.detailSheet,
            {
              backgroundColor: colors.card,
              bottom: insets.bottom + 84,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.detailClose} onPress={closeDetail}>
            <Feather name="x" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
          <View
            style={[
              styles.detailBadge,
              { backgroundColor: INCIDENT_CONFIG[selected.type].color + "20" },
            ]}
          >
            <Feather
              name={INCIDENT_CONFIG[selected.type].icon as any}
              size={14}
              color={INCIDENT_CONFIG[selected.type].color}
            />
            <Text
              style={{ color: INCIDENT_CONFIG[selected.type].color, fontSize: 12, fontWeight: "600" }}
            >
              {INCIDENT_CONFIG[selected.type].label}
            </Text>
          </View>
          <Text style={[styles.detailTitle, { color: colors.foreground }]}>
            {selected.title}
          </Text>
          <Text style={[styles.detailDesc, { color: colors.mutedForeground }]}>
            {selected.description}
          </Text>
          <View style={styles.detailFooter}>
            <Text style={[styles.detailMeta, { color: colors.mutedForeground }]}>
              {selected.upvotes} confirmations
            </Text>
            <TouchableOpacity
              onPress={onReportPress}
              style={[styles.detailBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={{ color: colors.primaryForeground, fontSize: 13, fontWeight: "700" }}>
                Report Similar
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  topOverlay: { position: "absolute", left: 0, right: 0 },
  scoreCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreLabel: { fontSize: 11, fontWeight: "500", marginBottom: 2 },
  scoreValue: { fontSize: 18, fontWeight: "800" },
  scoreDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreDotInner: { width: 14, height: 14, borderRadius: 7 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  callout: {
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  calloutTitle: { fontSize: 12, fontWeight: "600", maxWidth: 180 },
  myLocationBtn: {
    position: "absolute",
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  detailSheet: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  detailClose: { position: "absolute", top: 14, right: 14, padding: 4 },
  detailBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  detailTitle: { fontSize: 16, fontWeight: "800", marginBottom: 6 },
  detailDesc: { fontSize: 13, lineHeight: 18, marginBottom: 14 },
  detailFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailMeta: { fontSize: 12 },
  detailBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
});
