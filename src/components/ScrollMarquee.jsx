import { useEffect, useRef } from "react";

// Giant outlined title that slides in from the right and travels left as you scroll down.
export default function ScrollMarquee({ text, className = "" }) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const label = text.replace(/\s+/g, "").toUpperCase();
  // enough repeats that the strip never runs out of text while it travels
  const repeats = Math.max(3, Math.ceil(260 / (label.length * 7.4)));

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const r = wrap.getBoundingClientRect();
      if (r.bottom < -150 || r.top > vh + 150) return; // off-screen: skip work
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height))); // 0 → 1 as it scrolls through
      const width = track.scrollWidth;
      const start = vw * 0.85; // begins off to the right
      const dist = Math.min(vw * 1.9, width - vw * 0.2); // never runs out of text
      track.style.transform = `translate3d(${start - p * dist}px,0,0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [label]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`relative left-1/2 w-screen -translate-x-1/2 overflow-hidden select-none opacity-40 ${className}`}
    >
      <div
        ref={trackRef}
        className="scroll-marquee outline-text font-heading font-extrabold uppercase leading-[0.85] tracking-[-0.04em] text-[clamp(4rem,12vw,10rem)]"
      >
        {Array.from({ length: repeats }, (_, i) => (
          <span key={i} className="pr-[0.2em]">{label}</span>
        ))}
      </div>
    </div>
  );
}
