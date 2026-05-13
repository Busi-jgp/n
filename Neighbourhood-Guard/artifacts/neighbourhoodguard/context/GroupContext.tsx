import React, { createContext, useCallback, useContext, useState } from "react";

import type { GroupPost, WatchGroup, GroupMember } from "@/data/groupData";
import { getMockMembers, getMockPosts } from "@/data/groupData";

interface GroupContextValue {
  group: WatchGroup | null;
  members: GroupMember[];
  posts: GroupPost[];
  joined: boolean;
  joinGroup: (group: WatchGroup, myName: string) => void;
  leaveGroup: () => void;
  addPost: (content: string, type: GroupPost["type"], myName: string, suburb: string) => void;
  reactToPost: (postId: string) => void;
}

const GroupContext = createContext<GroupContextValue | null>(null);

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [group, setGroup] = useState<WatchGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [joined, setJoined] = useState(false);

  const joinGroup = useCallback((g: WatchGroup, myName: string) => {
    setGroup(g);
    setMembers(getMockMembers(g.suburb, myName));
    setPosts(getMockPosts(g.suburb));
    setJoined(true);
  }, []);

  const leaveGroup = useCallback(() => {
    setGroup(null);
    setMembers([]);
    setPosts([]);
    setJoined(false);
  }, []);

  const addPost = useCallback(
    (content: string, type: GroupPost["type"], myName: string, suburb: string) => {
      const newPost: GroupPost = {
        id: "p" + Date.now(),
        authorId: "me",
        authorName: myName.split(" ")[0] + " " + (myName.split(" ")[1]?.[0] ?? "") + ".",
        content,
        type,
        timestamp: Date.now(),
        reactions: 0,
      };
      setPosts((prev) => [newPost, ...prev]);
    },
    []
  );

  const reactToPost = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, reactions: p.reactions + 1 } : p))
    );
  }, []);

  return (
    <GroupContext.Provider value={{ group, members, posts, joined, joinGroup, leaveGroup, addPost, reactToPost }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  const ctx = useContext(GroupContext);
  if (!ctx) throw new Error("useGroup must be used within GroupProvider");
  return ctx;
}
