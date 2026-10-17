import SectionHead from "@/components/SectionHead";
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
        <SectionHead n="02" count={`${String(PROJECTS.length).padStart(2, "0")} Projects`} title="Selected Work" />

        <CategoryFilter active={active} onChange={setActive} />

        <div className="border-t border-border">
          {filtered.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}