---
name: jayasri-context
description: Core context, commands, and rules for the Jayasri Makeovers project.
---

# Jayasri Makeovers - Project Context

This is a Next.js (App Router) mobile-first portfolio website for Jayasri, an ISO Certified Makeup Artist based in Bangalore.

## Technical Stack
- **Framework**: Next.js App Router (`src/app/page.tsx`)
- **Styling**: Tailwind CSS v4 (`src/app/globals.css` @theme instead of tailwind.config.ts)
- **Fonts**: Playfair Display (Headings) & Poppins (Body text)
- **Deployment**: Vercel

## Key Architecture & Features
1. **Mobile Container Constraint**: The app is strictly wrapped in `<MobileContainer>` because 100% of the audience comes from Instagram on mobile phones. It effectively functions as a scalable Linktree.
2. **i18n (Language Toggle)**: Client-side language toggle between English and Kannada controlled via `src/context/LanguageContext.tsx` and translation files `src/locales/*.json`.
3. **Asset Protection**: Custom CSS classes (`.protect-image`) and absolute positioning are used to enforce watermarks and block right-clicks on portfolio images.

## Updating Content
- **New Photos**: Drop images in `public/images/portfolio/` -> Add to the `images` array in `src/components/Portfolio.tsx`.
- **Translations**: Always update BOTH `src/locales/en.json` and `src/locales/kn.json` when adding new strings.
- **Calendar**: Add booked dates (Format: `YYYY-MM-DD`) to `BOOKED_DATES` at the top of `src/components/Calendar.tsx`. 
- **Testimonials**: Currently hardcoded in `src/components/Testimonial.tsx`. Keep changes here visually consistent and scale to a horizontal scroll/carousel only when >1 testimonial exists.
