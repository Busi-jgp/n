import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
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

import ContactPickerModal from "@/components/ContactPickerModal";
import type { TrustedContact } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import {
  canUseWhatsApp,
  sendToContactBestChannel,
  sendViaMessages,
  sendViaSMS,
  sendViaWhatsApp,
} from "@/utils/messaging";

const TIPS = [
  { icon: "eye", tip: "Stay aware of your surroundings. Avoid using your phone while walking." },
  { icon: "headphones", tip: "Keep one earphone out. Be alert to sounds around you." },
  { icon: "sun", tip: "Stick to well-lit, populated routes — especially at night." },
  { icon: "smartphone", tip: "Keep your phone out of sight in your pocket." },
  { icon: "users", tip: "Walk with a friend when possible, especially after dark." },
];

function formatDuration(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

const avatarColors = ["#0B7A8A", "#27AE60", "#E67E22", "#8E44AD", "#2980B9"];

// ─── Channel Picker ──────────────────────────────────────────────────────────

interface ChannelPickerProps {
  visible: boolean;
  contacts: TrustedContact[];
  message: string;
  onDone: () => void;
  onCancel: () => void;
}

function ChannelPicker({ visible, contacts, message, onDone, onCancel }: ChannelPickerProps) {
  const colors = useColors();
  const [whatsAppAvailable, setWhatsAppAvailable] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      canUseWhatsApp().then(setWhatsAppAvailable);
      setResult(null);
    }
  }, [visible]);

  const handleWhatsApp = async () => {
    if (sending) return;
    setSending(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // WhatsApp deep links work one at a time; open for each contact sequentially
    for (const contact of contacts) {
      await sendViaWhatsApp(contact.phone, message);
    }
    setResult(`Sent via WhatsApp to ${contacts.length} contact${contacts.length > 1 ? "s" : ""}`);
    setSending(false);
    setTimeout(onDone, 1400);
  };

  const handleMessages = async () => {
    if (sending) return;
    setSending(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (Platform.OS === "web") {
      Alert.alert(
        "Messages (demo)",
        `Would open iMessage/SMS for: ${contacts.map((c) => c.name).join(", ")}`
      );
      setSending(false);
      setTimeout(onDone, 400);
      return;
    }
    // Open native Messages for each contact (SMS/iMessage depending on device)
    for (const contact of contacts) {
      await sendViaMessages(contact.phone, message);
    }
    setResult(
      `Opened ${Platform.OS === "ios" ? "iMessage / SMS" : "SMS"} for ${contacts.length} contact${contacts.length > 1 ? "s" : ""}`
    );
    setSending(false);
    setTimeout(onDone, 1400);
  };

  const handleSMSAll = async () => {
    if (sending) return;
    setSending(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (Platform.OS === "web") {
      Alert.alert("SMS (demo)", `Would SMS: ${contacts.map((c) => c.name).join(", ")}`);
      setSending(false);
      setTimeout(onDone, 400);
      return;
    }
    await sendViaSMS(contacts.map((c) => c.phone), message);
    setResult(`SMS sent to ${contacts.length} contact${contacts.length > 1 ? "s" : ""}`);
    setSending(false);
    setTimeout(onDone, 1400);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={cpStyles.overlay}>
        <View style={[cpStyles.sheet, { backgroundColor: colors.card }]}>
          <View style={[cpStyles.handle, { backgroundColor: colors.border }]} />

          {result ? (
            <View style={cpStyles.resultBox}>
              <View style={[cpStyles.resultIcon, { backgroundColor: colors.successLight }]}>
                <Feather name="check-circle" size={30} color={colors.success} />
              </View>
              <Text style={[cpStyles.resultText, { color: colors.foreground }]}>{result}</Text>
            </View>
          ) : (
            <>
              <Text style={[cpStyles.title, { color: colors.foreground }]}>Notify via</Text>
              <Text style={[cpStyles.subtitle, { color: colors.mutedForeground }]}>
                {contacts.length} contact{contacts.length > 1 ? "s" : ""} selected — choose how to send
              </Text>

              <View style={cpStyles.channels}>
                {whatsAppAvailable && (
                  <TouchableOpacity
                    style={[cpStyles.channelBtn, { backgroundColor: "#25D366", opacity: sending ? 0.6 : 1 }]}
                    onPress={handleWhatsApp}
                    activeOpacity={0.85}
                    disabled={sending}
                  >
                    <View style={cpStyles.channelIcon}>
                      <Feather name="message-circle" size={22} color="#fff" />
                    </View>
                    <View style={cpStyles.channelText}>
                      <Text style={cpStyles.channelLabel}>WhatsApp</Text>
                      <Text style={cpStyles.channelDesc}>
                        Preferred · opens one conversation at a time
                      </Text>
                    </View>
                    <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.7)" />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[cpStyles.channelBtn, { backgroundColor: Platform.OS === "ios" ? "#147EFB" : "#34A853", opacity: sending ? 0.6 : 1 }]}
                  onPress={handleMessages}
                  activeOpacity={0.85}
                  disabled={sending}
                >
                  <View style={cpStyles.channelIcon}>
                    <Feather name="message-square" size={22} color="#fff" />
                  </View>
                  <View style={cpStyles.channelText}>
                    <Text style={cpStyles.channelLabel}>
                      {Platform.OS === "ios" ? "iMessage" : "Messages"}
                    </Text>
                    <Text style={cpStyles.channelDesc}>
                      {Platform.OS === "ios"
                        ? "Uses iMessage or SMS — opens each chat"
                        : "Opens native Messages app per contact"}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[cpStyles.channelBtn, { backgroundColor: colors.primary, opacity: sending ? 0.6 : 1 }]}
                  onPress={handleSMSAll}
                  activeOpacity={0.85}
                  disabled={sending}
                >
                  <View style={cpStyles.channelIcon}>
                    <Feather name="smartphone" size={22} color="#fff" />
                  </View>
                  <View style={cpStyles.channelText}>
                    <Text style={cpStyles.channelLabel}>SMS to all at once</Text>
                    <Text style={cpStyles.channelDesc}>
                      Send one SMS to {contacts.length > 1 ? `all ${contacts.length} contacts` : "the contact"} simultaneously
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[cpStyles.skipBtn, { borderColor: colors.border }]}
                onPress={onCancel}
              >
                <Text style={[cpStyles.skipText, { color: colors.mutedForeground }]}>Skip notification</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Contact Share Sheet ──────────────────────────────────────────────────────

interface ShareSheetProps {
  visible: boolean;
  onClose: () => void;
  onSend: (selected: TrustedContact[]) => void;
  contacts: TrustedContact[];
}

function ShareSheet({ visible, onClose, onSend, contacts }: ShareSheetProps) {
  const colors = useColors();
  const [selected, setSelected] = useState<string[]>([]);
  const personalContacts = contacts.filter((c) => !c.isSecurityTeam);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSend = () => {
    onSend(contacts.filter((c) => selected.includes(c.id)));
    setSelected([]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={shareStyles.overlay}>
        <View style={[shareStyles.sheet, { backgroundColor: colors.card }]}>
          <View style={[shareStyles.handle, { backgroundColor: colors.border }]} />
          <Text style={[shareStyles.title, { color: colors.foreground }]}>Who should know?</Text>
          <Text style={[shareStyles.subtitle, { color: colors.mutedForeground }]}>
            Select contacts to notify — you'll choose WhatsApp, iMessage, or SMS next
          </Text>

          {personalContacts.length === 0 ? (
            <View style={shareStyles.emptyBox}>
              <Feather name="users" size={22} color={colors.mutedForeground} />
              <Text style={[shareStyles.noContacts, { color: colors.mutedForeground }]}>
                No trusted contacts yet. Add some using the contacts button above.
              </Text>
            </View>
          ) : (
            <FlatList
              data={personalContacts}
              keyExtractor={(c) => c.id}
              style={{ maxHeight: 240 }}
              contentContainerStyle={{ gap: 8 }}
              renderItem={({ item, index }) => {
                const isSelected = selected.includes(item.id);
                return (
                  <TouchableOpacity
                    onPress={() => toggle(item.id)}
                    style={[
                      shareStyles.contactRow,
                      {
                        backgroundColor: isSelected ? colors.primary + "12" : colors.background,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        shareStyles.avatar,
                        { backgroundColor: avatarColors[index % avatarColors.length] },
                      ]}
                    >
                      <Text style={shareStyles.avatarText}>{initials(item.name)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[shareStyles.contactName, { color: colors.foreground }]}>
                        {item.name}
                      </Text>
                      <Text style={[shareStyles.contactPhone, { color: colors.mutedForeground }]}>
                        {item.phone}
                      </Text>
                    </View>
                    <View
                      style={[
                        shareStyles.checkbox,
                        {
                          borderColor: isSelected ? colors.primary : colors.border,
                          backgroundColor: isSelected ? colors.primary : "transparent",
                        },
                      ]}
                    >
                      {isSelected && <Feather name="check" size={13} color="#fff" />}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}

          <View style={shareStyles.actions}>
            <TouchableOpacity
              style={[shareStyles.skipBtn, { borderColor: colors.border }]}
              onPress={onClose}
            >
              <Text style={[shareStyles.skipText, { color: colors.mutedForeground }]}>Skip</Text>
            </TouchableOpacity>
            {personalContacts.length > 0 && (
              <TouchableOpacity
                style={[
                  shareStyles.sendBtn,
                  {
                    backgroundColor: colors.primary,
                    opacity: selected.length === 0 ? 0.45 : 1,
                  },
                ]}
                onPress={handleSend}
                disabled={selected.length === 0}
              >
                <Feather name="arrow-right" size={16} color="#fff" />
                <Text style={shareStyles.sendText}>
                  Next — {selected.length > 0 ? `${selected.length} selected` : "select contacts"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CheckInScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { checkIn, startCheckIn, endCheckIn } = useApp();
  const { contacts, user, subscription } = useAuth();

  const [destination, setDestination] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [showContacts, setShowContacts] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showChannelPicker, setShowChannelPicker] = useState(false);
  const [pendingContacts, setPendingContacts] = useState<TrustedContact[]>([]);
  const [pendingDestination, setPendingDestination] = useState("");
  const [sosLoading, setSosLoading] = useState(false);

  const topPadding = Platform.OS === "web" ? insets.top + 67 : insets.top;
  const securityTeam = contacts.find((c) => c.isSecurityTeam);
  const personalContacts = contacts.filter((c) => !c.isSecurityTeam);
  const hasSOS = subscription.tier === "estate" || subscription.tier === "family";

  useEffect(() => {
    if (!checkIn?.active) return;
    const interval = setInterval(() => setElapsed(Date.now() - checkIn.startTime), 1000);
    return () => clearInterval(interval);
  }, [checkIn]);

  // ── Step 1: enter destination → show contact picker
  const handleStart = () => {
    if (!destination.trim()) {
      Alert.alert("Where are you headed?", "Enter your destination before checking in.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPendingDestination(destination.trim());
    setShowShareSheet(true);
  };

  // ── Step 2: contacts chosen → show channel picker
  const handleContactsChosen = (selected: TrustedContact[]) => {
    setShowShareSheet(false);
    if (selected.length === 0) {
      doStartCheckIn([]);
      return;
    }
    setPendingContacts(selected);
    setTimeout(() => setShowChannelPicker(true), 300);
  };

  // ── Step 3: channel chosen / skipped → start check-in
  const doStartCheckIn = async (selectedContacts: TrustedContact[]) => {
    setShowChannelPicker(false);
    await startCheckIn(pendingDestination);
    setDestination("");
    setPendingContacts([]);
  };

  // Build the check-in notification message
  const buildCheckInMsg = () =>
    `Hi! ${user?.name ?? "Your contact"} has started a walk-home check-in on NeighbourhoodGuard, heading to "${pendingDestination}". They'll notify you when they arrive safely.`;

  const buildArrivalMsg = () =>
    `${user?.name ?? "Your contact"} has arrived safely at "${checkIn?.destination}". All good! — NeighbourhoodGuard`;

  // Arrival — notify contacts via best available channel
  const handleArrived = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (personalContacts.length > 0) {
      const msg = buildArrivalMsg();
      if (Platform.OS === "web") {
        Alert.alert("Arrived (demo)", `Would notify: ${personalContacts.map((c) => c.name).join(", ")}`);
      } else {
        for (const c of personalContacts) {
          await sendToContactBestChannel(c.phone, msg);
        }
      }
    }
    endCheckIn();
  };

  // SOS — uses WhatsApp or SMS to reach security team
  const handleSOS = async () => {
    if (!hasSOS) {
      Alert.alert(
        "Premium Feature",
        "The SOS panic button is available on Estate Pro (R349/month) and Family Guardian (R599/month) plans.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "View Plans", onPress: () => router.push("/(tabs)/premium") },
        ]
      );
      return;
    }
    if (!securityTeam) {
      Alert.alert(
        "No security team linked",
        "Link your armed response company first. Go to the Premium tab to add them.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Link Security Team", onPress: () => router.push("/(tabs)/premium") },
        ]
      );
      return;
    }

    Alert.alert(
      "🚨 Send SOS?",
      `This will immediately alert ${securityTeam.name} via WhatsApp or SMS. Only use this in a genuine emergency.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "SEND SOS",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setSosLoading(true);
            const sosMsg = `🚨 SOS ALERT — ${user?.name ?? "NeighbourhoodGuard User"} is NOT SAFE and requires immediate assistance.${checkIn?.active ? ` Last known destination: ${checkIn.destination}.` : ""} Suburb: ${user?.suburb ?? "Unknown"}. This is an automated NeighbourhoodGuard SOS alert.`;
            const channel = await sendToContactBestChannel(securityTeam.phone, sosMsg);
            setSosLoading(false);
            if (channel) {
              Alert.alert(
                "SOS sent",
                `Emergency alert sent to ${securityTeam.name} via ${channel === "whatsapp" ? "WhatsApp" : channel === "imessage" ? "iMessage" : "SMS"}.`
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: topPadding + 16,
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 90,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.heading, { color: colors.foreground }]}>Check-in</Text>
            <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
              Let trusted contacts know you're on the move
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowContacts(true)}
            style={[styles.contactsBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Feather name="users" size={18} color={colors.primary} />
            {contacts.length > 0 && (
              <View style={[styles.contactsBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.contactsBadgeText}>{contacts.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Messaging channels info row */}
        <View style={[styles.channelsRow, { backgroundColor: colors.secondary }]}>
          <Feather name="send" size={13} color={colors.primary} />
          <Text style={[styles.channelsText, { color: colors.primary }]}>
            Notifies via WhatsApp, iMessage, or SMS — your choice every time
          </Text>
        </View>

        {/* SOS Button */}
        <TouchableOpacity
          onPress={handleSOS}
          activeOpacity={0.85}
          disabled={sosLoading}
          style={[
            styles.sosBtn,
            {
              backgroundColor: hasSOS && securityTeam ? colors.danger : colors.dangerLight,
              borderColor: colors.danger,
              opacity: sosLoading ? 0.7 : 1,
            },
          ]}
        >
          <View style={styles.sosBtnInner}>
            <Feather
              name="alert-circle"
              size={22}
              color={hasSOS && securityTeam ? "#fff" : colors.danger}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.sosBtnTitle,
                  { color: hasSOS && securityTeam ? "#fff" : colors.danger },
                ]}
              >
                SOS — I'm Not Safe
              </Text>
              <Text
                style={[
                  styles.sosBtnSub,
                  {
                    color:
                      hasSOS && securityTeam ? "rgba(255,255,255,0.8)" : colors.mutedForeground,
                  },
                ]}
              >
                {hasSOS && securityTeam
                  ? `WhatsApp / SMS → ${securityTeam.name}`
                  : hasSOS
                  ? "Link your security team first"
                  : "Upgrade to Estate Pro to unlock"}
              </Text>
            </View>
            {!hasSOS && (
              <View style={[styles.sosBtnBadge, { backgroundColor: "#F6AD55" }]}>
                <Text style={styles.sosBtnBadgeText}>PRO</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {securityTeam && (
          <View
            style={[
              styles.secTeamCard,
              { backgroundColor: colors.card, borderColor: colors.danger + "40" },
            ]}
          >
            <Feather name="shield" size={16} color={colors.danger} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.secTeamName, { color: colors.foreground }]}>
                {securityTeam.name}
              </Text>
              <Text style={[styles.secTeamPhone, { color: colors.mutedForeground }]}>
                {securityTeam.phone}
              </Text>
            </View>
            <View style={[styles.secTeamBadge, { backgroundColor: colors.danger + "15" }]}>
              <Text style={[styles.secTeamBadgeText, { color: colors.danger }]}>Security</Text>
            </View>
          </View>
        )}

        {/* Active Check-in */}
        {checkIn?.active ? (
          <View
            style={[styles.activeCard, { backgroundColor: colors.card, borderColor: colors.success }]}
          >
            <View style={[styles.activeHeader, { backgroundColor: colors.success + "15" }]}>
              <View style={[styles.activePulse, { backgroundColor: colors.success }]} />
              <Text style={[styles.activeStatus, { color: colors.success }]}>
                Walk in progress
              </Text>
            </View>
            <View style={styles.activeBody}>
              <View style={styles.activeRow}>
                <View
                  style={[styles.activeIconBox, { backgroundColor: colors.primary + "15" }]}
                >
                  <Feather name="map-pin" size={18} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.activeLabel, { color: colors.mutedForeground }]}>
                    Heading to
                  </Text>
                  <Text style={[styles.activeValue, { color: colors.foreground }]}>
                    {checkIn.destination}
                  </Text>
                </View>
              </View>
              <View style={styles.timerBox}>
                <Text style={[styles.timerValue, { color: colors.foreground }]}>
                  {formatDuration(elapsed)}
                </Text>
                <Text style={[styles.timerLabel, { color: colors.mutedForeground }]}>elapsed</Text>
              </View>
              <TouchableOpacity
                onPress={handleArrived}
                activeOpacity={0.85}
                style={[styles.arrivedBtn, { backgroundColor: colors.success }]}
              >
                <Feather name="check-circle" size={18} color="#fff" />
                <Text style={styles.arrivedText}>I've Arrived Safely</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => endCheckIn()}
                activeOpacity={0.85}
                style={[styles.cancelBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>
                  Cancel Check-in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={[styles.startCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + "15" }]}>
              <Feather name="navigation" size={28} color={colors.primary} />
            </View>
            <Text style={[styles.startTitle, { color: colors.foreground }]}>
              I'm walking home
            </Text>
            <Text style={[styles.startDesc, { color: colors.mutedForeground }]}>
              Start a check-in so trusted contacts know you're on the move.
            </Text>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                Where are you heading?
              </Text>
              <View
                style={[
                  styles.inputRow,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Feather name="map-pin" size={16} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="e.g. Home — 14 Oak Avenue"
                  placeholderTextColor={colors.mutedForeground}
                  value={destination}
                  onChangeText={setDestination}
                  returnKeyType="done"
                  onSubmitEditing={handleStart}
                />
              </View>
            </View>
            {personalContacts.length > 0 && (
              <View
                style={[
                  styles.contactsPreview,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Feather name="users" size={13} color={colors.primary} />
                <Text style={[styles.contactsPreviewText, { color: colors.mutedForeground }]}>
                  Will notify:{" "}
                  {personalContacts.slice(0, 3).map((c) => c.name.split(" ")[0]).join(", ")}
                  {personalContacts.length > 3 ? ` +${personalContacts.length - 3}` : ""}
                </Text>
              </View>
            )}

            {/* Channel badges */}
            <View style={styles.channelBadges}>
              <View style={[styles.badge, { backgroundColor: "#25D36620" }]}>
                <Feather name="message-circle" size={12} color="#25D366" />
                <Text style={[styles.badgeText, { color: "#25D366" }]}>WhatsApp</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: "#147EFB20" }]}>
                <Feather name="message-square" size={12} color="#147EFB" />
                <Text style={[styles.badgeText, { color: "#147EFB" }]}>iMessage</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: colors.primary + "20" }]}>
                <Feather name="smartphone" size={12} color={colors.primary} />
                <Text style={[styles.badgeText, { color: colors.primary }]}>SMS</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleStart}
              activeOpacity={0.85}
              style={[styles.startBtn, { backgroundColor: colors.primary }]}
            >
              <Feather name="navigation" size={18} color={colors.primaryForeground} />
              <Text style={[styles.startBtnText, { color: colors.primaryForeground }]}>
                Start Check-in
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Safety Tips */}
        <Text style={[styles.tipsHeading, { color: colors.foreground }]}>Safety Tips</Text>
        <View style={styles.tips}>
          {TIPS.map((tip, i) => (
            <View
              key={i}
              style={[styles.tipCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.tipIcon, { backgroundColor: colors.primary + "15" }]}>
                <Feather name={tip.icon as any} size={16} color={colors.primary} />
              </View>
              <Text style={[styles.tipText, { color: colors.mutedForeground }]}>{tip.tip}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <ContactPickerModal visible={showContacts} onClose={() => setShowContacts(false)} />

      <ShareSheet
        visible={showShareSheet}
        onClose={() => { setShowShareSheet(false); doStartCheckIn([]); }}
        onSend={handleContactsChosen}
        contacts={contacts}
      />

      <ChannelPicker
        visible={showChannelPicker}
        contacts={pendingContacts}
        message={buildCheckInMsg()}
        onDone={() => doStartCheckIn(pendingContacts)}
        onCancel={() => doStartCheckIn([])}
      />
    </View>
  );
}

const cpStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingTop: 12,
    gap: 16,
    paddingBottom: 40,
  },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 4 },
  title: { fontSize: 20, fontWeight: "800" },
  subtitle: { fontSize: 13, marginTop: -8 },
  channels: { gap: 10 },
  channelBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  channelIcon: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  channelText: { flex: 1 },
  channelLabel: { fontSize: 15, fontWeight: "800", color: "#fff" },
  channelDesc: { fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  skipBtn: {
    alignItems: "center",
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
  },
  skipText: { fontSize: 14, fontWeight: "600" },
  resultBox: { alignItems: "center", gap: 14, paddingVertical: 20 },
  resultIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  resultText: { fontSize: 16, fontWeight: "700", textAlign: "center" },
});

const shareStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingTop: 12,
    gap: 14,
    paddingBottom: 40,
  },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 4 },
  title: { fontSize: 20, fontWeight: "800" },
  subtitle: { fontSize: 13, lineHeight: 18, marginTop: -6 },
  emptyBox: { alignItems: "center", gap: 8, paddingVertical: 16 },
  noContacts: { fontSize: 13, textAlign: "center" },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 14, fontWeight: "800" },
  contactName: { fontSize: 14, fontWeight: "700" },
  contactPhone: { fontSize: 12, marginTop: 1 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: { flexDirection: "row", gap: 10 },
  skipBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  skipText: { fontSize: 14, fontWeight: "700" },
  sendBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
  },
  sendText: { color: "#fff", fontSize: 14, fontWeight: "800" },
});

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  heading: { fontSize: 26, fontWeight: "800", marginBottom: 4 },
  subheading: { fontSize: 13 },
  contactsBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    position: "relative",
  },
  contactsBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  contactsBadgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  channelsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  channelsText: { fontSize: 12, fontWeight: "600" },
  sosBtn: { borderRadius: 18, borderWidth: 2, marginBottom: 12, overflow: "hidden" },
  sosBtnInner: { flexDirection: "row", alignItems: "center", gap: 14, padding: 18 },
  sosBtnTitle: { fontSize: 16, fontWeight: "900" },
  sosBtnSub: { fontSize: 12, marginTop: 2 },
  sosBtnBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  sosBtnBadgeText: { color: "#fff", fontSize: 10, fontWeight: "900" },
  secTeamCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  secTeamName: { fontSize: 13, fontWeight: "700" },
  secTeamPhone: { fontSize: 11, marginTop: 1 },
  secTeamBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  secTeamBadgeText: { fontSize: 11, fontWeight: "700" },
  activeCard: { borderRadius: 20, borderWidth: 2, overflow: "hidden", marginBottom: 24 },
  activeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  activePulse: { width: 10, height: 10, borderRadius: 5 },
  activeStatus: { fontSize: 13, fontWeight: "700" },
  activeBody: { padding: 20, gap: 18 },
  activeRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  activeIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  activeLabel: { fontSize: 11, marginBottom: 2 },
  activeValue: { fontSize: 16, fontWeight: "700" },
  timerBox: { alignItems: "center" },
  timerValue: { fontSize: 52, fontWeight: "800", fontVariant: ["tabular-nums"] },
  timerLabel: { fontSize: 13 },
  arrivedBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
  },
  arrivedText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  cancelText: { fontSize: 14, fontWeight: "600" },
  startCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  startTitle: { fontSize: 20, fontWeight: "800" },
  startDesc: { fontSize: 13, lineHeight: 18, textAlign: "center" },
  inputGroup: { width: "100%", gap: 8 },
  inputLabel: { fontSize: 14, fontWeight: "600" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: { flex: 1, fontSize: 14 },
  contactsPreview: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  contactsPreviewText: { fontSize: 12, flex: 1 },
  channelBadges: { flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontWeight: "700" },
  startBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
  },
  startBtnText: { fontSize: 16, fontWeight: "800" },
  tipsHeading: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  tips: { gap: 10 },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tipText: { fontSize: 13, lineHeight: 18, flex: 1 },
});
