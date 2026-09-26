import { useState } from "react";
import { PROJECTS } from "@/lib/projects";
import CategoryFilter from "@/components/portfolio/CategoryFilter";
import ProjectCard from "@/components/portfolio/ProjectCard";

export default function PortfolioSection() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === active);

  return (
    <section id="work" className="relative w-full bg-background py-20 sm:py-28 px-5 sm:px-8 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Selected Work
          </p>
        </div>
        <h2 className="font-heading font-bold text-2xl sm:text-3xl tracking-[-0.02em] mb-8">
          Projects & research
        </h2>

        <CategoryFilter active={active} onChange={setActive} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}