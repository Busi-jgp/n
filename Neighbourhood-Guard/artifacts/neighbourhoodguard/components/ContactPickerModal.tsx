import { Feather } from "@expo/vector-icons";
import * as Contacts from "expo-contacts";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { TrustedContact } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

interface Props {
  visible: boolean;
  onClose: () => void;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ContactPickerModal({ visible, onClose }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { contacts, addContact, removeContact } = useAuth();

  const [deviceContacts, setDeviceContacts] = useState<Contacts.Contact[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"mine" | "add">("mine");

  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");

  const loadDeviceContacts = async () => {
    if (Platform.OS === "web") return;
    setLoading(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Allow access to contacts to add trusted people quickly.");
        setLoading(false);
        return;
      }
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        sort: Contacts.SortTypes.FirstName,
      });
      setDeviceContacts(data.filter((c) => c.phoneNumbers && c.phoneNumbers.length > 0));
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: "mine" | "add") => {
    setActiveTab(tab);
    if (tab === "add" && deviceContacts.length === 0 && Platform.OS !== "web") {
      loadDeviceContacts();
    }
  };

  const isAdded = (phone: string) =>
    contacts.some((c) => c.phone.replace(/\s/g, "") === phone.replace(/\s/g, ""));

  const handleAddFromDevice = (contact: Contacts.Contact) => {
    const phone = contact.phoneNumbers?.[0]?.number ?? "";
    if (!phone) return;
    if (isAdded(phone)) {
      const existing = contacts.find((c) => c.phone.replace(/\s/g, "") === phone.replace(/\s/g, ""));
      if (existing) removeContact(existing.id);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      addContact({ name: contact.name ?? "Unknown", phone });
    }
  };

  const handleAddManual = () => {
    if (!manualName.trim() || !manualPhone.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addContact({ name: manualName.trim(), phone: manualPhone.trim() });
    setManualName("");
    setManualPhone("");
  };

  const filtered = deviceContacts.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const avatarColors = ["#0B7A8A", "#27AE60", "#E67E22", "#8E44AD", "#2980B9"];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom + 24 }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Trusted Contacts</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
          {(["mine", "add"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, { borderBottomColor: activeTab === tab ? colors.primary : "transparent" }]}
              onPress={() => handleTabChange(tab)}
            >
              <Text style={[styles.tabText, { color: activeTab === tab ? colors.primary : colors.mutedForeground }]}>
                {tab === "mine" ? `My Contacts (${contacts.length})` : "Add New"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "mine" ? (
          <View style={{ flex: 1 }}>
            {contacts.length === 0 ? (
              <View style={styles.empty}>
                <Feather name="users" size={36} color={colors.mutedForeground} />
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No contacts yet</Text>
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  Add trusted people who will be notified when you check in.
                </Text>
                <TouchableOpacity
                  style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
                  onPress={() => handleTabChange("add")}
                >
                  <Text style={{ color: colors.primaryForeground, fontWeight: "700" }}>Add Contacts</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={contacts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16, gap: 10 }}
                renderItem={({ item, index }) => (
                  <View style={[styles.contactRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={[styles.avatar, { backgroundColor: avatarColors[index % avatarColors.length] }]}>
                      <Text style={styles.avatarText}>{initials(item.name)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.contactName, { color: colors.foreground }]}>{item.name}</Text>
                      <Text style={[styles.contactPhone, { color: colors.mutedForeground }]}>{item.phone}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeContact(item.id)}
                      style={[styles.removeBtn, { backgroundColor: colors.dangerLight }]}
                    >
                      <Feather name="trash-2" size={15} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={[styles.manualSection, { borderBottomColor: colors.border }]}>
              <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Add manually</Text>
              <View style={styles.manualFields}>
                <View style={[styles.manualInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Feather name="user" size={16} color={colors.mutedForeground} />
                  <TextInput
                    style={[styles.manualTextInput, { color: colors.foreground }]}
                    placeholder="Name"
                    placeholderTextColor={colors.mutedForeground}
                    value={manualName}
                    onChangeText={setManualName}
                    autoCapitalize="words"
                  />
                </View>
                <View style={[styles.manualInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Feather name="phone" size={16} color={colors.mutedForeground} />
                  <TextInput
                    style={[styles.manualTextInput, { color: colors.foreground }]}
                    placeholder="Phone number"
                    placeholderTextColor={colors.mutedForeground}
                    value={manualPhone}
                    onChangeText={setManualPhone}
                    keyboardType="phone-pad"
                  />
                </View>
                <TouchableOpacity
                  style={[styles.addManualBtn, { backgroundColor: colors.primary, opacity: (!manualName || !manualPhone) ? 0.5 : 1 }]}
                  onPress={handleAddManual}
                  disabled={!manualName || !manualPhone}
                >
                  <Feather name="plus" size={18} color={colors.primaryForeground} />
                  <Text style={[styles.addManualText, { color: colors.primaryForeground }]}>Add Contact</Text>
                </TouchableOpacity>
              </View>
            </View>

            {Platform.OS !== "web" && (
              <View style={{ flex: 1 }}>
                <View style={[styles.orRow, { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 }]}>
                  <Text style={[styles.sectionLabel, { color: colors.foreground }]}>From your contacts</Text>
                  {loading && <ActivityIndicator size="small" color={colors.primary} />}
                </View>
                {deviceContacts.length > 0 && (
                  <View style={[styles.searchRow, { paddingHorizontal: 16, marginBottom: 8 }]}>
                    <View style={[styles.searchInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
                      <Feather name="search" size={16} color={colors.mutedForeground} />
                      <TextInput
                        style={[styles.manualTextInput, { color: colors.foreground }]}
                        placeholder="Search contacts..."
                        placeholderTextColor={colors.mutedForeground}
                        value={search}
                        onChangeText={setSearch}
                      />
                    </View>
                  </View>
                )}
                <FlatList
                  data={filtered}
                  keyExtractor={(item) => item.id ?? item.name ?? ""}
                  contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
                  renderItem={({ item, index }) => {
                    const phone = item.phoneNumbers?.[0]?.number ?? "";
                    const added = isAdded(phone);
                    return (
                      <TouchableOpacity
                        onPress={() => handleAddFromDevice(item)}
                        style={[styles.contactRow, { backgroundColor: colors.card, borderColor: added ? colors.primary : colors.border }]}
                        activeOpacity={0.8}
                      >
                        <View style={[styles.avatar, { backgroundColor: avatarColors[index % avatarColors.length] }]}>
                          <Text style={styles.avatarText}>{initials(item.name ?? "?")}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.contactName, { color: colors.foreground }]}>{item.name}</Text>
                          <Text style={[styles.contactPhone, { color: colors.mutedForeground }]}>{phone}</Text>
                        </View>
                        <View style={[styles.addedBadge, { backgroundColor: added ? colors.successLight : colors.muted }]}>
                          <Feather name={added ? "check" : "plus"} size={14} color={added ? colors.success : colors.mutedForeground} />
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: { fontSize: 18, fontWeight: "800" },
  closeBtn: { padding: 4 },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
  },
  tabText: { fontSize: 14, fontWeight: "700" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 10, paddingBottom: 60 },
  emptyTitle: { fontSize: 18, fontWeight: "700", marginTop: 8 },
  emptyText: { fontSize: 13, textAlign: "center", lineHeight: 19 },
  emptyBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginTop: 8 },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  contactName: { fontSize: 14, fontWeight: "700" },
  contactPhone: { fontSize: 12, marginTop: 2 },
  removeBtn: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  addedBadge: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  manualSection: { padding: 16, borderBottomWidth: 1 },
  sectionLabel: { fontSize: 14, fontWeight: "700", marginBottom: 10 },
  manualFields: { gap: 10 },
  manualInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  manualTextInput: { flex: 1, fontSize: 14 },
  addManualBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 12,
  },
  addManualText: { fontSize: 14, fontWeight: "700" },
  orRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  searchRow: {},
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
