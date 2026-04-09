"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

export default function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
  ];

  return (
    <section className="py-12 px-6 bg-white" id="faq">
      <div className="text-center mb-10">
        <h3 className="font-playfair text-3xl font-bold text-brand-primary">
          {t("faq.title") || "Frequently Asked Questions"}
        </h3>
        <div className="w-16 h-1 bg-brand-secondary mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-neutral-100 rounded-2xl overflow-hidden shadow-sm transition-all"
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center bg-neutral-50 hover:bg-brand-primary/5 transition-colors focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-poppins font-semibold text-neutral-800 pr-4 text-sm md:text-base leading-relaxed">
                {faq.q}
              </span>
              <span className={`text-brand-secondary transform transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </button>
            <div 
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-40 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
              }`}
            >
              <p className="text-sm text-neutral-600 leading-relaxed">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
