import { getUpdates } from "@/lib/updates";
import UpdatesList from "@/components/sections/UpdatesList";
import { CONTAINER, SECTION, EYEBROW, DISPLAY, DISPLAY_LG } from "@/lib/ui-classes";

/**
 * Async Server Component: fetches published updates (ISR-cached) and renders the
 * on-site "Latest Updates" feed. Thin wrapper around the testable UpdatesList.
 */
export default async function LatestUpdates() {
  const updates = await getUpdates();

  return (
    <section id="updates" className={SECTION}>
      <div className="pointer-events-none absolute top-[15%] left-1/2 h-[360px] w-[640px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(200,241,53,0.04)_0%,transparent_70%)]" />
      <div className={`container ${CONTAINER} relative`}>
        <div className="mb-12">
          <span className={`eyebrow ${EYEBROW} text-muted`}>Latest Updates</span>
          <h2 className={`${DISPLAY} ${DISPLAY_LG} text-foreground mt-3`}>
            What we&apos;ve <span className="text-accent">shipped.</span>
          </h2>
          <p className="mt-4 max-w-[48ch] leading-[1.7] text-muted">
            Launches, new features, improvements, and fixes — the latest from the Velobits team.
          </p>
        </div>
        <div>
          <UpdatesList updates={updates} />
        </div>
      </div>
    </section>
  );
}
