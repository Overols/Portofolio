import { useEffect, useState } from "react";

const clock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Jakarta", hourCycle: "h23", hour: "2-digit", minute: "2-digit", second: "2-digit",
});
const SECTIONS = [["top", "Intro"], ["about", "About"], ["work", "Work"], ["skills", "Skills"], ["contact", "Contact"]];
const THEMES = ["178 100% 88%", "72 100% 70%", "18 100% 72%", "270 100% 82%"];

export default function HudBar() {
  const [time, setTime] = useState(() => clock.format(new Date()));
  const [scroll, setScroll] = useState(0);
  const [cur, setCur] = useState([0, 0]);
  const [sec, setSec] = useState(0);
  const [theme, setTheme] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => setTime(clock.format(new Date())), 1000);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(max > 0 ? window.scrollY / max : 0);
      let idx = 0;
      SECTIONS.forEach(([id], i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight / 2) idx = i;
      });
      setSec(idx);
    };
    const onMove = (e) => setCur([e.clientX / window.innerWidth, e.clientY / window.innerHeight]);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      clearInterval(tick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const cycle = () => {
    const next = (theme + 1) % THEMES.length;
    setTheme(next);
    ["--accent", "--accent-2", "--primary", "--ring"].forEach((v) =>
      document.documentElement.style.setProperty(v, THEMES[next])
    );
  };

  return (
    <div style={{ animationDelay: "1.1s" }} className="pop-in hud pointer-events-none fixed bottom-4 left-8 z-40 hidden lg:flex items-center gap-5 border border-border bg-background/70 px-3 py-1.5 backdrop-blur">
      <span>SCRL {scroll.toFixed(2)}</span>
      <span>CRSR {cur[0].toFixed(3)} {cur[1].toFixed(3)}</span>
      <span>0{sec} — {SECTIONS[sec][1]}</span>
      <button type="button" onClick={cycle} aria-label="Change accent colour" className="pointer-events-auto flex items-center gap-2 uppercase hover:text-foreground">
        Theme <span className="h-2.5 w-2.5 bg-[hsl(var(--accent))]" />
      </button>
      <span>{time} +07</span>
    </div>
  );
}
