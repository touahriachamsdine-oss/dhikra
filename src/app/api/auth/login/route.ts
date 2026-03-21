import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken, AUTH_COOKIE_OPTIONS } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify password
    const passwordValid = await compare(password, user.password)
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Sign JWT
    const token = await signToken({ id: user.id, email: user.email, role: user.role })

    // Set httpOnly auth cookie
    const response = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
    })

    response.cookies.set(AUTH_COOKIE_OPTIONS.name, token, AUTH_COOKIE_OPTIONS)

    return response
  } catch (error) {
    console.error('[LOGIN]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
