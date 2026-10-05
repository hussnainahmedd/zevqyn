import { cn } from "@/lib/utils";

export interface PasswordCheck {
  valid: boolean;
  errors: string[];
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
}

export function checkPassword(pw: string): PasswordCheck {
  const errors: string[] = [];
  if (pw.length < 8) errors.push("at least 8 characters");
  if (!/[A-Z]/.test(pw)) errors.push("one capital letter (A–Z)");
  if (!/[a-z]/.test(pw)) errors.push("one small letter (a–z)");
  if (!/[0-9]/.test(pw)) errors.push("one number (0–9)");
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pw)) errors.push("one special character (!@#$%…)");

  let score: PasswordCheck["score"] = 0;
  if (pw.length > 0) {
    const met = 5 - errors.length;
    if (pw.length >= 12 && met === 5) score = 4;
    else if (met >= 4) score = 3;
    else if (met >= 3) score = 2;
    else if (met >= 2) score = 1;
  }
  const label = pw.length === 0 ? "" : score === 4 ? "Strong" : score === 3 ? "Good" : score === 2 ? "Fair" : "Weak";
  return { valid: errors.length === 0, errors, score, label };
}

const barColor = ["", "bg-rose-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500"];
const textColor = ["", "text-rose-600", "text-amber-600", "text-lime-700", "text-emerald-700"];

export function PasswordStrength({ password }: { password: string }) {
  const check = checkPassword(password);
  if (!password) return null;
  return (
    <div className="mt-2 space-y-2" aria-live="polite">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1" aria-hidden>
          {[1, 2, 3, 4].map(i => (
            <span key={i} className={cn("h-1.5 flex-1 rounded-full", i <= check.score ? barColor[check.score] : "bg-zinc-200")} />
          ))}
        </div>
        <span className={cn("text-xs font-semibold", textColor[check.score])}>{check.label}</span>
      </div>
      {check.errors.length > 0 && (
        <ul className="space-y-0.5 text-xs text-zinc-500">
          {check.errors.map(e => <li key={e}>· Needs {e}</li>)}
        </ul>
      )}
    </div>
  );
}
