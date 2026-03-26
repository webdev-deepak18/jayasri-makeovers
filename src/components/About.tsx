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

          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
            <a
              href="phonepe://pay?pa=8867052945@ybl&pn=Jayasri%20Makeovers&cu=INR"
              className="w-full flex items-center justify-center gap-2 bg-[#5f259f] hover:bg-[#4a1a80] active:scale-95 text-white font-poppins font-semibold px-4 py-3.5 rounded-xl shadow-md transition-all text-base"
            >
              <span className="text-xl">⚡</span>
              Pay via PhonePe
            </a>
            <div className="flex gap-3 w-full">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-1.5 bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 active:scale-95 text-neutral-700 font-poppins font-semibold px-3 py-2.5 rounded-xl shadow-sm transition-all text-xs"
              >
                <span className="text-sm">{copied ? "✅" : "📋"}</span>
                {copied ? "ID Copied" : "Copy ID"}
              </button>
              <a
                href="/images/jayasri-phonepe-qr-code.png"
                download="Jayasri_Makeovers_QR.png"
                className="flex-1 flex items-center justify-center gap-1.5 bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 active:scale-95 text-neutral-700 font-poppins font-semibold px-3 py-2.5 rounded-xl shadow-sm transition-all text-xs"
              >
                <span className="text-sm">⬇️</span>
                Save QR
              </a>
            </div>
          </div>

          <div className="mt-5 w-full text-left space-y-2">
            <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold px-1 mb-3">How to pay</p>

            {/* Step 1 */}
            <div className="flex items-center gap-3 bg-[#5f259f]/5 border border-[#5f259f]/15 rounded-2xl p-3.5">
              <div className="w-8 h-8 rounded-full bg-[#5f259f] text-white text-sm font-bold flex items-center justify-center shrink-0">1</div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">Open PhonePe</p>
                <p className="text-xs text-neutral-500 mt-0.5">Tap the button above — app opens with details pre-filled.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 bg-neutral-50 border border-neutral-100 rounded-2xl p-3.5">
              <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-700 text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-800">Use GPay / Any UPI</p>
                <p className="text-xs text-neutral-500 mt-0.5 mb-2">Search by UPI ID, number, or scan QR.</p>
                <div className="bg-white rounded-xl border border-neutral-100 divide-y divide-neutral-100 text-xs overflow-hidden shadow-sm">
                  <div className="flex justify-between items-center px-3 py-2">
                    <span className="text-neutral-500">UPI ID</span>
                    <span className="font-semibold text-[#5f259f] tracking-wide">8867052945@ybl</span>
                  </div>
                  <div className="flex justify-between items-center px-3 py-2">
                    <span className="text-neutral-500">Number</span>
                    <span className="font-semibold text-neutral-800 tracking-wide">88670 52945</span>
                  </div>
                  <div className="flex justify-between items-center px-3 py-2">
                    <span className="text-neutral-500">Name</span>
                    <span className="font-semibold text-neutral-800">Jayashree C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-100 rounded-2xl p-3.5">
              <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-700 text-sm font-bold flex items-center justify-center shrink-0">3</div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">Scan from Gallery</p>
                <p className="text-xs text-neutral-500 mt-0.5">Save QR → open your app → Scan from photos.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
