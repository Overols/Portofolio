import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/Reveal";
import { useState } from "react";
import { Linkedin, Github, Instagram, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

// Get a free access key at https://web3forms.com (enter your email, no signup) —
// paste it below. Submissions land straight in your inbox, no backend needed.
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/muhammadridhoprakoso/", Icon: Linkedin },
  { label: "GitHub", href: "https://github.com/Overols", Icon: Github },
  { label: "Instagram", href: "https://www.instagram.com/_ridhoprakoso/", Icon: Instagram },
];

const LINKS = [
  { label: "Email", text: "mridhoprakoso@gmail.com", href: "mailto:mridhoprakoso@gmail.com" },
  ...SOCIALS.map((s) => ({ label: s.label, text: s.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), href: s.href })),
];

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Portfolio inquiry from ${form.name}`,
          from_name: "Portfolio Contact Form",
          ...form,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Couldn't reach the server. Please try again in a moment.");
    }
  };

  return (
    <section id="contact" className="relative w-full bg-background py-20 sm:py-28 px-5 sm:px-8 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <SectionHead n="05" title="Let's Talk" />
        <Reveal as="p" className="text-muted-foreground mb-10">
          Open to full-stack and applied ML opportunities, collaborations, and research work.
        </Reveal>

        <Reveal as="form" delay={0.1} onSubmit={handleSubmit} className="flex flex-col gap-4 text-left max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full bg-card border border-border rounded-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-[hsl(var(--accent))] focus:outline-none transition-colors"
            />
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full bg-card border border-border rounded-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-[hsl(var(--accent))] focus:outline-none transition-colors"
            />
          </div>
          <textarea
            name="message"
            required
            rows={5}
            value={form.message}
            onChange={handleChange}
            placeholder="Message"
            className="w-full bg-card border border-border rounded-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-[hsl(var(--accent))] focus:outline-none transition-colors resize-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent text-accent-foreground font-semibold text-sm px-6 py-3.5 hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send message
              </>
            )}
          </button>

          {status === "success" && (
            <p className="flex items-center justify-center gap-2 text-sm text-[hsl(var(--accent-2))]">
              <CheckCircle2 className="h-4 w-4" />
              Thanks — your message is on its way. I'll get back to you soon.
            </p>
          )}
          {status === "error" && (
            <p className="flex items-center justify-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {errorMsg}
            </p>
          )}
        </Reveal>

        <ul className="mt-16 border-t border-border">
          {LINKS.map(({ label, text, href }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex items-baseline justify-between gap-4 border-b border-border py-5 transition-colors hover:bg-card/60"
              >
                <span className="hud w-24 shrink-0">{label}</span>
                <span className="flex-1 break-all font-heading text-lg font-bold tracking-tight transition-colors group-hover:text-[hsl(var(--accent))] sm:text-2xl">{text}</span>
                <span className="text-xl transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
