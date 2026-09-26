import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutMe from "@/components/about/AboutMe";
import PortfolioSection from "@/components/portfolio/PortfolioSection";
import SkillsSection from "@/components/skills/SkillsSection";
import ContactSection from "@/components/contact/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-[100svh] bg-background text-foreground">
      <Navbar />

      <main>
        <Hero />
        <AboutMe />
        <PortfolioSection />
        <SkillsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}