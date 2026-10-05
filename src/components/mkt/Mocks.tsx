import { FileText, Sparkles, CheckCircle2, Layers, Quote } from "lucide-react";

const win =
  "overflow-hidden rounded-2xl border border-zinc-900/10 bg-white shadow-[0_40px_80px_-24px_rgba(15,18,45,0.25)]";
const bar = "flex items-center gap-1.5 border-b border-zinc-900/[0.07] bg-zinc-50/80 px-4 py-2.5";

/** RAG chat with page-level citation chips */
export function ChatMock() {
  return (
    <div className={win}>
      <div className={bar}>
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
        <p className="ml-2 text-[11px] font-medium text-zinc-500">Research assistant · distributed_systems.pdf</p>
      </div>
      <div className="space-y-3 p-4">
        <div className="ml-auto w-fit max-w-[85%] rounded-xl rounded-br-sm bg-indigo-600 px-3.5 py-2.5 text-[12px] leading-relaxed text-white">
          What does section 3.2 say about embedding quantization?
        </div>
        <div className="w-fit max-w-[92%] rounded-xl rounded-bl-sm bg-zinc-100 px-3.5 py-2.5 text-[12px] leading-relaxed text-zinc-800">
          Section 3.2 reports lower inference latency when quantizing embedding layers, validating the
          architecture hypothesis.
        </div>
        <div className="flex flex-wrap gap-1.5 pl-1">
          {["p.14 · §3.2", "p.15 · fig.4", "p.18 · table 2"].map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700"
            >
              <Quote className="h-2.5 w-2.5" />
              {c}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <p className="text-[12px] text-zinc-400">Ask a follow-up grounded in the document…</p>
        </div>
      </div>
    </div>
  );
}

/** Parsed document with highlighted retrieved chunks */
export function DocMock() {
  return (
    <div className={win}>
      <div className={bar}>
        <FileText className="h-3.5 w-3.5 text-zinc-400" />
        <p className="text-[11px] font-medium text-zinc-500">distributed_inference.pdf · 24 pages parsed</p>
      </div>
      <div className="space-y-2.5 p-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`rounded-lg p-2.5 ${i === 1 ? "border border-indigo-200 bg-indigo-50/70" : "bg-zinc-50"}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold text-zinc-500">CHUNK {String(i + 1).padStart(2, "0")}</p>
              {i === 1 && (
                <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                  match 0.94
                </span>
              )}
            </div>
            <div className="mt-1.5 space-y-1">
              <div className={`h-1.5 rounded-full ${i === 1 ? "w-11/12 bg-indigo-300/70" : "w-full bg-zinc-200"}`} />
              <div className={`h-1.5 rounded-full ${i === 1 ? "w-4/5 bg-indigo-300/50" : "w-5/6 bg-zinc-200"}`} />
              <div className="h-1.5 w-3/5 rounded-full bg-zinc-200" />
            </div>
          </div>
        ))}
        <p className="flex items-center gap-1.5 pt-1 text-[10px] font-medium text-emerald-600">
          <CheckCircle2 className="h-3 w-3" /> Embedded · 768-dim · pgvector indexed
        </p>
      </div>
    </div>
  );
}

/** Resume card with verified bullets */
export function ResumeMock() {
  return (
    <div className={win}>
      <div className="flex items-center justify-between border-b border-zinc-900/[0.07] bg-zinc-50/80 px-4 py-2.5">
        <p className="text-[11px] font-medium text-zinc-500">Resume · sample preview</p>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          ATS-ready
        </span>
      </div>
      <div className="p-4">
        <p className="text-[14px] font-bold text-zinc-900">Alex Morgan</p>
        <p className="text-[10px] text-zinc-500">CS Student · AI & Web Development</p>
        <div className="mt-3 space-y-2">
          {[
            ["FastAPI Embedding Cache", "Python · pgvector · Docker"],
            ["Research → cited with sources", "from distributed_inference.pdf"],
          ].map(([t, s]) => (
            <div key={t} className="rounded-lg bg-zinc-50 p-2.5">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-800">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                {t}
              </p>
              <p className="mt-0.5 pl-4 text-[10px] text-zinc-500">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Project card generated from research */
export function ProjectMock() {
  return (
    <div className={win}>
      <div className={bar}>
        <Layers className="h-3.5 w-3.5 text-zinc-400" />
        <p className="text-[11px] font-medium text-zinc-500">Project proposal · from 3 sources</p>
      </div>
      <div className="p-4">
        <p className="text-[13px] font-bold text-zinc-900">Quantized Embedding Search</p>
        <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
          A pgvector-backed semantic search service applying §3.2 quantization findings.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["FastAPI", "pgvector", "Gemini", "Docker"].map((t) => (
            <span
              key={t}
              className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-medium text-zinc-600"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400" />
        </div>
        <p className="mt-1.5 text-[10px] text-zinc-500">Traced to 3 papers · 11 citations</p>
      </div>
    </div>
  );
}

/** Flashcard from study tools */
export function FlashMock() {
  return (
    <div className={`${win} p-5`}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-500">Flashcard 12 / 40</p>
      <p className="mt-2 text-[13px] font-semibold leading-snug text-zinc-900">
        Why does embedding quantization reduce inference latency?
      </p>
      <div className="mt-3 rounded-lg bg-indigo-50 p-2.5">
        <p className="text-[11px] leading-relaxed text-indigo-900">
          Smaller weight matrices fit in cache → fewer memory transfers per forward pass.
        </p>
      </div>
      <p className="mt-2 text-[10px] text-zinc-400">Generated from distributed_inference.pdf · p.14</p>
    </div>
  );
}
