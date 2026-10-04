import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatDate(s?: string) { if (!s) return "—"; try { return new Date(s).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"}); } catch { return s; } }
