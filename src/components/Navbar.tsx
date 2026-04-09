"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-brand-light/95 backdrop-blur-md sticky top-0 z-50 border-b border-brand-secondary/20">
      <div className="flex items-center">
        <h1 className="font-playfair font-bold text-xl text-brand-primary tracking-wide">
          Jayasri <span className="text-brand-secondary">Makeovers</span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleLang}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-brand-primary border border-brand-secondary/30 shadow-sm transition-all hover:bg-brand-secondary/10"
        >
          {lang === 'en' ? 'EN | ಕನ್ನಡ' : 'ಕನ್ನಡ | EN'}
        </button>

        {/* Hamburger Icon */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-brand-primary active:scale-95 transition-transform relative z-50 bg-white rounded-full shadow-sm border border-brand-secondary/20"
          aria-label="Toggle menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between items-center overflow-hidden">
            <span className={`w-full h-0.5 bg-current transform transition-all duration-300 origin-left ${isMenuOpen ? 'rotate-45 translate-x-px' : ''}`} />
            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0 translate-x-3' : ''}`} />
            <span className={`w-full h-0.5 bg-current transform transition-all duration-300 origin-left ${isMenuOpen ? '-rotate-45 translate-x-px' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Slide-over Menu */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div 
          className={`absolute top-0 right-0 w-64 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col pt-24 px-6 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent clicking inside from closing it
        >
          <nav className="flex flex-col gap-6">
            {[
              { id: "pricing", label: t("nav.services") || "Services" },
              { id: "portfolio", label: t("nav.portfolio") || "Portfolio" },
              { id: "calendar", label: t("calendar.title") || "Availability" },
              { id: "faq", label: "FAQ" },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-lg font-poppins font-bold text-neutral-800 border-b border-neutral-100 pb-3 active:text-brand-primary transition-colors flex items-center justify-between group"
              >
                <span>{link.label}</span>
                <span className="text-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">→</span>
              </a>
            ))}
          </nav>
          
          <div className="mt-auto pb-10">
            <a 
              href="https://wa.me/918867052945"
              target="_blank" rel="noopener noreferrer"
              className="w-full bg-brand-primary text-white text-center py-3.5 rounded-xl font-bold tracking-wide shadow-md flex items-center justify-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{t("nav.book") || "Book Now"}</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
