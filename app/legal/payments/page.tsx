import type { Metadata } from "next";
import LegalDocument, { A, P, UL, type LegalSectionData } from "@/components/legal/LegalDocument";
import { brand } from "@/lib/site-content";

const UPDATED = "4 November 2026";
const MAIL = brand.contactEmail;
const strong = "text-foreground";

export const metadata: Metadata = {
  title: "Payment Policy | Velobits",
  description:
    "How billing, refunds and cancellation work for paid Velobits products, including FixMyText passes, credits and Pro.",
  alternates: { canonical: `${brand.domain}/legal/payments` },
  robots: { index: true, follow: true },
};

const sections: LegalSectionData[] = [
  {
    id: "scope",
    title: "What this covers",
    body: (
      <>
        <P>
          This policy covers payments for every Velobits product. Today, only FixMyText (
          {brand.fixmytextUrl.replace("https://", "")}) takes payments.{" "}
          <strong className={strong}>Revon is free</strong>: it has no purchases, subscriptions or
          ads. If we add paid features to Revon or another product, they will follow this policy and
          we will update it first.
        </P>
      </>
    ),
  },
  {
    id: "what-you-buy",
    title: "What you can buy in FixMyText",
    body: (
      <>
        <P>FixMyText has a free allowance. You can pay for more with one of these:</P>
        <UL>
          <li>
            <strong className={strong}>Passes:</strong> time-limited access to more uses and to more
            tools, from a single day up to a year. A pass states its tools, daily uses and length
            before you pay.
          </li>
          <li>
            <strong className={strong}>Credit packs:</strong> a number of extra AI uses, bought in
            one go.
          </li>
          <li>
            <strong className={strong}>Pro:</strong> a 30-day plan with the highest limits and all
            tools.
          </li>
        </UL>
        <P>
          What each option includes is shown at checkout. Free-use limits and what a paid option
          unlocks can change over time, but not for something you have already paid for.
        </P>
      </>
    ),
  },
  {
    id: "billing",
    title: "Prices and billing",
    body: (
      <UL>
        <li>
          <strong className={strong}>Currency:</strong> prices are shown in the currency of your
          region: Indian rupees (INR), US dollars (USD), pounds (GBP) or euros (EUR). The amount you
          see at checkout is the amount you pay.
        </li>
        <li>
          <strong className={strong}>Payment provider:</strong> payments are handled by Razorpay.
          Your card, UPI or bank details go to Razorpay and are never stored by Velobits.
        </li>
        <li>
          <strong className={strong}>One-time payments:</strong> each purchase is a one-time
          payment. Pro does not renew by itself. When it ends you can buy it again, and you can
          renew in the last 7 days of the period without losing the days you have already paid for.
        </li>
        <li>
          <strong className={strong}>Taxes:</strong> any applicable taxes are shown at checkout
          before you pay.
        </li>
        <li>
          <strong className={strong}>Price changes:</strong> we may change prices for future
          purchases. A change never affects something you have already bought.
        </li>
      </UL>
    ),
  },
  {
    id: "delivery",
    title: "When you get what you paid for",
    body: (
      <P>
        FixMyText is a digital service, so a purchase is applied to your account as soon as the
        payment is confirmed. Passes and Pro run for the length they state, starting from purchase,
        and any time or daily uses not used by the end do not carry over. Credits are added to your
        balance.
      </P>
    ),
  },
  {
    id: "cancel",
    title: "Cancellation",
    body: (
      <UL>
        <li>
          <strong className={strong}>Pro:</strong> you can cancel in your account at any time. You
          keep access until the end of the period you paid for. You will not be charged again,
          because Pro does not renew by itself.
        </li>
        <li>
          <strong className={strong}>Passes and credits:</strong> they cannot be cancelled once
          bought, but there is nothing further to pay. A pass simply ends when its time is up.
        </li>
      </UL>
    ),
  },
  {
    id: "refunds",
    title: "Refunds",
    body: (
      <>
        <UL>
          <li>
            <strong className={strong}>Automatic refund:</strong> if you are charged and we cannot
            apply the purchase to your account (for example the payment cannot be matched to a valid
            order), we refund it to your original payment method. It usually reaches you in 5 to 7
            business days, depending on your bank.
          </li>
          <li>
            <strong className={strong}>Charged twice, or charged by mistake:</strong> tell us and we
            will refund the extra payment.
          </li>
          <li>
            <strong className={strong}>Other cases:</strong> because the service is delivered
            straight away, we generally do not refund a pass, credit pack or Pro period once it has
            been used. If something is wrong with what you bought, contact us and we will look at it
            fairly.
          </li>
        </UL>
        <P>Nothing here limits any rights you have under the consumer law where you live.</P>
      </>
    ),
  },
  {
    id: "contact",
    title: "Billing help",
    body: (
      <>
        <P>
          For a payment problem, a refund request or a question, email{" "}
          <A href={`mailto:${MAIL}`}>{MAIL}</A> from the address on your account, and include the
          date and amount of the payment and the payment reference from your receipt. We will reply
          as soon as we can.
        </P>
        <P>
          Related: <A href="/legal/cookies">Cookie Policy</A> ·{" "}
          <A href="/app/revon/privacy">Revon Privacy Policy</A>.
        </P>
      </>
    ),
  },
];

export default function PaymentPolicyPage() {
  return (
    <LegalDocument
      eyebrow="Velobits · Legal"
      title="Payment Policy"
      updated={UPDATED}
      summary={
        <>
          <p className="text-[0.95rem] font-semibold text-foreground">The short version</p>
          <UL>
            <li>Revon is free. Only FixMyText takes payments, through Razorpay.</li>
            <li>Every purchase is one-time. Nothing renews by itself.</li>
            <li>If a payment cannot be applied to your account, it is refunded automatically.</li>
          </UL>
        </>
      }
      sections={sections}
      sibling={{ label: "← Cookie Policy", href: "/legal/cookies" }}
    />
  );
}
