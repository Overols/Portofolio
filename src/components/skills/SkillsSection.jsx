import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/Reveal";
import { SKILL_GROUPS } from "@/lib/skills";

export default function SkillsSection() {
  return (
    <section id="skills" className="relative w-full bg-background py-20 sm:py-28 px-5 sm:px-8 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <SectionHead n="04" count={`${SKILL_GROUPS.length} Categories`} title="Skills" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {SKILL_GROUPS.map((group, gi) => (
            <Reveal key={group.category} delay={gi * 0.1}>
              <h3 className="font-heading font-semibold text-sm text-foreground mb-4 pb-3 border-b border-border">
                {group.category}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {group.skills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <div
                      key={skill.name}
                      className="group flex items-center gap-2.5 border border-border px-3.5 py-3 hover:border-[hsl(var(--accent))] transition-colors"
                    >
                      <Icon className="h-4 w-4 text-[hsl(var(--accent))] shrink-0" />
                      <span className="text-sm text-foreground/85 group-hover:text-foreground transition-colors">
                        {skill.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
