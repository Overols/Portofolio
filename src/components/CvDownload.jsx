import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FILENAME = "Muhammad-Ridho-Prakoso-CV.pdf";

// Renders the trigger button (styled by className/children) + the name/email dialog.
export default function CvDownload({ children, ...props }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState(""); // honeypot, real users never fill this
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (status === "loading") return;
    const n = name.trim();
    const m = email.trim();
    if (n.length < 2) return setError("Please enter your name.");
    if (!EMAIL_RE.test(m)) return setError("Please enter a valid email address.");

    setError("");
    setStatus("loading");
    try {
      const res = await fetch("/api/request-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: n, email: m, website: trap }),
      });
      if (!res.ok || !res.headers.get("content-type")?.includes("application/pdf")) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      const url = URL.createObjectURL(await res.blob());
      const a = Object.assign(document.createElement("a"), { href: url, download: FILENAME });
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      setStatus("done");
      setTimeout(() => setOpen(false), 1800);
    } catch (err) {
      setStatus("idle");
      setError(err instanceof TypeError ? "Can't reach the server. Check your connection and try again." : err.message);
    }
  }

  return (
    <>
      <button
        type="button"
        {...props}
        onClick={() => {
          setStatus("idle");
          setError("");
          setOpen(true);
        }}
      >
        {children}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Download my CV</DialogTitle>
            <DialogDescription>
              Enter your name and a real email address. The PDF downloads instantly once your email checks out.
            </DialogDescription>
          </DialogHeader>

          {status === "done" ? (
            <p className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-[hsl(var(--accent))]" />
              Thanks, {name.trim()}! Your download has started.
            </p>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cv-name">Name</Label>
                <Input id="cv-name" autoComplete="name" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cv-email">Email</Label>
                <Input id="cv-email" type="email" autoComplete="email" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <input type="text" name="website" value={trap} onChange={(e) => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

              {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground font-mono-tech text-xs font-semibold uppercase tracking-[0.12em] px-6 py-3.5 transition hover:brightness-110 disabled:opacity-60"
              >
                {status === "loading" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>) : "Verify & download"}
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
