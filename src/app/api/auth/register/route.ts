import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken, AUTH_COOKIE_OPTIONS } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password, name, nationalId } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        nationalId: nationalId || null,
        role: 'CUSTOMER',
      },
    })

    // Auto-login after registration
    const token = await signToken({ id: user.id, email: user.email, role: user.role })

    const response = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
    })

    response.cookies.set(AUTH_COOKIE_OPTIONS.name, token, AUTH_COOKIE_OPTIONS)
    return response

  } catch (error) {
    console.error('[REGISTER]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
