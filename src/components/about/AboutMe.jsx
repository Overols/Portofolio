import Timeline from "@/components/about/Timeline";
import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/Reveal";
import StatsRow from "@/components/about/StatsRow";
import CertificationsList from "@/components/about/CertificationsList";
import profilePhoto from "@/assets/images/Profile_Picture.png"

const BIO =
  "Computer Science student at Bina Nusantara University focused on full-stack development and applied machine learning. Experienced in building end-to-end systems, from real-time computer vision applications to ensemble-based predictive models and production-ready exam management platforms. Previously active as a Media and Publication Activist in the Cyber Security Community for one year, contributing to content strategy and public outreach.";

export default function AboutMe() {
  return (
    <section id="about" className="relative w-full bg-background py-20 sm:py-28 px-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHead n="01" title="About Me" />

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 md:gap-16 items-start">
          <Reveal className="w-40 sm:w-56 md:w-full mx-auto md:mx-0">
            <div className="rounded-2xl overflow-hidden border border-border p-1.5 bg-card">
              <img
                src={profilePhoto}
                alt="Muhammad Ridho Prakoso"
                loading="lazy"
                className="w-full aspect-[3/4] rounded-none object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-foreground/90 leading-relaxed max-w-2xl">
              {BIO}
            </p>
            <StatsRow />
          </Reveal>
        </div>

        <Timeline />
        <CertificationsList />
      </div>
    </section>
  );
}