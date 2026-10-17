import { CV_URL } from "@/lib/site";
import Reveal from "@/components/Reveal";

const EXPERIENCE = [
  { org: "Cyber Security Community Binus", role: "Activist, Media & Publication", years: "2025—2026" },
  { org: "Student Council SMA Plus Pembangunan Jaya", role: "Head Division of Design & Video", years: "2022—2023" },
  { org: "Student Council SMA Plus Pembangunan Jaya", role: "Member, Video Documentation Division", years: "2021—2022" },
];
const STUDY = [
  { org: "Bina Nusantara University", role: "Bachelor of Computer Science", years: "2024—Present" },
  { org: "SMA Plus Pembangunan Jaya", role: "High School Diploma, Natural Sciences & Mathematics", years: "2021—2024" },
];

function Rows({ title, rows, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <p className="hud mb-4">{title}</p>
      <ol className="border-t border-border">
        {rows.map((r, i) => (
          <li key={i} className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-3 border-b border-border py-5 transition-colors hover:bg-card/60">
            <span className="hud">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="font-heading font-bold uppercase tracking-tight text-base sm:text-lg">{r.org}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.role}</p>
            </div>
            <span className="hud whitespace-nowrap">{r.years}</span>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

export default function Timeline() {
  return (
    <div className="mt-20 grid gap-12 md:grid-cols-2">
      <Rows title="Work experience" rows={EXPERIENCE} />
      <Rows title="Study" rows={STUDY} delay={0.12} />
      <Reveal
        as="a"
        href={CV_URL}
        download="Muhammad-Ridho-Prakoso-CV.pdf"
        className="hud md:col-span-2 flex items-center justify-between border border-border px-5 py-4 !text-foreground transition-colors hover:border-accent hover:!text-[hsl(var(--accent))]"
      >
        <span>In-depth look</span>
        <span>Download CV ↓</span>
      </Reveal>
    </div>
  );
}
