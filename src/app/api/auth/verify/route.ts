import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.redirect(new URL('/login?error=missing_token', request.url));
    }

    try {
        const user = await prisma.user.findUnique({
            where: { verificationToken: token }
        });

        if (!user) {
            return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                verificationToken: null // Clear token after use
            }
        });

        return NextResponse.redirect(new URL('/login?verified=true', request.url));
    } catch (error) {
        console.error('[VERIFY]', error);
        return NextResponse.redirect(new URL('/login?error=server_error', request.url));
    }
}
