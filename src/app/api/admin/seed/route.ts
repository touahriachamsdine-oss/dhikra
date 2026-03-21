// This route is deprecated. Use /api/auth/seed instead.
import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { message: 'Moved. Use POST /api/auth/seed instead.' },
    { status: 301 }
  )
}
