const NAME = "Muhammad Ridho Prakoso";
const TITLE = "Full-Stack Software Developer & AI Analyst";
const SUMMARY =
  "I build full-stack systems and applied ML models — from real-time computer vision to production-ready platforms.";

export default function Hero() {
  const words = NAME.split(" ");

  return (
    <section
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden bg-background flex flex-col justify-center"
    >
      {/* Soft vibrant gradient orbs — the only background texture */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="orb-drift absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full opacity-30 blur-[110px]"
          style={{ background: "hsl(var(--accent))" }}
        />
        <div
          className="orb-drift-slow absolute -bottom-40 -right-20 h-[460px] w-[460px] rounded-full opacity-25 blur-[120px]"
          style={{ background: "hsl(var(--accent-2))" }}
        />
      </div>

      <div className="relative z-10 px-5 sm:px-8 pt-28 pb-20">
        <div className="mx-auto max-w-6xl w-full">
          <div
            className="fade-up inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground mb-7"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--accent-2))] opacity-70 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[hsl(var(--accent-2))]" />
            </span>
            Open to new opportunities
          </div>

          <h1 className="font-heading font-extrabold tracking-[-0.03em] leading-[1.02]">
            <span className="block text-[clamp(2.2rem,7vw,4.5rem)]">
              {words.map((w, i) => (
                <span key={i} className="word-in" style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
                  {w}
                  {i < words.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </span>
          </h1>

          <p
            className="fade-up mt-4 text-lg sm:text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent-2))]"
            style={{ animationDelay: "0.45s" }}
          >
            {TITLE}
          </p>

          <p className="fade-up mt-5 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed" style={{ animationDelay: "0.55s" }}>
            {SUMMARY}
          </p>

          <div className="fade-up mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4" style={{ animationDelay: "0.65s" }}>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent-2))] text-white font-semibold text-sm px-6 py-3.5 hover:opacity-90 transition-opacity shadow-[0_8px_30px_-10px_hsl(var(--accent)/0.6)]"
            >
              Contact about work
            </a>
            <a
              href="#work"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-border text-foreground font-semibold text-sm px-6 py-3.5 hover:border-foreground/40 hover:bg-card transition-colors"
            >
              View portfolio
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
