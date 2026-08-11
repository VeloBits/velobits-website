import { updateTypeMeta, type Update, type UpdateType } from "@/lib/site-content";

const typeStyles: Record<UpdateType, string> = {
  launch: "border-accent/40 bg-[var(--accent-a12)] text-accent",
  feature:
    "border-[rgb(from_var(--tone-feature)_r_g_b/0.4)] bg-[rgb(from_var(--tone-feature)_r_g_b/0.12)] text-[var(--tone-feature)]",
  update: "border-foreground/16 bg-foreground/5 text-muted",
  fix: "border-[rgb(from_var(--tone-fix)_r_g_b/0.4)] bg-[rgb(from_var(--tone-fix)_r_g_b/0.12)] text-[var(--tone-fix)]",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Pure presentational list of shipped updates. Kept separate from the async
 * data-fetching wrapper (LatestUpdates) so it can be unit-tested in jsdom.
 */
export default function UpdatesList({ updates }: { updates: Update[] }) {
  if (updates.length === 0) {
    return (
      <p className="text-[0.9rem] leading-[1.7] text-muted">
        No updates yet — more coming soon. Subscribe below to hear about launches and new features
        first.
      </p>
    );
  }

  const gridClass =
    updates.length === 1
      ? "grid grid-cols-1 gap-5"
      : updates.length === 2
        ? "grid grid-cols-1 sm:grid-cols-2 gap-5"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5";

  return (
    <ol className={gridClass}>
      {updates.map((u) => {
        const meta = updateTypeMeta[u.type] ?? updateTypeMeta.update;
        const date = formatDate(u.date);
        return (
          <li
            key={u.id}
            className="card flex flex-col gap-2 p-6 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-3 py-[0.2rem] text-[0.62rem] font-bold tracking-[0.12em] uppercase ${typeStyles[u.type] ?? typeStyles.update}`}
              >
                {meta.label}
              </span>
              {date && <span className="text-[0.72rem] text-subtle">{date}</span>}
            </div>
            <h3 className="font-display text-[1.05rem] leading-[1.4] font-extrabold tracking-[-0.01em] text-foreground">
              {u.title}
            </h3>
            {u.body && <p className="text-[0.85rem] leading-[1.7] text-muted">{u.body}</p>}
            {u.link && (
              <a
                href={u.link}
                className="mt-1 inline-flex items-center gap-1 self-start text-[0.78rem] font-semibold text-accent hover:underline"
              >
                Read more
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}
          </li>
        );
      })}
    </ol>
  );
}
