"use client";
import { useEffect, useRef, useState } from "react";
import { Brain, Check, ChevronDown, Cloud, FlaskConical, Layers, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { AI_MODEL_OPTIONS, AiModelChoice } from "./models";

const ICONS: Record<AiModelChoice, typeof Sparkles> = {
  auto: Sparkles,
  fast: Zap,
  smart: Brain,
  models: Layers,
  cloud: Cloud,
  experimental: FlaskConical,
};

interface Props {
  value: AiModelChoice;
  onChange: (m: AiModelChoice) => void;
  className?: string;
}

/** Compact AI model picker. Matches the ZEVQYN design system (indigo/zinc, rounded-lg). */
export function ModelSelector({ value, onChange, className }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const current = AI_MODEL_OPTIONS.find((o) => o.value === value) ?? AI_MODEL_OPTIONS[0];
  const CurrentIcon = ICONS[current.value];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open ]);

  return (
    <div ref={wrapRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-900/15 bg-white px-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <CurrentIcon className="h-4 w-4 text-indigo-600" aria-hidden />
        <span className="max-w-[10rem] truncate sm:max-w-none">{current.label}</span>
        <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label="AI model"
          className="absolute left-0 z-50 mt-2 w-64 max-w-[calc(100vw-3rem)] overflow-hidden rounded-xl border border-zinc-900/10 bg-white shadow-lg"
        >
          <ul className="max-h-80 overflow-y-auto py-1.5">
            {AI_MODEL_OPTIONS.map((o) => {
              const Icon = ICONS[o.value];
              const selected = o.value === value;
              return (
                <li key={o.value} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => { onChange(o.value); setOpen(false); }}
                    className={cn(
                      "flex min-h-[3rem] w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:bg-zinc-50",
                      selected && "bg-indigo-50/60 hover:bg-indigo-50"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", selected ? "text-indigo-600" : "text-zinc-400")} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-zinc-900">{o.label}</span>
                      <span className="block truncate text-xs text-zinc-500">{o.subtitle}</span>
                    </span>
                    {selected && <Check className="h-4 w-4 shrink-0 text-indigo-600" aria-hidden />}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-zinc-900/[0.06] px-3 py-2 text-[11px] leading-snug text-zinc-400">
            Routes across providers with automatic fallback when one is busy.
          </p>
        </div>
      )}
    </div>
  );
}
