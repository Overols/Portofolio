import { useEffect, useRef } from "react";
import { renderPlanet } from "@/lib/planetRender";

const ease = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function PlanetCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cur = 0, target = 0, raf = 0, img, buf;
    const orbitDuration = 36000;
    const orbitStart = performance.now();

    const size = () => {
      // Render at a denser internal resolution to reduce visible stepping during rotation.
      const px = Math.max(2, Math.ceil(window.innerWidth / 320));
      canvas.width = Math.ceil(window.innerWidth / px);
      canvas.height = Math.ceil(window.innerHeight / px);
      img = ctx.createImageData(canvas.width, canvas.height);
      buf = new Uint32Array(img.data.buffer);
    };
    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const draw = (timestamp = performance.now()) => {
      raf = 0;
      cur += (target - cur) * 0.12;
      if (Math.abs(target - cur) < 0.0004) cur = target;

      // Rotation uses a full 2π phase; the last and first orbit frames are identical.
      if (!reduce && cur < 0.015) {
        const phase = ((((timestamp - orbitStart) % orbitDuration) + orbitDuration) % orbitDuration) / orbitDuration * (Math.PI * 2);
        renderPlanet(buf, canvas.width, canvas.height, cur, { rotationAngle: phase });
      } else {
        renderPlanet(buf, canvas.width, canvas.height, cur);
      }
      ctx.putImageData(img, 0, 0);
      canvas.style.opacity = String(0.85 - 0.55 * ease(0.08, 0.6, cur));
      if (cur !== target || (!reduce && cur < 0.015)) raf = requestAnimationFrame(draw);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const onScroll = () => { target = progress(); kick(); };
    const onResize = () => { size(); kick(); };

    size();
    target = cur = reduce ? 0 : progress();
    draw();

    if (!reduce) window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <canvas ref={ref} className="h-full w-full" style={{ imageRendering: "auto" }} />
    </div>
  );
}