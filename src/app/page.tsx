import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Portfolio from "@/components/Portfolio";
import Calendar from "@/components/Calendar";
import Testimonial from "@/components/Testimonial";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { getPublicBookedDates } from "@/actions/orders";

export default async function Home() {
  const bookedDates = await getPublicBookedDates();

  return (
    <main className="flex min-h-screen flex-col w-full bg-white">
      <Navbar />
      <Hero />
      <Pricing />
      <Portfolio />
      <Calendar bookedDates={bookedDates} />
      <Testimonial />
      <About />
      <FAQ />
      <div className="h-10 bg-brand-light w-full"></div> {/* Spacer for fixed whatsapp button if added later */}
      <Footer />
    </main>
  );
}
