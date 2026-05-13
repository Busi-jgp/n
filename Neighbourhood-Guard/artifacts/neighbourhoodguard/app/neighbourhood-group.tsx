import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  FlatList,
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
import { useGroup } from "@/context/GroupContext";
import {
  POST_TYPE_CONFIG,
  type GroupPost,
  getGroupForSuburb,
  memberInitials,
  timeAgo,
} from "@/data/groupData";
import { useColors } from "@/hooks/useColors";

const avatarPalette = ["#0B7A8A", "#27AE60", "#E67E22", "#8E44AD", "#2980B9", "#C0392B", "#16A085"];

function avatar(name: string, idx: number) {
  return avatarPalette[idx % avatarPalette.length];
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({ post, index, onReact }: { post: GroupPost; index: number; onReact: () => void }) {
  const colors = useColors();
  const cfg = POST_TYPE_CONFIG[post.type];
  const bg = avatar(post.authorName, index);
  const [reacted, setReacted] = useState(false);

  const handleReact = () => {
    if (reacted) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReacted(true);
    onReact();
  };

  return (
    <View style={[postStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={postStyles.header}>
        <View style={[postStyles.avatar, { backgroundColor: bg }]}>
          <Text style={postStyles.avatarText}>{memberInitials(post.authorName)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[postStyles.authorName, { color: colors.foreground }]}>{post.authorName}</Text>
          <Text style={[postStyles.timestamp, { color: colors.mutedForeground }]}>{timeAgo(post.timestamp)}</Text>
        </View>
        <View style={[postStyles.typeBadge, { backgroundColor: cfg.color + "18" }]}>
          <Feather name={cfg.icon as any} size={11} color={cfg.color} />
          <Text style={[postStyles.typeText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>
      <Text style={[postStyles.content, { color: colors.foreground }]}>{post.content}</Text>
      <View style={[postStyles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity onPress={handleReact} style={postStyles.reactBtn} activeOpacity={0.7}>
          <Feather name="thumbs-up" size={14} color={reacted ? colors.primary : colors.mutedForeground} />
          <Text style={[postStyles.reactCount, { color: reacted ? colors.primary : colors.mutedForeground }]}>
            {post.reactions + (reacted ? 1 : 0)}
          </Text>
        </TouchableOpacity>
        <View style={[postStyles.typeLine, { backgroundColor: cfg.color }]} />
      </View>
    </View>
  );
}

// ─── Post Composer ────────────────────────────────────────────────────────────

function PostComposer({ onPost }: { onPost: (content: string, type: GroupPost["type"]) => void }) {
  const colors = useColors();
  const [text, setText] = useState("");
  const [type, setType] = useState<GroupPost["type"]>("general");
  const [expanded, setExpanded] = useState(false);

  const submit = () => {
    if (!text.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onPost(text.trim(), type);
    setText("");
    setExpanded(false);
  };

  return (
    <View style={[compStyles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {expanded && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={compStyles.typeRow} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
          {(Object.entries(POST_TYPE_CONFIG) as [GroupPost["type"], (typeof POST_TYPE_CONFIG)[GroupPost["type"]]][]).map(([k, v]) => (
            <TouchableOpacity
              key={k}
              onPress={() => setType(k)}
              style={[compStyles.typeChip, { backgroundColor: type === k ? v.color : colors.muted, borderColor: type === k ? v.color : colors.border }]}
            >
              <Feather name={v.icon as any} size={12} color={type === k ? "#fff" : colors.mutedForeground} />
              <Text style={[compStyles.typeChipText, { color: type === k ? "#fff" : colors.mutedForeground }]}>{v.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <View style={compStyles.row}>
        <TextInput
          style={[compStyles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
          placeholder="Share an update with your group..."
          placeholderTextColor={colors.mutedForeground}
          value={text}
          onChangeText={setText}
          onFocus={() => setExpanded(true)}
          multiline
          maxLength={400}
        />
        <TouchableOpacity
          onPress={submit}
          disabled={!text.trim()}
          style={[compStyles.sendBtn, { backgroundColor: colors.primary, opacity: text.trim() ? 1 : 0.45 }]}
        >
          <Feather name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Join / Discover Screen ───────────────────────────────────────────────────

function JoinScreen({ suburb }: { suburb: string }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { joinGroup } = useGroup();
  const { user } = useAuth();
  const group = getGroupForSuburb(suburb);
  const [joining, setJoining] = useState(false);

  const handleJoin = async (g: typeof group) => {
    if (!g) return;
    setJoining(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await new Promise((r) => setTimeout(r, 500));
    joinGroup(g, user?.name ?? "Neighbour");
    setJoining(false);
  };

  const handleCreate = () => {
    Alert.alert(
      "Create a group",
      `No watch group exists for "${suburb}" yet.\n\nThis would create a new group and make you the admin. In a full release this would be registered with the City of Tshwane neighbourhood watch programme.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Create Group",
          onPress: () => {
            const newGroup = {
              id: "g-new-" + Date.now(),
              suburb,
              name: `${suburb} Neighbourhood Watch`,
              description: `Community watch group for ${suburb} residents.`,
              memberCount: 1,
              createdAt: Date.now(),
              admin: user?.name ?? "You",
            };
            joinGroup(newGroup, user?.name ?? "Neighbour");
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[
        joinStyles.container,
        { paddingTop: 24, paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[joinStyles.heroIcon, { backgroundColor: colors.primary + "15" }]}>
        <Feather name="shield" size={40} color={colors.primary} />
      </View>
      <Text style={[joinStyles.title, { color: colors.foreground }]}>
        {group ? `${group.name}` : `${suburb} Watch Group`}
      </Text>
      {group ? (
        <>
          <Text style={[joinStyles.desc, { color: colors.mutedForeground }]}>{group.description}</Text>
          <View style={[joinStyles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={joinStyles.stat}>
              <Text style={[joinStyles.statVal, { color: colors.foreground }]}>{group.memberCount}</Text>
              <Text style={[joinStyles.statLabel, { color: colors.mutedForeground }]}>Members</Text>
            </View>
            <View style={[joinStyles.statDivider, { backgroundColor: colors.border }]} />
            <View style={joinStyles.stat}>
              <Text style={[joinStyles.statVal, { color: colors.success }]}>Active</Text>
              <Text style={[joinStyles.statLabel, { color: colors.mutedForeground }]}>Status</Text>
            </View>
            <View style={[joinStyles.statDivider, { backgroundColor: colors.border }]} />
            <View style={joinStyles.stat}>
              <Text style={[joinStyles.statVal, { color: colors.foreground }]}>{group.suburb}</Text>
              <Text style={[joinStyles.statLabel, { color: colors.mutedForeground }]}>Suburb</Text>
            </View>
          </View>
          <View style={[joinStyles.adminCard, { backgroundColor: colors.secondary }]}>
            <Feather name="star" size={14} color={colors.primary} />
            <Text style={[joinStyles.adminText, { color: colors.primary }]}>Admin: {group.admin}</Text>
          </View>
          <TouchableOpacity
            style={[joinStyles.joinBtn, { backgroundColor: colors.primary, opacity: joining ? 0.7 : 1 }]}
            onPress={() => handleJoin(group)}
            disabled={joining}
            activeOpacity={0.85}
          >
            <Feather name="user-plus" size={20} color="#fff" />
            <Text style={joinStyles.joinBtnText}>{joining ? "Joining…" : "Join this group"}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={[joinStyles.desc, { color: colors.mutedForeground }]}>
            No watch group exists yet for {suburb}. You can create one and invite your neighbours.
          </Text>
          <TouchableOpacity
            style={[joinStyles.joinBtn, { backgroundColor: colors.primary }]}
            onPress={handleCreate}
            activeOpacity={0.85}
          >
            <Feather name="plus-circle" size={20} color="#fff" />
            <Text style={joinStyles.joinBtnText}>Create a Watch Group</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={[joinStyles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="lock" size={14} color={colors.mutedForeground} />
        <Text style={[joinStyles.infoText, { color: colors.mutedForeground }]}>
          Groups are suburb-private. Only residents in your area see posts. No personal data is shared with third parties.
        </Text>
      </View>
    </ScrollView>
  );
}

// ─── Main Group Screen ────────────────────────────────────────────────────────

export default function NeighbourhoodGroupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { group, posts, members, joined, addPost, reactToPost, leaveGroup } = useGroup();
  const [activeTab, setActiveTab] = useState<"feed" | "members">("feed");
  const topPadding = Platform.OS === "web" ? insets.top + 67 : insets.top;
  const suburb = user?.suburb ?? "Pretoria";

  const handlePost = (content: string, type: GroupPost["type"]) => {
    addPost(content, type, user?.name ?? "Neighbour", suburb);
  };

  const handleLeave = () => {
    Alert.alert("Leave group?", "You can rejoin at any time.", [
      { text: "Cancel", style: "cancel" },
      { text: "Leave", style: "destructive", onPress: leaveGroup },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      {/* Header */}
      <LinearGradient
        colors={["#0B7A8A", "#064A56"]}
        style={[styles.header, { paddingTop: topPadding + 8, paddingBottom: 0 }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {joined && group ? group.name : "Neighbourhood Watch"}
            </Text>
            {joined && group && (
              <Text style={styles.headerSub}>{group.memberCount + 1} members · {suburb}</Text>
            )}
          </View>
          {joined ? (
            <TouchableOpacity onPress={handleLeave} style={styles.backBtn}>
              <Feather name="log-out" size={18} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 38 }} />
          )}
        </View>

        {joined && (
          <View style={styles.tabRow}>
            {(["feed", "members"] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => { Haptics.selectionAsync(); setActiveTab(tab); }}
                style={[styles.tabBtn, { borderBottomColor: activeTab === tab ? "#fff" : "transparent" }]}
              >
                <Feather
                  name={tab === "feed" ? "message-square" : "users"}
                  size={14}
                  color={activeTab === tab ? "#fff" : "rgba(255,255,255,0.5)"}
                />
                <Text style={[styles.tabBtnText, { color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.5)" }]}>
                  {tab === "feed" ? "Feed" : `Members (${members.length})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </LinearGradient>

      {/* Content */}
      {!joined ? (
        <JoinScreen suburb={suburb} />
      ) : activeTab === "feed" ? (
        <>
          <FlatList
            data={posts}
            keyExtractor={(p) => p.id}
            renderItem={({ item, index }) => (
              <PostCard post={item} index={index} onReact={() => reactToPost(item.id)} />
            )}
            contentContainerStyle={[
              styles.feedList,
              { paddingBottom: Platform.OS === "ios" ? insets.bottom + 100 : 100 },
            ]}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
          />
          <PostComposer onPost={handlePost} />
        </>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(m) => m.id}
          renderItem={({ item, index }) => (
            <View
              style={[memberStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[memberStyles.avatar, { backgroundColor: avatarPalette[index % avatarPalette.length] }]}>
                <Text style={memberStyles.avatarText}>{memberInitials(item.name)}</Text>
                {item.active && (
                  <View style={[memberStyles.activeDot, { backgroundColor: "#27AE60", borderColor: colors.card }]} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <View style={memberStyles.nameRow}>
                  <Text style={[memberStyles.name, { color: colors.foreground }]}>{item.name}</Text>
                  {item.id === "me" && (
                    <View style={[memberStyles.youBadge, { backgroundColor: colors.primary + "18" }]}>
                      <Text style={[memberStyles.youBadgeText, { color: colors.primary }]}>You</Text>
                    </View>
                  )}
                  {item.role === "admin" && (
                    <View style={[memberStyles.adminBadge, { backgroundColor: "#F6AD55" + "25" }]}>
                      <Feather name="star" size={10} color="#F6AD55" />
                      <Text style={[memberStyles.adminBadgeText, { color: "#F6AD55" }]}>Admin</Text>
                    </View>
                  )}
                </View>
                <Text style={[memberStyles.joined, { color: colors.mutedForeground }]}>
                  {item.active ? "Active recently" : "Joined " + timeAgo(item.joinedAt)}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={[styles.feedList, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  backBtn: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#fff" },
  headerSub: { fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2 },
  tabRow: { flexDirection: "row" },
  tabBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12, borderBottomWidth: 2 },
  tabBtnText: { fontSize: 13, fontWeight: "700" },
  feedList: { paddingHorizontal: 16, paddingTop: 12 },
});

const postStyles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 10 },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 13, fontWeight: "800" },
  authorName: { fontSize: 14, fontWeight: "700" },
  timestamp: { fontSize: 11, marginTop: 1 },
  typeBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  typeText: { fontSize: 11, fontWeight: "700" },
  content: { fontSize: 14, lineHeight: 20 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTopWidth: 1 },
  reactBtn: { flexDirection: "row", alignItems: "center", gap: 5 },
  reactCount: { fontSize: 13, fontWeight: "700" },
  typeLine: { width: 3, height: 16, borderRadius: 2 },
});

const compStyles = StyleSheet.create({
  container: { borderTopWidth: 1, paddingBottom: Platform.OS === "ios" ? 20 : 12 },
  typeRow: {},
  row: { flexDirection: "row", alignItems: "flex-end", gap: 10, paddingHorizontal: 16, paddingTop: 10 },
  input: { flex: 1, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  typeChip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  typeChipText: { fontSize: 12, fontWeight: "700" },
});

const joinStyles = StyleSheet.create({
  container: { paddingHorizontal: 24, alignItems: "center", gap: 16 },
  heroIcon: { width: 80, height: 80, borderRadius: 24, alignItems: "center", justifyContent: "center", marginTop: 16 },
  title: { fontSize: 22, fontWeight: "800", textAlign: "center" },
  desc: { fontSize: 14, lineHeight: 21, textAlign: "center" },
  statsRow: { width: "100%", flexDirection: "row", borderRadius: 16, borderWidth: 1, paddingVertical: 16 },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statVal: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 11 },
  statDivider: { width: 1 },
  adminCard: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  adminText: { fontSize: 13, fontWeight: "700" },
  joinBtn: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 16, paddingVertical: 16 },
  joinBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  infoBox: { width: "100%", flexDirection: "row", gap: 10, padding: 14, borderRadius: 14, borderWidth: 1, alignItems: "flex-start" },
  infoText: { fontSize: 12, lineHeight: 17, flex: 1 },
});

const memberStyles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", position: "relative" },
  avatarText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  activeDot: { position: "absolute", bottom: 1, right: 1, width: 11, height: 11, borderRadius: 6, borderWidth: 2 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  name: { fontSize: 14, fontWeight: "700" },
  youBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  youBadgeText: { fontSize: 10, fontWeight: "800" },
  adminBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  adminBadgeText: { fontSize: 10, fontWeight: "800" },
  joined: { fontSize: 12, marginTop: 2 },
});
