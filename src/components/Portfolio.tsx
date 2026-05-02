"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type Category = "all" | "simple" | "semi-hd" | "hd-bridal" | "hairstyle";

type PortfolioImage = {
  src: string;
  category: Category | Category[];
};

const images: PortfolioImage[] = [
  // Initial few photos are makeup as requested
  { src: "/images/portfolio/bridal-01.webp", category: "hd-bridal" },
  { src: "/images/portfolio/bridal-03.webp", category: "hd-bridal" },
  { src: "/images/portfolio/hd-01.webp", category: "hd-bridal" },
  { src: "/images/portfolio/hd-02.webp", category: "hd-bridal" },
  { src: "/images/portfolio/engagement-01.webp", category: "semi-hd" },
  { src: "/images/portfolio/babyshower-03.webp", category: "semi-hd" },
  { src: "/images/portfolio/simple-01.webp", category: "simple" },
  
  // Scattering hairstyle photos in between
  { src: "/images/portfolio/hair-01.webp", category: "hairstyle" },
  { src: "/images/portfolio/hair-12.webp", category: "hairstyle" },
  // { src: "/images/portfolio/reception-01.webp", category: "semi-hd" },
  { src: "/images/portfolio/simple-02.webp", category: "simple" },
  { src: "/images/portfolio/hair-02.webp", category: "hairstyle" },
  { src: "/images/portfolio/hair-13.webp", category: "hairstyle" },
  { src: "/images/portfolio/hair-14.webp", category: "hairstyle" },
  { src: "/images/portfolio/hair-15.webp", category: "hairstyle" },
  { src: "/images/portfolio/hair-16.webp", category: "hairstyle" },
  { src: "/images/portfolio/hair-17.webp", category: "hairstyle" },
  { src: "/images/portfolio/hair-18.webp", category: "hairstyle" },
  
  { src: "/images/portfolio/bridal-02.webp", category: "hd-bridal" },
  { src: "/images/portfolio/babyshower-01.webp", category: "semi-hd" },
  { src: "/images/portfolio/hair-03.webp", category: "hairstyle" },
  
  { src: "/images/portfolio/simple-03.webp", category: "simple" },
  { src: "/images/portfolio/hair-05.webp", category: "hairstyle" },
  { src: "/images/portfolio/simple-04.webp", category: "simple" },
  { src: "/images/portfolio/simple-07.webp", category: "simple" },
  { src: "/images/portfolio/simple-06.webp", category: "simple" },
  { src: "/images/portfolio/semi-hd-01.webp", category: "semi-hd" },
  
  { src: "/images/portfolio/babyshower-02.webp", category: "semi-hd" },
  { src: "/images/portfolio/hair-07.webp", category: "hairstyle" },
  
  { src: "/images/portfolio/simple-05.webp", category: "simple" },
  { src: "/images/portfolio/simple-06.webp", category: "simple" },
  { src: "/images/portfolio/hair-08.webp", category: "hairstyle" },
  
  { src: "/images/portfolio/hair-09.webp", category: "hairstyle" },
  { src: "/images/portfolio/hair-10.webp", category: "hairstyle" },
  { src: "/images/portfolio/hair-11.webp", category: "hairstyle" },
];

export default function Portfolio() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Category>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [shuffledImages, setShuffledImages] = useState(images);

  useEffect(() => {
    const shuffleArray = <T,>(array: T[]): T[] => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const hairImages = images.filter((img) => 
      Array.isArray(img.category) ? img.category.includes("hairstyle") : img.category === "hairstyle"
    );
    const otherImages = images.filter((img) => 
      Array.isArray(img.category) ? !img.category.includes("hairstyle") : img.category !== "hairstyle"
    );
    
    const shuffledOthers = shuffleArray(otherImages);
    const shuffledHair = shuffleArray(hairImages);

    // Ensure first 6 photos are non-hair
    const firstOthers = shuffledOthers.slice(0, 6);
    const remainingOthers = shuffledOthers.slice(6);

    const remainingMixed = shuffleArray([...remainingOthers, ...shuffledHair]);
    
    setShuffledImages([...firstOthers, ...remainingMixed]);
  }, []);

  // Touch swipe tracking
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const categories: { id: Category; labelKey: string }[] = [
    { id: "all", labelKey: "portfolio.all" },
    { id: "simple", labelKey: "portfolio.simple" },
    { id: "semi-hd", labelKey: "portfolio.semi-hd" },
    { id: "hd-bridal", labelKey: "portfolio.hd-bridal" },
    { id: "hairstyle", labelKey: "portfolio.hairstyle" },
  ];

  const filteredImages = activeTab === "all" ? shuffledImages : shuffledImages.filter(img => 
    Array.isArray(img.category) ? img.category.includes(activeTab) : img.category === activeTab
  );

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };
  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  // Arrow click wrappers (prevent closing lightbox on click through)
  const nextImage = (e: React.MouseEvent) => { e.stopPropagation(); goNext(); };
  const prevImage = (e: React.MouseEvent) => { e.stopPropagation(); goPrev(); };

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Only process as a horizontal swipe if it's clearly more horizontal than vertical
    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY)) return;

    if (deltaX < 0) {
      goNext(); // Swipe left = next image
    } else {
      goPrev(); // Swipe right = prev image
    }
  };

  return (
    <section className="scroll-mt-20 py-12 bg-white relative" id="portfolio">
      <div className="text-center mb-8 px-6">
        <h3 className="font-playfair text-3xl font-bold text-brand-primary">{t("portfolio.title")}</h3>
        <div className="w-16 h-1 bg-brand-secondary mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Filter Tabs — horizontal scroll, pills stay natural width */}
      <div className="flex overflow-x-auto hide-scrollbar px-6 pb-6 gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveTab(cat.id);
            }}
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
            className="relative w-full rounded-2xl overflow-hidden shadow-sm inline-block group cursor-pointer animate-in fade-in zoom-in duration-500"
            onClick={() => openLightbox(idx)}
          >
            <Image
              src={img.src}
              alt={`Jayasri Makeovers - Professional ${Array.isArray(img.category) ? img.category.join(", ") : img.category} makeup and hairstyling in Bangalore`}
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
          className="fixed inset-y-0 w-full max-w-md left-1/2 -translate-x-1/2 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-md"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white p-2 z-[110] bg-black/40 rounded-full hover:bg-white/20 transition-colors"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>

          {/* Swipe hint indicator — shows briefly then fades */}
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-3 text-white/50 text-xs pointer-events-none select-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            <span>Swipe to browse</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>

          {/* Position indicator dots */}
          <div className="absolute top-6 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none">
            {filteredImages.map((_, idx) => (
              <div
                key={idx}
                className={`rounded-full transition-all duration-300 ${
                  idx === lightboxIndex
                    ? "w-4 h-2 bg-white"
                    : "w-2 h-2 bg-white/30"
                }`}
              />
            ))}
          </div>
          
          {/* Prev Button (desktop fallback) */}
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 z-[110] bg-black/40 rounded-full hover:bg-white/20 transition-colors md:flex hidden"
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
                alt={`Jayasri Makeovers ${Array.isArray(filteredImages[lightboxIndex].category) ? filteredImages[lightboxIndex].category.join(", ") : filteredImages[lightboxIndex].category} full size`}
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

          {/* Next Button (desktop fallback) */}
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 z-[110] bg-black/40 rounded-full hover:bg-white/20 transition-colors md:flex hidden"
            onClick={nextImage}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      )}
    </section>
  );
}
