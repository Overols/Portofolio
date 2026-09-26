import { useState } from "react";
import { Linkedin, Github, Instagram, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

// Get a free access key at https://web3forms.com (enter your email, no signup) —
// paste it below. Submissions land straight in your inbox, no backend needed.
const WEB3FORMS_ACCESS_KEY = "7cbb869c-6b37-4bb8-bf38-e39283d6ff00";

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/muhammadridhoprakoso/", Icon: Linkedin },
  { label: "GitHub", href: "https://github.com/Overols", Icon: Github },
  { label: "Instagram", href: "https://www.instagram.com/_ridhoprakoso/", Icon: Instagram },
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
      <div className="mx-auto max-w-2xl text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Contact
          </p>
        </div>
        <h2 className="font-heading font-bold text-2xl sm:text-3xl tracking-[-0.02em] mb-4">
          Let's work together
        </h2>
        <p className="text-muted-foreground mb-10">
          Open to full-stack and applied ML opportunities, collaborations, and research work.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-[hsl(var(--accent))] focus:outline-none transition-colors"
            />
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-[hsl(var(--accent))] focus:outline-none transition-colors"
            />
          </div>
          <textarea
            name="message"
            required
            rows={5}
            value={form.message}
            onChange={handleChange}
            placeholder="Message"
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-[hsl(var(--accent))] focus:outline-none transition-colors resize-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent-2))] text-white font-semibold text-sm px-6 py-3.5 hover:opacity-90 disabled:opacity-60 transition-opacity"
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
        </form>

        <div className="mt-12 flex items-center justify-center gap-6">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="group flex flex-col items-center gap-2"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground/80 group-hover:border-[hsl(var(--accent))] group-hover:text-[hsl(var(--accent))] transition-colors">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[11px] tracking-wide uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
