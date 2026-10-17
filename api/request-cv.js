import { promises as dns } from "node:dns";
import { readFile } from "node:fs/promises";
import path from "node:path";

const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;

// Throwaway-inbox providers and placeholder domains. Extend as needed.
const BLOCKED = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "guerrillamail.org", "sharklasers.com", "grr.la",
  "10minutemail.com", "10minutemail.net", "tempmail.com", "temp-mail.org", "temp-mail.io", "tempmail.net",
  "tempail.com", "yopmail.com", "yopmail.net", "trashmail.com", "trashmail.net", "getnada.com", "nada.email",
  "dispostable.com", "maildrop.cc", "throwawaymail.com", "fakeinbox.com", "mailnesia.com", "mintemail.com",
  "emailondeck.com", "moakt.com", "mohmal.com", "burnermail.io", "mailcatch.com", "spamgourmet.com",
  "discard.email", "discardmail.com", "tmpmail.org", "tmpmail.net",
  "example.com", "example.org", "example.net", "test.com", "domain.com",
]);

// Common typos of big providers -> suggest the correction instead of accepting.
const TYPOS = {
  "gmial.com": "gmail.com", "gmal.com": "gmail.com", "gamil.com": "gmail.com", "gmai.com": "gmail.com",
  "gmail.co": "gmail.com", "gmail.con": "gmail.com", "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com",
  "yahoo.con": "yahoo.com", "hotnail.com": "hotmail.com", "hotmial.com": "hotmail.com",
  "outlok.com": "outlook.com", "outlook.con": "outlook.com", "iclod.com": "icloud.com", "icloud.con": "icloud.com",
};

const reject = (res, error) => res.status(422).json({ error });

// QuickEmailVerification single-email API. Returns the parsed result, or null when the
// check can't be completed (no key, out of credits, rate limit, timeout, outage), in
// which case we fail open so real visitors are never blocked by our own tooling.
async function checkMailbox(email) {
  const key = process.env.QEV_API_KEY;
  if (!key) {
    console.warn("QEV_API_KEY is not set; skipping mailbox verification.");
    return null;
  }
  const endpoint = process.env.QEV_SANDBOX === "true" ? "/v1/verify/sandbox" : "/v1/verify";
  const url = `https://api.quickemailverification.com${endpoint}?email=${encodeURIComponent(email)}&apikey=${encodeURIComponent(key)}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) return null;
    const d = await r.json();
    return d.success === "true" ? d : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { name = "", email = "", website = "" } = body || {};

  if (website) return res.status(400).json({ error: "Invalid request." }); // honeypot

  const n = String(name).trim();
  const e = String(email).trim().toLowerCase();

  if (n.length < 2 || n.length > 80) return reject(res, "Please enter your name.");
  if (e.length > 254 || !EMAIL_RE.test(e)) return reject(res, "Please enter a valid email address.");

  const [local, domain] = e.split("@");
  if (TYPOS[domain]) return reject(res, `Did you mean ${local}@${TYPOS[domain]}?`);
  // Free local checks first, so junk never costs an API credit.
  // QEV_SANDBOX=true skips them so you can test with the sandbox's example.com addresses.
  if (process.env.QEV_SANDBOX !== "true") {
    if (BLOCKED.has(domain)) return reject(res, "Disposable or placeholder emails aren't accepted. Please use your real email.");

    try {
      const mx = await dns.resolveMx(domain);
      if (!mx.some((r) => r.exchange && r.exchange !== ".")) {
        return reject(res, "That email domain can't receive mail.");
      }
    } catch (err) {
      if (err.code === "ENOTFOUND" || err.code === "ENODATA") return reject(res, "That email domain doesn't exist.");
      return res.status(503).json({ error: "Couldn't verify your email right now. Please try again." });
    }
  }

  // Mailbox-level check (SMTP). Only a definite "invalid" blocks; unknown/accept-all pass.
  const check = await checkMailbox(e);
  if (check) {
    if (check.disposable === "true") return reject(res, "Disposable emails aren't accepted. Please use your real email.");
    if (check.result === "invalid") {
      if (check.did_you_mean) {
        const s = check.did_you_mean.includes("@") ? check.did_you_mean : `${local}@${check.did_you_mean}`;
        return reject(res, `Did you mean ${s}?`);
      }
      return reject(res, check.reason === "rejected_email"
        ? "That email address doesn't exist. Please check for typos."
        : "That email address looks invalid. Please use a real one.");
    }
  }

  try {
    const pdf = await readFile(path.join(process.cwd(), "private", "cv.pdf"));
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="Muhammad-Ridho-Prakoso-CV.pdf"');
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(pdf);
  } catch {
    return res.status(500).json({ error: "CV file is unavailable right now." });
  }
}
