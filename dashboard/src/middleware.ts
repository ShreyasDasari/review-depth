import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Auth middleware is disabled until Supabase is configured.
  // When ready, use @supabase/ssr's createServerClient here.
  // For now, pass through all requests.
  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};