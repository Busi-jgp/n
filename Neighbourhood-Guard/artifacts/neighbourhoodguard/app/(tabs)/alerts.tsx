import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import IncidentCard, { INCIDENT_CONFIG } from "@/components/IncidentCard";
import type { IncidentType } from "@/context/AppContext";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useGroup } from "@/context/GroupContext";
import {
  CATEGORY_COLORS,
  type NewsArticle,
  getNewsForSuburb,
  timeAgoNews,
} from "@/data/newsData";
import { useColors } from "@/hooks/useColors";

const FILTERS: { key: IncidentType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "suspicious", label: "Suspicious" },
  { key: "break-in", label: "Break-ins" },
  { key: "protest", label: "Protests" },
  { key: "road-hazard", label: "Roads" },
  { key: "load-shedding", label: "Eskom" },
  { key: "all-clear", label: "All Clear" },
];

function NewsCard({ article }: { article: NewsArticle }) {
  const colors = useColors();
  const catColor = CATEGORY_COLORS[article.category];

  return (
    <View style={[newsStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={newsStyles.cardHeader}>
        <View style={[newsStyles.catBadge, { backgroundColor: catColor + "18" }]}>
          <View style={[newsStyles.catDot, { backgroundColor: catColor }]} />
          <Text style={[newsStyles.catText, { color: catColor }]}>
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </Text>
        </View>
        <Text style={[newsStyles.timeText, { color: colors.mutedForeground }]}>
          {timeAgoNews(article.timestamp)}
        </Text>
      </View>
      <Text style={[newsStyles.headline, { color: colors.foreground }]} numberOfLines={2}>
        {article.headline}
      </Text>
      <Text style={[newsStyles.summary, { color: colors.mutedForeground }]} numberOfLines={3}>
        {article.summary}
      </Text>
      <View style={newsStyles.cardFooter}>
        <View style={[newsStyles.suburbBadge, { backgroundColor: colors.primary + "15" }]}>
          <Feather name="map-pin" size={11} color={colors.primary} />
          <Text style={[newsStyles.suburbText, { color: colors.primary }]}>{article.suburb}</Text>
        </View>
        <Text style={[newsStyles.source, { color: colors.mutedForeground }]}>{article.source}</Text>
      </View>
    </View>
  );
}

function PremiumNewsTeaser({ suburb }: { suburb: string }) {
  const colors = useColors();
  return (
    <View style={[teaserStyles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <LinearGradientFallback>
        <View style={teaserStyles.content}>
          <Feather name="rss" size={28} color="#2980B9" />
          <Text style={teaserStyles.title}>Local News Feed</Text>
          <Text style={teaserStyles.subtitle}>
            Get real-time safety news and crime updates specific to{" "}
            <Text style={{ fontWeight: "700" }}>{suburb || "your suburb"}</Text> — updated hourly
          </Text>
          <TouchableOpacity
            style={teaserStyles.btn}
            onPress={() => router.push("/(tabs)/premium")}
          >
            <Text style={teaserStyles.btnText}>Unlock from R149/month →</Text>
          </TouchableOpacity>
        </View>
      </LinearGradientFallback>
    </View>
  );
}

function LinearGradientFallback({ children }: { children: React.ReactNode }) {
  return <View style={{ padding: 20, alignItems: "center", gap: 10 }}>{children}</View>;
}

function WatchGroupBanner({ suburb }: { suburb: string }) {
  const colors = useColors();
  const { joined, group, members } = useGroup();
  return (
    <TouchableOpacity
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/neighbourhood-group"); }}
      activeOpacity={0.85}
      style={[groupBannerStyles.card, { backgroundColor: joined ? colors.primary : colors.card, borderColor: joined ? colors.primary : colors.border }]}
    >
      <View style={[groupBannerStyles.iconBox, { backgroundColor: joined ? "rgba(255,255,255,0.18)" : colors.primary + "15" }]}>
        <Feather name="shield" size={20} color={joined ? "#fff" : colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[groupBannerStyles.title, { color: joined ? "#fff" : colors.foreground }]}>
          {joined && group ? group.name : `${suburb || "Your"} Watch Group`}
        </Text>
        <Text style={[groupBannerStyles.sub, { color: joined ? "rgba(255,255,255,0.75)" : colors.mutedForeground }]}>
          {joined ? `${members.length} members · Tap to view feed` : "Join your neighbourhood watch group"}
        </Text>
      </View>
      <View style={[groupBannerStyles.badge, { backgroundColor: joined ? "rgba(255,255,255,0.2)" : colors.success + "18" }]}>
        <View style={[groupBannerStyles.dot, { backgroundColor: joined ? "#fff" : colors.success }]} />
        <Text style={[groupBannerStyles.badgeText, { color: joined ? "#fff" : colors.success }]}>
          {joined ? "Active" : "Open"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const groupBannerStyles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 16, borderWidth: 1, padding: 14, marginHorizontal: 16, marginTop: 10, marginBottom: 4 },
  iconBox: { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 13, fontWeight: "800" },
  sub: { fontSize: 11, marginTop: 2 },
  badge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: "700" },
});

export default function AlertsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { incidents } = useApp();
  const { subscription, user } = useAuth();
  const [filter, setFilter] = useState<IncidentType | "all">("all");
  const [activeTab, setActiveTab] = useState<"alerts" | "news">("alerts");

  const isPremium = subscription.tier !== "free";
  const suburb = user?.suburb ?? "";

  const sorted = [...incidents].sort((a, b) => b.timestamp - a.timestamp);
  const filtered = filter === "all" ? sorted : sorted.filter((i) => i.type === filter);

  const recentCount = incidents.filter(
    (i) => Date.now() - i.timestamp < 60 * 60 * 1000
  ).length;

  const newsArticles = getNewsForSuburb(suburb);
  const topPadding = Platform.OS === "web" ? insets.top + 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 16, backgroundColor: colors.background }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.heading, { color: colors.foreground }]}>Community Alerts</Text>
            <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
              {recentCount > 0 ? `${recentCount} alert${recentCount > 1 ? "s" : ""} in the last hour` : `${suburb || "Your area"} · Pretoria`}
            </Text>
          </View>
          <View style={[styles.liveBadge, { backgroundColor: colors.success + "18" }]}>
            <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.liveText, { color: colors.success }]}>Live</Text>
          </View>
        </View>

        <View style={[styles.tabRow, { borderBottomColor: colors.border }]}>
          {(["alerts", "news"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveTab(tab);
              }}
              style={[
                styles.tabBtn,
                { borderBottomColor: activeTab === tab ? colors.primary : "transparent" },
              ]}
            >
              <Feather
                name={tab === "alerts" ? "bell" : "rss"}
                size={14}
                color={activeTab === tab ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  { color: activeTab === tab ? colors.primary : colors.mutedForeground },
                ]}
              >
                {tab === "alerts" ? "Alerts" : "Local News"}
              </Text>
              {tab === "news" && !isPremium && (
                <View style={[styles.premiumDot, { backgroundColor: "#F6AD55" }]}>
                  <Text style={styles.premiumDotText}>PRO</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === "alerts" ? (
        <>
          <WatchGroupBanner suburb={suburb} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
            style={{ maxHeight: 52 }}
          >
            {FILTERS.map((f) => {
              const isActive = filter === f.key;
              const cfg = f.key !== "all" ? INCIDENT_CONFIG[f.key as IncidentType] : null;
              return (
                <TouchableOpacity
                  key={f.key}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setFilter(f.key);
                  }}
                  activeOpacity={0.75}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isActive ? colors.primary : colors.card,
                      borderColor: isActive ? colors.primary : colors.border,
                    },
                  ]}
                >
                  {cfg && (
                    <View
                      style={[
                        styles.filterDot,
                        { backgroundColor: isActive ? "rgba(255,255,255,0.7)" : cfg.color },
                      ]}
                    />
                  )}
                  <Text
                    style={[
                      styles.filterText,
                      { color: isActive ? colors.primaryForeground : colors.foreground },
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.muted }]}>
                <Feather name="shield" size={32} color={colors.mutedForeground} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>All quiet</Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No alerts in your area right now.
              </Text>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <IncidentCard incident={item} />}
              contentContainerStyle={[
                styles.list,
                { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 90 },
              ]}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
            />
          )}
        </>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 90 },
          ]}
        >
          {isPremium ? (
            <>
              <View style={[styles.newsHeader, { backgroundColor: colors.secondary }]}>
                <Feather name="map-pin" size={13} color={colors.primary} />
                <Text style={[styles.newsHeaderText, { color: colors.primary }]}>
                  Showing news for {suburb || "Pretoria"} and nearby areas
                </Text>
              </View>
              {newsArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </>
          ) : (
            <>
              <PremiumNewsTeaser suburb={suburb} />
              <View style={[styles.blurOverlay, { backgroundColor: colors.background }]}>
                {newsArticles.slice(0, 2).map((article) => (
                  <View key={article.id} style={styles.lockedCard}>
                    <View style={[newsStyles.card, { backgroundColor: colors.card, borderColor: colors.border, opacity: 0.3 }]}>
                      <Text style={[newsStyles.headline, { color: colors.foreground }]} numberOfLines={1}>
                        {article.headline}
                      </Text>
                      <Text style={[newsStyles.summary, { color: colors.mutedForeground }]} numberOfLines={2}>
                        {article.summary}
                      </Text>
                    </View>
                    <View style={[styles.lockOverlay, { backgroundColor: colors.card + "CC" }]}>
                      <Feather name="lock" size={20} color={colors.mutedForeground} />
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const newsStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    gap: 8,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  catBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  catDot: { width: 6, height: 6, borderRadius: 3 },
  catText: { fontSize: 11, fontWeight: "700" },
  timeText: { fontSize: 11 },
  headline: { fontSize: 14, fontWeight: "800", lineHeight: 19 },
  summary: { fontSize: 12, lineHeight: 17 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  suburbBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  suburbText: { fontSize: 11, fontWeight: "600" },
  source: { fontSize: 11 },
});

const teaserStyles = StyleSheet.create({
  container: { borderRadius: 20, borderWidth: 1, overflow: "hidden", marginBottom: 14 },
  content: { alignItems: "center", gap: 8 },
  title: { fontSize: 18, fontWeight: "800", color: "#2980B9" },
  subtitle: { fontSize: 13, color: "#666", textAlign: "center", lineHeight: 19 },
  btn: { backgroundColor: "#2980B9", borderRadius: 20, paddingHorizontal: 18, paddingVertical: 9, marginTop: 4 },
  btnText: { color: "#fff", fontSize: 13, fontWeight: "800" },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 0, gap: 10 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  heading: { fontSize: 24, fontWeight: "800" },
  subheading: { fontSize: 13, marginTop: 2 },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4 },
  liveText: { fontSize: 12, fontWeight: "700" },
  tabRow: { flexDirection: "row", borderBottomWidth: 1 },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
  },
  tabBtnText: { fontSize: 13, fontWeight: "700" },
  premiumDot: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  premiumDotText: { color: "#fff", fontSize: 8, fontWeight: "900" },
  filterRow: { gap: 8, paddingHorizontal: 16, paddingVertical: 10, alignItems: "center" },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  filterDot: { width: 7, height: 7, borderRadius: 4 },
  filterText: { fontSize: 13, fontWeight: "600" },
  list: { paddingHorizontal: 16, paddingTop: 8 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingBottom: 100 },
  emptyIcon: { width: 72, height: 72, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptyText: { fontSize: 14 },
  newsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  newsHeaderText: { fontSize: 12, fontWeight: "600" },
  blurOverlay: {},
  lockedCard: { position: "relative", marginBottom: 10 },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
