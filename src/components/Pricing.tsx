"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import Image from "next/image";

export default function Pricing() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"packages" | "booking">("packages");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("8867052945");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 px-6 bg-brand-light" id="pricing">
      <div className="text-center mb-10">
        <h3 className="font-playfair text-3xl font-bold text-brand-primary">{t("pricing.title")}</h3>
        <div className="w-16 h-1 bg-brand-secondary mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="flex bg-neutral-200/50 p-1.5 rounded-full max-w-sm mx-auto mb-8 relative shadow-inner">
        {/* Animated Background Pill */}
        <div
          className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-sm transition-transform duration-300 ease-out z-0 ${
            activeTab === "packages" ? "translate-x-0" : "translate-x-[calc(100%+0px)] ml-3"
          }`}
        />
        
        <button
          onClick={() => setActiveTab("packages")}
          className={`flex-1 py-3 px-4 text-sm font-bold font-poppins rounded-full z-10 transition-colors ${
            activeTab === "packages" ? "text-brand-primary" : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          {t("nav.services") || "Packages"}
        </button>
        <button
          onClick={() => setActiveTab("booking")}
          className={`flex-1 py-3 px-4 text-sm font-bold font-poppins rounded-full z-10 transition-colors ${
            activeTab === "booking" ? "text-brand-primary" : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Trial & Booking
        </button>
      </div>

      {activeTab === "packages" ? (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Simple Makeover (Popular) */}
          <div className="relative bg-white border-2 border-brand-secondary/40 rounded-2xl p-6 shadow-md overflow-hidden transition-transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 bg-brand-secondary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              {t("pricing.popular")}
            </div>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-playfair text-xl font-bold text-neutral-800 pr-4">{t("pricing.simple")}</h4>
              <span className="font-poppins font-bold text-brand-primary text-xl whitespace-nowrap">₹3000</span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed">{t("pricing.simpleInclude")}</p>
          </div>

          {/* HD Bridal */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-playfair text-xl font-bold text-neutral-800">{t("pricing.hdBridal")}</h4>
              <span className="font-poppins font-bold text-brand-primary text-xl whitespace-nowrap">₹5000</span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed">{t("pricing.hdBridalInclude")}</p>
          </div>

          {/* Engagement */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-playfair text-xl font-bold text-neutral-800">{t("pricing.engagement")}</h4>
              <span className="font-poppins font-bold text-brand-primary text-xl whitespace-nowrap">₹3500</span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed">{t("pricing.engagementInclude")}</p>
          </div>

          {/* Saree & Hair */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-playfair text-xl font-bold text-neutral-800">{t("pricing.sareeHair")}</h4>
              <span className="font-poppins font-bold text-brand-primary text-xl whitespace-nowrap">₹1000</span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed">{t("pricing.sareeHairInclude")}</p>
          </div>

        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Free Trial Demo */}
          <div className="bg-white border-l-4 border-brand-secondary rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🏡</span>
              <h4 className="font-playfair text-lg font-bold text-neutral-800">Free Trial Demo</h4>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed pl-9">
              {t("about.demo")}
            </p>
          </div>

          {/* Travel Notice */}
          <div className="bg-white border-l-4 border-neutral-300 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🚗</span>
              <h4 className="font-playfair text-lg font-bold text-neutral-800">Travel Policy</h4>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed pl-9">
              {t("about.travel")}
            </p>
          </div>

          {/* Booking Terms Box */}
          <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border-2 border-brand-primary/20 rounded-2xl p-6 text-center shadow-sm relative pt-8 mt-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm whitespace-nowrap">
              Booking Policy
            </div>

            <h4 className="font-playfair text-xl font-bold text-brand-primary mb-3">
              {t("about.advanceTitle") || "Secure Your Special Day! 💖"}
            </h4>
            <p className="text-sm text-neutral-700 leading-relaxed max-w-md mx-auto mb-8">
              {t("about.advanceFriendly") || "To ensure you receive my absolute full attention on your special day, I take a 50% advance to secure your booking. Once confirmed, I completely block my calendar and decline other requests for your slot!"}
            </p>

            {/* Repositioned Payment Section from About.tsx */}
            <div className="bg-white rounded-3xl p-5 pt-8 border border-neutral-100 relative shadow-sm inline-block w-full max-w-sm">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white border border-neutral-200 text-brand-primary text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-sm whitespace-nowrap z-10 flex items-center gap-1.5">
                <span>🛡️</span> {t("about.scanToPay") || "Scan to Pay Advance"}
              </div>

              <div className="w-full px-2 mb-4">
                <Image
                  src="/images/jayasri-phonepe-qr-code.png"
                  alt="PhonePe QR Code"
                  width={300}
                  height={300}
                  className="w-full max-w-[200px] h-auto object-contain mx-auto"
                />
              </div>

              <p className="font-bold text-neutral-800 text-lg tracking-wide mb-1">
                {t("about.phonePe")}
              </p>
              <p className="text-xs text-neutral-500 mb-5">100% Secure Payment via UPI</p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex flex-col items-center justify-center gap-1.5 bg-brand-primary text-white font-poppins font-bold px-3 py-4 rounded-xl shadow-md active:scale-95 transition-all outline-none"
                >
                  <span className="text-xl">{copied ? "✅" : "📋"}</span>
                  <span className="text-[11px] leading-tight">{copied ? "Number Copied" : "Copy Number"}</span>
                </button>
                <a
                  href="/images/jayasri-phonepe-qr-code.png"
                  download="Jayasri_Makeovers_QR.png"
                  className="flex-1 flex flex-col items-center justify-center gap-1.5 bg-neutral-50 text-brand-primary border border-neutral-200 font-poppins font-bold px-3 py-4 rounded-xl shadow-sm hover:bg-neutral-100 active:scale-95 transition-all outline-none"
                >
                  <span className="text-xl">⬇️</span>
                  <span className="text-[11px] leading-tight">Save QR Code</span>
                </a>
              </div>
              
              {/* Very dense simple booking steps appended inside the box for context */}
              <div className="mt-5 w-full text-left space-y-2 bg-neutral-50 rounded-xl p-3 border border-neutral-100 text-xs">
                <div className="flex items-start gap-2">
                  <div className="bg-brand-primary text-white w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">1</div>
                  <p className="text-neutral-600 leading-tight">Copy number or save QR</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-brand-primary text-white w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">2</div>
                  <p className="text-neutral-600 leading-tight">Pay 50% via any UPI App</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-brand-primary text-white w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">3</div>
                  <p className="text-neutral-600 leading-tight">Screenshot & WhatsApp me!</p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
