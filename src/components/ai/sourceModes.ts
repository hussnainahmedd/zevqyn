/** Shared source-mode contract for the Research Studio source selector.
 *  Values sent to the backend `source_mode` field: "documents" (default) | "web" | "both". */

export const SOURCE_MODE_STORAGE_KEY = "zevqyn-source-mode";

export type SourceMode = "documents" | "web" | "both";

export interface SourceModeOption {
  value: SourceMode;
  label: string;
  subtitle: string;
}

export const SOURCE_MODE_OPTIONS: SourceModeOption[] = [
  { value: "documents", label: "Documents", subtitle: "Your uploaded documents" },
  { value: "web", label: "Web", subtitle: "Current web sources" },
  { value: "both", label: "Both", subtitle: "Documents + web" },
];

const SOURCE_MODE_VALUES = new Set<string>(SOURCE_MODE_OPTIONS.map((o) => o.value));

export function isSourceMode(v: unknown): v is SourceMode {
  return typeof v === "string" && SOURCE_MODE_VALUES.has(v);
}

/** User-facing label for a source mode value. */
export function sourceModeLabel(v: string | undefined | null): string {
  const opt = SOURCE_MODE_OPTIONS.find((o) => o.value === v);
  return opt ? opt.label : "Documents";
}
