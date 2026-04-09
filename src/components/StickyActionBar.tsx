"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";

export default function StickyActionBar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Show CTA only after scrolling past the hero section (~500px)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsModalOpen(false); // Close modal if they scroll all the way back up
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Do not render on admin routes
  if (pathname?.startsWith("/admin")) return null;

  if (!isVisible) return null;

  return (
    <>
      {/* The Bottom Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 py-4 pointer-events-none flex justify-center">
        {/* We restrict the width to max-w-md to align with the MobileContainer */}
        <div className="w-full max-w-md pointer-events-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-brand-primary text-white font-poppins font-bold text-lg py-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-[#a67c00] transition-colors flex items-center justify-center gap-3 animate-slide-up"
          >
            {/* Phone Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            {/* Divider Dot */}
            <span className="opacity-50 text-sm">•</span>
            {/* Message Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            <span className="ml-1">{t("cta.callOrWhatsapp")}</span>
          </button>
        </div>
      </div>

      {/* Action Sheet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-opacity">
          {/* Invisible backdrop to dismiss */}
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-md mx-auto bg-white rounded-t-3xl p-6 pb-12 shadow-2xl animate-slide-up">
            <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto mb-6" />
            
            <div className="space-y-4">
              <a
                href="https://wa.me/918867052945?text=Hi%20Jayasri,%20I%20would%20like%20to%20inquire%20about%20your%20makeup%20services!"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsModalOpen(false)}
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white font-poppins font-semibold text-lg py-4 rounded-2xl shadow-sm hover:bg-[#20bd5a] transition-all"
              >
                {/* WhatsApp nativeish icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                {t("cta.whatsappMe")}
              </a>
              
              <a
                href="tel:+918867052945"
                onClick={() => setIsModalOpen(false)}
                className="w-full flex items-center justify-center gap-3 bg-white text-brand-primary border-2 border-brand-primary font-poppins font-semibold text-lg py-4 rounded-2xl shadow-sm hover:bg-neutral-50 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {t("cta.callMe")}
              </a>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="mt-6 w-full text-center text-sm font-medium text-neutral-500 hover:text-neutral-800 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
