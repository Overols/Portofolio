import { useEffect, useRef } from "react";
import { renderPlanet } from "@/lib/planetRender";

const LAND_URL = "/earth-land.geojson";

const ease = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const mix = (a, b, t) => a + (b - a) * t;
const JAKARTA = { lat: -6.2088 * Math.PI / 180, lon: 106.8456 * Math.PI / 180 };
const TARGET_ROTATION = Math.atan2(
  Math.sin(JAKARTA.lon),
  Math.sin(JAKARTA.lat) * Math.sin(0.35) + Math.cos(JAKARTA.lat) * Math.cos(0.35),
);

export default function PlanetCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cur = 0, target = 0, raf = 0, img, buf, landMask = null;
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
    const loadLand = async () => {
      try {
        const response = await fetch(LAND_URL);
        if (!response.ok) throw new Error(`Earth land data request failed: ${response.status}`);
        const geo = await response.json();
        const mapCanvas = document.createElement("canvas");
        mapCanvas.width = 2048;
        mapCanvas.height = 1024;
        const mapCtx = mapCanvas.getContext("2d", { willReadFrequently: true });
        mapCtx.fillStyle = "#000";
        mapCtx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
        mapCtx.fillStyle = "#fff";
        for (const { geometry } of geo.features) {
          if (!geometry) continue;
          const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
          for (const rings of polygons) {
            mapCtx.beginPath();
            for (const ring of rings) {
              ring.forEach(([lon, lat], index) => {
                const x = ((lon + 180) / 360) * mapCanvas.width;
                const y = ((90 - lat) / 180) * mapCanvas.height;
                if (index === 0) mapCtx.moveTo(x, y);
                else mapCtx.lineTo(x, y);
              });
              mapCtx.closePath();
            }
            mapCtx.fill("evenodd");
          }
        }
        const { data, width, height } = mapCtx.getImageData(0, 0, mapCanvas.width, mapCanvas.height);
        landMask = { data, width, height };
        kick();
      } catch (error) {
        console.error("Unable to load Earth land polygons; using procedural surface.", error);
      }
    };
    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const draw = (timestamp = performance.now()) => {
      raf = 0;
      cur += (target - cur) * 0.12;
      if (Math.abs(target - cur) < 0.0004) cur = target;

      const phase = reduce ? 0 : ((((timestamp - orbitStart) % orbitDuration) + orbitDuration) % orbitDuration) / orbitDuration * (Math.PI * 2);
      // Ease the globe toward a centered Jakarta view while scrolling; d/zoom remains scroll-driven.
      const scrollBlend = ease(0, 0.28, cur);
      const rotation = mix(3.0 + phase, TARGET_ROTATION, scrollBlend);
      renderPlanet(buf, canvas.width, canvas.height, cur, { rotation, landMask });
      ctx.putImageData(img, 0, 0);
      canvas.style.opacity = String(0.85 - 0.55 * ease(0.08, 0.6, cur));
      if (cur !== target || (!reduce && cur < 0.015)) raf = requestAnimationFrame(draw);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const onScroll = () => { target = progress(); kick(); };
    const onResize = () => { size(); kick(); };

    size();
    loadLand();
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