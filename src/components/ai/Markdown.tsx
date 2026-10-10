"use client";
import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

/** Fenced code block: dark, monospace, horizontal scroll, Copy button.
 *  Copy is always visible on touch, hover-revealed on desktop. */
function CodeBlock({ children }: { children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const doCopy = async () => {
    const text = preRef.current?.innerText ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API unavailable (permissions) — fall back to a textarea.
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="group relative mb-4 rounded-lg border border-zinc-900/[0.08] bg-zinc-950">
      <button
        type="button"
        onClick={doCopy}
        aria-label="Copy code"
        className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.06] px-2 py-1 text-[11px] font-medium text-zinc-300 transition hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
      >
        {copied ? <Check className="h-3 w-3 text-emerald-400" aria-hidden /> : <Copy className="h-3 w-3" aria-hidden />}
        {copied ? "Copied" : "Copy"}
      </button>
      <div className="overflow-x-auto rounded-lg">
        <pre ref={preRef} className="min-w-max p-3.5 pt-9 font-mono text-[13px] leading-relaxed text-zinc-100 md:pt-3.5">
          {children}
        </pre>
      </div>
    </div>
  );
}

/** remark plugin: turn [SOURCE_N] markers into styled citation chips.
 *  Skips fenced code blocks (their text is literal code). */
function remarkCitationMarkers() {
  const PAT = /\[SOURCE_(\d+)\]/g;
  const xform = (node: any): void => {
    if (!node || typeof node !== "object") return;
    const kids = node.children;
    if (!Array.isArray(kids)) return;
    const out: any[] = [];
    for (const child of kids) {
      if (child && child.type === "code") { out.push(child); continue; }
      if (child && child.type === "text" && typeof child.value === "string") {
        let last = 0, hit = false;
        PAT.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = PAT.exec(child.value))) {
          hit = true;
          if (m.index > last) out.push({ type: "text", value: child.value.slice(last, m.index) });
          out.push({ type: "cite-ref", data: { hName: "cite-ref", hProperties: { num: m[1] } } });
          last = m.index + m[0].length;
        }
        if (!hit) { out.push(child); continue; }
        if (last < child.value.length) out.push({ type: "text", value: child.value.slice(last) });
      } else {
        xform(child);
        out.push(child);
      }
    }
    node.children = out;
  };
  return (tree: any) => xform(tree);
}

/** ZEVQYN-styled Markdown renderer. Raw HTML is never rendered (no rehype-raw). */
const components: Components = {
  p: ({ children }) => <p className="mb-4 text-sm leading-7 text-zinc-800 last:mb-0">{children}</p>,
  h1: ({ children }) => <h1 className="mb-2.5 mt-6 text-xl font-bold tracking-tight text-zinc-900 first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-2.5 mt-6 text-lg font-bold tracking-tight text-zinc-900 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 mt-5 text-base font-semibold text-zinc-900 first:mt-0">{children}</h3>,
  h4: ({ children }) => <h4 className="mb-1.5 mt-4 text-sm font-semibold text-zinc-900 first:mt-0">{children}</h4>,
  ul: ({ children }) => <ul className="mb-4 list-disc space-y-2 pl-6 text-sm leading-7 text-zinc-800">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-zinc-800">{children}</ol>,
  li: ({ children }) => <li className="pl-1 marker:text-zinc-400">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mb-4 rounded-r-lg border-l-2 border-indigo-200 bg-indigo-50/50 py-2.5 pl-4 pr-3 text-sm leading-7 text-zinc-700 [&>p]:mb-2 [&>p]:last:mb-0">{children}</blockquote>
  ),
  code: ({ children, className }) => {
    // Inline code only — fenced blocks are handled by `pre` (CodeBlock).
    if (className) return <code className={className}>{children}</code>;
    return <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[13px] text-zinc-800">{children}</code>;
  },
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 underline decoration-indigo-200 underline-offset-2 hover:text-indigo-700">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto rounded-lg border border-zinc-900/[0.08]">
      <table className="w-full min-w-[560px] border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-zinc-100/80">{children}</thead>,
  th: ({ children }) => <th className="border-b border-zinc-900/10 px-3.5 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-zinc-600">{children}</th>,
  td: ({ children }) => <td className="border-b border-zinc-900/[0.05] px-3.5 py-2.5 align-top leading-6 text-zinc-800 last:border-b-0">{children}</td>,
  hr: () => <hr className="my-5 border-zinc-900/[0.08]" />,
  strong: ({ children }) => <strong className="font-semibold text-zinc-900">{children}</strong>,
  // Rendered from [SOURCE_N] by remarkCitationMarkers.
  ...({
    "cite-ref": ({ num }: any) => (
      <sup className="mx-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded bg-indigo-100 px-1 align-super text-[10px] font-bold leading-none text-indigo-700">
        {num ?? "?"}
      </sup>
    ),
  } as Record<string, React.ComponentType<any>>),
};

export function Markdown({ text, className }: { text: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkCitationMarkers]} components={components}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
