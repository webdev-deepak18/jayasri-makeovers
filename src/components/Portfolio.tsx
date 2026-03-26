"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import Image from "next/image";

type Category = "all" | "bridal" | "hair" | "hd" | "engagement" | "simple" | "babyShower" | "reception";

const images = [
  { src: "/images/portfolio/bridal-01.webp", category: "bridal" },
  { src: "/images/portfolio/hd-01.webp", category: "hd" },
  { src: "/images/portfolio/bridal-02.webp", category: "bridal" },
  { src: "/images/portfolio/engagement-01.webp", category: "engagement" },
  { src: "/images/portfolio/simple-01.webp", category: "simple" },
  { src: "/images/portfolio/reception-01.webp", category: "reception" },
  { src: "/images/portfolio/simple-02.webp", category: "simple" },
  { src: "/images/portfolio/simple-03.webp", category: "simple" },
  { src: "/images/portfolio/babyshower-01.webp", category: "babyShower" },
  { src: "/images/portfolio/hair-01.webp", category: "hair" },
  { src: "/images/portfolio/babyshower-02.webp", category: "babyShower" },
  { src: "/images/portfolio/hair-02.webp", category: "hair" },
  { src: "/images/portfolio/hair-03.webp", category: "hair" },
  { src: "/images/portfolio/hair-05.webp", category: "hair" },
  { src: "/images/portfolio/hair-07.webp", category: "hair" },
  { src: "/images/portfolio/hair-08.webp", category: "hair" },
  { src: "/images/portfolio/hair-09.webp", category: "hair" },
  { src: "/images/portfolio/hair-10.webp", category: "hair" },
];

export default function Portfolio() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Category>("all");

  const categories: { id: Category; labelKey: string }[] = [
    { id: "all", labelKey: "portfolio.all" },
    { id: "bridal", labelKey: "portfolio.bridal" },
    { id: "hair", labelKey: "portfolio.hair" },
    { id: "hd", labelKey: "portfolio.hd" },
    { id: "engagement", labelKey: "portfolio.engagement" },
    { id: "simple", labelKey: "portfolio.simple" },
    { id: "babyShower", labelKey: "portfolio.babyShower" },
    { id: "reception", labelKey: "portfolio.reception" },
  ];

  const filteredImages = activeTab === "all" ? images : images.filter(img => img.category === activeTab);

  return (
    <section className="py-12 bg-white" id="portfolio">
      <div className="text-center mb-8 px-6">
        <h3 className="font-playfair text-3xl font-bold text-brand-primary">{t("portfolio.title")}</h3>
        <div className="w-16 h-1 bg-brand-secondary mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Filter Tabs — horizontal scroll, pills stay natural width */}
      <div className="flex overflow-x-auto hide-scrollbar px-6 pb-6 gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex-shrink-0 whitespace-nowrap px-5 py-2 rounded-full text-sm font-poppins font-semibold transition-all shadow-sm ${
              activeTab === cat.id
                ? "bg-brand-secondary text-white shadow-md scale-105"
                : "bg-brand-light text-brand-primary border border-brand-secondary/20 hover:bg-brand-secondary/10"
            }`}
          >
            {/* @ts-expect-error valid key */}
            {t(cat.labelKey)}
          </button>
        ))}
      </div>

      {/* Masonry-style Grid (CSS Columns) */}
      <div className="px-6 columns-2 gap-4 space-y-4">
        {filteredImages.map((img, idx) => (
          <div key={`${img.src}-${idx}`} className="relative w-full rounded-2xl overflow-hidden shadow-sm inline-block group">
            <Image
              src={img.src}
              alt={`Jayasri Makeovers ${img.category}`}
              width={400}
              height={600}
              className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105 protect-image"
              loading="lazy"
              draggable={false}
            />
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none pointer-events-none">
              <p className="text-white text-xs sm:text-sm font-bold -rotate-45 tracking-widest uppercase drop-shadow-md whitespace-nowrap">
                Jayasri Makeovers
              </p>
            </div>
             <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>
    </section>
  );
}
