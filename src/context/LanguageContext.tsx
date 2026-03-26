"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import en from "@/locales/en.json";
import kn from "@/locales/kn.json";

type Language = "en" | "kn";
type Translations = typeof en;

interface LanguageContextType {
  lang: Language;
  t: (key: keyof Translations) => string;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  
  // Prevent hydration mismatch by using useEffect for any local storage logic if needed
  // (Left out for simplicity, defaults to English but is fully client-side togglable)

  const translations = lang === "en" ? en : kn;

  const t = (key: keyof Translations): string => {
    return translations[key] || key;
  };

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "kn" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
