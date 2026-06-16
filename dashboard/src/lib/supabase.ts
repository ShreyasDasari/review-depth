/**
 * Supabase client factory.
 * When env vars aren't set (local dev / build without config),
 * returns a stub object so the app compiles and pages render.
 * When env vars ARE set, creates a real Supabase client.
 */

type SupabaseClient = ReturnType<typeof createRealClient>;

function createRealClient() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function createStubClient(): SupabaseClient {
  return {
    auth: {
      signUp: async () => ({ data: null, error: null }),
      signInWithPassword: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      exchangeCodeForSession: async () => ({ data: null, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: () => ({
            limit: () => ({
              then: (resolve: any) => resolve({ data: [], error: null }),
            }),
          }),
        }),
      }),
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  } as unknown as SupabaseClient;
}

let client: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (client) return client;

  if (
    typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    client = createRealClient();
  } else {
    client = createStubClient();
  }

  return client;
}