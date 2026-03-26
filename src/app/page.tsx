import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Portfolio from "@/components/Portfolio";
import Calendar from "@/components/Calendar";
import Testimonial from "@/components/Testimonial";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-white">
      <Navbar />
      <Hero />
      <Pricing />
      <Portfolio />
      <Calendar />
      <Testimonial />
      <About />
      <div className="h-10 bg-brand-light w-full"></div> {/* Spacer for fixed whatsapp button if added later */}
      <Footer />
    </main>
  );
}
