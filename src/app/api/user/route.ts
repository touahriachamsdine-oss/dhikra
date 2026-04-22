import { NextResponse } from 'next/server'
import { hash, compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
    const session = await getCurrentUser()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
        where: { id: session.id },
        select: {
            id: true,
            email: true,
            name: true,
            nationalId: true,
            image: true,
            role: true,
        }
    })

    return NextResponse.json({ user })
}

export async function PATCH(request: Request) {
    const session = await getCurrentUser()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { name, image, currentPassword, newPassword } = await request.json()

        const user = await prisma.user.findUnique({ where: { id: session.id } })
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        const updateData: any = {}
        if (name !== undefined) updateData.name = name
        if (image !== undefined) updateData.image = image

        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: 'Current password required' }, { status: 400 })
            }
            const isMatch = await compare(currentPassword, user.password)
            if (!isMatch) {
                return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 })
            }
            updateData.password = await hash(newPassword, 12)
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.id },
            data: updateData,
        })

        return NextResponse.json({
            ok: true,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                image: updatedUser.image
            }
        })

    } catch (error) {
        console.error('[USER_PATCH]', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
