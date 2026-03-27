"use client";

import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { useState } from "react";

export default function About() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("8867052945");
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
            <p className="text-sm text-neutral-600 leading-relaxed font-medium">
              Secure your date with a{" "}
              <span className="font-bold text-brand-primary">50% advance</span>{" "}
              — your slot is reserved exclusively for you.
            </p>
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

          <div className="flex gap-4 w-full max-w-sm mx-auto">
            <button
              onClick={handleCopy}
              className="flex-1 flex flex-col items-center justify-center gap-2 bg-brand-primary text-white font-poppins font-bold px-4 py-5 rounded-2xl shadow-lg active:scale-95 transition-all"
            >
              <span className="text-2xl">{copied ? "✅" : "📋"}</span>
              <span className="text-sm">{copied ? "Number Copied" : "Copy Number"}</span>
            </button>
            <a
              href="/images/jayasri-phonepe-qr-code.png"
              download="Jayasri_Makeovers_QR.png"
              className="flex-1 flex flex-col items-center justify-center gap-2 bg-white text-brand-primary border-2 border-brand-primary/20 font-poppins font-bold px-4 py-5 rounded-2xl shadow-md hover:bg-neutral-50 active:scale-95 transition-all"
            >
              <span className="text-2xl">⬇️</span>
              <span className="text-sm text-center leading-tight">Save QR Code</span>
            </a>
          </div>

          <div className="mt-7 w-full text-left space-y-3">
            <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold px-1 mb-1">Simple Booking Steps</p>

            {/* Step 1 */}
            <div className="flex items-center gap-4 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-4">
              <div className="w-9 h-9 rounded-full bg-brand-primary text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-sm">1</div>
              <div>
                <p className="text-sm font-bold text-neutral-800">Copy Number or Save QR</p>
                <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">Use the buttons above to quickly save my payment details.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-4 bg-neutral-50 border border-neutral-100 rounded-2xl p-4">
              <div className="w-9 h-9 rounded-full bg-neutral-200 text-neutral-700 text-sm font-bold flex items-center justify-center shrink-0 shadow-sm">2</div>
              <div>
                <p className="text-sm font-bold text-neutral-800">Open Any UPI App</p>
                <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">Launch GPay, PhonePe, or PayTM on your phone.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 bg-neutral-50 border border-neutral-100 rounded-2xl p-4">
              <div className="w-9 h-9 rounded-full bg-neutral-200 text-neutral-700 text-sm font-bold flex items-center justify-center shrink-0 shadow-sm mt-0.5">3</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-800">Search & Pay 50%</p>
                <p className="text-xs text-neutral-500 mt-0.5 mb-2 leading-relaxed">Search via Number / UPI ID, or Scan from your Gallery.</p>
                
                <div className="bg-white rounded-xl border border-neutral-100 divide-y divide-neutral-100 text-[11px] overflow-hidden shadow-xs mt-2">
                  <div className="flex justify-between items-center px-3 py-2">
                    <span className="text-neutral-400 font-medium">Number</span>
                    <span className="font-bold text-neutral-800 tracking-wide">88670 52945</span>
                  </div>
                  <div className="flex justify-between items-center px-3 py-2">
                    <span className="text-neutral-400 font-medium">UPI ID</span>
                    <span className="font-bold text-brand-primary tracking-wide">8867052945@ybl</span>
                  </div>
                  <div className="flex justify-between items-center px-3 py-2 bg-neutral-50/30">
                    <span className="text-neutral-400 font-medium">Name</span>
                    <span className="font-bold text-neutral-700">Jayashree C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
