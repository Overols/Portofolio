import Reveal from "@/components/Reveal";

export default function ProjectCard({ project, index = 0 }) {
  const links = project.links?.length ? project.links : project.link ? [{ label: "View project", url: project.link }] : [];

  return (
    <Reveal as="article" className="group grid gap-6 border-b border-border py-8 md:grid-cols-[4rem_1fr_18rem] md:gap-10 md:py-10">
      <span className="hud">{String(index + 1).padStart(3, "0")}</span>

      <div>
        <p className="hud mb-3 !text-[hsl(var(--accent))]">{project.category}</p>
        <h3 className="font-heading font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(1.5rem,3.2vw,2.5rem)]">
          {project.title}
        </h3>
        <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">{project.description}</p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {links.length ? (
            links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="hud link-underline pb-0.5 !text-foreground hover:!text-[hsl(var(--accent))]">
                {l.label} ↗
              </a>
            ))
          ) : (
            <span className="hud">No public link</span>
          )}
        </div>
      </div>

      {project.image && (
        <img src={project.image} alt={project.title} loading="lazy" className="aspect-video w-full object-cover grayscale transition duration-500 group-hover:grayscale-0" />
      )}
    </Reveal>
  );
}
