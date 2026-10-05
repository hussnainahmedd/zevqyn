import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, UPDATED } from "@/components/mkt/Legal";

export const metadata: Metadata = {
  title: "Privacy Policy — ZEVQYN",
  description:
    "How ZEVQYN collects, uses, stores, and protects your information, including uploaded research documents, account data, and AI interactions.",
  alternates: { canonical: "https://zevqyn.dev/privacy-policy" },
  openGraph: {
    title: "Privacy Policy — ZEVQYN",
    description:
      "How ZEVQYN collects, uses, stores, and protects your information.",
    url: "https://zevqyn.dev/privacy-policy",
    type: "website",
  },
};

export default function PrivacyPolicy() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This Privacy Policy explains what information ZEVQYN collects, how it is used, and the choices you have. ZEVQYN is an AI research and career workspace where you upload documents, ask questions with citations, and build resumes and portfolios."
      updated={UPDATED}
    >
      <h2>1. Information you provide</h2>
      <p>
        When you use ZEVQYN, you may provide information such as your name, email address, and
        account credentials when you register or sign in. Inside the product you may also create or
        upload:
      </p>
      <ul>
        <li>
          <strong>Research documents</strong> — PDF, DOCX, and TXT files you upload to research
          workspaces for analysis.
        </li>
        <li>
          <strong>Workspace content</strong> — workspace names, descriptions, notes, and
          organization you create.
        </li>
        <li>
          <strong>AI queries and interactions</strong> — questions you ask about your documents,
          research tool runs (summaries, key points, questions, flashcards), and career-assistant
          conversations.
        </li>
        <li>
          <strong>Career content</strong> — resume details, portfolio information, projects, skills,
          education, and profile pictures you add to the resume and portfolio builders.
        </li>
        <li>
          <strong>Messages you send us</strong> — for example through the{" "}
          <Link href="/contact">contact form</Link>.
        </li>
      </ul>

      <h2>2. Information collected automatically</h2>
      <p>We may automatically collect limited technical information, such as:</p>
      <ul>
        <li>device and browser type, operating system, and approximate region derived from IP;</li>
        <li>pages visited, features used, and timestamps, for operating and improving the service;</li>
        <li>error and performance diagnostics that help us keep ZEVQYN reliable.</li>
      </ul>

      <h2>3. Cookies</h2>
      <p>
        ZEVQYN uses cookies and similar technologies for essential purposes such as keeping you
        signed in, remembering preferences, and protecting against abuse. See our{" "}
        <Link href="/cookie-policy">Cookie Policy</Link> for details.
      </p>

      <h2>4. How we use information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>provide, maintain, and improve ZEVQYN's features;</li>
        <li>process your documents and generate AI-assisted research output and citations;</li>
        <li>operate the resume builder, portfolio builder, and career assistance features;</li>
        <li>communicate with you about your account, updates, and support requests;</li>
        <li>detect, prevent, and address security issues and abuse;</li>
        <li>comply with legal obligations.</li>
      </ul>
      <p>
        <strong>We do not sell your personal information.</strong> Your uploaded documents and
        workspaces are private to your account by default. Public sharing — such as publishing a
        portfolio page — only happens when you explicitly choose to publish.
      </p>

      <h2>5. AI processing</h2>
      <p>
        To provide research features, content from documents you upload is processed by AI services
        (currently Google Gemini) to generate embeddings for search and to produce summaries,
        answers, questions, and flashcards. Your document content is sent to these AI providers only
        as needed to perform the feature you requested. AI-generated responses may contain
        inaccuracies — see our <Link href="/disclaimer">Disclaimer</Link>.
      </p>

      <h2>6. Third-party services</h2>
      <p>ZEVQYN relies on infrastructure providers to operate, which may process data as described:</p>
      <ul>
        <li>
          <strong>Supabase</strong> — authentication, database, and file storage for uploaded images
          and documents.
        </li>
        <li>
          <strong>Google Gemini</strong> — AI processing for research, chat, and career features.
        </li>
        <li>
          <strong>Vercel</strong> — hosting of the web application.
        </li>
        <li>
          <strong>Render</strong> — hosting of the application backend/API.
        </li>
      </ul>
      <p>
        In the future we may introduce analytics (such as Google Analytics) and advertising (such as
        Google AdSense). If advertising is introduced, Google and its partners may use cookies or
        similar technologies to serve and measure advertisements in accordance with Google's
        advertising policies. This policy will be updated before any such change takes effect.
      </p>

      <h2>7. Data security</h2>
      <p>
        We apply reasonable technical and organizational measures to protect your information,
        including encrypted connections (HTTPS), authenticated API access, and access controls on
        our infrastructure. No method of transmission or storage is completely secure, and we cannot
        guarantee absolute security.
      </p>

      <h2>8. Data retention</h2>
      <p>
        We retain your account data, uploaded documents, and generated content for as long as your
        account is active and as needed to provide the service. If you delete a workspace, document,
        resume, or portfolio, the associated content is removed from the active product. Backups may
        retain copies for a limited period before being overwritten.
      </p>

      <h2>9. Your rights and deletion requests</h2>
      <p>You may at any time:</p>
      <ul>
        <li>access and update your profile information in account settings;</li>
        <li>delete workspaces, documents, resumes, and portfolios you created;</li>
        <li>
          request deletion of your account and associated personal data by contacting us through the{" "}
          <Link href="/contact">contact form</Link>.
        </li>
      </ul>
      <p>
        We will respond to deletion and access requests within a reasonable timeframe, subject to
        legal retention requirements.
      </p>

      <h2>10. Children's privacy</h2>
      <p>
        ZEVQYN is intended for students and professionals and is not directed at children under 13.
        We do not knowingly collect personal information from children under 13.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we will revise the "Last
        updated" date above. Material changes will be communicated through the product or by email
        where appropriate.
      </p>

      <h2>12. Contact</h2>
      <p>
        If you have questions about this Privacy Policy or our data practices, reach us through the{" "}
        <Link href="/contact">contact page</Link>.
      </p>
    </LegalShell>
  );
}
