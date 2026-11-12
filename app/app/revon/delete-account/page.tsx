import type { Metadata } from "next";
import LegalDocument, {
  A,
  P,
  SampleMail,
  UL,
  type LegalSectionData,
} from "@/components/legal/LegalDocument";
import { brand } from "@/lib/site-content";

const UPDATED = "12 November 2026";
const MAIL = brand.contactEmail;
const strong = "text-foreground";

export const metadata: Metadata = {
  title: "Delete your Revon account | Velobits",
  description:
    "How to delete your Revon account and data by email: what to send, how we find your account, what is deleted, what is kept and the 14-day timeline.",
  alternates: { canonical: `${brand.domain}/app/revon/delete-account` },
  robots: { index: true, follow: true },
};

const deleteSubject = "Delete my Revon account";
const deleteBody = `Hello,

Please delete my Revon account and the data linked to it.

Sign-in email: you@example.com
Verified mobile number: +91 98765 43210

Thank you.
Your name`;

const cancelSubject = "Cancel my Revon account deletion";
const cancelBody = `Hello,

Please cancel my request to delete my Revon account. I want to keep it.

Sign-in email: you@example.com
Verified mobile number: +91 98765 43210

Thank you.
Your name`;

const sections: LegalSectionData[] = [
  {
    id: "how-to-request",
    title: "How to ask for deletion",
    body: (
      <>
        <P>
          Send an email to <A href={`mailto:${MAIL}`}>{MAIL}</A> with the subject{" "}
          <strong className={strong}>&quot;{deleteSubject}&quot;</strong>. Once we receive it, your
          Revon account and its data are deleted within the next 14 days.
        </P>
        <P>
          Send it from the email address you sign in with if you can. That is the quickest way for
          us to match the request to your account.
        </P>
        <SampleMail
          label="Sample email: delete my account"
          to={MAIL}
          subject={deleteSubject}
          body={deleteBody}
        />
      </>
    ),
  },
  {
    id: "which-account",
    title: "How we find your account",
    body: (
      <>
        <P>Your Revon account is identified by either of these. Please give at least one:</P>
        <UL>
          <li>
            <strong className={strong}>Your sign-in email:</strong> the Google account or email
            address you use to sign in to Revon.
          </li>
          <li>
            <strong className={strong}>Your verified mobile number:</strong> the number you verified
            with an SMS code when you created the account, with the country code (for example +91).
          </li>
        </UL>
        <P>
          To protect you, we only delete an account when the request clearly comes from its owner.
          If you write from a different address, or something does not match, we may reply with a
          question first. The 14 days start once we can match your request to an account.
        </P>
      </>
    ),
  },
  {
    id: "timeline",
    title: "The 14-day timeline",
    body: (
      <UL>
        <li>
          <strong className={strong}>Day 0:</strong> we receive your email.
        </li>
        <li>
          <strong className={strong}>Within 14 days:</strong> we delete your account and the data
          listed below.
        </li>
        <li>
          <strong className={strong}>Any time before that:</strong> you can cancel (next section).
          Once the deletion has been carried out it cannot be undone, and you would need to create a
          new account.
        </li>
      </UL>
    ),
  },
  {
    id: "cancel",
    title: "Change your mind: cancel the request",
    body: (
      <>
        <P>
          Send another email to <A href={`mailto:${MAIL}`}>{MAIL}</A> with the subject{" "}
          <strong className={strong}>&quot;{cancelSubject}&quot;</strong>, before the deletion is
          carried out. Your account then stays exactly as it is.
        </P>
        <SampleMail
          label="Sample email: cancel the deletion"
          to={MAIL}
          subject={cancelSubject}
          body={cancelBody}
        />
        <P>
          Until the deletion is carried out, your account is not changed. If you want to stop
          appearing to your riding group sooner, leave your rides in the app.
        </P>
      </>
    ),
  },
  {
    id: "what-is-deleted",
    title: "What is deleted",
    body: (
      <UL>
        <li>
          Your sign-in account (Google or email and password) and its link to your verified mobile
          number.
        </li>
        <li>
          Your profile: name, photo, blood group, date of birth, up to three emergency contacts,
          your profile banner, and your privacy and sharing settings.
        </li>
        <li>
          Your Medical ID: medications, allergies, medical conditions, organ donor choice, insurance
          policy number, notes and your primary emergency contact.
        </li>
        <li>
          Your bikes (names, vehicle, RC and registration numbers, and photos) and your ride history
          (routes, distances, times, speeds and stops).
        </li>
        <li>Your app settings (riding country, units, theme and map icon size).</li>
        <li>Your saved places (names, addresses and coordinates).</li>
        <li>Any bike model suggestions of yours that are still waiting for review.</li>
        <li>The link between your account and any ride you were in.</li>
      </UL>
    ),
  },
  {
    id: "what-is-kept",
    title: "What is kept",
    body: (
      <>
        <UL>
          <li>
            <strong className={strong}>Your name in rides you joined.</strong> Each ride keeps a
            record of its riders (name, marker colour, status, and your phone number only if you
            chose to share it), and the ride history of riders who rode with you lists your name.
            Revon tells you that rides you joined keep your name in their history. Add{" "}
            <em>&quot;also erase my ride history&quot;</em> to your email and we will remove your
            part of those rides as well.
          </li>
          <li>
            <strong className={strong}>Our correspondence</strong> about your request, and anything
            we are legally required to keep.
          </li>
        </UL>
        <P>
          Your ride history is stored on your account, so it is deleted with the account. A copy
          kept on your phone, and any cards or invite images you saved to your photos, stay on your
          phone until you delete them or remove Revon. Revon has no payments, advertising or
          analytics, so there is nothing to delete on those fronts.
        </P>
      </>
    ),
  },
  {
    id: "in-the-app",
    title: "In the app",
    body: (
      <P>
        The <strong className={strong}>Delete my account</strong> button in Revon&apos;s Settings
        brings you to this page. For how we handle your data in general, see the{" "}
        <A href="/app/revon/privacy">Privacy Policy</A>.
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

export default function RevonDeleteAccountPage() {
  return (
    <LegalDocument
      eyebrow="Revon · Your data"
      title="Delete your account"
      updated={UPDATED}
      summary={
        <>
          <p className="text-[0.95rem] font-semibold text-foreground">The short version</p>
          <UL>
            <li>
              Email <A href={`mailto:${MAIL}`}>{MAIL}</A> with the subject &quot;{deleteSubject}
              &quot;.
            </li>
            <li>Your Revon account and its data are deleted within 14 days of us receiving it.</li>
            <li>Send another email any time before then to cancel the request.</li>
          </UL>
        </>
      }
      sections={sections}
      sibling={{ label: "Privacy Policy →", href: "/app/revon/privacy" }}
    />
  );
}
