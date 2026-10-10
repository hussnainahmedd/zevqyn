"use client";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { SOURCE_MODE_OPTIONS, SourceMode } from "./sourceModes";

interface Props {
  value: SourceMode;
  onChange: (m: SourceMode) => void;
  className?: string;
}

/**
 * Segmented source-mode picker: Documents | Web | Both.
 * Matches the ZEVQYN design system (indigo/zinc, rounded-lg). Radio-group
 * semantics with arrow-key navigation; buttons are Tab-focusable too.
 */
export function SourceSelector({ value, onChange, className }: Props) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (idx + 1) % SOURCE_MODE_OPTIONS.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (idx - 1 + SOURCE_MODE_OPTIONS.length) % SOURCE_MODE_OPTIONS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = SOURCE_MODE_OPTIONS.length - 1;
    if (next !== null) {
      e.preventDefault();
      const opt = SOURCE_MODE_OPTIONS[next];
      onChange(opt.value);
      btnRefs.current[next]?.focus();
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Answer source"
      className={cn(
        "inline-flex h-9 items-center gap-0.5 rounded-lg border border-zinc-900/[0.15] bg-white p-1 shadow-sm",
        className
      )}
    >
      {SOURCE_MODE_OPTIONS.map((o, i) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => { btnRefs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={selected}
            title={o.subtitle}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "inline-flex h-7 items-center rounded-md px-3 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              selected
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
