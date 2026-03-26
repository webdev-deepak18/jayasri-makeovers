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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <section className="py-12 bg-white relative" id="portfolio">
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
          <div 
            key={`${img.src}-${idx}`} 
            className="relative w-full rounded-2xl overflow-hidden shadow-sm inline-block group cursor-pointer"
            onClick={() => openLightbox(idx)}
          >
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

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center touch-none backdrop-blur-md"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white p-2 z-[110] bg-black/40 rounded-full hover:bg-white/20 transition-colors"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          
          {/* Prev Button */}
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 z-[110] bg-black/40 rounded-full hover:bg-white/20 transition-colors"
            onClick={prevImage}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          {/* Main Image Container */}
          <div className="relative w-full max-w-md h-full px-4 flex items-center justify-center pointer-events-none">
            <div 
              className="relative w-full h-[85vh] pointer-events-auto"
              onContextMenu={(e) => e.preventDefault()}
            >
              <Image
                src={filteredImages[lightboxIndex].src}
                alt={`Jayasri Makeovers ${filteredImages[lightboxIndex].category} full size`}
                fill
                className="object-contain pointer-events-none select-none protect-image"
                priority
                draggable={false}
              />
              {/* Lightbox Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none pointer-events-none">
                <p className="text-white text-2xl sm:text-4xl font-bold -rotate-45 tracking-widest uppercase drop-shadow-lg whitespace-nowrap">
                  Jayasri Makeovers
                </p>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 z-[110] bg-black/40 rounded-full hover:bg-white/20 transition-colors"
            onClick={nextImage}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      )}
    </section>
  );
}
