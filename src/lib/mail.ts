import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Use a fallback domain if dhikra.dz is not yet verified in Resend
const FROM_EMAIL = "Taswiya <onboarding@resend.dev>";

export const sendVerificationEmail = async (email: string, token: string, lang: string = "ar") => {
    const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const confirmLink = `${domain}/api/auth/verify?token=${token}`;

    const subjects: Record<string, string> = {
        ar: "تفعيل حسابك - تسوية",
        fr: "Activez votre compte - Taswiya",
        en: "Activate your account - Taswiya"
    };

    const messages: Record<string, string> = {
        ar: `<h1>مرحباً بك في تسوية</h1><p>يرجى الضغط على الرابط التالي لتفعيل حسابك:</p><a href="${confirmLink}">تفعيل الحساب</a>`,
        fr: `<h1>Bienvenue sur Taswiya</h1><p>Veuillez cliquer sur le lien ci-dessous pour activer votre compte :</p><a href="${confirmLink}">Activer le compte</a>`,
        en: `<h1>Welcome to Taswiya</h1><p>Please click the link below to activate your account:</p><a href="${confirmLink}">Activate Account</a>`
    };

    await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: subjects[lang] || subjects.ar,
        html: messages[lang] || messages.ar
    });
};
