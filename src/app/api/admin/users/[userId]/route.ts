import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const { userId } = await params
        const body = await request.json()
        const { isBanned } = body

        if (typeof isBanned !== 'boolean') {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
        }

        if (userId === user.id) {
            return NextResponse.json({ error: 'Cannot ban yourself' }, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { isBanned }
        })

        return NextResponse.json({ ok: true, user: updatedUser })
    } catch (error) {
        console.error('[ADMIN USER BAN]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ userId: string }> }) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const { userId } = await params

        if (userId === user.id) {
            return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
        }

        // Because of onDelete: Cascade, cases and files will be deleted automatically
        await prisma.user.delete({
            where: { id: userId }
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('[ADMIN USER DELETE]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
