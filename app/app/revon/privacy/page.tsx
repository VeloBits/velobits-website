import type { Metadata } from "next";
import LegalDocument, {
  A,
  P,
  Table,
  UL,
  type LegalSectionData,
} from "@/components/legal/LegalDocument";
import { brand } from "@/lib/site-content";

const UPDATED = "12 November 2026";
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
          and iOS only. The Velobits website and FixMyText have their own policies (see section 11).
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
              "Profile: display name, profile photo, and whether riders may call you.",
              "To show who you are in a group.",
              "Your account in Firebase Realtime Database, and a copy on your phone",
            ],
            [
              "App settings: the country you ride in, your units (distance, fuel economy, temperature), your theme and your map icon size.",
              "So Revon looks and measures the way you want, on every phone you sign in on. Your riding country starts from your phone's region. When you ride in another country, Revon may use your device location to suggest your riding country, and it asks before changing it.",
              "Your account in Firebase Realtime Database, and a copy on your phone",
            ],
            [
              "Ride history: the path, distance, time, speeds and stops of each ride you take, and the names of the riders you rode with.",
              "So you can look back on your rides, and see them on any phone you sign in on.",
              "Your account in Firebase Realtime Database, and a copy on your phone",
            ],
            [
              "Bikes: for each bike a name, vehicle number, RC number, a hidden registration number and, if you add one, a photo.",
              "To keep your garage and your riding profile.",
              "Your account in Firebase Realtime Database, and a copy on your phone",
            ],
            [
              "Bike model suggestions: if you add a bike that is not in the list, the brand and model name you typed. Nothing else about the bike is sent: not the vehicle number, registration number or photo.",
              "So the model can be reviewed and added to the shared bike list for all riders.",
              "A review queue in Firebase Realtime Database. Once approved, the brand and model name can appear in the bike list shown to every rider.",
            ],
            [
              "Medical ID (optional health information): medications, allergies, medical conditions, organ donor choice, insurance policy number, notes, and the primary emergency contact you choose.",
              "To help the people riding with you, and anyone who helps you, if you need help. See who sees it in section 4.",
              "Your account in Firebase Realtime Database, and a copy on your phone",
            ],
            [
              "Emergency contacts: up to three (name, number, relationship). Blood group and date of birth if you add them.",
              "To hold emergency details you choose to add.",
              "Your account in Firebase Realtime Database, and a copy on your phone",
            ],
            [
              "Precise location, including speed and heading, while you use Revon. During a group ride this continues in the background, and your phone shows a notification or indicator while it does.",
              "To show you on the group map, work out who is ahead or behind, detect a missed turn and arrival, and navigate.",
              "Firebase Realtime Database for group rides. For solo rides it is used on your phone and saved to your ride history.",
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
              "Photos you pick or take for your profile picture, a bike or a ride card background, and cards and invite images you save to your photo library.",
              "To personalise your profile and bikes and let you keep and share cards.",
              "Profile and bike photos: your account. Saved cards and invite images: your phone.",
            ],
            [
              "Technical data such as IP address, device and app version.",
              "Created automatically when the app talks to the services in section 5.",
              "Those service providers",
            ],
          ]}
        />
        <P>
          <strong className="text-foreground">Medical ID is sensitive health information.</strong>{" "}
          It is optional: you add only what you want, and you can change or remove any of it at any
          time. We use it only for the purposes in section 4, and we handle it on the basis of your
          consent, which you withdraw by removing it or by deleting your account.
        </P>
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
          Other riders only see you when you share a ride with them. Joining a ride is by a code, an
          invite link or a QR code, and the host can lock a ride.
        </P>
        <Table
          head={["Who", "What they can see"]}
          rows={[
            [
              "Riders in your ride",
              "Your name, your colour on the map, your status, your live position, speed and heading, whether you are off the route or have arrived, your SOS alert and type, and the hand signals you send. Your mobile number only if you allow riders to call you.",
            ],
            [
              "Riders in your ride, only while you have an SOS active, and anyone you share your card with",
              "Your Medical ID: medications, allergies, medical conditions, organ donor choice, insurance policy number, notes and your primary emergency contact. It is shown to the riders in the same group only while an SOS from you is active, and on a Medical ID card only when you choose to share that card.",
            ],
            [
              "Only you",
              "Your ride history, your bikes (including the vehicle, RC and registration numbers and any bike photo), your settings, your email address, your blood group and date of birth, and your emergency contacts other than the primary contact you choose to put on your Medical ID.",
            ],
          ]}
        />
        <P>
          <strong className="text-foreground">Bike suggestions.</strong> Your bikes are private to
          you. The only exception is a bike model you suggest because it is missing from the list:
          its brand and model name alone are reviewed, and if approved they become part of the bike
          list that every rider sees.
        </P>
        <P>
          <strong className="text-foreground">Invite links and QR codes.</strong> An invite contains
          only the ride code, in a link like https://revon.velobits.dev/join/CODE or in a QR code
          that holds the same link. Anyone who has it can ask to join an unlocked ride and will then
          see what the first row above describes, so share it only with people you trust. A shared
          invite image holds the code, the link and the QR code, and nothing else about you.
        </P>
        <P>
          Your ride history lists the names of the riders you rode with, and their histories list
          yours. Rides you take part in keep your name in their record, as explained in section 7.
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
          <strong className="text-foreground">
            Settings, ride history, bikes, Medical ID and emergency contacts:
          </strong>{" "}
          kept on your account until you remove them or delete your account. Deleting your account
          through the deletion request deletes them too.
        </li>
        <li>
          <strong className="text-foreground">On your phone:</strong> the copy Revon keeps on your
          phone, saved cards and invite images stay until you delete them or uninstall Revon.
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
    id: "other-policies",
    title: "Other Velobits policies",
    body: (
      <P>
        This policy covers the Revon app only. The Velobits website has its own{" "}
        <A href="/legal/privacy">Privacy Policy</A>, and FixMyText (
        {brand.fixmytextUrl.replace("https://", "")}) is a separate product with its own policy.
      </P>
    ),
  },
  {
    id: "store-summary",
    title: "Summary for app store listings",
    body: (
      <>
        <P>
          The same information as above, grouped the way app stores ask for it. The sections above
          are the full policy.
        </P>
        <Table
          head={["Category", "What Revon collects", "Notes"]}
          rows={[
            [
              "Location",
              "Precise location, speed and heading while you use Revon, in the background during a group ride.",
              "Shown to the riders in your ride. Needed to run the app.",
            ],
            [
              "Personal info",
              "Name, email address, mobile number, date of birth, emergency contacts, vehicle and registration numbers.",
              "Optional parts can be removed at any time.",
            ],
            [
              "Health info",
              "Medications, allergies, medical conditions, organ donor choice, insurance policy number, blood group, notes.",
              "Optional. Shown to your group only during your SOS, or on a card you share.",
            ],
            ["Photos", "Profile and bike photos you choose.", "Optional."],
            [
              "App activity",
              "Ride history, rides you join, SOS alerts, hand signals, app settings, and the brand and model of a bike you suggest for the shared list.",
              "Ride history is private to your account. A suggested bike model, with nothing else about the bike, may be added to a list every rider sees.",
            ],
            [
              "Not collected",
              "Contacts, microphone, advertising ID, payments, advertising or analytics data.",
              "Revon has no ads and no payments today.",
            ],
            [
              "Security and control",
              "Data is encrypted in transit.",
              "You can delete your account and data, see section 9.",
            ],
          ]}
        />
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
              Your phone number is shared only if you allow it. Your Medical ID is shown to your
              group only while you have an SOS active, or on a card you choose to share.
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
