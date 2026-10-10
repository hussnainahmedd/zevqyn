"use client";
import { X } from "lucide-react";
import { aiDisplayName, AiModelChoice } from "./models";

interface Props {
  /** The model choice the user had selected when the request ran. */
  requested: AiModelChoice;
  /** Backend provider key that actually served the request (provider_used). */
  providerUsed?: string;
  onDismiss: () => void;
}

/** Small, dismissible notice shown when the router fell back to another provider. Never shows raw errors. */
export function FallbackNotice({ requested, providerUsed, onDismiss }: Props) {
  const usedName = aiDisplayName(providerUsed);
  const text =
    requested === "auto"
      ? `Primary AI is temporarily at capacity. Continuing with ${usedName}.`
      : `${aiDisplayName(requested)} is temporarily at capacity. Continuing with ${usedName}.`;
  return (
    <div role="status" className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
      <p className="flex-1 leading-relaxed">{text}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notice"
        className="rounded p-0.5 text-amber-600 transition hover:bg-amber-100 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
}
