"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { lang, toggleLang } = useLanguage();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-brand-light/95 backdrop-blur-md sticky top-0 z-50 border-b border-brand-secondary/20">
      <div className="flex items-center gap-3">
        <h1 className="font-playfair font-bold text-xl text-brand-primary tracking-wide">
          Jayasri <span className="text-brand-secondary">Makeovers</span>
        </h1>
      </div>
      
      <button 
        onClick={toggleLang}
        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-brand-primary border border-brand-secondary/30 shadow-sm transition-all hover:bg-brand-secondary/10"
      >
        {lang === 'en' ? 'EN | ಕನ್ನಡ' : 'ಕನ್ನಡ | EN'}
      </button>
    </nav>
  );
}
