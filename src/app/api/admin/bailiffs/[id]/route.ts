import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const bailiffId = params.id

        // Check if bailiff exists
        const bailiff = await prisma.bailiff.findUnique({
            where: { id: bailiffId }
        })

        if (!bailiff) {
            return NextResponse.json({ error: 'Bailiff not found' }, { status: 404 })
        }

        // Delete bailiff
        await prisma.bailiff.delete({
            where: { id: bailiffId }
        })

        // Create notification
        await prisma.notification.create({
            data: {
                message: `Bailiff ${bailiff.name} has been deleted by an administrator.`,
                type: 'WARNING',
                // notify all admins? or just system-wide. 
                // For now, let's just create it. 
                // If userId is null, it's global or for the admin notification center.
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[ADMIN BAILIFF DELETE]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
