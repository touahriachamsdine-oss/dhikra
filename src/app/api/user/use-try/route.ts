import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST() {
    const session = await getCurrentUser()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.id }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        if (user.freeTries <= 0) {
            return NextResponse.json({ error: 'No free tries remaining' }, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.id },
            data: {
                freeTries: {
                    decrement: 1
                }
            },
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
                hasCard: true,
                plan: true,
                freeTries: true,
            }
        })

        return NextResponse.json({
            ok: true,
            user: updatedUser
        })

    } catch (error) {
        console.error('[USE_TRY]', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
