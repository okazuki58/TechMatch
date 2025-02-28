"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";


const AuthContext = createContext<{
  user: Session["user"] | null;
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
  const [user, setUser] = useState<Session["user"] | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
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
