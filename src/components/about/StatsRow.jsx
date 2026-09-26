const STATS = [
  { value: "1+", label: "Year of Experience" },
  { value: "4+", label: "Projects Completed" },
  { value: "Multiple", label: "Collaborative Research & Development Works" },
];

export default function StatsRow() {
  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 border-t border-border pt-8">
      {STATS.map((s, i) => (
        <div key={i} className="flex flex-col gap-1">
          <span className="font-heading font-extrabold text-3xl sm:text-4xl bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent-2))] bg-clip-text text-transparent tracking-[-0.03em]">
            {s.value}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider leading-relaxed">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}