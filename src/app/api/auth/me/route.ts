import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const sessionUser = await getCurrentUser()
  if (!sessionUser) return NextResponse.json({ user: null }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      hasCard: true,
      plan: true,
    }
  })

  if (!user) return NextResponse.json({ user: null }, { status: 401 })

  return NextResponse.json({ user })
}
