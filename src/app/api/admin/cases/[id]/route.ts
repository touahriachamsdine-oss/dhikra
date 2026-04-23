import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser()

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const { id } = params
        const body = await request.json()
        const { status, adminNotes } = body

        const updatedCase = await (prisma.case.update as any)({
            where: { id },
            data: {
                ...(status && { status }),
                ...(adminNotes !== undefined && { adminNotes }),
            },
        })

        return NextResponse.json(updatedCase)
    } catch (error) {
        console.error('[ADMIN CASE PATCH]', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
