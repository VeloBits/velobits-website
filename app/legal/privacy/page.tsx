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
const SITE = brand.domain.replace("https://", "");
const strong = "text-foreground";

export const metadata: Metadata = {
  title: "Velobits Privacy Policy",
  description:
    "How Velobits handles personal data on its website: waitlist emails, community votes and ideas, analytics and contact. Revon and FixMyText have their own policies.",
  alternates: { canonical: `${brand.domain}/legal/privacy` },
  robots: { index: true, follow: true },
};

const sections: LegalSectionData[] = [
  {
    id: "who-we-are",
    title: "Who we are and what this covers",
    body: (
      <>
        <P>
          Velobits (&quot;Velobits&quot;, &quot;we&quot;, &quot;us&quot;) builds software products.
          This policy covers the Velobits website at {SITE} and what you send us through it or by
          email. It does not cover our products, which each have their own privacy policy:
        </P>
        <UL>
          <li>
            <strong className={strong}>Revon</strong> (the group motorcycle ride app):{" "}
            <A href="/app/revon/privacy">Revon Privacy Policy</A>.
          </li>
          <li>
            <strong className={strong}>FixMyText</strong> (
            {brand.fixmytextUrl.replace("https://", "")}): see the privacy information on that site.
          </li>
        </UL>
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
        <P>
          The website has no accounts and no ads. It collects only what you choose to give us, plus
          basic technical data.
        </P>
        <Table
          head={["Data", "Why we need it", "Where it lives"]}
          rows={[
            [
              "Waitlist: your email address, the time you signed up, the form it came from, and your browser's user agent.",
              "To tell you about launches and send you early access.",
              "A Google Sheet we control",
            ],
            [
              "Community poll: your choice and a random anonymous ID created in your browser. It is not linked to your name or email.",
              "To count one vote per browser.",
              "The same Google Sheet, and your browser's local storage",
            ],
            [
              "Ideas: the text you submit.",
              "To decide what to build next.",
              "The same Google Sheet",
            ],
            [
              "Email you send us: your address and what you write.",
              "To reply to you.",
              "Our email account",
            ],
            [
              "Technical data: IP address, browser and device type, and the pages you view.",
              "To deliver the site, keep it secure and count visits.",
              "Our hosting provider and web analytics",
            ],
          ]}
        />
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use it",
    body: (
      <UL>
        <li>To send you a welcome message and launch updates if you joined the waitlist.</li>
        <li>To count poll votes and read the ideas you send.</li>
        <li>To answer your emails and fix problems.</li>
        <li>To keep the website working and secure, and to see in total how it is used.</li>
        <li>To meet legal obligations.</li>
      </UL>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <P>
          We do not sell your personal data and we do not share it for advertising. These providers
          help us run the site:
        </P>
        <Table
          head={["Provider", "What it does", "What it receives"]}
          rows={[
            [
              "Google (Sheets, Apps Script and Gmail)",
              "Stores waitlist, poll and idea entries, and sends our emails.",
              "The entries above and the email addresses we write to.",
            ],
            [
              "Vercel",
              "Hosts the website and provides Vercel Web Analytics.",
              "Technical data such as IP address, browser and pages viewed. Analytics counts visits without cookies and does not follow you across sites.",
            ],
          ]}
        />
        <P>We may also disclose data if the law requires it or to protect someone&apos;s safety.</P>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    body: (
      <P>
        The website sets no cookies. It remembers your light or dark choice and your poll vote in
        your browser&apos;s local storage. Details are in our{" "}
        <A href="/legal/cookies">Cookie Policy</A>.
      </P>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <UL>
        <li>
          <strong className={strong}>Waitlist email:</strong> until you unsubscribe or ask us to
          delete it.
        </li>
        <li>
          <strong className={strong}>Poll votes and ideas:</strong> we keep them while they are
          useful for deciding what to build. Ideas carry no name or email, so we cannot always tell
          which one is yours. Tell us the wording and we will remove it.
        </li>
        <li>
          <strong className={strong}>Email you send us:</strong> as long as needed to deal with your
          request and keep a record of it.
        </li>
        <li>
          <strong className={strong}>Technical data:</strong> for the periods our hosting and
          analytics providers keep it.
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
            <strong className={strong}>Unsubscribe:</strong> reply to any email from us and ask to
            stop, and we will remove you from the list.
          </li>
          <li>
            <strong className={strong}>Delete your data:</strong> email{" "}
            <A href={`mailto:${MAIL}`}>{MAIL}</A> from the address you signed up with and we will
            delete your waitlist entry.
          </li>
        </UL>
        <P>
          Depending on where you live (for example the EU, the UK or California) you may also have
          the right to access, correct, export or erase your data, to object to or restrict how it
          is used, and to complain to your data protection authority. Email us and we will reply
          within 30 days.
        </P>
      </>
    ),
  },
  {
    id: "security",
    title: "Security and transfers",
    body: (
      <P>
        The site is served over an encrypted connection, and entries are stored in accounts
        protected by sign-in. No system is perfectly secure. Google and Vercel run servers in many
        countries, so your data may be processed outside the country where you live.
      </P>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <P>
        The website is not directed to children under 13, and we do not knowingly collect their
        data. If you think a child has joined the waitlist, email us and we will delete the entry.
      </P>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <P>
        If we change this policy we will update the date at the top. If a change significantly
        affects how we use your data, we will say so on the website before it applies.
      </P>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <P>
        Velobits · <A href={`mailto:${MAIL}`}>{MAIL}</A> · {SITE}
      </P>
    ),
  },
];

export default function VelobitsPrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Velobits · Legal"
      title="Privacy Policy"
      updated={UPDATED}
      summary={
        <>
          <p className="text-[0.95rem] font-semibold text-foreground">The short version</p>
          <UL>
            <li>
              This policy is for the Velobits website. Revon and FixMyText each have their own
              policy.
            </li>
            <li>
              We collect the email you give us for the waitlist, poll votes, ideas and basic visit
              data.
            </li>
            <li>No ads, no cookies and no selling of data.</li>
            <li>Ask us to unsubscribe or delete your data at any time.</li>
          </UL>
        </>
      }
      sections={sections}
      sibling={{ label: "Cookie Policy →", href: "/legal/cookies" }}
    />
  );
}
