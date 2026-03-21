import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// One-time admin account seeder
// Call: POST /api/auth/seed  { "setupKey": "DHIKRA_SETUP_2026" }
// After first use, remove or lock this endpoint.

const SETUP_KEY = process.env.SETUP_KEY || 'DHIKRA_SETUP_2026'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@dhikra.dz'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Dhikra@Admin2026!'

export async function POST(request: Request) {
  try {
    const { setupKey } = await request.json()

    if (setupKey !== SETUP_KEY) {
      return NextResponse.json({ error: 'Invalid setup key' }, { status: 403 })
    }

    // Check if admin already exists
    const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } })
    if (existing) {
      return NextResponse.json({
        message: 'Admin already exists.',
        credentials: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      })
    }

    const hashedPassword = await hash(ADMIN_PASSWORD, 12)

    const admin = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        name: 'Administrateur',
        role: 'ADMIN',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Admin account created.',
      credentials: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      userId: admin.id,
    })
  } catch (error) {
    console.error('[SEED]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
