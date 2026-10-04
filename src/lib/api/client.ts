import { env } from "../env";
import { supabase } from "../supabase";
export async function apiFetch<T=unknown>(path: string, opts: RequestInit & { auth?: boolean } = {}): Promise<T> {
  const headers: Record<string,string> = { "Content-Type": "application/json", ...(opts.headers as Record<string,string>||{}) };
  if (opts.auth !== false) {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) headers["Authorization"] = `Bearer ${data.session.access_token}`;
  }
  const res = await fetch(`${env.apiBase}${path}`, { ...opts, headers });
  if (res.status === 401) { if (typeof window !== "undefined" && opts.auth !== false) window.location.href = "/login"; throw new Error("Session expired. Please sign in again."); }
  if (!res.ok) { let msg = `Request failed (${res.status})`; try { const j = await res.json(); msg = (j as {detail?:string}).detail || msg; } catch { try { msg = await res.text() || msg; } catch {} } throw new Error(msg); }
  if (res.status === 204) return undefined as T;
  const ct = res.headers.get("content-type")||""; if (ct.includes("application/pdf")) return res as unknown as T;
  return res.json() as Promise<T>;
}
export function apiUrl(path:string){ return `${env.apiBase}${path}`; }
