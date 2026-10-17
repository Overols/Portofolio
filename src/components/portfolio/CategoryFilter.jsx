import { CATEGORIES } from "@/lib/projects";

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={`text-sm font-medium px-4 py-2 rounded-sm border transition-colors ${
            active === cat
              ? "border-transparent bg-accent text-accent-foreground"
              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
