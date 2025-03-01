"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Badge, QuizResult } from "../definitions";

// User型を拡張
interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  badges?: Badge[];
  quizResults?: QuizResult[];
}

const AuthContext = createContext<{
  user: ExtendedUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (provider?: string) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  user: null,
  status: "loading",
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<ExtendedUser | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user as ExtendedUser);
    } else {
      setUser(null);
    }
  }, [session]);

  const handleSignIn = async (provider?: string) => {
    await signIn(provider);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
