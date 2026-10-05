import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, UPDATED } from "@/components/mkt/Legal";

export const metadata: Metadata = {
  title: "Terms of Service — ZEVQYN",
  description:
    "The terms governing your use of ZEVQYN, an AI research and career workspace for students and professionals.",
  alternates: { canonical: "https://zevqyn.dev/terms" },
  openGraph: {
    title: "Terms of Service — ZEVQYN",
    description: "The terms governing your use of ZEVQYN.",
    url: "https://zevqyn.dev/terms",
    type: "website",
  },
};

export default function Terms() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Terms of Service"
      intro="These Terms of Service govern your access to and use of ZEVQYN, an AI research and career workspace. By creating an account or using the service, you agree to these terms."
      updated={UPDATED}
    >
      <h2>1. Acceptance of terms</h2>
      <p>
        By registering for or using ZEVQYN, you confirm that you accept these Terms and our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>. If you do not agree, do not use the
        service.
      </p>

      <h2>2. Your account</h2>
      <ul>
        <li>You must provide accurate information when creating an account.</li>
        <li>You are responsible for keeping your password confidential and for activity under your account.</li>
        <li>Notify us promptly through the <Link href="/contact">contact form</Link> if you suspect unauthorized access.</li>
        <li>Accounts are for individual use unless we explicitly offer team features.</li>
      </ul>

      <h2>3. Permitted use</h2>
      <p>
        ZEVQYN provides AI-assisted research workspaces, document analysis with citations, study
        tools (summaries, questions, flashcards), and career tools (resume builder, portfolio
        builder, career guidance). You may use these features for lawful personal, academic, and
        professional purposes.
      </p>

      <h2>4. Prohibited use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>upload content you do not have the right to use or share;</li>
        <li>use ZEVQYN to infringe intellectual property, privacy, or other rights;</li>
        <li>attempt to disrupt, overload, or gain unauthorized access to the service;</li>
        <li>reverse-engineer or copy the service's proprietary systems beyond normal use;</li>
        <li>use the service for unlawful, harmful, or deceptive activity;</li>
        <li>misrepresent AI-generated content as human-verified fact where verification matters.</li>
      </ul>

      <h2>5. Your content</h2>
      <p>
        <strong>You own the content you upload and create</strong> — your documents, workspaces,
        resumes, portfolios, and projects remain yours. By using ZEVQYN you grant us a limited
        license to store, process, and display that content solely to operate the service (for
        example, to index a document so you can chat with it, or to render a portfolio page you
        publish).
      </p>
      <p>
        You are responsible for the documents you upload, including ensuring you have the right to
        upload them and that they do not violate laws or third-party rights. Content you choose to
        publish (such as a public portfolio page) becomes visible to anyone with the link.
      </p>

      <h2>6. ZEVQYN intellectual property</h2>
      <p>
        The ZEVQYN name, logo, design, and software are protected by intellectual property rights.
        These Terms do not grant you ownership of the service itself. You may not copy, modify, or
        redistribute the service's proprietary elements except as the service's normal features
        allow.
      </p>

      <h2>7. AI-generated content and accuracy</h2>
      <p>
        ZEVQYN's AI features generate content based on your documents and on general AI models.
        <strong> AI output is not guaranteed to be accurate, complete, or current.</strong> Answers
        include citations where available so you can check sources yourself. You should
        independently verify important AI-generated information before relying on it — see our{" "}
        <Link href="/disclaimer">Disclaimer</Link>.
      </p>
      <p>
        Career assistance (resume suggestions, portfolio guidance, career plans) is informational and
        educational. It is not professional career counseling and does not guarantee employment,
        internships, or any specific outcome.
      </p>

      <h2>8. Service availability and changes</h2>
      <p>
        We aim to keep ZEVQYN available and reliable, but we do not guarantee uninterrupted access.
        The service may change, or features may be added, modified, or discontinued, as the product
        evolves. We may perform maintenance that temporarily limits availability.
      </p>

      <h2>9. Termination and suspension</h2>
      <p>
        You may stop using ZEVQYN at any time and may request deletion of your account through the{" "}
        <Link href="/contact">contact form</Link>. We may suspend or terminate accounts that violate
        these Terms or that we reasonably believe pose a security or legal risk.
      </p>

      <h2>10. Third-party services</h2>
      <p>
        ZEVQYN integrates third-party infrastructure (such as Supabase, Google Gemini, Vercel, and
        Render). Your use of the service is also subject to the practical limits of those
        providers. Links you add (for example, to GitHub or LinkedIn) are governed by those
        platforms' own terms.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, ZEVQYN is provided "as is" without warranties of any
        kind. We are not liable for indirect, incidental, or consequential damages arising from your
        use of the service, including reliance on AI-generated content. Our total liability is
        limited to the amounts you paid for the service, if any.
      </p>

      <h2>12. Changes to these terms</h2>
      <p>
        We may update these Terms from time to time and will revise the "Last updated" date above.
        Continued use of ZEVQYN after changes take effect constitutes acceptance of the updated
        Terms.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about these Terms? Reach us through the <Link href="/contact">contact page</Link>.
      </p>
    </LegalShell>
  );
}
