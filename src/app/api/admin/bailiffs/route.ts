import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const bailiffs = await prisma.bailiff.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ bailiffs })
    } catch (error) {
        console.error('[ADMIN BAILIFFS GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await request.json()
        const { name, email, phoneNumber, address, city } = body

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        const bailiff = await prisma.bailiff.create({
            data: { name, email, phoneNumber, address, city }
        })

        return NextResponse.json({ bailiff }, { status: 201 })
    } catch (error) {
        console.error('[ADMIN BAILIFFS POST]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
