const GRADIENTS = [
  "from-[hsl(250,84%,64%)] to-[hsl(280,70%,55%)]",
  "from-[hsl(166,68%,47%)] to-[hsl(200,80%,50%)]",
  "from-[hsl(250,84%,64%)] to-[hsl(166,68%,47%)]",
  "from-[hsl(310,70%,58%)] to-[hsl(250,84%,64%)]",
];

function initials(title) {
  return title
    .split(/[\s–-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function ProjectCard({ project, index = 0 }) {
  const hasLink = Boolean(project.link);
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <div className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-[hsl(var(--accent))]/50 transition-colors flex flex-col">
      <div className={`aspect-video ${project.image ? "" : `bg-gradient-to-br ${gradient}`} flex items-center justify-center relative overflow-hidden`}>
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="font-heading font-bold text-4xl text-white/90 tracking-tight">
            {initials(project.title)}
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <span className="text-xs font-semibold text-[hsl(var(--accent))] uppercase tracking-wide mb-2">
          {project.category}
        </span>
        <h3 className="font-heading font-bold text-lg text-foreground leading-tight mb-2">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {project.description}
        </p>

        {project.links && project.links.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium rounded-full border border-border px-3.5 py-2 text-foreground hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-colors"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        ) : hasLink ? (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-colors"
          >
            View project
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        ) : (
          <span className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm text-muted-foreground/50 cursor-not-allowed">
            No public link
          </span>
        )}
      </div>
    </div>
  );
}