// Numbered header: "01 ........ count", huge uppercase title, outlined marquee strip.
export default function SectionHead({ n, count, title }) {
  const text = title.replace(/\s+/g, "").toUpperCase();
  return (
    <div className="mb-10 sm:mb-14">
      <div className="hud mb-3 flex items-center justify-between">
        <span>{n}</span>
        {count && <span>{count}</span>}
      </div>
      <h2 className="font-heading font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(2.25rem,7vw,5.5rem)]">
        {title}
      </h2>
      <div aria-hidden className="mt-4 overflow-hidden whitespace-nowrap opacity-30 select-none">
        <div className="marquee outline-text font-heading font-extrabold leading-none text-[clamp(1.75rem,4vw,3rem)]">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="pr-6">{text}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
