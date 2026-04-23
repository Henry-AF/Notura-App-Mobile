import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseAuthStorage } from "./auth-storage.ts";

type AnySupabaseClient = SupabaseClient<any, "public", any>;

let cachedClient: AnySupabaseClient | null = null;

function readSupabaseEnv() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (typeof url !== "string" || url.length === 0) {
    throw new Error(
      "EXPO_PUBLIC_SUPABASE_URL nao configurado. Defina no ambiente do app mobile.",
    );
  }

  if (typeof anonKey !== "string" || anonKey.length === 0) {
    throw new Error(
      "EXPO_PUBLIC_SUPABASE_ANON_KEY nao configurado. Defina no ambiente do app mobile.",
    );
  }

  return { url, anonKey };
}

function createSupabaseClient(): AnySupabaseClient {
  const { url, anonKey } = readSupabaseEnv();
  const authStorage = createSupabaseAuthStorage(AsyncStorage);

  return createClient(url, anonKey, {
    auth: {
      storage: authStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
}

export function getSupabaseClient(): AnySupabaseClient {
  if (cachedClient === null) {
    cachedClient = createSupabaseClient();
  }

  return cachedClient;
}

export function getSupabaseAuth() {
  return getSupabaseClient().auth;
}

export async function getAccessToken(): Promise<string | null> {
  const { data } = await getSupabaseAuth().getSession();
  return data.session ? data.session.access_token : null;
}
