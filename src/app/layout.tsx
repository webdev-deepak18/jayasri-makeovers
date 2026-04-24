import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import MobileContainer from "@/components/layout/MobileContainer";
import { LanguageProvider } from "@/context/LanguageContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.jayasrimakeovers.in'),
  title: "Jayasri Makeovers | Makeup & Saree Draping in Bangalore",
  description: "Professional makeup artist in Bangalore specializing in simple makeovers, party makeup, saree draping, hairstyling, and HD bridal makeup.",
  keywords: ["makeup artist bangalore", "saree draping bangalore", "simple makeup bangalore", "party makeup artist", "woman hairstyle", "bridal makeup artist bangalore", "hd bridal makeup", "jayasri makeovers"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Jayasri Makeovers | Makeup & Saree Draping in Bangalore",
    description: "Professional makeup artist in Bangalore specializing in simple makeovers, party makeup, saree draping, hairstyling, and HD bridal makeup.",
    url: "https://www.jayasrimakeovers.in",
    siteName: "Jayasri Makeovers",
    locale: "en_IN",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  "name": "Jayasri Makeovers",
  "image": "https://www.jayasrimakeovers.in/images/portfolio/hd-01.webp",
  "url": "https://www.jayasrimakeovers.in",
  "telephone": "+918867052945",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bangalore",
    "addressRegion": "Karnataka",
    "addressCountry": "IN"
  },
  "description": "Professional makeup artist in Bangalore specializing in simple makeovers, party makeup, saree draping, hairstyling, and HD bridal makeup.",
  "priceRange": "₹₹",
  "founder": {
    "@type": "Person",
    "name": "Jayasri"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-JPBEXD9RLR"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JPBEXD9RLR');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${poppins.variable} antialiased bg-neutral-100 text-neutral-900`}
      >
        <LanguageProvider>
          <MobileContainer>{children}</MobileContainer>
        </LanguageProvider>
      </body>
    </html>
  );
}
