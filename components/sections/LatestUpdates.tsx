import { getUpdates } from "@/lib/updates";
import UpdatesList from "@/components/sections/UpdatesList";
import SectionHeader from "@/components/ui/SectionHeader";
import { CONTAINER, SECTION } from "@/lib/ui-classes";

/**
 * Async Server Component: fetches published updates (ISR-cached) and renders the
 * on-site "Latest Updates" feed. Thin wrapper around the testable UpdatesList.
 */
export default async function LatestUpdates() {
  const updates = await getUpdates();

  return (
    <section id="updates" className={SECTION}>
      <div className="pointer-events-none absolute top-[15%] left-1/2 h-[360px] w-[640px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgb(from_var(--accent-ink)_r_g_b/0.04)_0%,transparent_70%)]" />
      <div className={`container ${CONTAINER} relative`}>
        <SectionHeader
          index="05"
          eyebrow="Latest Updates"
          titleLines={["What we've", "shipped."]}
          lede="Launches, new features, improvements, and fixes — the latest from the Velobits team."
        />
        <div>
          <UpdatesList updates={updates} />
        </div>
      </div>
    </section>
  );
}
