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

// EmailVerify.io single-email API (syntax + MX + blacklist + SMTP mailbox check).
// Docs: GET https://app.emailverify.io/api/v1/validate?key=KEY&email=EMAIL -> { email, status, sub_status }
// Returns { status: "ok", data } or { status: "unconfigured" | "unavailable" }.
async function checkMailbox(email) {
  const key = process.env.EMAILVERIFY_API_KEY;
  if (!key) return { status: "unconfigured" };
  const url =
    "https://app.emailverify.io/api/v1/validate" +
    `?key=${encodeURIComponent(key)}&email=${encodeURIComponent(email)}`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    const text = await r.text();
    let d;
    try { d = JSON.parse(text); } catch { d = null; }
    // Error replies ("Invalid API Key", "0 credits remaining", "Please Try again"...) carry no usable status.
    if (!r.ok || !d || typeof d.status !== "string") {
      return { status: "unavailable", http: r.status, detail: text.slice(0, 120) };
    }
    return { status: "ok", data: d };
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

  // Mailbox-level check (SMTP). Strict by default: if the check can't run, nobody gets the CV.
  // EMAILVERIFY_FAIL_OPEN=true lets people through when the key is missing, credits ran out, or the API is down.
  const failOpen = process.env.EMAILVERIFY_FAIL_OPEN === "true";
  const check = await checkMailbox(e);

  if (check.status !== "ok") {
    console.warn("[cv] mailbox check unavailable:", check.status, check.http ?? "", check.detail ?? "");
    if (!failOpen) {
      return res.status(503).json({
        error: check.status === "unconfigured"
          ? "Email verification isn't set up yet. Please contact me by email instead."
          : "Couldn't verify your email right now. Please try again in a moment.",
      });
    }
  } else {
    const status = String(check.data.status).toLowerCase();
    const sub = String(check.data.sub_status ?? "").toLowerCase();
    console.log("[cv] verify", { domain, status, sub_status: sub });

    if (/disposable|spam.?trap|blacklist/.test(`${status} ${sub}`)) {
      return reject(res, "Disposable or risky emails aren't accepted. Please use your real email.");
    }
    if (status === "invalid") {
      return reject(res, /dns|mx|domain/.test(sub)
        ? "That email domain can't receive mail. Please use a real email."
        : "That email address doesn't exist. Please check for typos.");
    }
    // "valid" passes. Inconclusive results (e.g. unknown / catch-all company servers) also pass,
    // because the format, MX and disposable checks above already succeeded.
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
