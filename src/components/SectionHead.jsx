import Reveal from "@/components/Reveal";
import ScrollMarquee from "@/components/ScrollMarquee";

// Numbered header: "01 ........ count", huge uppercase title, scroll-driven giant marquee.
export default function SectionHead({ n, count, title }) {
  return (
    <div className="mb-10 sm:mb-14">
      <Reveal className="hud mb-3 flex items-center justify-between">
        <span>{n}</span>
        {count && <span>{count}</span>}
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-heading font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(2.25rem,7vw,5.5rem)]">
          {title}
        </h2>
      </Reveal>
      <ScrollMarquee text={title} className="mt-6" />
    </div>
  );
}
