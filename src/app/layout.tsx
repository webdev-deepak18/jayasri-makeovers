import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
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
  title: "Jayasri Makeovers | Bangalore",
  description: "Certified makeup artistry, from Bangalore's heart to yours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
