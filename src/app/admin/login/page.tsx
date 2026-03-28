"use client";

import { useTransition, useState } from "react";
import { login } from "./actions";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const { t } = useLanguage();

  async function handleLogin(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await login(formData);
      if (result.success) {
        window.location.href = "/admin/dashboard"; // Force full reload to update middleware cookies properly
      } else {
        setError(result.error || "Login failed");
      }
    });
  }

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-brand-secondary/20 p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center mb-4">
            <span className="text-2xl font-playfair text-white">J</span>
          </div>
          <h1 className="font-playfair text-2xl font-bold text-brand-primary">
            Admin Panel
          </h1>
          <p className="text-sm text-brand-secondary/80 mt-1 font-poppins">
            Jayasri Makeovers Back-Office
          </p>
        </div>

        <form action={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary font-poppins"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary font-poppins"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-brand-primary text-white font-poppins font-semibold py-3 rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
