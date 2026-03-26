"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Testimonial() {
  const { t } = useLanguage();

  return (
    <section className="py-12 px-6 bg-white overflow-hidden">
      <div className="text-center mb-10">
        <h3 className="font-playfair text-3xl font-bold text-brand-primary">{t("testimonials.title")}</h3>
        <div className="w-16 h-1 bg-brand-secondary mx-auto mt-4 rounded-full"></div>
      </div>
      
      <div className="relative bg-gradient-to-br from-brand-primary to-[#5e151b] rounded-3xl p-8 shadow-xl text-center transform transition-all hover:scale-[1.02]">
        {/* Decorative Quote Icon */}
        <div className="absolute top-4 left-6 text-brand-secondary/30 text-7xl font-playfair leading-none">
          &ldquo;
        </div>
        
        <p className="relative z-10 font-medium text-white text-[17px] leading-relaxed italic mt-4 mb-8 mx-auto max-w-[90%]">
           Thank you, Jayasri, for creating this look. You were very polite and professional, and you handled everything with great patience.
        </p>
        
        <div className="flex flex-col items-center">
           <div className="flex gap-1 mb-3">
             {[1,2,3,4,5].map(star => (
                <svg key={star} className="w-5 h-5 text-yellow-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
             ))}
           </div>
           <h4 className="font-playfair font-bold text-brand-light text-xl">Divya Shree</h4>
           <p className="text-brand-secondary text-sm font-medium tracking-wide uppercase mt-1">Happy Client</p>
        </div>
      </div>
    </section>
  );
}
