"use client";

import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

export default function About() {
  const { t } = useLanguage();

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
          <div className="flex gap-4 items-start bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
            <span className="text-2xl mt-0.5">🚗</span>
            <p className="text-sm text-neutral-600 leading-relaxed font-medium">{t("about.travel")}</p>
          </div>
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

          {/* Pay Now — opens PhonePe app with number pre-filled */}
          <a
            href="upi://pay?pa=8867052945@ybl&pn=Jayasri%20Makeovers&cu=INR"
            className="inline-flex items-center gap-2 bg-[#5f259f] hover:bg-[#4a1a80] active:scale-95 text-white font-poppins font-semibold px-8 py-3 rounded-full shadow-md transition-all text-base"
          >
            <span className="text-xl">💜</span>
            Pay Now via PhonePe
          </a>
          <p className="text-[11px] text-neutral-400 mt-2">
            Opens PhonePe app automatically
          </p>
        </div>

      </div>
    </section>
  );
}
