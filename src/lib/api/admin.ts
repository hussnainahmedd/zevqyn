"use client";

import { env } from "../env";

/**
 * Admin-panel API client. Uses the dedicated admin session token
 * (localStorage `zevqyn_admin_token`), completely separate from the
 * Supabase end-user session. A 401 here never redirects to /login —
 * the admin UI handles it by showing its own login screen.
 */

const TOKEN_KEY = "zevqyn_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export class AdminApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function adminFetch<T = unknown>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((opts.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${env.apiBase}${path}`, { ...opts, headers });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const j = (await res.json()) as { detail?: string };
      msg = j.detail || msg;
    } catch {
      try {
        msg = (await res.text()) || msg;
      } catch {
        /* keep default */
      }
    }
    throw new AdminApiError(msg, res.status);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export interface AdminUser {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string | null;
  last_sign_in_at: string | null;
  banned: boolean;
}

export interface AdminStats {
  users: number | null;
  workspaces: number | null;
  documents: number | null;
  projects: number | null;
  contact_messages: number | null;
}

export interface ContactMessage {
  id: string;
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  status?: string;
  created_at?: string;
}

export const adminApi = {
  login: (username: string, password: string) =>
    adminFetch<{ access_token: string; token_type: string }>(
      "/api/v1/admin/login",
      { method: "POST", body: JSON.stringify({ username, password }) }
    ),
  changePassword: (current_password: string, new_password: string) =>
    adminFetch<{ success: boolean }>(
      "/api/v1/admin/change-password",
      { method: "POST", body: JSON.stringify({ current_password, new_password }) }
    ),
  users: (page = 1, per_page = 50) =>
    adminFetch<AdminUser[]>(
      `/api/v1/admin/users?page=${page}&per_page=${per_page}`
    ),
  createUser: (b: { email: string; password: string; full_name?: string }) =>
    adminFetch<AdminUser>("/api/v1/admin/users", {
      method: "POST",
      body: JSON.stringify(b),
    }),
  updateUser: (
    id: string,
    b: { email?: string; password?: string; banned?: boolean }
  ) =>
    adminFetch<AdminUser>(`/api/v1/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(b),
    }),
  deleteUser: (id: string) =>
    adminFetch<{ success: boolean }>(`/api/v1/admin/users/${id}`, {
      method: "DELETE",
    }),
  stats: () => adminFetch<AdminStats>("/api/v1/admin/stats"),
  messages: () => adminFetch<ContactMessage[]>("/api/v1/contact/messages"),
  updateMessage: (id: string, b: { status: string }) =>
    adminFetch(`/api/v1/contact/messages/${id}`, {
      method: "PATCH",
      body: JSON.stringify(b),
    }),
};
