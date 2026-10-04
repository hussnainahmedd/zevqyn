import { createClient } from "@supabase/supabase-js";
import { env } from "./env";
export const supabase = createClient(env.supabaseUrl || "https://placeholder.supabase.co", env.supabaseAnonKey || "placeholder", { auth: { persistSession: true, autoRefreshToken: true } });
