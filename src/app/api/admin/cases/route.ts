import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/cases — fetch all cases with user info
export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cases = await (prisma.case.findMany as any)({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, email: true, name: true, role: true, phoneNumber: true, nationalId: true },
      },
    },
  })

  return NextResponse.json({ cases })
}

// PATCH /api/admin/cases — update a case status
export async function PATCH(request: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { caseId, status } = await request.json()

  const VALID_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']
  if (!caseId || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const updated = await prisma.case.update({
    where: { id: caseId },
    data: { status },
  })

  return NextResponse.json({ case: updated })
}
