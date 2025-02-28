// app/lib/contexts/auth-context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../definitions";
import { currentUser, loginUser, logoutUser } from "../data";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ユーザーの初期化 (実際のアプリではここでセッションの確認などを行う)
  useEffect(() => {
    // モックデータを使用: 実際のアプリではCookieやローカルストレージから復元
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  // ログイン処理
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // モックのログイン処理を呼び出し
      const loggedInUser = loginUser(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      console.error("ログインエラー:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ログアウト処理
  const logout = () => {
    setIsLoading(true);
    try {
      logoutUser();
      setUser(null);
    } catch (error) {
      console.error("ログアウトエラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
