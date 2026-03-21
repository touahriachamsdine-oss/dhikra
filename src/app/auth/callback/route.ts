import { NextResponse } from 'next/server'

// This route was used for Supabase OAuth callback — no longer needed.
// Redirect to home safely.
export async function GET() {
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
}
