"use client";

import { createContext, useContext } from "react";
import type { UserProfile } from "@/types";

interface UserContextValue {
  user: UserProfile | null;
  isDemo: boolean;
  setUser: (user: UserProfile | null) => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  isDemo: true,
  setUser: () => {},
});

export const UserProvider = UserContext.Provider;

export function useUser() {
  return useContext(UserContext);
}
