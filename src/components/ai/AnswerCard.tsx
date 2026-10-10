"use client";
import { useState } from "react";
import { Check, Copy, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Markdown } from "./Markdown";
import { aiDisplayName, type AiModelChoice } from "./models";

export interface AnswerCitation {
  source_label?: string;
  document_name?: string;
  page_number?: number;
  /** "document" for RAG document chunks, "web" for web-search sources. Defaults to document. */
  source_type?: "document" | "web";
  /** Web source URL. Never invent one — only render a link when present. */
  url?: string;
  /** Web source title. */
  title?: string;
}

/** Safe hostname for display, e.g. "nvidia.com". Returns "" when unparseable. */
function domainOf(url: string | undefined): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

interface FallbackInfo {
  requested: AiModelChoice;
  providerUsed?: string;
}

interface AnswerCardProps {
  title?: string;
  /** Markdown body. Use `children` instead for custom (structured) bodies. */
  markdown?: string;
  children?: React.ReactNode;
  citations?: AnswerCitation[];
  /** Backend provider key that served the request (provider_used). */
  providerUsed?: string;
  fallback?: FallbackInfo | null;
  /** Plain text for the Copy button. Omit to hide Copy. */
  copyText?: string;
  onRegenerate?: () => void;
  regenerating?: boolean;
  /** True while the first response is still loading (skeleton). */
  isLoading?: boolean;
  error?: string | null;
  emptyText?: string;
}

/** Sources section: groups citations into Documents and Web sources when both
 *  exist, with global [1][2][3] numbering. Web chips link out safely; document
 *  chips are non-interactive notes. */
function SourcesSection({ citations }: { citations: AnswerCitation[] }) {
  const docs = citations.filter((c) => c.source_type !== "web");
  const web = citations.filter((c) => c.source_type === "web");
  const grouped = web.length > 0 && docs.length > 0;
  let n = 0;

  const chipClass =
    "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2";

  const renderChip = (c: AnswerCitation) => {
    n += 1;
    const idx = n;
    if (c.source_type === "web") {
      const title = c.title || c.source_label || "Web source";
      const domain = domainOf(c.url);
      const tip = domain ? `${title} — ${domain}` : title;
      const inner = (
        <>
          <span className="shrink-0">[{idx}]</span>
          <span className="truncate">{title}{domain ? ` · ${domain}` : ""}</span>
        </>
      );
      const cls = cn(chipClass, "border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-500");
      // Never invent a URL: only link when one was actually returned.
      return c.url ? (
        <a key={idx} href={c.url} target="_blank" rel="noopener noreferrer" title={tip} aria-label={`Web source ${idx}: ${tip}`} className={cls}>
          {inner}
        </a>
      ) : (
        <span key={idx} tabIndex={0} role="note" title={tip} aria-label={`Web source ${idx}: ${tip}`} className={cn(cls, "cursor-default")}>
          {inner}
        </span>
      );
    }
    const name = c.source_label || c.document_name || `Source ${idx}`;
    const tip = `${name}${c.page_number ? ` — Page ${c.page_number}` : ""}`;
    return (
      <span
        key={idx}
        tabIndex={0}
        role="note"
        title={tip}
        aria-label={`Source ${idx}: ${tip}`}
        className={cn(chipClass, "cursor-default border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 focus-visible:ring-indigo-500")}
      >
        <span className="shrink-0">[{idx}]</span>
        <span className="truncate">{name}{c.page_number ? ` · p.${c.page_number}` : ""}</span>
      </span>
    );
  };

  const group = (label: string, items: AnswerCitation[]) => (
    <div>
      {grouped && <p className="text-xs font-medium text-zinc-500">{label}</p>}
      <div className={cn("flex flex-wrap gap-1.5", grouped && "mt-1.5")}>{items.map(renderChip)}</div>
    </div>
  );

  return (
    <div className="mt-4 border-t border-zinc-900/[0.06] pt-3">
      {!grouped && <p className="text-xs font-medium text-zinc-500">Sources</p>}
      <div className={cn("flex flex-col gap-3", !grouped && "mt-2")}>
        {docs.length > 0 && group("Documents", docs)}
        {web.length > 0 && group("Web sources", web)}
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div aria-label="Loading answer" role="status" className="animate-pulse space-y-3">
      <div className="h-3.5 w-11/12 rounded bg-zinc-200/70" />
      <div className="h-3.5 w-full rounded bg-zinc-200/70" />
      <div className="h-3.5 w-4/5 rounded bg-zinc-200/70" />
      <div className="h-3.5 w-3/5 rounded bg-zinc-200/70" />
    </div>
  );
}

export function AnswerCard({
  title = "ZEVQYN Answer",
  markdown,
  children,
  citations,
  providerUsed,
  fallback,
  copyText,
  onRegenerate,
  regenerating,
  isLoading,
  error,
  emptyText,
}: AnswerCardProps) {
  const [copied, setCopied] = useState(false);
  const hasContent = Boolean((markdown && markdown.trim()) || children);

  const doCopy = async () => {
    if (!copyText) return;
    try {
      await navigator.clipboard.writeText(copyText);
    } catch {
      // Clipboard API unavailable (permissions) — fall back to a textarea.
      const ta = document.createElement("textarea");
      ta.value = copyText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const modeLabel = providerUsed ? aiDisplayName(providerUsed) : null;
  // Fallback message must read naturally even if the backend omitted provider_used:
  // never surface the raw "another AI" placeholder.
  const fallbackActual = fallback?.providerUsed ? aiDisplayName(fallback.providerUsed) : aiDisplayName(fallback?.requested);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-900/[0.08] bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-900/[0.06] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
          <h3 className="truncate text-sm font-semibold text-zinc-900">{title}</h3>
        </div>
        {modeLabel && (
          <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
            {modeLabel}
          </span>
        )}
      </div>

      {fallback && (
        <p role="status" className="border-b border-amber-100 bg-amber-50/60 px-4 py-2 text-xs leading-relaxed text-amber-800">
          {fallback.requested === "auto"
            ? `Primary AI was temporarily at capacity. Answered with ${fallbackActual}.`
            : `${aiDisplayName(fallback.requested)} was temporarily unavailable. Answered with ${fallbackActual}.`}
        </p>
      )}

      {/* Body */}
      <div className="px-4 py-4">
        {error ? (
          <p role="alert" className="text-sm leading-relaxed text-rose-600">{error}</p>
        ) : isLoading && !hasContent ? (
          <Skeleton />
        ) : !hasContent && !isLoading ? (
          <p className="text-sm leading-relaxed text-zinc-400">{emptyText || "Ask a question about your documents to get a cited answer."}</p>
        ) : (
          <>
            {markdown ? <Markdown text={markdown} /> : children}
            {citations && citations.length > 0 && <SourcesSection citations={citations} />}
          </>
        )}
      </div>

      {/* Actions */}
      {(copyText || onRegenerate) && !error && (hasContent || isLoading) && (
        <div className="flex items-center gap-2 border-t border-zinc-900/[0.06] bg-zinc-50/60 px-4 py-2.5">
          {copyText && (
            <button
              type="button"
              onClick={doCopy}
              disabled={isLoading}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-900/[0.1] bg-white px-3 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isLoading || regenerating}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-900/[0.1] bg-white px-3 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", (isLoading || regenerating) && "animate-spin")} aria-hidden />
              {isLoading || regenerating ? "Working…" : "Regenerate"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
