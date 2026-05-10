import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken, AUTH_COOKIE_OPTIONS } from '@/lib/auth'
import { v4 as uuid } from 'uuid'
import { sendVerificationEmail } from '@/lib/mail'

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
    const verificationToken = uuid()

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        nationalId: nationalId || null,
        role: 'CUSTOMER',
        verificationToken,
      },
    })

    // Send verification email
    try {
        const lang = request.headers.get('accept-language')?.includes('fr') ? 'fr' : 'ar';
        await sendVerificationEmail(email, verificationToken, lang);
    } catch (err) {
        console.error('Failed to send verification email', err);
        // We continue even if email fails, user can try to resend later (though we haven't implemented that yet)
    }

    return NextResponse.json({
      ok: true,
      message: 'Verification email sent',
      needsVerification: true
    })

  } catch (error) {
    console.error('[REGISTER]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
