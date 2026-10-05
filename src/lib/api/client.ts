import { env } from "../env";
import { supabase } from "../supabase";
/** Turn a FastAPI `detail` payload (string, 422 array, or object) into a readable message. */
function detailToMessage(detail: unknown): string | null {
  if (typeof detail === "string") { const t = detail.trim(); return t ? t : null; }
  if (Array.isArray(detail)) {
    const parts = detail.map((d) => (d && typeof d === "object" && "msg" in d ? String((d as { msg: unknown }).msg) : null)).filter((p): p is string => !!p);
    if (parts.length) return parts.join("; ");
  }
  if (detail && typeof detail === "object") { try { return JSON.stringify(detail); } catch { return null; } }
  return null;
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
/** True for low-level network failures (Render cold start, blip, offline). */
function isNetworkError(e: unknown) {
  return e instanceof TypeError && /failed to fetch|networkerror|load failed/i.test(e.message);
}
export async function apiFetch<T=unknown>(path: string, opts: RequestInit & { auth?: boolean } = {}): Promise<T> {
  const headers: Record<string,string> = { "Content-Type": "application/json", ...(opts.headers as Record<string,string>||{}) };
  if (opts.auth !== false) {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) headers["Authorization"] = `Bearer ${data.session.access_token}`;
  }
  const url = `${env.apiBase}${path}`;
  // Retry network-level failures (backend cold start on Render free tier can take ~30s to wake).
  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { ...opts, headers });
      if (res.status === 401) { if (typeof window !== "undefined" && opts.auth !== false) window.location.href = "/login"; throw new Error("Session expired. Please sign in again."); }
      if (!res.ok) { let msg = `Request failed (${res.status})`; try { const j = await res.json(); msg = detailToMessage((j as {detail?:unknown}).detail) || msg; } catch { try { msg = await res.text() || msg; } catch {} } throw new Error(msg); }
      if (res.status === 204) return undefined as T;
      const ct = res.headers.get("content-type")||""; if (ct.includes("application/pdf")) return res as unknown as T;
      return res.json() as Promise<T>;
    } catch (e) {
      lastErr = e;
      if (!isNetworkError(e) || attempt === 3) break;
      await sleep(2500 * (attempt + 1)); // 2.5s, 5s, 7.5s — covers a cold start
    }
  }
  if (isNetworkError(lastErr)) throw new Error("Could not reach the server. Check your connection and try again.");
  throw lastErr;
}
export function apiUrl(path:string){ return `${env.apiBase}${path}`; }
