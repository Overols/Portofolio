import { useEffect, useState } from "react";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div
        className={`transition-colors duration-300 ${
          scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--accent-2))] font-heading font-bold text-sm text-white">
              MR
            </span>
            <span className="font-heading font-semibold text-sm text-foreground hidden sm:inline">
              Ridho Prakoso
            </span>
          </a>

          <ul className="hidden md:flex items-center gap-9 text-sm font-medium text-muted-foreground">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="link-underline hover:text-foreground transition-colors pb-0.5">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-foreground text-background text-sm font-semibold px-5 py-2.5 hover:bg-foreground/90 transition-colors"
          >
            Let's talk
          </a>

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
          >
            <span
              className={`block h-0.5 w-5 rounded-full bg-foreground transition-transform duration-300 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-foreground transition-transform duration-300 ${
                open ? "-translate-y-[1px] -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </div>

      {open && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl">
          <ul className="px-5 py-5 flex flex-col gap-4 text-base">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-foreground/85 hover:text-foreground transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-background text-sm font-semibold px-5 py-2.5"
              >
                Let's talk
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
