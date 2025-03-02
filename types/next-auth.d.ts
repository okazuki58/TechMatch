import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * セッションオブジェクトの型を拡張
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      badges?: Array<{ quizId: string; [key: string]: unknown }>;
      quizResults?: Array<{
        quizId: string;
        score: number;
        maxScore: number;
        [key: string]: unknown;
      }>;
      role?: string;
    };
  }

  /**
   * ユーザーオブジェクトの型を拡張
   */
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    badges?: Array<{ quizId: string; [key: string]: unknown }>;
    quizResults?: Array<{
      quizId: string;
      score: number;
      maxScore: number;
      [key: string]: unknown;
    }>;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
