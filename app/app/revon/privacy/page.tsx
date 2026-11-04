import type { Metadata } from "next";
import LegalDocument, {
  A,
  P,
  Table,
  UL,
  type LegalSectionData,
} from "@/components/legal/LegalDocument";
import { brand } from "@/lib/site-content";

const UPDATED = "4 November 2026";
const MAIL = brand.contactEmail;

export const metadata: Metadata = {
  title: "Revon Privacy Policy | Velobits",
  description:
    "How the Revon group motorcycle ride app collects, uses and shares your data, including location, profile and ride information.",
  alternates: { canonical: `${brand.domain}/app/revon/privacy` },
  robots: { index: true, follow: true },
};

const sections: LegalSectionData[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <P>
          Revon is a group motorcycle ride app made by Velobits (&quot;Velobits&quot;,
          &quot;we&quot;, &quot;us&quot;). This policy explains what the Revon mobile app collects,
          why, who it is shared with and what control you have. It covers the Revon app on Android
          and iOS and, in section 11, the Velobits website at {brand.domain.replace("https://", "")}
          .
        </P>
        <P>
          Questions or requests: <A href={`mailto:${MAIL}`}>{MAIL}</A>.
        </P>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    body: (
      <>
        <P>We collect only what Revon needs to work. There are no ads in Revon.</P>
        <Table
          head={["Data", "Why we need it", "Where it lives"]}
          rows={[
            [
              "Account: email address, sign-in method, and your name and photo if you sign in with Google. Passwords are handled by Google Firebase Authentication and are never visible to us.",
              "To create your account and sign you in.",
              "Firebase Authentication",
            ],
            [
              "Mobile number, verified with an SMS code.",
              "Every Revon account must have a verified number so riders in a group know who they are riding with.",
              "Firebase Authentication and your profile",
            ],
            [
              "Profile: display name, profile photo, and optional blood group, date of birth, medical notes and up to three emergency contacts (name, number, relationship). Preferences such as whether riders may call you.",
              "To show who you are in a group and to hold emergency details you choose to add.",
              "Your profile in Firebase Realtime Database, and a copy on your phone",
            ],
            [
              "Precise location, including speed and heading, while you use Revon. During a group ride this continues in the background, and your phone shows a notification or indicator while it does.",
              "To show you on the group map, work out who is ahead or behind, detect a missed turn and arrival, and navigate.",
              "Firebase Realtime Database for group rides. On your phone only for solo rides.",
            ],
            [
              "Ride activity: ride code, destination, regroup point, who is in the ride, rider status (for example fuel stop), SOS alerts and their type, hand signals and ride alerts, with timestamps.",
              "To run the ride for everyone in it.",
              "Firebase Realtime Database",
            ],
            [
              "Places you search for, nearby places you look up and routes you request.",
              "To find destinations and compute routes.",
              "Sent to the map provider you choose, see section 5",
            ],
            [
              "Photos you pick or take for your profile picture or ride card background, and ride cards you save to your photo library.",
              "To personalise your profile and let you keep and share ride cards.",
              "Profile photo: your profile. Ride cards: your phone.",
            ],
            [
              "Ride recordings: the path, distance, time and speeds of each ride, and who rode.",
              "So you can look back on your rides.",
              "Your phone only. They are not uploaded.",
            ],
            [
              "Technical data such as IP address, device and app version.",
              "Created automatically when the app talks to the services in section 5.",
              "Those service providers",
            ],
          ]}
        />
        <P>
          Revon does not read your contacts or microphone, does not use an advertising ID, and does
          not include advertising, analytics or crash-reporting software. The app asks permission
          before it uses location, camera, photos or notifications, and you can withdraw each in
          your phone settings.
        </P>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use your data",
    body: (
      <UL>
        <li>
          To provide Revon: sign-in, group rides, live map, navigation, alerts, SOS and signals.
        </li>
        <li>To verify your mobile number and keep accounts secure and free of abuse.</li>
        <li>To respond to your requests and to fix problems.</li>
        <li>To meet legal obligations.</li>
      </UL>
    ),
  },
  {
    id: "who-sees-what",
    title: "Who sees what",
    body: (
      <>
        <P>
          Other riders only see you when you share a ride with them. Joining a ride is by a code or
          an invite link, and the host can lock a ride.
        </P>
        <Table
          head={["Other riders in your ride can see", "Only you can see"]}
          rows={[
            [
              "Your name, your colour on the map, your status, your live position, speed and heading, whether you are off the route or have arrived, your SOS alert and type, and the hand signals you send. Your mobile number only if you allow riders to call you.",
              "Your profile photo, blood group, date of birth, medical notes, emergency contacts, email address and your ride history.",
            ],
          ]}
        />
        <P>
          Each rider&apos;s phone keeps its own recording of a group ride. Another rider&apos;s
          recording can contain your name and, if you allow it, your number. You control this in
          Settings under Privacy (&quot;Show my details in recorded rides&quot;).
        </P>
        <P>
          Emergency details are not shown to the group in this version of Revon. If a future version
          shares them during an SOS, we will tell you and update this policy first.
        </P>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share data with",
    body: (
      <>
        <P>
          We do not sell your personal data and we do not share it for advertising. We use these
          service providers to run Revon. Each receives only what its part of the app needs.
        </P>
        <Table
          head={["Provider", "What it does", "What it receives"]}
          rows={[
            [
              "Google (Firebase Authentication, Firebase Realtime Database, Google Sign-In)",
              "Sign-in, SMS verification and storage of profiles and live rides.",
              "Your account, profile, ride and location data as described above.",
            ],
            [
              "Google Maps Platform (Maps, Places, Routes)",
              "Map, place search, nearby places and routes when you choose the Google map source.",
              "Map views, your search text, coordinates and route requests, plus your IP address.",
            ],
            [
              "OpenStreetMap services (map tiles from OpenFreeMap, search from Photon, routing from Valhalla or OSRM, nearby places from Overpass)",
              "The same jobs when you choose the OpenStreetMap map source. These are public servers run by third parties.",
              "Map views, your search text, coordinates and route requests, plus your IP address.",
            ],
            [
              "Expo (EAS Update)",
              "Delivers app updates.",
              "Basic device and app version information when the app checks for an update.",
            ],
            [
              "Apple and Google (app stores) and your mobile carrier",
              "Distribute the app and deliver SMS verification codes.",
              "What their own policies describe.",
            ],
          ]}
        />
        <P>
          You choose the map source in Settings. A ride always shows on the source it was created
          with, so riders in one ride use the same map. We may also disclose data if the law
          requires it or to protect someone&apos;s safety.
        </P>
      </>
    ),
  },
  {
    id: "storage",
    title: "Where data is stored and how it is protected",
    body: (
      <P>
        Account, profile and ride data are stored by Google Firebase on Google&apos;s servers, which
        may be outside your country. Data travels over encrypted connections. Database rules limit
        your profile to you and a ride&apos;s live data to its members. No system is perfectly
        secure, so please use a strong password and keep your phone locked.
      </P>
    ),
  },
  {
    id: "retention",
    title: "How long we keep data",
    body: (
      <UL>
        <li>
          <strong className="text-foreground">Account and profile:</strong> until you delete your
          account.
        </li>
        <li>
          <strong className="text-foreground">Ride records:</strong> a ride can no longer be joined
          or resumed 24 hours after its last activity. We do not yet delete finished ride records
          automatically, so a record of a ride you took part in (your name, route points and the
          ride events) can remain in that ride&apos;s history. We are building automatic clean-up.
          You can ask us to erase your part of any ride at any time.
        </li>
        <li>
          <strong className="text-foreground">On your phone:</strong> ride recordings, ride cards
          and settings stay until you delete them or uninstall Revon.
        </li>
      </UL>
    ),
  },
  {
    id: "your-choices",
    title: "Your choices and rights",
    body: (
      <>
        <UL>
          <li>
            Edit or remove your photo, blood group, date of birth, notes and emergency contacts in
            Settings.
          </li>
          <li>
            Decide whether riders can call you and whether your details appear in recorded rides, in
            Settings under Privacy.
          </li>
          <li>
            Turn off location permission. The group will then not see you, and Revon will tell you
            so.
          </li>
          <li>Leave a ride at any time.</li>
        </UL>
        <P>
          Depending on where you live (for example the EU, the UK or California) you may also have
          the right to access, correct, export or erase your data, to object to or restrict how it
          is used, and to complain to your data protection authority. Email{" "}
          <A href={`mailto:${MAIL}`}>{MAIL}</A> from the address on your account and we will reply
          within 30 days.
        </P>
      </>
    ),
  },
  {
    id: "delete-account",
    title: "Delete your account and data",
    body: (
      <>
        <P>
          To delete your account, email{" "}
          <A href={`mailto:${MAIL}?subject=Delete%20my%20Revon%20account`}>{MAIL}</A> with the
          subject &quot;Delete my Revon account&quot;. Your account and its data are deleted within
          14 days of us receiving it, and you can cancel by sending another email. The{" "}
          <strong className="text-foreground">Delete my account</strong> button in the app opens the
          page that explains this, with sample emails, what is deleted and what is kept:{" "}
          <A href="/app/revon/delete-account">velobits.dev/app/revon/delete-account</A>.
        </P>
        <P>
          Rides you took part in may keep a record of your name and route points, as explained in
          section 7. Ask us to erase these in the same email and we will.
        </P>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <P>
        Revon is not directed to children under 13, or under the minimum age in your country, and we
        do not knowingly collect their data. If you believe a child has created an account, email us
        and we will delete it.
      </P>
    ),
  },
  {
    id: "website",
    title: "This website",
    body: (
      <>
        <P>The Velobits website ({brand.domain.replace("https://", "")}) collects little:</P>
        <UL>
          <li>
            <strong className="text-foreground">Waitlist:</strong> the email address you enter, the
            time, and your browser&apos;s user agent, stored in a Google Sheet we control. We send
            you a welcome message and launch updates, and you can unsubscribe by replying to any
            email.
          </li>
          <li>
            <strong className="text-foreground">Community poll and ideas:</strong> your vote with a
            random anonymous ID, and any idea you submit with your user agent.
          </li>
          <li>
            <strong className="text-foreground">Page-view statistics:</strong> aggregate visit
            counts from Vercel Web Analytics, which does not use cookies to track you across sites.
          </li>
        </UL>
        <P>
          FixMyText at {brand.fixmytextUrl.replace("https://", "")} is a separate product. This
          policy does not cover it.
        </P>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <P>
        If we change this policy we will update the date at the top. If a change affects how we use
        your data in a significant way, we will tell you in the app before it applies.
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

export default function RevonPrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Revon · Legal"
      title="Privacy Policy"
      updated={UPDATED}
      summary={
        <>
          <p className="text-[0.95rem] font-semibold text-foreground">The short version</p>
          <UL>
            <li>
              Revon shares your live location with the riders in your ride, and with nobody else.
            </li>
            <li>
              Your phone number is shared only if you allow it. Emergency details stay private to
              you.
            </li>
            <li>We do not sell your data and Revon has no ads or tracking software.</li>
            <li>You can delete your account by email, and it is gone within 14 days.</li>
          </UL>
        </>
      }
      sections={sections}
      sibling={{ label: "Terms of Service →", href: "/app/revon/terms" }}
    />
  );
}
