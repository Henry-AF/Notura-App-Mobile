import { z } from "zod";

import { getSupabaseAuth } from "../../lib/supabase.ts";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um email valido."),
  password: z.string().min(8, "A senha deve ter no minimo 8 caracteres."),
});

export type RegisterPayload = z.infer<typeof registerSchema>;

export interface RegisterResult {
  requiresEmailConfirmation: boolean;
}

interface RegisterAuthClient {
  signUp: (payload: {
    email: string;
    password: string;
    options: {
      data: {
        name: string;
      };
    };
  }) => Promise<{
    data: { session: unknown | null; user: unknown | null };
    error: { message: string } | null;
  }>;
}

export class RegisterApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegisterApiError";
  }
}

export function parseRegisterPayload(input: unknown): RegisterPayload {
  return registerSchema.parse(input);
}

export async function registerWithPassword(
  input: unknown,
  authClient: RegisterAuthClient = getSupabaseAuth(),
): Promise<RegisterResult> {
  const payload = parseRegisterPayload(input);
  const { data, error } = await authClient.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        name: payload.name,
      },
    },
  });

  if (error !== null) {
    throw new RegisterApiError(error.message);
  }

  return {
    requiresEmailConfirmation: data.session === null,
  };
}
