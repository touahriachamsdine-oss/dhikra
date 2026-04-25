import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
// In a real app, we'd use a storage provider. 
// For this demo/task, I'll simulate file storage and save the metadata.

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: caseId } = await params
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }


        // Verify case belongs to user or user is admin
        const existingCase = await prisma.case.findUnique({
            where: { id: caseId },
            select: { userId: true }
        })

        if (!existingCase) {
            return NextResponse.json({ error: 'Case not found' }, { status: 404 })
        }

        if (existingCase.userId !== user.id && user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const files = await prisma.caseFile.findMany({
            where: { caseId },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ files })
    } catch (error) {
        console.error('[CASE FILES GET]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: caseId } = await params
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { fileName, fileUrl, fileType } = body

        if (!fileName || !fileUrl) {
            return NextResponse.json({ error: 'File name and URL are required' }, { status: 400 })
        }

        // Verify case belongs to user
        const existingCase = await prisma.case.findUnique({
            where: { id: caseId },
            select: { userId: true }
        })

        if (!existingCase) {
            return NextResponse.json({ error: 'Case not found' }, { status: 404 })
        }

        if (existingCase.userId !== user.id && user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const caseFile = await prisma.caseFile.create({
            data: {
                fileName,
                fileUrl,
                fileType,
                caseId
            }
        })

        return NextResponse.json({ success: true, file: caseFile }, { status: 201 })
    } catch (error) {
        console.error('[CASE FILES POST]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
