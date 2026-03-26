"use client";

import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { useState } from "react";

export default function About() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("8867052945@ybl");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 px-6 bg-brand-light" id="about">
      <div className="text-center mb-10">
        <h3 className="font-playfair text-3xl font-bold text-brand-primary">{t("about.title")}</h3>
        <div className="w-16 h-1 bg-brand-secondary mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100 flex flex-col items-center text-center">
        <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-brand-light shadow-md mb-6 p-1 bg-white">
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image 
              src="/images/artist/jayasri.webp"
              alt="Jayasri - Makeover Artist"
              fill
              className="object-cover protect-image"
            />
          </div>
        </div>
        
        <h4 className="font-playfair text-2xl font-bold text-neutral-800 mb-1">Jayasri</h4>
        <p className="text-brand-primary font-semibold mb-8 uppercase tracking-wider text-xs bg-brand-secondary/10 px-4 py-1.5 rounded-full inline-block">
          {t("about.certified")}
        </p>

        <div className="space-y-4 w-full text-left">
          <div className="flex gap-4 items-start bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
            <span className="text-2xl mt-0.5">🏡</span>
            <p className="text-sm text-neutral-600 leading-relaxed font-medium">{t("about.demo")}</p>
          </div>
          {/* Travel charges moved to Pricing.tsx */}
          <div className="flex gap-4 items-start bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
            <span className="text-2xl mt-0.5">📅</span>
            <p className="text-sm text-neutral-600 leading-relaxed font-medium">{t("about.advance")}</p>
          </div>
        </div>
        
        {/* Payment QR Code Section */}
        <div className="mt-10 w-full flex flex-col items-center pt-8 border-t border-neutral-100">
          <h5 className="font-bold text-neutral-800 text-lg mb-5 flex items-center gap-2">
            <span>🛡️</span> {t("about.scanToPay")}
          </h5>

          {/* Full-width QR image — no outline, no box */}
          <div className="w-full px-4 mb-4">
            <Image
              src="/images/jayasri-phonepe-qr-code.png"
              alt="PhonePe QR Code — Scan to Pay Advance"
              width={600}
              height={600}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          <p className="font-bold text-brand-primary text-lg tracking-wide mb-1">
            {t("about.phonePe")}
          </p>
          <p className="text-xs text-neutral-500 mb-5">100% Secure Payment via UPI</p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mx-auto">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 bg-[#5f259f] hover:bg-[#4a1a80] active:scale-95 text-white font-poppins font-semibold px-4 py-3 rounded-xl shadow-md transition-all text-sm"
            >
              <span className="text-lg">{copied ? "✅" : "📋"}</span>
              {copied ? "ID Copied" : "Copy UPI ID"}
            </button>
            <a
              href="/images/jayasri-phonepe-qr-code.png"
              download="Jayasri_Makeovers_QR.png"
              className="flex-1 flex items-center justify-center gap-2 bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 active:scale-95 text-neutral-700 font-poppins font-semibold px-4 py-3 rounded-xl shadow-sm transition-all text-sm"
            >
              <span className="text-lg">⬇️</span>
              Save QR
            </a>
          </div>
          <p className="text-[11px] text-neutral-400 mt-3">
            Open PhonePe &gt; Paste ID or Scan Gallery Image
          </p>
        </div>

      </div>
    </section>
  );
}
