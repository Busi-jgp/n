export interface GroupMember {
  id: string;
  name: string;
  suburb: string;
  role: "admin" | "member";
  joinedAt: number;
  active: boolean;
}

export interface GroupPost {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  type: "alert" | "update" | "general" | "all-clear";
  timestamp: number;
  reactions: number;
}

export interface WatchGroup {
  id: string;
  suburb: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: number;
  admin: string;
}

export const SUBURB_GROUPS: Record<string, WatchGroup> = {
  Waterkloof: {
    id: "g-waterkloof",
    suburb: "Waterkloof",
    name: "Waterkloof Neighbourhood Watch",
    description: "Keeping Waterkloof and Waterkloof Park safe together. Est. 2019.",
    memberCount: 142,
    createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
    admin: "Petrus van Niekerk",
  },
  Garsfontein: {
    id: "g-garsfontein",
    suburb: "Garsfontein",
    name: "Garsfontein Watch Group",
    description: "Active community watch covering Garsfontein and surrounds.",
    memberCount: 89,
    createdAt: Date.now() - 200 * 24 * 60 * 60 * 1000,
    admin: "Anita Steenkamp",
  },
  Lynnwood: {
    id: "g-lynnwood",
    suburb: "Lynnwood",
    name: "Lynnwood Safety Network",
    description: "Community-driven safety group for Lynnwood and Lynnwood Glen.",
    memberCount: 211,
    createdAt: Date.now() - 500 * 24 * 60 * 60 * 1000,
    admin: "Derek Olivier",
  },
  Centurion: {
    id: "g-centurion",
    suburb: "Centurion",
    name: "Centurion Community Watch",
    description: "Covering Centurion, Highveld, and surrounding estates.",
    memberCount: 374,
    createdAt: Date.now() - 800 * 24 * 60 * 60 * 1000,
    admin: "Mariaan du Toit",
  },
  Menlyn: {
    id: "g-menlyn",
    suburb: "Menlyn",
    name: "Menlyn Neighbourhood Guard",
    description: "Protecting Menlyn, Newlands, and Ashlea Gardens.",
    memberCount: 156,
    createdAt: Date.now() - 150 * 24 * 60 * 60 * 1000,
    admin: "Jacques Ferreira",
  },
  Brooklyn: {
    id: "g-brooklyn",
    suburb: "Brooklyn",
    name: "Brooklyn Watch Network",
    description: "Brooklyn, Nieuw Muckleneuk, and Sunnyside community safety.",
    memberCount: 98,
    createdAt: Date.now() - 300 * 24 * 60 * 60 * 1000,
    admin: "Linda Botha",
  },
  Hatfield: {
    id: "g-hatfield",
    suburb: "Hatfield",
    name: "Hatfield Safety Collective",
    description: "Student and resident safety group for the Hatfield precinct.",
    memberCount: 67,
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    admin: "Prof. Thabo Molefe",
  },
  "Faerie Glen": {
    id: "g-faerieglen",
    suburb: "Faerie Glen",
    name: "Faerie Glen Watch",
    description: "Vigilant community watch for Faerie Glen and Olympus.",
    memberCount: 203,
    createdAt: Date.now() - 600 * 24 * 60 * 60 * 1000,
    admin: "Suzette Pretorius",
  },
  "Moreleta Park": {
    id: "g-moreleta",
    suburb: "Moreleta Park",
    name: "Moreleta Park Community Watch",
    description: "Safety and security updates for all Moreleta Park residents.",
    memberCount: 318,
    createdAt: Date.now() - 700 * 24 * 60 * 60 * 1000,
    admin: "Henk Vermaak",
  },
};

export function getGroupForSuburb(suburb: string): WatchGroup | null {
  return SUBURB_GROUPS[suburb] ?? null;
}

export function getMockPosts(suburb: string): GroupPost[] {
  const h = (n: number) => Date.now() - n * 60 * 60 * 1000;
  return [
    {
      id: "p1",
      authorId: "m1",
      authorName: "Petrus v.N.",
      content: `Reminder: monthly group meeting this Saturday 09:00 at the ${suburb} community hall. All welcome. Refreshments provided.`,
      type: "general",
      timestamp: h(1.5),
      reactions: 14,
    },
    {
      id: "p2",
      authorId: "m2",
      authorName: "Anita S.",
      content: `⚠️ Suspicious vehicle — silver Toyota Hilux, no plates — circling Elm Street. Please be vigilant and report to SAPS Ref #2026/45871 if seen again.`,
      type: "alert",
      timestamp: h(3),
      reactions: 31,
    },
    {
      id: "p3",
      authorId: "m3",
      authorName: "Derek O.",
      content: `All clear on the western side. Patrol completed 21:00–23:00, no incidents. 🟢`,
      type: "all-clear",
      timestamp: h(5),
      reactions: 22,
    },
    {
      id: "p4",
      authorId: "m4",
      authorName: "Linda B.",
      content: "Eskom confirmed Stage 4 loadshedding from 18:00–22:00 tonight. Please secure your gates and ensure backup lights are working.",
      type: "update",
      timestamp: h(8),
      reactions: 47,
    },
    {
      id: "p5",
      authorId: "m5",
      authorName: "Jacques F.",
      content: `New speed bump installed on Oak Avenue outside #34 — please slow down in that stretch especially at night.`,
      type: "general",
      timestamp: h(12),
      reactions: 9,
    },
    {
      id: "p6",
      authorId: "m6",
      authorName: "Mariaan d.T.",
      content: `🚨 ALERT: Three house break-ins reported on Pine Road this week. Please double-check all windows and gates. ADT has been notified. Neighbourhood patrol increased to nightly from tonight.`,
      type: "alert",
      timestamp: h(18),
      reactions: 68,
    },
  ];
}

export function getMockMembers(suburb: string, myName: string): GroupMember[] {
  return [
    { id: "me", name: myName, suburb, role: "member", joinedAt: Date.now(), active: true },
    { id: "m1", name: "Petrus van Niekerk", suburb, role: "admin", joinedAt: Date.now() - 365 * 24 * 60 * 60 * 1000, active: true },
    { id: "m2", name: "Anita Steenkamp", suburb, role: "member", joinedAt: Date.now() - 200 * 24 * 60 * 60 * 1000, active: true },
    { id: "m3", name: "Derek Olivier", suburb, role: "member", joinedAt: Date.now() - 180 * 24 * 60 * 60 * 1000, active: false },
    { id: "m4", name: "Linda Botha", suburb, role: "member", joinedAt: Date.now() - 150 * 24 * 60 * 60 * 1000, active: true },
    { id: "m5", name: "Jacques Ferreira", suburb, role: "member", joinedAt: Date.now() - 90 * 24 * 60 * 60 * 1000, active: false },
    { id: "m6", name: "Mariaan du Toit", suburb, role: "member", joinedAt: Date.now() - 60 * 24 * 60 * 60 * 1000, active: true },
    { id: "m7", name: "Henk Vermaak", suburb, role: "member", joinedAt: Date.now() - 45 * 24 * 60 * 60 * 1000, active: false },
    { id: "m8", name: "Suzette Pretorius", suburb, role: "member", joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000, active: true },
  ];
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function memberInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export const POST_TYPE_CONFIG: Record<GroupPost["type"], { color: string; label: string; icon: string }> = {
  alert: { color: "#E53E3E", label: "Alert", icon: "alert-triangle" },
  update: { color: "#F6AD55", label: "Update", icon: "info" },
  general: { color: "#4299E1", label: "General", icon: "message-circle" },
  "all-clear": { color: "#27AE60", label: "All Clear", icon: "check-circle" },
};
