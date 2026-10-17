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

// Sandbox returns simulated results ("valid" for almost anything), so it is ignored on Vercel production.
const isSandbox = () => process.env.QEV_SANDBOX === "true" && process.env.VERCEL_ENV !== "production";

// QuickEmailVerification single-email API (SMTP-level check).
// Returns { status: "ok", data } or { status: "unconfigured" | "unavailable" }.
async function checkMailbox(email) {
  const key = process.env.QEV_API_KEY;
  if (!key) return { status: "unconfigured" };
  const endpoint = isSandbox() ? "/v1/verify/sandbox" : "/v1/verify";
  const url = `https://api.quickemailverification.com${endpoint}?email=${encodeURIComponent(email)}&apikey=${encodeURIComponent(key)}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) return { status: "unavailable", http: r.status };
    const d = await r.json();
    return d.success === "true" ? { status: "ok", data: d } : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
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
  if (!isSandbox()) {
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

  // Mailbox-level check. Strict by default: only a definite "valid" gets the CV.
  // QEV_FAIL_OPEN=true lets unverifiable addresses and API outages through instead.
  const failOpen = process.env.QEV_FAIL_OPEN === "true";
  const check = await checkMailbox(e);

  if (check.status === "unconfigured") {
    // No QEV_API_KEY set: don't lock everyone out. The format, disposable-domain, typo and MX
    // checks above already passed, so continue in "local checks only" mode.
    // Set QEV_API_KEY in Vercel to also verify that the mailbox itself exists.
    console.warn("[cv] QEV_API_KEY is not set: mailbox-level check skipped (format/MX checks only).");
  } else if (check.status !== "ok") {
    console.warn("[cv] mailbox check unavailable:", check.status, check.http ?? "");
    if (!failOpen) {
      return res.status(503).json({
        error: "Couldn't verify your email right now. Please try again in a moment.",
      });
    }
  } else {
    const d = check.data;
    console.log("[cv] verify", { domain, result: d.result, reason: d.reason, accept_all: d.accept_all, disposable: d.disposable });
    if (d.disposable === "true") return reject(res, "Disposable emails aren't accepted. Please use your real email.");
    if (d.result === "invalid") {
      if (d.did_you_mean) {
        const sug = d.did_you_mean.includes("@") ? d.did_you_mean : `${local}@${d.did_you_mean}`;
        return reject(res, `Did you mean ${sug}?`);
      }
      return reject(res, d.reason === "rejected_email"
        ? "That email address doesn't exist. Please check for typos."
        : "That email address looks invalid. Please use a real one.");
    }
    // "unknown": only domains that accept every address (can't be checked at all) get through.
    if (d.result !== "valid" && d.accept_all !== "true" && !failOpen) {
      return reject(res, "We couldn't confirm that this email address exists. Please use another one.");
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