"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const cookieStore = await cookies();
    // In production, you would hash/encrypt this, but a simple 30 day cookie works well for a single-device admin scenario
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return { success: true };
  }

  return { success: false, error: "Invalid username or password" };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}
