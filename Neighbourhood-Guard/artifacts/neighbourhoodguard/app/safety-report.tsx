import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Circle, G, Path, Svg, Text as SvgText } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { generateReport } from "@/data/reportData";
import { useColors } from "@/hooks/useColors";

// ─── Gauge ───────────────────────────────────────────────────────────────────

function ScoreGauge({ score }: { score: number }) {
  const colors = useColors();
  const size = 200;
  const strokeWidth = 18;
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2 + 20;

  const startAngle = -210;
  const sweepTotal = 240;
  const sweepFill = (score / 100) * sweepTotal;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const arcPath = (cx: number, cy: number, r: number, startDeg: number, sweepDeg: number) => {
    const start = toRad(startDeg);
    const end = toRad(startDeg + sweepDeg);
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = sweepDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  const scoreColor =
    score >= 80 ? "#27AE60" : score >= 60 ? "#F6AD55" : score >= 40 ? "#ED8936" : "#E53E3E";
  const scoreLabel = score >= 80 ? "High" : score >= 60 ? "Medium" : score >= 40 ? "Caution" : "Low";

  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={size} height={size - 20}>
        <G>
          <Path
            d={arcPath(cx, cy, r, startAngle, sweepTotal)}
            fill="none"
            stroke={colors.border}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {score > 0 && (
            <Path
              d={arcPath(cx, cy, r, startAngle, sweepFill)}
              fill="none"
              stroke={scoreColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          )}
          <SvgText
            x={cx}
            y={cy - 10}
            textAnchor="middle"
            fontSize="44"
            fontWeight="900"
            fill={colors.foreground}
          >
            {score}
          </SvgText>
          <SvgText
            x={cx}
            y={cy + 18}
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill={scoreColor}
          >
            {scoreLabel} Safety
          </SvgText>
        </G>
      </Svg>
    </View>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function TimeBarChart({ blocks }: { blocks: { shortLabel: string; count: number; riskLevel: string }[] }) {
  const colors = useColors();
  const maxCount = Math.max(...blocks.map((b) => b.count), 1);
  const chartH = 80;
  const barW = 28;
  const gap = 8;
  const totalW = blocks.length * (barW + gap) - gap;

  const riskColor: Record<string, string> = {
    low: "#27AE60",
    medium: "#F6AD55",
    high: "#E53E3E",
  };

  return (
    <Svg width={totalW + 4} height={chartH + 32}>
      {blocks.map((b, i) => {
        const barH = Math.max((b.count / maxCount) * chartH, 4);
        const x = i * (barW + gap);
        const y = chartH - barH;
        const color = riskColor[b.riskLevel] ?? colors.primary;
        return (
          <G key={b.shortLabel}>
            <Path
              d={`M ${x + 4} ${y + barH} L ${x + 4} ${y + 4} Q ${x + 4} ${y} ${x + 8} ${y} L ${x + barW - 4} ${y} Q ${x + barW} ${y} ${x + barW} ${y + 4} L ${x + barW} ${y + barH} Z`}
              fill={color}
              opacity={0.9}
            />
            <SvgText
              x={x + barW / 2}
              y={chartH + 14}
              textAnchor="middle"
              fontSize="9"
              fill={colors.mutedForeground}
            >
              {b.shortLabel.split(" ")[0]}
            </SvgText>
            {b.count > 0 && (
              <SvgText
                x={x + barW / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={color}
              >
                {b.count}
              </SvgText>
            )}
          </G>
        );
      })}
    </Svg>
  );
}

function DayBarChart({ days }: { days: { short: string; count: number }[] }) {
  const colors = useColors();
  const maxCount = Math.max(...days.map((d) => d.count), 1);
  const chartH = 60;
  const barW = 28;
  const gap = 8;
  const totalW = days.length * (barW + gap) - gap;

  const weekend = ["Sat", "Sun"];

  return (
    <Svg width={totalW + 4} height={chartH + 28}>
      {days.map((d, i) => {
        const barH = Math.max((d.count / maxCount) * chartH, 3);
        const x = i * (barW + gap);
        const y = chartH - barH;
        const color = weekend.includes(d.short) ? "#E53E3E" : colors.primary;
        return (
          <G key={d.short}>
            <Path
              d={`M ${x + 4} ${y + barH} L ${x + 4} ${y + 4} Q ${x + 4} ${y} ${x + 8} ${y} L ${x + barW - 4} ${y} Q ${x + barW} ${y} ${x + barW} ${y + 4} L ${x + barW} ${y + barH} Z`}
              fill={color}
              opacity={0.85}
            />
            <SvgText
              x={x + barW / 2}
              y={chartH + 14}
              textAnchor="middle"
              fontSize="9"
              fill={colors.mutedForeground}
            >
              {d.short}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

// ─── Main Report Screen ────────────────────────────────────────────────────────

export default function SafetyReportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { incidents } = useApp();
  const { user, subscription } = useAuth();

  const report = useMemo(
    () => generateReport(incidents, user?.suburb ?? "Pretoria"),
    [incidents, user?.suburb]
  );

  const isPremium = subscription.tier !== "free";
  const scoreDelta = report.safetyScore - report.lastMonthScore;
  const incidentDelta = report.totalIncidents - report.lastMonthIncidents;
  const topPadding = Platform.OS === "web" ? insets.top + 67 : insets.top;

  const routeColors: Record<string, { bg: string; text: string; icon: string }> = {
    safe: { bg: colors.successLight, text: colors.success, icon: "check-circle" },
    caution: { bg: colors.warningLight, text: "#E67E22", icon: "alert-triangle" },
    avoid: { bg: colors.dangerLight, text: colors.danger, icon: "x-circle" },
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={["#0B7A8A", "#064A56"]}
        style={[styles.headerBg, { paddingTop: topPadding + 8, paddingBottom: 24 }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Safety Report</Text>
            <Text style={styles.headerSub}>
              {report.month} {report.year} · {report.suburb}
            </Text>
          </View>
          <View style={{ width: 38 }} />
        </View>

        <ScoreGauge score={report.safetyScore} />

        <View style={styles.deltaRow}>
          <Feather
            name={scoreDelta >= 0 ? "trending-up" : "trending-down"}
            size={15}
            color={scoreDelta >= 0 ? "#7DCEA0" : "#F1948A"}
          />
          <Text style={[styles.deltaText, { color: scoreDelta >= 0 ? "#7DCEA0" : "#F1948A" }]}>
            {Math.abs(scoreDelta)} pts {scoreDelta >= 0 ? "better" : "worse"} than last month
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            {
              label: "Incidents",
              value: report.totalIncidents,
              delta: incidentDelta,
              lessIsBetter: true,
              icon: "alert-circle",
            },
            {
              label: "Resolved",
              value: report.resolvedIncidents,
              delta: null,
              lessIsBetter: false,
              icon: "check-circle",
            },
            {
              label: "Last Month",
              value: report.lastMonthIncidents,
              delta: null,
              lessIsBetter: false,
              icon: "calendar",
            },
          ].map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name={stat.icon as any} size={16} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.foreground }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{stat.label}</Text>
              {stat.delta !== null && (
                <Text style={{ fontSize: 10, fontWeight: "700", color: (stat.delta > 0) === stat.lessIsBetter ? colors.danger : colors.success }}>
                  {stat.delta > 0 ? "+" : ""}{stat.delta}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Peak Times */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="clock" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Peak Danger Times</Text>
          </View>
          <Text style={[styles.cardSub, { color: colors.mutedForeground }]}>
            Incidents by time of day this month
          </Text>
          <View style={styles.chartWrap}>
            <TimeBarChart blocks={report.peakTimes} />
          </View>
          <View style={styles.legendRow}>
            {(["low", "medium", "high"] as const).map((lvl) => (
              <View key={lvl} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: lvl === "high" ? "#E53E3E" : lvl === "medium" ? "#F6AD55" : "#27AE60" }]} />
                <Text style={[styles.legendText, { color: colors.mutedForeground }]}>
                  {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Day of Week */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="calendar" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Day of Week Breakdown</Text>
          </View>
          <Text style={[styles.cardSub, { color: colors.mutedForeground }]}>
            Weekends (red) are consistently higher risk
          </Text>
          <View style={styles.chartWrap}>
            <DayBarChart days={report.dayOfWeek} />
          </View>
        </View>

        {/* Incident Type Breakdown */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="pie-chart" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Incident Breakdown</Text>
          </View>
          <View style={styles.typeList}>
            {report.typeBreakdown.map((t) => {
              const maxCount = Math.max(...report.typeBreakdown.map((x) => x.count), 1);
              const pct = (t.count / maxCount) * 100;
              return (
                <View key={t.type} style={styles.typeRow}>
                  <View style={styles.typeHeader}>
                    <View style={[styles.typeDot, { backgroundColor: t.color }]} />
                    <Text style={[styles.typeLabel, { color: colors.foreground }]}>{t.label}</Text>
                    <Text style={[styles.typeCount, { color: colors.mutedForeground }]}>{t.count}</Text>
                    <Text style={[styles.typeChange, { color: t.change < 0 ? colors.success : t.change > 0 ? colors.danger : colors.mutedForeground }]}>
                      {t.change > 0 ? "+" : ""}{t.change !== 0 ? `${t.change}%` : "—"}
                    </Text>
                  </View>
                  <View style={[styles.typeBarBg, { backgroundColor: colors.muted }]}>
                    <View style={[styles.typeBarFill, { width: `${pct}%`, backgroundColor: t.color }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Safest Routes */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="navigation" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Route Safety Ratings</Text>
          </View>
          <Text style={[styles.cardSub, { color: colors.mutedForeground }]}>
            Based on {report.month} incident patterns in {report.suburb}
          </Text>
          <View style={styles.routeList}>
            {report.routes.map((route) => {
              const rc = routeColors[route.safety];
              return (
                <View key={route.name} style={[styles.routeCard, { backgroundColor: rc.bg, borderColor: rc.text + "30" }]}>
                  <Feather name={rc.icon as any} size={18} color={rc.text} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.routeName, { color: rc.text }]}>{route.name}</Text>
                    <Text style={[styles.routeNote, { color: colors.mutedForeground }]}>{route.note}</Text>
                  </View>
                  <View style={[styles.routeBadge, { backgroundColor: rc.text }]}>
                    <Text style={styles.routeBadgeText}>
                      {route.safety.charAt(0).toUpperCase() + route.safety.slice(1)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Recommendations */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="star" size={16} color="#F6AD55" />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Recommendations</Text>
          </View>
          <View style={styles.recList}>
            {report.recommendations.map((rec, i) => (
              <View key={i} style={[styles.recCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <View style={[styles.recIcon, { backgroundColor: colors.primary + "15" }]}>
                  <Feather name={rec.icon as any} size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.recTitle, { color: colors.foreground }]}>{rec.title}</Text>
                  <Text style={[styles.recDetail, { color: colors.mutedForeground }]}>{rec.detail}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.footerNote, { borderColor: colors.border }]}>
          <Feather name="info" size={13} color={colors.mutedForeground} />
          <Text style={[styles.footerNoteText, { color: colors.mutedForeground }]}>
            Report generated from community-reported incidents in your area. Data is user-generated and not officially verified. Last updated: {new Date().toLocaleDateString("en-ZA")}.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBg: { paddingHorizontal: 20, alignItems: "center" },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 12 },
  backBtn: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  headerCenter: { alignItems: "center" },
  headerTitle: { fontSize: 17, fontWeight: "800", color: "#fff" },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  deltaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: -8, marginBottom: 8 },
  deltaText: { fontSize: 13, fontWeight: "700" },
  content: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: "center", gap: 4 },
  statValue: { fontSize: 26, fontWeight: "900" },
  statLabel: { fontSize: 11, textAlign: "center" },
  card: { borderRadius: 18, borderWidth: 1, padding: 18, gap: 10 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: "800" },
  cardSub: { fontSize: 12, lineHeight: 16, marginTop: -4 },
  chartWrap: { alignItems: "center", paddingVertical: 8 },
  legendRow: { flexDirection: "row", justifyContent: "center", gap: 16 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11 },
  typeList: { gap: 12 },
  typeRow: { gap: 6 },
  typeHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  typeDot: { width: 10, height: 10, borderRadius: 5 },
  typeLabel: { fontSize: 13, fontWeight: "600", flex: 1 },
  typeCount: { fontSize: 13, fontWeight: "700" },
  typeChange: { fontSize: 11, fontWeight: "700", width: 36, textAlign: "right" },
  typeBarBg: { height: 7, borderRadius: 4, overflow: "hidden" },
  typeBarFill: { height: "100%", borderRadius: 4 },
  routeList: { gap: 10 },
  routeCard: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  routeName: { fontSize: 13, fontWeight: "800", marginBottom: 3 },
  routeNote: { fontSize: 12, lineHeight: 16 },
  routeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  routeBadgeText: { color: "#fff", fontSize: 10, fontWeight: "900" },
  recList: { gap: 10 },
  recCard: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  recIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  recTitle: { fontSize: 13, fontWeight: "800", marginBottom: 4 },
  recDetail: { fontSize: 12, lineHeight: 17 },
  footerNote: { flexDirection: "row", gap: 8, paddingTop: 12, borderTopWidth: 1, alignItems: "flex-start" },
  footerNoteText: { fontSize: 11, lineHeight: 16, flex: 1 },
});
