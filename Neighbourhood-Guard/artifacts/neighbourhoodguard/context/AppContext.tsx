import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type IncidentType =
  | "suspicious"
  | "break-in"
  | "protest"
  | "road-hazard"
  | "load-shedding"
  | "all-clear";

export interface Incident {
  id: string;
  type: IncidentType;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  upvotes: number;
  upvotedByMe?: boolean;
}

export interface CheckIn {
  active: boolean;
  startTime: number;
  destination: string;
}

interface AppContextValue {
  incidents: Incident[];
  checkIn: CheckIn | null;
  addIncident: (
    incident: Omit<Incident, "id" | "timestamp" | "upvotes">
  ) => void;
  upvoteIncident: (id: string) => void;
  startCheckIn: (destination: string) => void;
  endCheckIn: () => void;
}

const STORAGE_KEY_INCIDENTS = "@ng_incidents";
const STORAGE_KEY_CHECKIN = "@ng_checkin";

const MOCK_INCIDENTS: Incident[] = [
  {
    id: "1",
    type: "suspicious",
    title: "Suspicious person",
    description: "Unknown male loitering near Garsfontein Park entrance for 30+ minutes.",
    latitude: -25.7831,
    longitude: 28.2756,
    timestamp: Date.now() - 15 * 60 * 1000,
    upvotes: 7,
  },
  {
    id: "2",
    type: "break-in",
    title: "Car break-in",
    description: "Window smashed on Ford Ranger at Menlyn parking level 2. Blue vehicle.",
    latitude: -25.7825,
    longitude: 28.2762,
    timestamp: Date.now() - 42 * 60 * 1000,
    upvotes: 14,
  },
  {
    id: "3",
    type: "all-clear",
    title: "All clear — Waterkloof",
    description: "Area patrolled by neighbourhood watch, all clear as of now.",
    latitude: -25.7870,
    longitude: 28.2310,
    timestamp: Date.now() - 60 * 60 * 1000,
    upvotes: 5,
  },
  {
    id: "4",
    type: "load-shedding",
    title: "Stage 4 load-shedding",
    description: "Lynnwood Ridge affected. Stage 4 in effect until 22:00.",
    latitude: -25.7600,
    longitude: 28.2900,
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    upvotes: 23,
  },
  {
    id: "5",
    type: "road-hazard",
    title: "Pothole — N1 slip",
    description: "Large pothole on the N1 southbound slip road towards Garsfontein. Drive carefully.",
    latitude: -25.7700,
    longitude: 28.2800,
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    upvotes: 9,
  },
  {
    id: "6",
    type: "suspicious",
    title: "Slow-moving vehicle",
    description: "White Toyota Hilux circling Waterkloof Ridge, no plates visible.",
    latitude: -25.7990,
    longitude: 28.2450,
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
    upvotes: 11,
  },
  {
    id: "7",
    type: "protest",
    title: "Service delivery protest",
    description: "Road blocked on Lynnwood Road near UNISA. Avoid the area.",
    latitude: -25.7540,
    longitude: 28.2380,
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    upvotes: 18,
  },
];

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [checkIn, setCheckIn] = useState<CheckIn | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY_INCIDENTS);
        if (stored) {
          const userAdded: Incident[] = JSON.parse(stored);
          setIncidents([...userAdded, ...MOCK_INCIDENTS]);
        }
        const ci = await AsyncStorage.getItem(STORAGE_KEY_CHECKIN);
        if (ci) setCheckIn(JSON.parse(ci));
      } catch {}
    })();
  }, []);

  const addIncident = useCallback(
    async (incident: Omit<Incident, "id" | "timestamp" | "upvotes">) => {
      const newIncident: Incident = {
        ...incident,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        upvotes: 0,
      };
      setIncidents((prev) => {
        const next = [newIncident, ...prev];
        const userAdded = next.filter(
          (i) => !MOCK_INCIDENTS.find((m) => m.id === i.id)
        );
        AsyncStorage.setItem(
          STORAGE_KEY_INCIDENTS,
          JSON.stringify(userAdded)
        ).catch(() => {});
        return next;
      });
    },
    []
  );

  const upvoteIncident = useCallback((id: string) => {
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === id && !i.upvotedByMe
          ? { ...i, upvotes: i.upvotes + 1, upvotedByMe: true }
          : i
      )
    );
  }, []);

  const startCheckIn = useCallback(async (destination: string) => {
    const ci: CheckIn = {
      active: true,
      startTime: Date.now(),
      destination,
    };
    setCheckIn(ci);
    await AsyncStorage.setItem(STORAGE_KEY_CHECKIN, JSON.stringify(ci));
  }, []);

  const endCheckIn = useCallback(async () => {
    setCheckIn(null);
    await AsyncStorage.removeItem(STORAGE_KEY_CHECKIN);
  }, []);

  return (
    <AppContext.Provider
      value={{ incidents, checkIn, addIncident, upvoteIncident, startCheckIn, endCheckIn }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
