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
const strong = "text-foreground";

export const metadata: Metadata = {
  title: "Cookie Policy | Velobits",
  description:
    "The cookies and similar storage used by the Velobits website, FixMyText and the Revon app, and how to control them.",
  alternates: { canonical: `${brand.domain}/legal/cookies` },
  robots: { index: true, follow: true },
};

const sections: LegalSectionData[] = [
  {
    id: "what",
    title: "What this covers",
    body: (
      <>
        <P>
          This policy covers every Velobits product: the Velobits website (
          {brand.domain.replace("https://", "")}), FixMyText (
          {brand.fixmytextUrl.replace("https://", "")}) and the Revon mobile app. Cookies are small
          text files a website stores in your browser. We also use similar browser storage (local
          storage), which works the same way for this purpose, so we describe both here.
        </P>
        <P>
          We use them only to make the products work and remember your choices. We do not use
          advertising or cross-site tracking cookies, and we do not sell data collected through
          them.
        </P>
      </>
    ),
  },
  {
    id: "website",
    title: "Velobits website",
    body: (
      <>
        <P>
          The website itself sets no cookies. It stores two small items in your browser&apos;s local
          storage:
        </P>
        <Table
          head={["Name", "Purpose", "Lasts"]}
          rows={[
            [
              "vb-theme",
              "Remembers whether you chose the light or dark look.",
              "Until you clear it",
            ],
            [
              "vb_voter_id and vote markers",
              "A random ID that lets the community poll count one vote per browser. It is not linked to your name or email.",
              "Until you clear it",
            ],
          ]}
        />
        <P>
          Page-view statistics come from Vercel Web Analytics, which counts visits without cookies
          and does not follow you across sites.
        </P>
      </>
    ),
  },
  {
    id: "fixmytext",
    title: "FixMyText",
    body: (
      <>
        <Table
          head={["Name", "Purpose", "Lasts"]}
          rows={[
            [
              "fixmytext_session (cookie)",
              "Keeps you signed in to FixMyText. Essential: without it you would have to sign in on every visit.",
              "Up to 7 days, and removed when you sign out",
            ],
            [
              "Sign-in provider session (cookie)",
              "Set by our sign-in service while you are signed in, so signing in once covers the whole product.",
              "Until your sign-in session ends",
            ],
            [
              "fmx_theme_mode, fmx_sidebar_w, fmx_bottom_h, fmx_split_pct, fmx_tool_view, fmx_keybindings (local storage)",
              "Remember your theme, panel sizes, tool view and keyboard shortcuts.",
              "Until you clear them",
            ],
            [
              "fmx_visitor_id, fmx_trial_uses (local storage)",
              "Count the free uses available to a visitor who is not signed in.",
              "Until you clear them",
            ],
            [
              "Reminder dismissal (local storage)",
              "Remembers that you dismissed the email-verification reminder.",
              "Until the time stored in it",
            ],
          ]}
        />
        <P>
          When you pay, our payment provider (Razorpay) shows its own checkout and may set its own
          cookies. Those are covered by its policy, not ours. FixMyText may also send error reports
          to a monitoring service to help us fix bugs. These reports contain technical details about
          the error and are not used for advertising.
        </P>
      </>
    ),
  },
  {
    id: "revon",
    title: "Revon app",
    body: (
      <P>
        The Revon mobile app does not use cookies. It keeps your settings and ride recordings in
        storage on your phone. When Revon shows a Velobits page such as the privacy policy, that
        page follows this policy, and pages shown inside the app (
        <code className="text-foreground">?embed=1</code>) set no cookies.
      </P>
    ),
  },
  {
    id: "control",
    title: "Your choices",
    body: (
      <>
        <P>
          You can block or delete cookies and local storage in your browser settings, and your
          browser can tell you before it stores one. If you block essential items, some features
          stop working: for example, you may have to sign in repeatedly to FixMyText, or lose your
          saved layout.
        </P>
        <UL>
          <li>
            <strong className={strong}>Clear storage:</strong> use your browser&apos;s &quot;clear
            site data&quot; option for velobits.dev or fixmytext.velobits.dev.
          </li>
          <li>
            <strong className={strong}>Do not track:</strong> we do not track you across other
            sites, so there is nothing extra to switch off.
          </li>
        </UL>
        <P>
          Because we only use items that are needed to run the products and remember your choices,
          we do not show a cookie consent banner. If that changes, we will add one and update this
          policy first.
        </P>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes",
    body: (
      <P>
        If we add a new cookie or tracking technology, we will update this page and its date. See
        also the <A href="/app/revon/privacy">Revon Privacy Policy</A> for how we handle personal
        data.
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

export default function CookiePolicyPage() {
  return (
    <LegalDocument
      eyebrow="Velobits · Legal"
      title="Cookie Policy"
      updated={UPDATED}
      summary={
        <>
          <p className="text-[0.95rem] font-semibold text-foreground">The short version</p>
          <UL>
            <li>No advertising or cross-site tracking cookies, on any Velobits product.</li>
            <li>
              The website sets no cookies. FixMyText uses a sign-in cookie to keep you signed in.
            </li>
            <li>The Revon app does not use cookies.</li>
          </UL>
        </>
      }
      sections={sections}
      sibling={{ label: "Payment Policy →", href: "/legal/payments" }}
    />
  );
}
