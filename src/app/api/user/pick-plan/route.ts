import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: Request) {
    const session = await getCurrentUser()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { planName } = await request.json()

        if (!planName) {
            return NextResponse.json({ error: 'Plan name is required' }, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.id },
            data: {
                hasCard: true,
                plan: planName
            },
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
                hasCard: true,
                plan: true,
            }
        })

        return NextResponse.json({
            ok: true,
            user: updatedUser
        })

    } catch (error) {
        console.error('[PICK_PLAN_API]', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
