"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, ShieldCheck, FileText, Globe } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

type Language = "ar" | "fr" | "en";

const termsContent = {
  fr: {
    back: "Retour à l'accueil",
    title: "Conditions Générales d'Utilisation",
    lastUpdated: "Dernière mise à jour :",
    sections: [
      {
        icon: "FileText",
        title: "1. Préambule et Acceptation",
        content: "Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation de la plateforme Taswiya. En créant un compte ou en utilisant nos services, vous acceptez sans réserve ces CGU. Si vous n'acceptez pas ces conditions, vous devez cesser toute utilisation de la Plateforme."
      },
      {
        icon: "ShieldCheck",
        title: "2. Description des Services",
        content: "Taswiya est une plateforme numérique facilitant la gestion de dossiers juridiques, la génération de documents (mises en demeure, plaintes) et le suivi des litiges (logement, travail, automobile, etc.). Les documents générés sont automatisés et ne remplacent en aucun cas les conseils personnalisés d'un avocat ou d'un professionnel du droit."
      },
      {
        title: "3. Inscription et Sécurité du Compte",
        content: "Pour utiliser nos services, vous devez créer un compte en fournissant des informations exactes (nom, email, numéro de téléphone, pièce d'identité). Vous êtes responsable du maintien de la confidentialité de votre mot de passe et de toutes les activités effectuées sous votre compte. Taswiya se réserve le droit de suspendre tout compte contenant de fausses informations."
      },
      {
        title: "4. Obligations de l'Utilisateur",
        content: "Vous vous engagez à utiliser la Plateforme de manière légale et éthique. Il est strictement interdit de :\n- Fournir de fausses informations ou usurper l'identité d'un tiers.\n- Télécharger des documents contenant des virus, malwares ou contenus illicites.\n- Tenter d'interférer avec le bon fonctionnement de la Plateforme ou d'en compromettre la sécurité."
      },
      {
        title: "5. Propriété Intellectuelle",
        content: "Tous les éléments de la Plateforme (textes, logos, interfaces, algorithmes, modèles de documents) sont la propriété exclusive de Taswiya. Vous bénéficiez d'une licence limitée, non exclusive et non transférable pour utiliser la Plateforme à des fins personnelles et non commerciales."
      },
      {
        title: "6. Confidentialité et Données Personnelles",
        content: "Nous accordons une importance capitale à la protection de vos données. Vos documents, dossiers et informations personnelles sont chiffrés et stockés de manière sécurisée. Ils ne sont partagés qu'avec les professionnels habilités (ex: huissiers) si vous en faites la demande explicite. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données."
      },
      {
        title: "7. Limitation de Responsabilité",
        content: "Taswiya est soumis à une obligation de moyens concernant le fonctionnement de la Plateforme. Nous déclinons toute responsabilité en cas de dommages directs ou indirects résultant de l'utilisation de nos modèles de documents, de l'indisponibilité temporaire du service, ou de la perte de données échappant à notre contrôle technique."
      },
      {
        title: "8. Résiliation",
        content: "Vous pouvez supprimer votre compte à tout moment. Taswiya se réserve également le droit de suspendre ou de fermer votre compte sans préavis en cas de violation des présentes CGU."
      },
      {
        title: "9. Droit Applicable et Juridiction",
        content: "Les présentes CGU sont régies par la loi algérienne. En cas de litige relatif à l'interprétation ou à l'exécution de ces conditions, les tribunaux compétents d'Alger seront seuls compétents, à défaut de résolution à l'amiable."
      },
      {
        title: "10. Contact",
        content: "Pour toute question juridique ou demande d'assistance concernant ces CGU, veuillez nous contacter à : contact@taswiya.dz"
      }
    ],
    footer: "Taswiya. Tous droits réservés."
  },
  en: {
    back: "Back to Home",
    title: "Terms of Service",
    lastUpdated: "Last updated:",
    sections: [
      {
        icon: "FileText",
        title: "1. Preamble and Acceptance",
        content: "These Terms of Service govern your access to and use of the Taswiya platform. By creating an account or using our services, you fully accept these Terms. If you do not agree to these terms, you must cease using the Platform immediately."
      },
      {
        icon: "ShieldCheck",
        title: "2. Description of Services",
        content: "Taswiya is a digital platform facilitating the management of legal files, the generation of documents (demand letters, complaints), and the tracking of disputes (housing, labor, automotive, etc.). The generated documents are automated and in no way replace the personalized advice of a lawyer or legal professional."
      },
      {
        title: "3. Registration and Account Security",
        content: "To use our services, you must create an account by providing accurate information (name, email, phone number, national ID). You are responsible for maintaining the confidentiality of your password and all activities under your account. Taswiya reserves the right to suspend any account containing false information."
      },
      {
        title: "4. User Obligations",
        content: "You agree to use the Platform in a legal and ethical manner. It is strictly forbidden to:\n- Provide false information or impersonate a third party.\n- Upload documents containing viruses, malware, or illicit content.\n- Attempt to interfere with the proper functioning of the Platform or compromise its security."
      },
      {
        title: "5. Intellectual Property",
        content: "All elements of the Platform (texts, logos, interfaces, algorithms, document templates) are the exclusive property of Taswiya. You are granted a limited, non-exclusive, non-transferable license to use the Platform for personal, non-commercial purposes."
      },
      {
        title: "6. Confidentiality and Privacy",
        content: "We place the utmost importance on protecting your data. Your documents, files, and personal information are encrypted and securely stored. They are only shared with authorized professionals (e.g., bailiffs) if you explicitly request it. You have the right to access, rectify, and delete your data."
      },
      {
        title: "7. Limitation of Liability",
        content: "Taswiya is subject to a best-efforts obligation regarding the operation of the Platform. We disclaim all liability for direct or indirect damages resulting from the use of our document templates, temporary service unavailability, or data loss beyond our technical control."
      },
      {
        title: "8. Termination",
        content: "You may delete your account at any time. Taswiya also reserves the right to suspend or terminate your account without notice in the event of a breach of these Terms."
      },
      {
        title: "9. Governing Law and Jurisdiction",
        content: "These Terms are governed by Algerian law. In the event of a dispute relating to the interpretation or execution of these conditions, the competent courts of Algiers shall have exclusive jurisdiction, failing an amicable resolution."
      },
      {
        title: "10. Contact",
        content: "For any legal questions or support requests regarding these Terms, please contact us at: contact@taswiya.dz"
      }
    ],
    footer: "Taswiya. All rights reserved."
  },
  ar: {
    back: "العودة للرئيسية",
    title: "شروط وأحكام الاستخدام",
    lastUpdated: "آخر تحديث:",
    sections: [
      {
        icon: "FileText",
        title: "1. ديباجة وقبول",
        content: "تحكم شروط الاستخدام هذه وصولك إلى منصة تسوية واستخدامها. بإنشاء حساب أو استخدام خدماتنا، فإنك تقبل هذه الشروط بالكامل وبدون تحفظ. إذا كنت لا توافق على هذه الشروط، يجب عليك التوقف عن استخدام المنصة فوراً."
      },
      {
        icon: "ShieldCheck",
        title: "2. وصف الخدمات",
        content: "تسوية هي منصة رقمية تسهل إدارة الملفات القانونية، وإنشاء المستندات (الإنذارات، الشكاوى)، وتتبع النزاعات (السكن، العمل، السيارات، إلخ). المستندات المنشأة تكون آلية ولا تحل بأي حال من الأحوال محل الاستشارة المخصصة من محامٍ أو مختص قانوني."
      },
      {
        title: "3. التسجيل وأمان الحساب",
        content: "لاستخدام خدماتنا، يجب عليك إنشاء حساب بتقديم معلومات دقيقة (الاسم، البريد الإلكتروني، رقم الهاتف، بطاقة الهوية الوطنية). أنت مسؤول عن الحفاظ على سرية كلمة المرور الخاصة بك وجميع الأنشطة التي تتم تحت حسابك. تحتفظ منصة تسوية بالحق في تعليق أي حساب يحتوي على معلومات كاذبة."
      },
      {
        title: "4. التزامات المستخدم",
        content: "أنت توافق على استخدام المنصة بطريقة قانونية وأخلاقية. يُمنع منعاً باتاً:\n- تقديم معلومات كاذبة أو انتحال شخصية طرف ثالث.\n- تحميل مستندات تحتوي على فيروسات أو برامج ضارة أو محتوى غير قانوني.\n- محاولة التدخل في الأداء السليم للمنصة أو المساس بأمنها."
      },
      {
        title: "5. الملكية الفكرية",
        content: "جميع عناصر المنصة (النصوص، الشعارات، الواجهات، الخوارزميات، نماذج المستندات) هي ملكية حصرية لتسوية. تُمنح لك ترخيصاً محدوداً وغير حصري وغير قابل للتحويل لاستخدام المنصة لأغراض شخصية وغير تجارية."
      },
      {
        title: "6. السرية وحماية البيانات",
        content: "نحن نولي أهمية قصوى لحماية بياناتك. يتم تشفير مستنداتك وملفاتك ومعلوماتك الشخصية وتخزينها بشكل آمن. لا يتم مشاركتها إلا مع المهنيين المعتمدين (مثل المحضرين القضائيين) إذا طلبت ذلك صراحة. يحق لك الوصول إلى بياناتك وتصحيحها وحذفها."
      },
      {
        title: "7. حدود المسؤولية",
        content: "تخضع منصة تسوية لالتزام ببذل العناية فيما يتعلق بتشغيل المنصة. نحن نخلي مسؤوليتنا عن الأضرار المباشرة أو غير المباشرة الناتجة عن استخدام نماذج المستندات الخاصة بنا، أو عدم توفر الخدمة المؤقت، أو فقدان البيانات الخارج عن سيطرتنا التقنية."
      },
      {
        title: "8. إنهاء الحساب",
        content: "يمكنك حذف حسابك في أي وقت. تحتفظ منصة تسوية أيضاً بالحق في تعليق أو إغلاق حسابك دون إشعار مسبق في حال انتهاك هذه الشروط."
      },
      {
        title: "9. القانون المعمول به والاختصاص القضائي",
        content: "تخضع هذه الشروط للقانون الجزائري. في حال وجود نزاع يتعلق بتفسير أو تنفيذ هذه الشروط، تكون المحاكم المختصة في الجزائر العاصمة هي صاحبة الاختصاص الحصري، في حال عدم التوصل إلى حل ودي."
      },
      {
        title: "10. اتصل بنا",
        content: "لأي أسئلة قانونية أو طلبات دعم بخصوص هذه الشروط، يرجى التواصل معنا على: contact@taswiya.dz"
      }
    ],
    footer: "تسوية. جميع الحقوق محفوظة."
  }
};

export default function TermsOfService() {
  const [lang, setLang] = useState<Language>("ar");
  const isRtl = lang === "ar";
  const content = termsContent[lang];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-slate-950 font-sans text-gray-800 dark:text-gray-200 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <header className="flex justify-between items-center py-4 px-8 max-w-7xl mx-auto w-full border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className={`w-5 h-5 text-gray-500 ${isRtl ? 'rotate-180' : ''}`} />
            <span className="font-bold text-gray-600 dark:text-gray-300">{content.back}</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-full px-3 py-1.5 text-sm font-medium">
            <Globe className="w-4 h-4 text-gray-500" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-transparent border-none outline-none cursor-pointer text-gray-700 dark:text-gray-300"
            >
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6 sm:px-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{content.title}</h1>
          <p className="text-gray-500 dark:text-gray-400">{content.lastUpdated} {new Date().toLocaleDateString(lang === 'ar' ? 'ar-DZ' : (lang === 'fr' ? 'fr-DZ' : 'en-US'))}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 sm:p-12">
          {content.sections.map((section, index) => (
            <section key={index} className="mb-10 last:mb-0">
              <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 flex items-center gap-3 mb-4">
                {section.icon === "FileText" && <FileText className="w-6 h-6 flex-shrink-0" />}
                {section.icon === "ShieldCheck" && <ShieldCheck className="w-6 h-6 flex-shrink-0" />}
                <span>{section.title}</span>
              </h2>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                {section.content.split('\n').map((paragraph, pIndex) => (
                  <p key={pIndex} className={paragraph.startsWith('-') ? 'pl-4 sm:pl-6' : ''}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} {content.footer}</p>
      </footer>
    </div>
  );
}
