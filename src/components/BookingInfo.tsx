"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import Image from "next/image";

export default function BookingInfo() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("8867052945");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="scroll-mt-20 py-12 px-6 bg-white" id="booking-info">
      <div className="text-center mb-10">
        <h3 className="font-playfair text-3xl font-bold text-brand-primary">
          Trial & Booking
        </h3>
        <div className="w-16 h-1 bg-brand-secondary mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="space-y-7 max-w-lg mx-auto">
        {/* Free Trial Demo */}
        <div className="bg-brand-light/40 border-l-4 border-brand-secondary rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🏡</span>
            <h4 className="font-playfair text-lg font-bold text-neutral-800">Free Trial Demo</h4>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed pl-9">
            {t("about.demo")}
          </p>
        </div>

        {/* Travel Notice */}
        <div className="bg-neutral-50 border-l-4 border-neutral-300 rounded-2xl p-5 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🚗</span>
            <h4 className="font-playfair text-lg font-bold text-neutral-800">Travel Policy</h4>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed pl-9">
            {t("about.travel")}
          </p>
        </div>

        {/* Booking Terms Box */}
        <div className="bg-gradient-to-b from-white to-brand-light/30 border border-brand-secondary/30 rounded-3xl p-6 text-center shadow-lg relative pt-10 mt-12">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-[11px] font-bold px-5 py-2 rounded-full uppercase tracking-wider shadow-md whitespace-nowrap">
            Booking Policy
          </div>

          <h4 className="font-playfair text-2xl font-bold text-brand-primary mb-3">
            {t("about.advanceTitle") || "Secure Your Special Day! 💖"}
          </h4>
          <p className="text-sm text-neutral-600 leading-relaxed max-w-md mx-auto mb-8">
            {t("about.advanceFriendly") || "To ensure you receive my absolute full attention on your special day, I take a 50% advance to secure your booking. Once confirmed, I completely block my calendar and decline other requests for your slot!"}
          </p>

          {/* Payment Section */}
          <div className="bg-white rounded-2xl p-5 pt-8 border border-neutral-200 relative shadow-sm inline-block w-full max-w-sm">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white border border-brand-primary/20 text-brand-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm whitespace-nowrap z-10 flex items-center gap-1.5">
              <span>🛡️</span> {t("about.scanToPay") || "Scan to Pay Advance"}
            </div>

            <div className="w-full px-4 mb-4 bg-neutral-50/50 rounded-xl py-2">
              <Image
                src="/images/jayasri-phonepe-qr-code.png"
                alt="PhonePe QR Code"
                width={300}
                height={300}
                className="w-full max-w-[180px] h-auto object-contain mx-auto mix-blend-multiply"
              />
            </div>

            <p className="font-bold text-neutral-800 text-lg tracking-wide mb-1">
              {t("about.phonePe")}
            </p>
            <p className="text-[11px] text-green-600 font-semibold bg-green-50 inline-block px-3 py-1 rounded-full mb-6 border border-green-100">
              ✓ 100% Secure Payment via UPI
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={handleCopy}
                className="flex-1 flex flex-col items-center justify-center gap-1.5 bg-brand-primary text-white font-poppins font-semibold px-2 py-3 rounded-xl shadow-md active:scale-95 transition-all outline-none"
              >
                <span className="text-xl">{copied ? "✅" : "📋"}</span>
                <span className="text-[10px] sm:text-[11px] leading-tight">{copied ? "Number Copied" : "Copy UPI Number"}</span>
              </button>
              <a
                href="/images/jayasri-phonepe-qr-code.png"
                download="Jayasri_Makeovers_QR.png"
                className="flex-1 flex flex-col items-center justify-center gap-1.5 bg-white text-brand-primary border-2 border-brand-primary/20 font-poppins font-semibold px-2 py-3 rounded-xl shadow-sm hover:bg-brand-light/10 active:scale-95 transition-all outline-none"
              >
                <span className="text-xl">⬇️</span>
                <span className="text-[10px] sm:text-[11px] leading-tight">Save QR Code</span>
              </a>
            </div>
            
            {/* Very dense simple booking steps appended inside the box for context */}
            <div className="mt-6 w-full text-left space-y-2.5 bg-brand-light/30 rounded-xl p-4 border border-brand-secondary/20 text-xs">
              <div className="flex items-start gap-3">
                <div className="bg-brand-primary text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</div>
                <p className="text-neutral-700 leading-tight font-medium">Copy number or save my QR code</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-brand-primary text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</div>
                <p className="text-neutral-700 leading-tight font-medium">Pay 50% advance via PhonePe/GPay</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-brand-primary text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</div>
                <p className="text-neutral-700 leading-tight font-medium">Send me a screenshot directly on WhatsApp!</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
