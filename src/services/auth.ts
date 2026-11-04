import { isSupabaseConfigured, supabase } from './supabase';

// Helpers for talking to Supabase.
// Keep database calls here (or in new files next to this one), not inside Phaser scenes.

export type RegisterRequest = {
  email: string;
  password: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
};

function requireConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Copy .env.example to .env and add your project URL and publishable key.',
    );
  }
}


// Reads all rows from the demo_messages table.
export async function register(request: RegisterRequest): Promise<RegisterResponse> {
  requireConfigured();

  const { data, error } = await supabase.auth.signUp({
    email: request.email,
    password: request.password,
    options: {
      emailRedirectTo: 'https://example.com/welcome',
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  console.log('User registered:', data);

  return { success: !!data, message: 'User registered successfully.' };
}

declare global {
  interface Window {
    register:  typeof register;
  }
}

export function installRegister() {
  window.register = register;
}
