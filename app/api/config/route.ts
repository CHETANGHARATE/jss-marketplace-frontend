import { NextResponse } from 'next/server';

/**
 * GET /api/config
 *
 * Returns runtime configuration values from server-side environment variables.
 * This endpoint is called by the client on first load to get the correct API URL
 * without relying on NEXT_PUBLIC_ build-time inlining.
 *
 * Server-side env vars (without NEXT_PUBLIC_ prefix) are NOT baked into the
 * client bundle — they are resolved fresh on every request.
 */
export async function GET() {
  const apiBaseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://api.jsssolutions.in/api/v1';

  return NextResponse.json(
    { apiBaseUrl },
    {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
      },
    }
  );
}
