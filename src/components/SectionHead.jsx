import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import ScrollMarquee from "@/components/ScrollMarquee";

// Title words rise out of a mask the first time the heading scrolls into view.
function RiseTitle({ text }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.split(" ");
  return (
    <h2
      ref={ref}
      aria-label={text}
      className="font-heading font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(2.25rem,7vw,5.5rem)]"
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden className="title-mask">
          <span className={`title-word ${on ? "is-in" : ""}`} style={{ transitionDelay: `${i * 0.09}s` }}>
            {w}
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </h2>
  );
}

// Numbered header: "01 ........ count", huge uppercase title, scroll-driven giant marquee.
export default function SectionHead({ n, count, title }) {
  return (
    <div className="mb-10 sm:mb-14">
      <Reveal className="hud mb-3 flex items-center justify-between">
        <span>{n}</span>
        {count && <span>{count}</span>}
      </Reveal>
      <RiseTitle text={title} />
      <ScrollMarquee text={title} className="mt-6" />
    </div>
  );
}
