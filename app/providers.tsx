"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "./lib/contexts/auth-context";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
        <Toaster position="bottom-center" />
      </AuthProvider>
    </SessionProvider>
  );
}
