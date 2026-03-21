import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, description, documentType, plaintiffName, defendantName, amount } = body

        if (!title || !description) {
            return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
        }

        const newCase = await prisma.case.create({
            data: {
                title,
                description,
                documentType,
                plaintiffName,
                defendantName,
                amount: amount ? parseFloat(amount) : null,
                userId: user.id
            }
        })

        return NextResponse.json({ success: true, case: newCase }, { status: 201 })
    } catch (error) {
        console.error('[CASES POST]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET() {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const cases = await prisma.case.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ cases })
    } catch (error) {
        console.error('[CASES GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
