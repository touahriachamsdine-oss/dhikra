import { NextResponse } from 'next/server'

export async function POST() {
    return NextResponse.json({ error: 'Trial mode is deprecated' }, { status: 410 })
}
