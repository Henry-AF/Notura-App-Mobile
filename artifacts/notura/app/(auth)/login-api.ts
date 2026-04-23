import { z } from "zod";

import { getSupabaseAuth } from "../../lib/supabase.ts";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um email valido."),
  password: z.string().min(8, "A senha deve ter no minimo 8 caracteres."),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

interface LoginAuthClient {
  signInWithPassword: (credentials: LoginCredentials) => Promise<{
    data: { session: unknown | null; user: unknown | null };
    error: { message: string } | null;
  }>;
}

export class LoginApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoginApiError";
  }
}

export function parseLoginCredentials(input: unknown): LoginCredentials {
  return loginSchema.parse(input);
}

export async function loginWithPassword(
  input: unknown,
  authClient: LoginAuthClient = getSupabaseAuth(),
): Promise<void> {
  const credentials = parseLoginCredentials(input);
  const { error } = await authClient.signInWithPassword(credentials);

  if (error !== null) {
    throw new LoginApiError(error.message);
  }
}
