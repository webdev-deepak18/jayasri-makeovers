"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Pricing() {
  const { t } = useLanguage();

  return (
    <section className="py-12 px-6 bg-brand-light" id="pricing">
      <div className="text-center mb-10">
        <h3 className="font-playfair text-3xl font-bold text-brand-primary">{t("pricing.title")}</h3>
        <div className="w-16 h-1 bg-brand-secondary mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="space-y-5">
        
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

      {/* Booking Terms Box */}
      <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border-2 border-brand-primary/20 rounded-2xl p-6 mt-10 text-center shadow-sm">
        <h4 className="font-playfair text-xl font-bold text-brand-primary mb-3">
          {t("about.advanceTitle") || "Secure Your Special Day! 💖"}
        </h4>
        <p className="text-sm text-neutral-700 leading-relaxed max-w-md mx-auto">
          {t("about.advanceFriendly") || "To ensure you receive my absolute full attention on your special day, I take a 50% advance to secure your booking. Once confirmed, I completely block my calendar and decline other requests for your slot!"}
        </p>
      </div>

      {/* Travel Notice (Moved to bottom) */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 mt-6 flex items-start gap-3 shadow-sm text-left">
        <span className="text-xl">🚗</span>
        <p className="text-sm text-neutral-600 font-medium leading-relaxed">
          <span className="font-bold text-neutral-800">Travel Notice: </span>
          {t("about.travel")}
        </p>
      </div>
    </section>
  );
}
