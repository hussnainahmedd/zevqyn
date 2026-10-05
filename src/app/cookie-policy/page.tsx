import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, UPDATED } from "@/components/mkt/Legal";

export const metadata: Metadata = {
  title: "Cookie Policy — ZEVQYN",
  description:
    "How ZEVQYN uses cookies and similar technologies, including essential, preference, analytics, and advertising cookies.",
  alternates: { canonical: "https://zevqyn.dev/cookie-policy" },
  openGraph: {
    title: "Cookie Policy — ZEVQYN",
    description: "How ZEVQYN uses cookies and similar technologies.",
    url: "https://zevqyn.dev/cookie-policy",
    type: "website",
  },
};

export default function CookiePolicy() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Cookie Policy"
      intro="This Cookie Policy explains what cookies are, which ones ZEVQYN uses, and how you can control them."
      updated={UPDATED}
    >
      <h2>1. What cookies are</h2>
      <p>
        Cookies are small text files stored on your device by your browser. They help websites
        remember who you are, keep you signed in, remember preferences, and understand how a service
        is used. Similar technologies (such as local storage) may be used for the same purposes.
      </p>

      <h2>2. Cookies ZEVQYN uses</h2>

      <h3>Essential and authentication cookies</h3>
      <p>
        These are required for ZEVQYN to work. They keep you signed in, protect against abuse, and
        remember security-related state. The service cannot function without them.
      </p>

      <h3>Preference cookies</h3>
      <p>
        These remember choices you make in the product, such as interface preferences, so your
        experience is consistent between visits.
      </p>

      <h3>Analytics cookies (future)</h3>
      <p>
        ZEVQYN may in the future use analytics tools (such as Google Analytics) to understand how
        visitors use the public website and which features are useful. These tools would use cookies
        to collect aggregated, non-identifying usage statistics. This policy will be updated before
        any analytics cookies are introduced.
      </p>

      <h3>Advertising cookies (future)</h3>
      <p>
        ZEVQYN may in the future display advertising (such as through Google AdSense). If so,
        Google and its partners may use cookies or similar technologies to serve, measure, and
        personalize advertisements in line with Google's advertising policies. This policy will be
        updated before any advertising cookies are introduced.
      </p>

      <h2>3. Third-party cookies</h2>
      <p>
        Some features rely on third-party services (for example, authentication and hosting
        infrastructure) that may set their own cookies subject to their own policies. ZEVQYN does
        not control third-party cookies.
      </p>

      <h2>4. Managing cookies</h2>
      <p>You can control cookies through your browser settings. Most browsers let you:</p>
      <ul>
        <li>view and delete existing cookies;</li>
        <li>block cookies for specific sites or altogether;</li>
        <li>receive a warning before a cookie is stored.</li>
      </ul>
      <p>
        Note that blocking essential cookies will prevent you from signing in and using ZEVQYN's
        core features.
      </p>

      <h2>5. Updates to this policy</h2>
      <p>
        We may update this Cookie Policy as our use of cookies changes. The "Last updated" date
        above will always reflect the latest version.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions about cookies? Reach us through the <Link href="/contact">contact page</Link>.
        For the broader picture of how we handle information, see our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
    </LegalShell>
  );
}
