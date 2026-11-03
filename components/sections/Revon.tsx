"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureIcon from "@/components/ui/FeatureIcon";
import { revonFeatures, revonRiderNotes, revonSteps } from "@/lib/site-content";
import { CONTAINER, SECTION } from "@/lib/ui-classes";

export default function Revon() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 70);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="revon" className={SECTION} ref={sectionRef}>
      <div className={`container ${CONTAINER}`}>
        <SectionHeader
          index="01"
          eyebrow="Meet Revon"
          titleLines={["Every rider.", "One live map."]}
          lede="Group rides fall apart when nobody knows where anybody is. Revon keeps the whole convoy on one screen, so the only thing left to do is ride."
        />

        {/* How it works */}
        <ol className="mb-14 grid grid-cols-3 gap-5 max-[820px]:grid-cols-1">
          {revonSteps.map((step, i) => (
            <li
              key={step.title}
              className="card reveal relative flex flex-col gap-3 p-6"
              data-pet-perch={i === 0 ? true : undefined}
            >
              <span className="label-mono text-accent">Step {i + 1}</span>
              <h3 className="font-[var(--font-display)] text-[1.05rem] font-extrabold tracking-[-0.01em] text-foreground uppercase">
                {step.title}
              </h3>
              <p className="text-[0.85rem] leading-[1.7] text-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        {/* Features */}
        <ul className="grid grid-cols-4 gap-5 max-[1020px]:grid-cols-2 max-[560px]:grid-cols-1">
          {revonFeatures.map((f) => (
            <li
              key={f.id}
              className="card card-glow reveal flex flex-col gap-4 p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <span
                className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-gradient-to-br from-accent/15 to-accent/5 text-accent"
                aria-hidden="true"
              >
                <FeatureIcon name={f.icon} />
              </span>
              <h3 className="font-[var(--font-display)] text-[0.98rem] font-extrabold tracking-[-0.01em] text-foreground uppercase">
                {f.title}
              </h3>
              <p className="text-[0.82rem] leading-[1.7] text-muted">{f.body}</p>
            </li>
          ))}
        </ul>

        {/* Built for riders */}
        <div className="card reveal mt-14 grid grid-cols-3 gap-8 bg-gradient-to-br from-accent/4 to-transparent p-8 max-[820px]:grid-cols-1 md:p-10">
          {revonRiderNotes.map((n) => (
            <div key={n.title} className="flex gap-4">
              <span className="mt-[2px] shrink-0 text-accent">
                <FeatureIcon name={n.icon} size={24} />
              </span>
              <div>
                <h3 className="mb-1 text-[0.9rem] font-semibold text-foreground">{n.title}</h3>
                <p className="text-[0.82rem] leading-[1.7] text-muted">{n.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[0.8rem] text-subtle">
            Free for every rider. Read how Revon treats your data in the{" "}
            <Link
              href="/revon/privacy"
              className="font-semibold text-foreground underline decoration-accent/50 underline-offset-4 hover:decoration-accent"
            >
              privacy policy
            </Link>
            .
          </p>
          <a href="#waitlist" className="btn btn-primary text-[0.82rem]">
            Join the Revon Waitlist
          </a>
        </div>
      </div>
    </section>
  );
}
