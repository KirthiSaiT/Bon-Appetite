import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/clerk-react";
import { useMemo } from "react";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && key);

export const ADMIN_EMAIL = (
  (import.meta.env.VITE_ADMIN_EMAIL as string | undefined) ?? "admin.bonappetit@gmail.com"
).toLowerCase();

/** Anonymous client: public reads (prices, workshops) and booking inserts. */
export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url!, key!, { auth: { persistSession: false } })
  : null;

/**
 * Client that sends the signed-in user's Clerk token (JWT template "supabase"),
 * so row level security can recognise the admin. Falls back to anonymous.
 */
export const useSupabase = (): SupabaseClient | null => {
  const { getToken, isSignedIn } = useAuth();
  return useMemo(() => {
    if (!supabaseConfigured) return null;
    if (!isSignedIn) return supabase;
    return createClient(url!, key!, {
      accessToken: async () => (await getToken({ template: "supabase" })) ?? null,
    });
  }, [getToken, isSignedIn]);
};
