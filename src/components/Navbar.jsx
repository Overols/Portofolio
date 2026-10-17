import { useEffect, useState } from "react";

const LINKS = [
  { n: "01", label: "About", href: "#about" },
  { n: "02", label: "Work", href: "#work" },
  { n: "03", label: "Skills", href: "#skills" },
  { n: "04", label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className={`transition-colors duration-300 ${scrolled || open ? "bg-background/85 backdrop-blur-xl border-b border-border" : "bg-transparent"}`}>
        <nav className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-baseline gap-3">
            <span className="font-heading font-extrabold uppercase tracking-tight text-lg">
              Ridho<span className="text-[hsl(var(--accent))]">.</span>
            </span>
            <span className="hud hidden lg:inline">Portfolio/{new Date().getFullYear()}</span>
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="hud transition-colors hover:!text-foreground">
                  {l.n}/{l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="hud hidden md:inline-flex border border-border px-4 py-2 !text-foreground transition-colors hover:bg-accent hover:!text-accent-foreground hover:border-accent"
          >
            Get in touch
          </a>

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden hud !text-foreground p-2 -mr-2"
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </div>

      {open && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl">
          <ul className="px-5 py-4 flex flex-col">
            {[...LINKS, { n: "05", label: "Get in touch", href: "#contact" }].map((l) => (
              <li key={l.label} className="border-b border-border last:border-b-0">
                <a href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-4 font-heading font-extrabold uppercase text-2xl tracking-tight">
                  <span className="hud">{l.n}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
