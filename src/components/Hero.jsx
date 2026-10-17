import { ArrowUpRight, Download } from "lucide-react";
import { SKILL_GROUPS } from "@/lib/skills";
import { CV_URL } from "@/lib/site";

const TECH = SKILL_GROUPS.flatMap((g) => g.skills.map((s) => s.name));
const FACTS = ["Based in Jakarta, Indonesia", "Bina Nusantara University", "Open to new opportunities"];

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden bg-background flex flex-col">
      <div aria-hidden className="hero-bg-art">
        <video autoPlay loop muted playsInline preload="metadata" poster="/hero/hero-bg-poster.jpg">
          <source src="/hero/hero-bg.webm" type="video/webm" />
          <source src="/hero/hero-bg.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="relative z-10 flex flex-1 items-center px-5 sm:px-8 pt-28 pb-12">
        <div className="mx-auto max-w-6xl w-full">
          <p className="fade-up font-mono-tech text-xs sm:text-sm uppercase tracking-[0.14em] text-foreground" style={{ animationDelay: "0.05s" }}>
            Full-Stack Software Developer &amp; AI Analyst
          </p>
          <p className="fade-up hud mt-2" style={{ animationDelay: "0.12s" }}>
            Full-stack systems · Applied ML · Computer vision
          </p>

          <h1 className="mt-8 font-heading font-extrabold uppercase tracking-[-0.045em] leading-[0.88] text-[clamp(2.5rem,9.5vw,7.5rem)]">
            {["Muhammad Ridho", "Prakoso"].map((line, i, arr) => (
              <span key={line} className="block">
                <span className="word-in" style={{ animationDelay: `${0.2 + i * 0.12}s` }}>{line}</span>
                {i === arr.length - 1 && <span className="text-[hsl(var(--accent))]">.</span>}
              </span>
            ))}
          </h1>

          <p className="fade-up mt-8 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed" style={{ animationDelay: "0.55s" }}>
            I build full-stack systems and applied ML models — from real-time computer vision to production-ready platforms.
          </p>

          <div className="fade-up mt-10 flex flex-col sm:flex-row gap-3" style={{ animationDelay: "0.65s" }}>
            <a href="#contact" className="group inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground font-mono-tech text-xs font-semibold uppercase tracking-[0.12em] px-6 py-4 hover:brightness-110 transition">
              Contact about work
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href={CV_URL}
              download="Muhammad-Ridho-Prakoso-CV.pdf"
              className="group relative inline-flex items-center justify-center overflow-hidden border border-accent/60 hover:border-accent text-foreground font-mono-tech text-xs font-semibold uppercase tracking-[0.12em] px-6 py-4 transition-colors"
            >
              <span aria-hidden className="absolute inset-0 translate-y-full bg-accent transition-transform duration-300 ease-out group-hover:translate-y-0" />
              <span className="relative flex items-center gap-3 transition-colors duration-300 group-hover:text-accent-foreground">
                <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                Download CV
                <span className="text-[10px] opacity-60">PDF</span>
              </span>
            </a>

            <a href="#work" className="group inline-flex items-center justify-center gap-2 border border-border text-foreground font-mono-tech text-xs font-semibold uppercase tracking-[0.12em] px-6 py-4 hover:border-foreground/50 transition-colors">
              View portfolio
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </div>

          <div className="fade-up hud mt-12 flex flex-col sm:flex-row gap-2 sm:gap-10" style={{ animationDelay: "0.8s" }}>
            {FACTS.map((f) => <span key={f}>{f}</span>)}
          </div>
        </div>
      </div>

      <span className="hud absolute right-8 bottom-16 hidden sm:block">▼ Scroll</span>

      <div aria-hidden className="relative z-10 overflow-hidden whitespace-nowrap border-y border-border py-3">
        <div className="marquee hud">
          {[...TECH, ...TECH].map((t, i) => (
            <span key={i} className="px-6">{t} <span className="text-[hsl(var(--accent))]">/</span></span>
          ))}
        </div>
      </div>
    </section>
  );
}
