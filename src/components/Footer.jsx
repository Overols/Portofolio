import { Linkedin, Github, Instagram, ArrowUp } from "lucide-react";

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/muhammadridhoprakoso/", Icon: Linkedin },
  { label: "GitHub", href: "https://github.com/Overols", Icon: Github },
  { label: "Instagram", href: "https://www.instagram.com/_ridhoprakoso/", Icon: Instagram },
];

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-10">
          <div className="max-w-sm">
            <a href="#top" className="flex items-center gap-2.5 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--accent-2))] font-heading font-bold text-sm text-white">
                MR
              </span>
              <span className="font-heading font-semibold text-sm text-foreground">
                Muhammad Ridho Prakoso
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Full-Stack Software Developer & AI Analyst, building applied ML and web systems
              from Jakarta, Indonesia.
            </p>
          </div>

          <div className="flex gap-14">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Navigate
              </h3>
              <ul className="flex flex-col gap-2.5 text-sm">
                {LINKS.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-foreground/75 hover:text-foreground transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Connect
              </h3>
              <ul className="flex flex-col gap-2.5 text-sm">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground/75 hover:text-foreground transition-colors"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-5 flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Muhammad Ridho Prakoso</span>
          <a
            href="#top"
            aria-label="Back to top"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:border-foreground/40 hover:text-foreground transition-colors"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
