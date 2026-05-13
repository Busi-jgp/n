import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface User {
  name: string;
  phone: string;
  suburb: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  isSecurityTeam?: boolean;
}

export type SubscriptionTier = "free" | "neighbourhood" | "estate" | "family";

export interface Subscription {
  tier: SubscriptionTier;
  activatedAt: number;
  suburb?: string;
}

interface AuthContextValue {
  user: User | null;
  contacts: TrustedContact[];
  subscription: Subscription;
  loading: boolean;
  signIn: (name: string, phone: string, suburb: string) => Promise<void>;
  signOut: () => Promise<void>;
  addContact: (contact: Omit<TrustedContact, "id">) => Promise<void>;
  removeContact: (id: string) => Promise<void>;
  setSecurityTeam: (contact: Omit<TrustedContact, "id" | "isSecurityTeam">) => Promise<void>;
  removeSecurityTeam: () => Promise<void>;
  activateSubscription: (tier: SubscriptionTier) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

const STORAGE_USER = "@ng_user";
const STORAGE_CONTACTS = "@ng_contacts";
const STORAGE_SUBSCRIPTION = "@ng_subscription";

const DEFAULT_SUBSCRIPTION: Subscription = { tier: "free", activatedAt: Date.now() };

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [subscription, setSubscription] = useState<Subscription>(DEFAULT_SUBSCRIPTION);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [u, c, s] = await Promise.all([
          AsyncStorage.getItem(STORAGE_USER),
          AsyncStorage.getItem(STORAGE_CONTACTS),
          AsyncStorage.getItem(STORAGE_SUBSCRIPTION),
        ]);
        if (u) setUser(JSON.parse(u));
        if (c) setContacts(JSON.parse(c));
        if (s) setSubscription(JSON.parse(s));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (name: string, phone: string, suburb: string) => {
    const u: User = { name, phone, suburb };
    await AsyncStorage.setItem(STORAGE_USER, JSON.stringify(u));
    setUser(u);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_USER);
    setUser(null);
  }, []);

  const saveContacts = useCallback((next: TrustedContact[]) => {
    AsyncStorage.setItem(STORAGE_CONTACTS, JSON.stringify(next)).catch(() => {});
  }, []);

  const addContact = useCallback(async (contact: Omit<TrustedContact, "id">) => {
    const newContact: TrustedContact = {
      ...contact,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
    };
    setContacts((prev) => {
      const next = [...prev, newContact];
      saveContacts(next);
      return next;
    });
  }, [saveContacts]);

  const removeContact = useCallback(async (id: string) => {
    setContacts((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveContacts(next);
      return next;
    });
  }, [saveContacts]);

  const setSecurityTeam = useCallback(async (contact: Omit<TrustedContact, "id" | "isSecurityTeam">) => {
    const newContact: TrustedContact = {
      ...contact,
      id: "security-team-" + Date.now(),
      isSecurityTeam: true,
    };
    setContacts((prev) => {
      const next = [
        ...prev.filter((c) => !c.isSecurityTeam),
        newContact,
      ];
      saveContacts(next);
      return next;
    });
  }, [saveContacts]);

  const removeSecurityTeam = useCallback(async () => {
    setContacts((prev) => {
      const next = prev.filter((c) => !c.isSecurityTeam);
      saveContacts(next);
      return next;
    });
  }, [saveContacts]);

  const activateSubscription = useCallback(async (tier: SubscriptionTier) => {
    const sub: Subscription = { tier, activatedAt: Date.now() };
    await AsyncStorage.setItem(STORAGE_SUBSCRIPTION, JSON.stringify(sub));
    setSubscription(sub);
  }, []);

  const cancelSubscription = useCallback(async () => {
    const sub: Subscription = { tier: "free", activatedAt: Date.now() };
    await AsyncStorage.setItem(STORAGE_SUBSCRIPTION, JSON.stringify(sub));
    setSubscription(sub);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, contacts, subscription, loading,
      signIn, signOut, addContact, removeContact,
      setSecurityTeam, removeSecurityTeam,
      activateSubscription, cancelSubscription,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
