import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, UPDATED } from "@/components/mkt/Legal";

export const metadata: Metadata = {
  title: "Disclaimer — ZEVQYN",
  description:
    "Important information about the limitations of ZEVQYN's AI-generated research and career assistance.",
  alternates: { canonical: "https://zevqyn.dev/disclaimer" },
  openGraph: {
    title: "Disclaimer — ZEVQYN",
    description: "Limitations of ZEVQYN's AI-generated research and career assistance.",
    url: "https://zevqyn.dev/disclaimer",
    type: "website",
  },
};

export default function Disclaimer() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Disclaimer"
      intro="ZEVQYN provides AI-assisted research and career tools. This page explains what the service can and cannot do, so you can use it with the right expectations."
      updated={UPDATED}
    >
      <h2>What ZEVQYN does</h2>
      <p>ZEVQYN offers AI-assisted help with:</p>
      <ul>
        <li>research assistance and document analysis;</li>
        <li>summaries, key points, study questions, and flashcards from your documents;</li>
        <li>citation-backed answers to questions about your uploaded materials;</li>
        <li>resume building and resume-related suggestions;</li>
        <li>portfolio building and career guidance.</li>
      </ul>

      <h2>AI-generated content has limits</h2>
      <p>AI-generated content may:</p>
      <ul>
        <li>contain inaccuracies or outdated information;</li>
        <li>omit important context from the source material;</li>
        <li>misunderstand complex or ambiguous documents;</li>
        <li>present plausible-sounding but incorrect statements.</li>
      </ul>
      <p>
        Where possible, ZEVQYN shows citations so you can check the source yourself.{" "}
        <strong>Always verify important information independently</strong> before relying on it for
        academic, professional, or personal decisions.
      </p>

      <h2>Not professional advice</h2>
      <p>ZEVQYN is a productivity tool, not a substitute for professional guidance. It should not be treated as a replacement for:</p>
      <ul>
        <li>professional legal advice;</li>
        <li>medical advice or diagnosis;</li>
        <li>financial or investment advice;</li>
        <li>official academic guidance from your institution;</li>
        <li>guaranteed career outcomes — career suggestions are informational and do not promise employment or internships.</li>
      </ul>

      <h2>Your responsibility</h2>
      <p>
        You are responsible for how you use AI-generated output — including what you submit for
        coursework, what you publish on a resume or portfolio, and what you share with others.
        Plagiarism rules and academic-integrity policies of your institution still apply; use
        ZEVQYN as a study aid, not a shortcut around them.
      </p>

      <h2>Questions</h2>
      <p>
        If anything here is unclear, <Link href="/contact">contact us</Link> and we'll be happy to
        explain.
      </p>
    </LegalShell>
  );
}
