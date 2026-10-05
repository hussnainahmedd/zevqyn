"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

type QA = { q: string; a: React.ReactNode };
export type Group = { title: string; items: QA[] };

function Item({ qa, open, onToggle, id }: { qa: QA; open: boolean; onToggle: () => void; id: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-900/[0.08] bg-white transition-shadow hover:shadow-[0_16px_40px_-24px_rgba(15,18,45,0.35)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        id={`${id}-button`}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:px-6"
      >
        <span className="font-display text-[15px] font-semibold tracking-tight text-zinc-950 sm:text-base">
          {qa.q}
        </span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-950/[0.04] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <ChevronDown className="h-4 w-4 text-zinc-600" />
        </span>
      </button>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 text-[15px] leading-relaxed text-zinc-600 sm:px-6">{qa.a}</div>
        </div>
      </div>
    </div>
  );
}

export function FaqAccordion({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState<string | null>("g0-i0");
  return (
    <div className="mt-12 space-y-10">
      {groups.map((g, gi) => (
        <section key={g.title} aria-label={g.title}>
          <h2 className="font-display text-xl font-semibold tracking-tight text-zinc-950">
            {g.title}
          </h2>
          <div className="mt-4 space-y-3">
            {g.items.map((qa, ii) => {
              const id = `g${gi}-i${ii}`;
              return (
                <Item key={id} id={id} qa={qa} open={open === id} onToggle={() => setOpen(open === id ? null : id)} />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export function FaqLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-medium text-indigo-600 hover:text-indigo-700">
      {children}
    </Link>
  );
}
