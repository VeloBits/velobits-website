import type { Metadata } from "next";
import Link from "next/link";
import { CONTAINER } from "@/lib/ui-classes";
import { RIDE_CODE, normalizeRideCode, revonStores } from "@/lib/revon-links";
import FeatureIcon from "@/components/ui/FeatureIcon";

/**
 * What someone sees when they open https://revon.velobits.dev/join/CODE without the Revon
 * app, or on a computer. On a phone that has the app, the operating system opens the app
 * directly and this page is never shown (see /.well-known/assetlinks.json and
 * apple-app-site-association). Invite pages are personal, so they stay out of search.
 */
export const metadata: Metadata = {
  title: "Join a Revon ride | Velobits",
  description: "You have been invited to a group motorcycle ride on Revon.",
  robots: { index: false, follow: false },
};

const btn = "btn btn-primary w-full justify-center sm:w-auto";

export default async function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params;
  const code = normalizeRideCode(decodeURIComponent(raw));
  const valid = RIDE_CODE.test(code);

  return (
    <div className={`${CONTAINER} pt-[8rem] pb-24`}>
      <section className="mx-auto flex max-w-[560px] flex-col items-center gap-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 text-accent">
          <FeatureIcon name="bike" size={28} />
        </span>

        <p className="label-mono text-accent">Revon · Group ride</p>
        <h1 className="font-display text-[clamp(1.9rem,6vw,3rem)] leading-[0.95] font-extrabold tracking-[-0.03em] text-foreground uppercase">
          {valid ? "You are invited to a ride" : "This invite link looks wrong"}
        </h1>

        {valid ? (
          <>
            <p className="max-w-[40ch] text-[0.95rem] leading-[1.8] text-muted">
              Open Revon on your phone and join with this code. Everyone in the ride shows up on one
              live map.
            </p>

            <div className="card w-full px-6 py-6">
              <p className="label-mono mb-2 text-subtle">Ride code</p>
              <p
                className="font-mono text-[clamp(2rem,10vw,2.8rem)] font-bold tracking-[0.3em] text-foreground"
                aria-label={`Ride code ${code.split("").join(" ")}`}
              >
                {code}
              </p>
            </div>

            <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a href={`revon://join/${code}`} className={btn}>
                Open in Revon
              </a>
              {revonStores.android && (
                <a
                  href={revonStores.android}
                  className="btn btn-ghost w-full justify-center sm:w-auto"
                >
                  Get it on Google Play
                </a>
              )}
              {revonStores.ios && (
                <a href={revonStores.ios} className="btn btn-ghost w-full justify-center sm:w-auto">
                  Get it on the App Store
                </a>
              )}
            </div>

            {!revonStores.android && !revonStores.ios && (
              <p className="text-[0.85rem] leading-[1.7] text-muted">
                Don&apos;t have Revon yet? It is coming soon to Android and iOS.{" "}
                <Link
                  href="/#waitlist"
                  className="font-medium text-foreground underline decoration-accent/50 underline-offset-4 hover:decoration-accent"
                >
                  Join the waitlist
                </Link>{" "}
                and keep your code: type it in the app under Join a ride.
              </p>
            )}
          </>
        ) : (
          <p className="max-w-[40ch] text-[0.95rem] leading-[1.8] text-muted">
            A Revon ride code has six letters and numbers. Ask the person who invited you to send
            the link or the code again.
          </p>
        )}

        <Link href="/" className="text-[0.82rem] text-subtle no-underline hover:text-foreground">
          ← velobits.dev
        </Link>
      </section>
    </div>
  );
}
