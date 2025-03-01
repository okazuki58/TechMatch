import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function auth() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await auth();

  if (!session || typeof session !== "object" || !("user" in session)) {
    redirect("/login");
  }

  return session;
}
