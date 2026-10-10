"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

/** ZEVQYN-styled Markdown renderer. Raw HTML is never rendered (no rehype-raw). */
const components: Components = {
  p: ({ children }) => <p className="mb-3 text-sm leading-relaxed text-zinc-800 last:mb-0">{children}</p>,
  h1: ({ children }) => <h1 className="mb-2 mt-4 text-lg font-semibold text-zinc-900 first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-2 mt-4 text-base font-semibold text-zinc-900 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-1.5 mt-3 text-sm font-semibold text-zinc-900 first:mt-0">{children}</h3>,
  h4: ({ children }) => <h4 className="mb-1 mt-2 text-sm font-semibold text-zinc-900 first:mt-0">{children}</h4>,
  ul: ({ children }) => <ul className="mb-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-800">{children}</ul>,
  ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-800">{children}</ol>,
  li: ({ children }) => <li className="pl-0.5">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-2 border-indigo-200 bg-indigo-50/50 py-2 pl-4 pr-3 text-sm leading-relaxed text-zinc-700 [&>p]:mb-1">{children}</blockquote>
  ),
  code: ({ children, className }) => {
    // Inline code only — fenced blocks are handled by `pre`.
    if (className) return <code className={className}>{children}</code>;
    return <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[13px] text-zinc-800">{children}</code>;
  },
  pre: ({ children }) => (
    <div className="mb-3 overflow-x-auto rounded-lg border border-zinc-900/[0.08] bg-zinc-950">
      <pre className="min-w-0 p-3.5 font-mono text-[13px] leading-relaxed text-zinc-100">{children}</pre>
    </div>
  ),
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 underline decoration-indigo-200 underline-offset-2 hover:text-indigo-700">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="mb-3 overflow-x-auto rounded-lg border border-zinc-900/[0.08]">
      <table className="w-full min-w-[480px] border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-zinc-50">{children}</thead>,
  th: ({ children }) => <th className="border-b border-zinc-900/[0.08] px-3 py-2 text-left text-xs font-semibold text-zinc-600">{children}</th>,
  td: ({ children }) => <td className="border-b border-zinc-900/[0.05] px-3 py-2 align-top text-zinc-800">{children}</td>,
  hr: () => <hr className="my-4 border-zinc-900/[0.08]" />,
  strong: ({ children }) => <strong className="font-semibold text-zinc-900">{children}</strong>,
};

export function Markdown({ text, className }: { text: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
