import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
    try {
        const user = await getCurrentUser()

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const files = await prisma.caseFile.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                case: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phoneNumber: true,
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json({ files })
    } catch (error) {
        console.error('[ADMIN FILES GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
