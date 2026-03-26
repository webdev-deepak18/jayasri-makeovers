"use client";

import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full h-[65vh] min-h-[500px] flex items-end justify-center pb-12">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/portfolio/bridal-01.webp" 
          alt="Jayasri Makeovers Bridal Work"
          fill
          priority
          className="object-cover object-[center_35%] protect-image"
          draggable={false}
        />
        {/* Watermark Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none pointer-events-none">
          <p className="text-white text-2xl font-bold -rotate-12 tracking-widest uppercase drop-shadow-xl whitespace-nowrap">
            Jayasri Makeovers <br/> 88670 52945
          </p>
        </div>
        {/* Gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>
      
      <div className="relative z-10 w-full px-8 text-center flex flex-col items-center">
        <h2 className="font-playfair text-[28px] leading-tight md:text-4xl text-white font-medium mb-6 drop-shadow-md">
          {t("hero.tagline")}
        </h2>
        
        <a 
          href="https://wa.me/918867052945" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-black/20 hover:scale-105 active:scale-95 transition-all w-full max-w-[280px]"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {t("hero.bookNow")}
        </a>
      </div>
    </section>
  );
}
