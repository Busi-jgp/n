import * as SMS from "expo-sms";
import { Alert, Linking, Platform } from "react-native";

export type MessageChannel = "whatsapp" | "imessage" | "sms" | "demo";

function toInternationalZA(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("27")) return digits;
  if (digits.startsWith("0")) return "27" + digits.slice(1);
  return digits;
}

export async function canUseWhatsApp(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  try {
    return await Linking.canOpenURL("whatsapp://send?text=test");
  } catch {
    return false;
  }
}

export async function sendViaWhatsApp(phone: string, message: string): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const intlPhone = toInternationalZA(phone);
  const url = `whatsapp://send?phone=${intlPhone}&text=${encodeURIComponent(message)}`;
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    }
  } catch {}
  return false;
}

export async function sendViaMessages(phone: string, message: string): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const sep = Platform.OS === "ios" ? "&body=" : "?body=";
  const url = `sms:${phone}${sep}${encodeURIComponent(message)}`;
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    }
  } catch {}
  return false;
}

export async function sendViaSMS(phones: string[], message: string): Promise<boolean> {
  if (Platform.OS === "web") return false;
  try {
    const available = await SMS.isAvailableAsync();
    if (available) {
      await SMS.sendSMSAsync(phones, message);
      return true;
    }
  } catch {}
  return false;
}

export type BestChannelResult = {
  hasWhatsApp: boolean;
  hasMessages: boolean;
  hasSMS: boolean;
};

export async function detectChannels(): Promise<BestChannelResult> {
  const [hasWhatsApp, hasSMS] = await Promise.all([
    canUseWhatsApp(),
    Platform.OS !== "web" ? SMS.isAvailableAsync().catch(() => false) : Promise.resolve(false),
  ]);
  return {
    hasWhatsApp,
    hasMessages: Platform.OS === "ios",
    hasSMS: hasSMS as boolean,
  };
}

export function channelLabel(ch: MessageChannel): string {
  switch (ch) {
    case "whatsapp": return "WhatsApp";
    case "imessage": return "iMessage";
    case "sms": return "SMS";
    default: return "Demo";
  }
}

export function channelIcon(ch: MessageChannel): string {
  switch (ch) {
    case "whatsapp": return "message-circle";
    case "imessage": return "message-square";
    case "sms": return "smartphone";
    default: return "info";
  }
}

export async function sendToContactBestChannel(
  phone: string,
  message: string,
  preferWhatsApp = true
): Promise<MessageChannel | null> {
  if (Platform.OS === "web") {
    Alert.alert("Message (demo)", `Would send to ${phone}:\n\n${message}`);
    return "demo";
  }
  if (preferWhatsApp) {
    const sent = await sendViaWhatsApp(phone, message);
    if (sent) return "whatsapp";
  }
  if (Platform.OS === "ios") {
    const sent = await sendViaMessages(phone, message);
    if (sent) return "imessage";
  }
  const sent = await sendViaSMS([phone], message);
  if (sent) return "sms";
  return null;
}
