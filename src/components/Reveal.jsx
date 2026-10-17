import { useEffect, useRef, useState } from "react";

// Pop-up on scroll: fades, rises and scales in the first time it enters the viewport.
// <Reveal delay={0.1}>…</Reveal>  or  <Reveal as="article" className="…">…</Reveal>
export default function Reveal({ as: Tag = "div", delay = 0, className = "", style, children, ...rest }) {
  const ref = useRef(null);
  const [state, setState] = useState(0); // 0 hidden · 1 animating in · 2 settled (classes removed)

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setState(2);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState(1);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (state !== 1) return;
    const t = setTimeout(() => setState(2), 1100 + delay * 1000);
    return () => clearTimeout(t);
  }, [state, delay]);

  const cls = state === 0 ? "reveal" : state === 1 ? "reveal is-in" : "";
  return (
    <Tag
      ref={ref}
      className={`${cls} ${className}`.trim()}
      style={state === 1 && delay ? { transitionDelay: `${delay}s`, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
