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

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  return (
    <>
      <nav className={`flex items-center justify-between px-6 py-4 sticky top-0 z-50 border-b border-brand-secondary/20 shadow-sm transition-colors duration-300 ${isMenuOpen ? 'bg-[#fdf8f4]' : 'bg-brand-light/95 backdrop-blur-md'}`}>
        <div className="flex items-center relative z-50">
          <h1 className="font-playfair font-bold text-xl text-brand-primary tracking-wide">
            Jayasri <span className="text-brand-secondary">Makeovers</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 relative z-50">
          <button 
            onClick={toggleLang}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-brand-primary border border-brand-secondary/30 shadow-sm transition-all hover:bg-brand-secondary/10"
          >
            {lang === 'en' ? 'EN | ಕನ್ನಡ' : 'ಕನ್ನಡ | EN'}
          </button>

          {/* Hamburger Icon */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2.5 text-brand-primary active:scale-95 transition-transform bg-white rounded-full shadow-sm border border-brand-secondary/20"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between items-center overflow-hidden">
              <span className={`w-full h-0.5 bg-current transform transition-all duration-300 origin-left ${isMenuOpen ? 'rotate-45 translate-x-px translate-y-[-1px]' : ''}`} />
              <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0 translate-x-3' : ''}`} />
              <span className={`w-full h-0.5 bg-current transform transition-all duration-300 origin-left ${isMenuOpen ? '-rotate-45 translate-x-px translate-y-[1px]' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Full Screen Mobile Menu */}
      <div 
        className={`fixed inset-0 z-40 transition-all duration-300 ease-out flex flex-col pt-32 px-6 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        style={{ backgroundColor: '#fdf8f4' }}
      >
        <nav className="flex flex-col gap-6 items-center w-full max-w-sm mx-auto flex-1">
          {[
            { id: "pricing", label: t("nav.services") || "Services" },
            { id: "portfolio", label: t("nav.portfolio") || "Portfolio" },
            { id: "booking-info", label: "Trial & Booking" },
            { id: "calendar", label: t("calendar.title") || "Availability" },
            { id: "faq", label: "FAQ" },
          ].map((link, idx) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              style={{
                transitionDelay: isMenuOpen ? `${idx * 50}ms` : '0ms'
              }}
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`text-2xl font-playfair font-bold text-center text-brand-primary active:scale-95 transition-all w-full pb-4 border-b border-brand-secondary/10 ${
                isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        
        <div 
          className={`pb-12 w-full max-w-sm mx-auto transition-all duration-500 delay-300 ${
            isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <a 
            href="https://wa.me/918867052945?text=Hi%20Jayasri,%20I%20would%20like%20to%20inquire%20about%20your%20makeup%20services!"
            target="_blank" rel="noopener noreferrer"
            className="w-full bg-brand-primary text-white text-center py-4 rounded-2xl font-poppins font-bold text-lg tracking-wide shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            onClick={() => setIsMenuOpen(false)}
          >
            <span>{t("nav.book") || "Book Now"}</span>
          </a>
        </div>
      </div>
    </>
  );
}
