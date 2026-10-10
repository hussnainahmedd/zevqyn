/** Shared model-choice contract for the ZEVQYN AI selector.
 *  Values sent to the backend `model` field: "auto" (default) | "fast" | "smart" | "models" | "cloud" | "experimental".
 *  Technical provider ids are never shown prominently in the UI. */

export const AI_MODEL_STORAGE_KEY = "zevqyn-ai-model";

export type AiModelChoice = "auto" | "fast" | "smart" | "models" | "cloud" | "experimental";

export interface AiModelOption {
  value: AiModelChoice;
  label: string;
  subtitle: string;
}

export const AI_MODEL_OPTIONS: AiModelOption[] = [
  { value: "auto", label: "Auto — Recommended", subtitle: "Smart routing with fallback" },
  { value: "fast", label: "ZEVQYN Fast", subtitle: "Speed-optimized" },
  { value: "smart", label: "ZEVQYN Smart", subtitle: "Balanced quality" },
  { value: "models", label: "ZEVQYN Models", subtitle: "Open model router" },
  { value: "cloud", label: "Cloud AI", subtitle: "Cloud-hosted" },
  { value: "experimental", label: "Experimental", subtitle: "May be unstable" },
];

const CHOICE_VALUES = new Set<string>(AI_MODEL_OPTIONS.map((o) => o.value));

export function isAiModelChoice(v: unknown): v is AiModelChoice {
  return typeof v === "string" && CHOICE_VALUES.has(v);
}

/** Backend provider keys (e.g. provider_used) -> user-facing display names. */
const PROVIDER_DISPLAY: Record<string, string> = {
  groq: "ZEVQYN Fast",
  gemini: "ZEVQYN Smart",
  openrouter: "ZEVQYN Models",
  cloudflare: "Cloud AI",
  huggingface: "Experimental",
};

const CHOICE_DISPLAY: Record<AiModelChoice, string> = {
  auto: "Auto",
  fast: "ZEVQYN Fast",
  smart: "ZEVQYN Smart",
  models: "ZEVQYN Models",
  cloud: "Cloud AI",
  experimental: "Experimental",
};

/** Resolve either a user choice value or a backend provider key to a display name. */
export function aiDisplayName(v: string | undefined | null): string {
  if (!v) return "another AI";
  if (v in PROVIDER_DISPLAY) return PROVIDER_DISPLAY[v];
  if (isAiModelChoice(v)) return CHOICE_DISPLAY[v];
  return "another AI";
}
