import { SKILL_GROUPS } from "@/lib/skills";

export default function SkillsSection() {
  return (
    <section id="skills" className="relative w-full bg-background py-20 sm:py-28 px-5 sm:px-8 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent-2))]" />
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Skills
          </p>
        </div>
        <h2 className="font-heading font-bold text-2xl sm:text-3xl tracking-[-0.02em] mb-10">
          What I work with
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {SKILL_GROUPS.map((group) => (
            <div key={group.category}>
              <h3 className="font-heading font-semibold text-sm text-foreground mb-4 pb-3 border-b border-border">
                {group.category}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {group.skills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <div
                      key={skill.name}
                      className="group flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-3 hover:border-[hsl(var(--accent))]/50 hover:-translate-y-0.5 transition-all"
                    >
                      <Icon className="h-4 w-4 text-[hsl(var(--accent))] shrink-0" />
                      <span className="text-sm text-foreground/85 group-hover:text-foreground transition-colors">
                        {skill.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
