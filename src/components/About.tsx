"use client";

import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

export default function About() {
  const { t, lang } = useLanguage();

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
        <p className="text-brand-primary font-semibold mb-6 uppercase tracking-wider text-xs bg-brand-secondary/10 px-4 py-1.5 rounded-full inline-block">
          {t("about.certified")}
        </p>
        
        <p className="text-neutral-600 leading-relaxed text-sm md:text-base max-w-sm">
          {lang === 'en' 
            ? "With a deep passion for artistry and an ISO certification, I specialize in bringing out your natural beauty and radiance to ensure you look absolutely flawless on your special day."
            : "ಕಲೆ ಮತ್ತು ಸೌಂದರ್ಯದ ಮೇಲಿನ ನನ್ನ ಆಳವಾದ ಆಸಕ್ತಿ ಹಾಗೂ ISO ದೃಢೀಕರಣದೊಂದಿಗೆ, ನಿಮ್ಮ ವಿಶೇಷ ದಿನದಂದು ನೀವು ರೇಷ್ಮೆಯಂತೆ ಹೊಳೆಯುವಂತೆ ಮತ್ತು ನೈಸರ್ಗಿಕವಾಗಿ ಸುಂದರವಾಗಿ ಕಾಣುವಂತೆ ಮಾಡಲು ನಾನು ಪರಿಣತಿ ಹೊಂದಿದ್ದೇನೆ."}
        </p>
      </div>
    </section>
  );
}
