"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type AnyRec = Record<string, any>;

function Citations({ items }: { items?: AnyRec[] }) {
  if (!items?.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {items.map((c, i) => (
        <span key={i} className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
          {c.source_label || c.document_name || `Source ${i + 1}`}{c.page_number ? ` · p.${c.page_number}` : ""}
        </span>
      ))}
    </div>
  );
}

function SummaryView({ data }: { data: AnyRec }) {
  return (
    <div>
      <p className="text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">{data.summary}</p>
      <Citations items={data.citations} />
    </div>
  );
}

function KeyPointsView({ data }: { data: AnyRec }) {
  const points: AnyRec[] = data.key_points || [];
  if (!points.length) return <p className="text-sm text-zinc-500">No key points generated.</p>;
  return (
    <ul className="space-y-3">
      {points.map((kp, i) => (
        <li key={i} className="flex gap-3 rounded-xl border border-zinc-900/[0.07] bg-white p-4">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{i + 1}</span>
          <div className="min-w-0">
            <p className="text-sm leading-relaxed text-zinc-800">{kp.text}</p>
            <Citations items={kp.citations} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function QuestionsView({ data }: { data: AnyRec }) {
  const qs: AnyRec[] = data.questions || [];
  const [open, setOpen] = useState<number | null>(null);
  if (!qs.length) return <p className="text-sm text-zinc-500">No questions generated.</p>;
  const diffColor: Record<string, string> = {
    easy: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    hard: "bg-rose-100 text-rose-700",
  };
  return (
    <ul className="space-y-3">
      {qs.map((q, i) => (
        <li key={i} className="rounded-xl border border-zinc-900/[0.07] bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-zinc-900"><span className="text-zinc-400">Q{i + 1}.</span> {q.question}</p>
            {q.difficulty && <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", diffColor[q.difficulty.toLowerCase()] || "bg-zinc-100 text-zinc-600")}>{q.difficulty}</span>}
          </div>
          <button onClick={() => setOpen(open === i ? null : i)} className="mt-2 flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
            {open === i ? "Hide answer" : "Show answer"} <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open === i && "rotate-180")} />
          </button>
          {open === i && <p className="mt-2 rounded-lg bg-zinc-50 p-3 text-sm leading-relaxed text-zinc-700">{q.answer}</p>}
          <Citations items={q.citations} />
        </li>
      ))}
    </ul>
  );
}

function FlashcardsView({ data }: { data: AnyRec }) {
  const cards: AnyRec[] = data.flashcards || [];
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (!cards.length) return <p className="text-sm text-zinc-500">No flashcards generated.</p>;
  const card = cards[idx];
  const go = (d: number) => { setIdx((idx + d + cards.length) % cards.length); setFlipped(false); };
  return (
    <div>
      <div onClick={() => setFlipped(!flipped)} className="cursor-pointer rounded-2xl border border-zinc-900/[0.08] bg-white p-6 shadow-sm transition hover:shadow-md select-none" role="button" aria-label={flipped ? "Show question" : "Show answer"}>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">{flipped ? "Answer" : "Question"} · {idx + 1}/{cards.length}</p>
        <p className="mt-2 min-h-[72px] text-base leading-relaxed text-zinc-900">{flipped ? card.back : card.front}</p>
        <p className="mt-3 text-xs text-indigo-600">Tap to flip</p>
      </div>
      <Citations items={card.citations} />
      <div className="mt-4 flex items-center justify-between">
        <button onClick={() => go(-1)} className="rounded-lg border border-zinc-900/[0.1] px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">← Prev</button>
        <button onClick={() => go(1)} className="rounded-lg border border-zinc-900/[0.1] px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Next →</button>
      </div>
    </div>
  );
}

export function ResearchToolOutput({ tool, data }: { tool: string; data: AnyRec }) {
  return (
    <div className="rounded-2xl border border-zinc-900/[0.08] bg-[#FBFAF7] p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
        {tool === "summary" ? "Summary" : tool === "key-points" ? "Key points" : tool === "questions" ? "Practice questions" : "Flashcards"}
      </p>
      {tool === "summary" && <SummaryView data={data} />}
      {tool === "key-points" && <KeyPointsView data={data} />}
      {tool === "questions" && <QuestionsView data={data} />}
      {tool === "flashcards" && <FlashcardsView data={data} />}
    </div>
  );
}
