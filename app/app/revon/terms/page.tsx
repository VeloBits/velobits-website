import type { Metadata } from "next";
import LegalDocument, { A, P, UL, type LegalSectionData } from "@/components/legal/LegalDocument";
import { brand } from "@/lib/site-content";

const UPDATED = "4 November 2026";
const MAIL = brand.contactEmail;

export const metadata: Metadata = {
  title: "Revon Terms of Service | Velobits",
  description:
    "The terms for using the Revon group motorcycle ride app, including safety, location sharing and acceptable use.",
  alternates: { canonical: `${brand.domain}/app/revon/terms` },
  robots: { index: true, follow: true },
};

const strong = "text-foreground";

const sections: LegalSectionData[] = [
  {
    id: "agreement",
    title: "Agreement",
    body: (
      <>
        <P>
          These terms govern your use of Revon, the group motorcycle ride app made by Velobits
          (&quot;Velobits&quot;, &quot;we&quot;, &quot;us&quot;). By creating an account or using
          Revon you agree to them. If you do not agree, please do not use the app.
        </P>
        <P>
          Our <A href="/app/revon/privacy">Privacy Policy</A> explains how we handle your data and
          is part of this agreement.
        </P>
      </>
    ),
  },
  {
    id: "safety",
    title: "Ride safely: important",
    body: (
      <>
        <P>
          Riding a motorcycle is dangerous. Revon is a convenience for riders. It is not a safety
          device and it does not replace your judgement, your training or the law.
        </P>
        <UL>
          <li>
            <strong className={strong}>Keep your attention on the road.</strong> Do not handle your
            phone while riding. Set up the ride, mount your phone securely and use spoken alerts.
            Stop in a safe place to read or type.
          </li>
          <li>
            <strong className={strong}>SOS is not an emergency service.</strong> It alerts the other
            riders in your ride. It does not contact the police, an ambulance or any rescue service,
            and it can only reach riders whose app is running and who have a data connection. In an
            emergency, call your local emergency number first.
          </li>
          <li>
            <strong className={strong}>Maps, routes and alerts can be wrong.</strong> Positions can
            be delayed or inaccurate, a phone can lose signal, and routes may ignore closed roads,
            weather or surface conditions. Use your own eyes and follow traffic laws and signs.
          </li>
          <li>
            <strong className={strong}>You ride at your own risk.</strong> You are responsible for
            your bike, your gear, your licence, your insurance and how you ride.
          </li>
        </UL>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Your account",
    body: (
      <UL>
        <li>
          You must be at least 13, or the minimum age to use online services in your country if
          higher.
        </li>
        <li>
          You need a verified mobile number. Give accurate information and keep your sign-in secure.
          You are responsible for activity under your account.
        </li>
        <li>You may not share an account or impersonate another person.</li>
        <li>You can delete your account at any time in Settings → Account.</li>
      </UL>
    ),
  },
  {
    id: "sharing-location",
    title: "Group rides and sharing your location",
    body: (
      <>
        <P>
          When you create or join a ride, you agree that Revon shows your name, live position,
          speed, status, SOS alerts and hand signals to every rider in that ride, as described in
          the Privacy Policy. Share your ride code or link only with people you trust, because
          anyone who joins can see you. The host can lock a ride and end it.
        </P>
        <P>
          Other riders can take screenshots or make notes of what they see. Do not use Revon to
          follow or watch someone who has not agreed to it.
        </P>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <P>You agree not to:</P>
        <UL>
          <li>break the law or encourage others to ride unsafely, race or ride recklessly;</li>
          <li>send false or prank SOS alerts or misuse hand signals;</li>
          <li>
            harass, threaten or stalk other riders, or share content that is unlawful or abusive;
          </li>
          <li>upload a photo or details you do not have the right to use;</li>
          <li>
            interfere with Revon or the services it relies on, probe or bypass its security, or
            overload it;
          </li>
          <li>copy, scrape, reverse engineer or resell the app, except where the law allows it.</li>
        </UL>
      </>
    ),
  },
  {
    id: "your-content",
    title: "Your content",
    body: (
      <P>
        You keep ownership of what you add to Revon, such as your name and photo. You give us
        permission to store, process and show it to the riders you ride with, only as needed to run
        the app.
      </P>
    ),
  },
  {
    id: "third-party",
    title: "Maps and other services",
    body: (
      <P>
        Revon uses third-party services for sign-in, storage, maps, search and routing, including
        Google and OpenStreetMap-based services. Your use of the map is also subject to the
        provider&apos;s terms. Map data from OpenStreetMap is © OpenStreetMap contributors. These
        services can change or become unavailable, which can affect Revon.
      </P>
    ),
  },
  {
    id: "ownership",
    title: "Our rights",
    body: (
      <P>
        Revon, its name, logo and design belong to Velobits and its licensors. We give you a
        personal, non-exclusive, non-transferable licence to use the app for your own non-commercial
        riding for as long as you follow these terms.
      </P>
    ),
  },
  {
    id: "availability",
    title: "Changes and availability",
    body: (
      <P>
        Revon is provided free of charge and is still growing. We may add, change or remove
        features, and we cannot promise it will always be available or error free. We may update the
        app and these terms.
      </P>
    ),
  },
  {
    id: "termination",
    title: "Suspension and ending",
    body: (
      <P>
        You can stop using Revon at any time. We may suspend or end an account that breaks these
        terms, puts others at risk or misuses the service. Sections that by their nature should
        continue (including safety, disclaimers and liability) continue after that.
      </P>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimers and liability",
    body: (
      <>
        <P>
          Revon is provided &quot;as is&quot; and &quot;as available&quot;. To the extent the law
          allows, we do not promise that it will be accurate, uninterrupted or suited to a
          particular purpose.
        </P>
        <P>
          To the extent the law allows, Velobits is not liable for indirect or consequential loss,
          or for loss or injury that results from riding, from another rider&apos;s actions, from a
          delayed or missing alert, or from reliance on a map, route or position. Nothing in these
          terms limits liability that cannot be limited by law, including for death or personal
          injury caused by our negligence, or for fraud. Your statutory consumer rights are not
          affected.
        </P>
      </>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: (
      <P>
        These terms are governed by the laws of the country where Velobits is established, and its
        courts have jurisdiction, except that mandatory consumer protections in the country where
        you live still apply to you.
      </P>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <P>
        If we change these terms we will update the date at the top and, for significant changes,
        tell you in the app. Using Revon after a change means you accept it.
      </P>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <P>
        Velobits · <A href={`mailto:${MAIL}`}>{MAIL}</A> · {brand.domain.replace("https://", "")}
      </P>
    ),
  },
];

export default function RevonTermsPage() {
  return (
    <LegalDocument
      eyebrow="Revon · Legal"
      title="Terms of Service"
      updated={UPDATED}
      summary={
        <>
          <p className="text-[0.95rem] font-semibold text-foreground">The short version</p>
          <UL>
            <li>
              Keep your eyes on the road. Revon helps a group ride together but does not make riding
              safe.
            </li>
            <li>
              SOS alerts the riders in your ride. It does not call emergency services, so call them
              first.
            </li>
            <li>Only share a ride with people you trust, and treat other riders with respect.</li>
            <li>Revon is free, and you can delete your account at any time.</li>
          </UL>
        </>
      }
      sections={sections}
      sibling={{ label: "← Privacy Policy", href: "/app/revon/privacy" }}
    />
  );
}
