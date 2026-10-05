import type { Metadata } from "next";
import Link from "next/link";
import { MktShell, MarketingHeader, MarketingFooter } from "@/components/Marketing";
import { Eyebrow, CTABand } from "@/components/mkt/Kit";
import { Reveal } from "@/components/mkt/Reveal";
import { FaqAccordion, FaqLink, type Group } from "./FaqAccordion";

const GROUPS: Group[] = [
  {
    title: "General",
    items: [
      {
        q: "What is ZEVQYN?",
        a: (
          <>
            ZEVQYN is an AI research and career workspace. You upload documents (PDF, DOCX, TXT),
            ask questions about them and get citation-backed answers, generate study materials like
            summaries, questions and flashcards — then turn that work into projects, resumes and a
            public portfolio. It follows a simple chain:{" "}
            <strong>Research → Project → Resume → Portfolio → Growth</strong>.
          </>
        ),
      },
      {
        q: "Who is ZEVQYN for?",
        a: "Students, developers, and early-career professionals — anyone who works with documents and wants to convert learning into career proof: a stronger resume and a real portfolio.",
      },
      {
        q: "Is ZEVQYN free?",
        a: "ZEVQYN is free to start. Create an account and you can begin using research workspaces, the resume builder, and the portfolio builder right away.",
      },
      {
        q: "Do I need an account?",
        a: "Yes — research workspaces, documents, resumes and portfolios live in your private account, so signing in is required to use the app. Browsing the marketing pages, Resources articles, and public portfolio links needs no account.",
      },
    ],
  },
  {
    title: "Research",
    items: [
      {
        q: "What types of documents can I upload?",
        a: "You can upload PDF, DOCX, and TXT files into a research workspace. ZEVQYN parses the text, splits it into searchable chunks, and builds an index so you can chat with the content.",
      },
      {
        q: "How does ZEVQYN answer questions from my documents?",
        a: "When you ask a question, ZEVQYN searches your indexed documents for the most relevant passages (using vector embeddings) and an AI model composes an answer grounded in those passages — with citations pointing back to the source, so you can verify every claim.",
      },
      {
        q: "What is citation-backed AI?",
        a: "It means AI answers are tied to your actual documents. Instead of a free-floating response, each answer references the specific source it came from. If the AI can't find support in your documents, it won't invent one.",
      },
      {
        q: "Can AI responses contain mistakes?",
        a: (
          <>
            Yes. AI can misread documents, miss context, or phrase things inaccurately. Always
            verify important information against the cited source before relying on it — especially
            for coursework or graded work. See our <FaqLink href="/disclaimer">Disclaimer</FaqLink>{" "}
            for details.
          </>
        ),
      },
      {
        q: "Can I use ZEVQYN for academic research?",
        a: "Yes — it's built for exactly that: understanding papers, preparing for quizzes, and organizing study material. Use it as a study aid and follow your institution's academic-integrity rules; don't submit AI output as your own work.",
      },
    ],
  },
  {
    title: "Privacy",
    items: [
      {
        q: "Are my uploaded documents private?",
        a: "Yes. Workspaces and documents are private to your account by default. Nothing is shared unless you explicitly choose to publish something — like a public portfolio page.",
      },
      {
        q: "What information does ZEVQYN store?",
        a: (
          <>
            Your account details, the documents and workspaces you create, your AI interactions, and
            career content (resumes, portfolios). Full details are in our{" "}
            <FaqLink href="/privacy-policy">Privacy Policy</FaqLink>.
          </>
        ),
      },
      {
        q: "Can I delete my data?",
        a: (
          <>
            Yes. You can delete workspaces, documents, resumes and portfolios yourself at any time,
            and you can request full account deletion through our{" "}
            <FaqLink href="/contact">contact page</FaqLink>.
          </>
        ),
      },
    ],
  },
  {
    title: "Career",
    items: [
      {
        q: "Can ZEVQYN help with resumes?",
        a: "Yes. The resume builder helps you structure experience, projects, education, skills and certifications, with a clean ATS-friendly layout and PDF export.",
      },
      {
        q: "Can ZEVQYN help create a portfolio?",
        a: "Yes. Build a portfolio from your profile, projects and skills, add a profile picture, and publish it to a public link you can share with recruiters.",
      },
      {
        q: "Does ZEVQYN guarantee a job or internship?",
        a: "No — and no honest tool can. ZEVQYN helps you present your work better and plan your next steps with Career AI, but hiring outcomes depend on many factors outside the product.",
      },
    ],
  },
  {
    title: "Technical",
    items: [
      {
        q: "Which file formats are supported?",
        a: "PDF, DOCX, and TXT. For best results, use text-based PDFs rather than scanned images of pages.",
      },
      {
        q: "What should I do if a document cannot be processed?",
        a: (
          <>
            First check the file isn't corrupted or password-protected, and that it's under the size
            limit. Very large documents can take a while — the backend may also be waking up, so
            waiting a moment and retrying often works. If it still fails, reach out via our{" "}
            <FaqLink href="/contact">contact page</FaqLink> with the file type and size.
          </>
        ),
      },
    ],
  },
];

export const metadata: Metadata = {
  title: "FAQ — ZEVQYN",
  description:
    "Frequently asked questions about ZEVQYN: research workspaces, citation-backed AI, privacy, resumes, portfolios, and supported file formats.",
  alternates: { canonical: "https://zevqyn.dev/faq" },
  openGraph: {
    title: "FAQ — ZEVQYN",
    description: "Answers about ZEVQYN's research, privacy, and career features.",
    url: "https://zevqyn.dev/faq",
    type: "website",
  },
};

export default function Faq() {
  return (
    <MktShell>
      <MarketingHeader />
      <main className="mx-auto w-full max-w-3xl px-4 pb-8 pt-14 sm:px-6 sm:pt-20">
        <Reveal className="text-center">
          <Eyebrow>Help center</Eyebrow>
          <h1 className="font-display mt-4 text-4xl font-semibold tracking-[-0.02em] text-zinc-950 sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-zinc-600">
            Everything you need to know about research workspaces, privacy, and career tools.
          </p>
        </Reveal>
        <Reveal>
          <FaqAccordion groups={GROUPS} />
        </Reveal>
        <p className="mt-10 text-center text-sm text-zinc-500">
          Still stuck?{" "}
          <Link href="/contact" className="font-medium text-indigo-600 hover:text-indigo-700">
            Contact us
          </Link>{" "}
          — no account needed.
        </p>
      </main>
      <div className="pt-8">
        <CTABand
          title="Ready to research smarter?"
          sub="Create a free account and turn your documents into answers, study material, and career proof."
          cta="Create free account"
          href="/register"
        />
      </div>
      <MarketingFooter />
    </MktShell>
  );
}
