import { useEffect, useState } from "react";
import { X, FileImage } from "lucide-react";
import { CERTIFICATION_GROUPS } from "@/lib/certifications";

// Auto-loads every image dropped into src/assets/certifications/ — no manual
// imports needed. Name each file after its certificate, e.g. "ai-fundamentals.jpg"
// for "AI Fundamentals". See the mapping list for the exact expected filename
// of every certificate.
const IMAGES = import.meta.glob("../../assets/certifications/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const IMAGE_BY_SLUG = Object.fromEntries(
  Object.entries(IMAGES).map(([path, src]) => {
    const filename = path.split("/").pop().replace(/\.[a-z0-9]+$/i, "");
    return [filename, src];
  })
);

export default function CertificationsList() {
  const [lightbox, setLightbox] = useState(null); // { src, name } | null

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <div className="mt-16 border-t border-border pt-10">
      <div className="flex items-center gap-3 mb-8">
        <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent-2))]" />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Certifications
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {CERTIFICATION_GROUPS.map((group) => (
          <div key={group.category}>
            <h3 className="flex items-center gap-2 font-heading font-semibold text-sm text-foreground mb-4">
              {group.category}
              <span className="text-xs font-normal text-muted-foreground">
                ({group.items.length})
              </span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {group.items.map((item) => {
                const src = IMAGE_BY_SLUG[slugify(item)];
                return (
                  <button
                    key={item}
                    type="button"
                    disabled={!src}
                    onClick={() => src && setLightbox({ src, name: item })}
                    className="group text-left rounded-xl border border-border bg-card overflow-hidden hover:border-[hsl(var(--accent))]/50 transition-colors disabled:cursor-default"
                  >
                    <div className="aspect-[4/3] bg-secondary/50 flex items-center justify-center overflow-hidden">
                      {src ? (
                        <img
                          src={src}
                          alt={item}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <FileImage className="h-5 w-5 text-muted-foreground/40" />
                      )}
                    </div>
                    <p className="px-3 py-2.5 text-xs text-foreground/80 leading-snug line-clamp-2">
                      {item}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.src}
              alt={lightbox.name}
              className="w-full h-auto rounded-xl border border-border"
            />
            <p className="mt-4 text-center text-sm text-muted-foreground">{lightbox.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}