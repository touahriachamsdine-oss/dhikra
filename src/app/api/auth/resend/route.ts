import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuid } from 'uuid';
import { sendVerificationEmail } from '@/lib/mail';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // We return 200 even if user doesn't exist to prevent email enumeration
            return NextResponse.json({ ok: true, message: 'If an account exists, a new link has been sent.' });
        }

        if (user.emailVerified) {
            return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
        }

        // Generate new token and update user
        const verificationToken = uuid();
        await prisma.user.update({
            where: { id: user.id },
            data: { verificationToken }
        });

        // Send email
        const lang = request.headers.get('accept-language')?.includes('fr') ? 'fr' : 'ar';
        await sendVerificationEmail(email, verificationToken, lang);

        return NextResponse.json({ ok: true, message: 'Verification email sent' });

    } catch (error) {
        console.error('[RESEND_VERIFICATION]', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
