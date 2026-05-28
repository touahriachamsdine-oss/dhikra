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
        title: "1. Préambule et Acceptation des Conditions",
        content: "Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les modalités et conditions dans lesquelles la plateforme Taswiya met à la disposition de ses utilisateurs ses services numériques. L'utilisation de la plateforme implique l'acceptation pleine et entière des présentes CGU par l'utilisateur. En accédant à Taswiya, en créant un compte ou en utilisant l'une de nos fonctionnalités, vous reconnaissez avoir pris connaissance de ces CGU et vous engagez à les respecter sans réserve. Si vous êtes en désaccord avec l'une de ces dispositions, vous êtes invité à cesser immédiatement toute utilisation de nos services."
      },
      {
        icon: "ShieldCheck",
        title: "2. Description Détaillée des Services",
        content: "Taswiya est une solution logicielle innovante conçue pour simplifier la gestion des litiges, la création de dossiers juridiques et l'émission de documents automatisés tels que des mises en demeure et des lettres de réclamation. La plateforme couvre plusieurs catégories de litiges : immobilier, droit du travail, automobile, familial et litiges commerciaux généraux.\n\nIl est expressément précisé que Taswiya n'est pas un cabinet d'avocats. Les documents générés le sont à partir de modèles automatisés et ne constituent en aucun cas un avis juridique personnalisé. Pour tout conseil spécifique à votre situation, nous vous recommandons vivement de consulter un avocat ou un professionnel du droit qualifié."
      },
      {
        title: "3. Création de Compte et Obligations de Sécurité",
        content: "L'accès à la majorité des fonctionnalités de Taswiya nécessite la création d'un compte utilisateur. Lors de l'inscription, vous vous engagez à fournir des informations exactes, complètes et à jour, notamment votre identité réelle, votre adresse e-mail, votre numéro de téléphone et, le cas échéant, les documents justificatifs requis.\n\nL'utilisateur est seul responsable de la sécurité et de la confidentialité de ses identifiants de connexion. Toute action effectuée depuis votre compte sera présumée avoir été réalisée par vous. En cas d'utilisation frauduleuse de votre compte ou de faille de sécurité, vous êtes tenu d'en informer immédiatement le support de Taswiya. Nous nous réservons le droit de suspendre temporairement ou définitivement tout compte dont les informations s'avèrent erronées ou en cas de suspicion d'usurpation d'identité."
      },
      {
        title: "4. Règles de Conduite et Utilisation Acceptable",
        content: "En utilisant Taswiya, vous vous engagez formellement à adopter un comportement conforme aux lois en vigueur et aux bonnes mœurs. Il est strictement interdit de :\n\n- Fournir des informations intentionnellement fausses, trompeuses ou diffamatoires dans vos dossiers.\n- Utiliser la plateforme pour harceler, menacer ou extorquer des tiers.\n- Télécharger des fichiers corrompus, des virus, des chevaux de Troie ou tout autre code malveillant susceptible de nuire au fonctionnement de la plateforme.\n- Tenter de contourner les systèmes de sécurité, de procéder à de l'ingénierie inverse sur nos algorithmes ou d'accéder à des données qui ne vous sont pas destinées.\n\nToute violation de ces règles pourra entraîner la suspension immédiate de votre compte, sans préjudice de poursuites judiciaires."
      },
      {
        title: "5. Propriété Intellectuelle",
        content: "L'ensemble des éléments constituant la plateforme Taswiya (structure, design, interfaces, bases de données, textes, images, logos, algorithmes de génération de documents) est protégé par le droit de la propriété intellectuelle et reste la propriété exclusive de Taswiya ou de ses concédants.\n\nTaswiya vous concède une licence personnelle, révocable, non exclusive et non transférable d'utilisation de la plateforme et des documents générés, pour vos besoins propres. Toute reproduction, représentation, modification, publication, transmission ou dénaturation, totale ou partielle, de la plateforme ou de son contenu, par quelque procédé que ce soit, est formellement interdite sans l'autorisation expresse et préalable de Taswiya."
      },
      {
        title: "6. Politique de Confidentialité et Traitement des Données",
        content: "La protection de votre vie privée et de vos données à caractère personnel est au cœur de nos préoccupations. Taswiya collecte, stocke et traite vos données conformément aux normes de sécurité les plus strictes. \n\nLes informations saisies dans vos dossiers, ainsi que les documents téléchargés, sont chiffrés. Ils sont strictement confidentiels et ne seront jamais vendus à des tiers. Le partage de ces informations n'intervient qu'à votre demande expresse (par exemple, lors de la transmission d'un dossier à un huissier partenaire). Conformément à la réglementation applicable, vous disposez d'un droit d'accès, de rectification, de portabilité et d'effacement de vos données personnelles."
      },
      {
        title: "7. Responsabilité et Garanties",
        content: "Taswiya s'efforce d'assurer un accès continu et optimal à la plateforme, sous réserve des périodes de maintenance technique. Toutefois, nous sommes tenus à une obligation de moyens et non de résultat.\n\nTaswiya ne saurait être tenue pour responsable :\n- Des éventuelles erreurs, inexactitudes ou omissions dans les documents générés par l'utilisateur si ce dernier a fourni des informations erronées.\n- Des conséquences juridiques découlant de l'utilisation des documents téléchargés depuis la plateforme.\n- Des interruptions de service liées au réseau internet ou à des cas de force majeure."
      },
      {
        title: "8. Durée et Résiliation",
        content: "Les présentes CGU sont conclues pour une durée indéterminée à compter de votre première utilisation de la plateforme.\n\nVous êtes libre de fermer votre compte à tout moment via les paramètres de votre espace personnel. De son côté, Taswiya se réserve le droit, à sa seule discrétion et sans préavis, de suspendre ou de supprimer votre accès en cas de manquement grave aux présentes conditions, de comportement illicite ou de fraude, sans qu'aucune indemnité ne puisse être réclamée."
      },
      {
        title: "9. Droit Applicable et Règlement des Litiges",
        content: "Les présentes Conditions Générales d'Utilisation sont soumises à la législation algérienne.\n\nEn cas de différend relatif à la validité, l'interprétation ou l'exécution des présentes CGU, les parties s'engagent à rechercher en priorité une solution amiable. À défaut d'accord amiable dans un délai d'un mois, le litige sera porté devant les tribunaux compétents d'Alger, nonobstant la pluralité de défendeurs ou l'appel en garantie."
      },
      {
        title: "10. Modifications des CGU et Contact",
        content: "Taswiya se réserve le droit de modifier les présentes CGU à tout moment afin de les adapter aux évolutions techniques ou légales de nos services. Les utilisateurs seront informés de toute modification substantielle par e-mail ou via une notification sur la plateforme. Le fait de continuer à utiliser les services après la publication des modifications vaut acceptation de ces dernières.\n\nPour toute question, demande de clarification ou réclamation, notre équipe est à votre disposition par courrier électronique à l'adresse suivante : contact@taswiya.dz"
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
        title: "1. Preamble and Acceptance of Terms",
        content: "These Terms of Service (hereinafter \"Terms\") outline the rules and regulations for the use of the Taswiya digital platform. By accessing this platform, creating an account, or using our features, you acknowledge that you have read, understood, and agree to be fully bound by these Terms. If you disagree with any part of these conditions, you must immediately discontinue your use of our services."
      },
      {
        icon: "ShieldCheck",
        title: "2. Detailed Description of Services",
        content: "Taswiya is an innovative software solution designed to streamline dispute management, legal file creation, and the automated generation of documents such as formal demand letters and complaints. The platform covers various dispute categories including real estate, labor law, automotive, and general civil disputes.\n\nIt is expressly stated that Taswiya is not a law firm. The documents generated are based on automated templates and under no circumstances constitute personalized legal advice. For any advice specific to your legal situation, we strongly recommend consulting a qualified lawyer or legal professional."
      },
      {
        title: "3. Account Creation and Security Obligations",
        content: "Access to most Taswiya features requires the creation of a user account. During registration, you agree to provide accurate, complete, and up-to-date information, including your real identity, email address, phone number, and any necessary supporting documents.\n\nYou are solely responsible for maintaining the security and confidentiality of your login credentials. Any action performed under your account will be presumed to have been carried out by you. In the event of fraudulent use of your account or a security breach, you are required to notify Taswiya support immediately. We reserve the right to temporarily or permanently suspend any account found to contain false information or suspected of identity theft."
      },
      {
        title: "4. Code of Conduct and Acceptable Use",
        content: "By using Taswiya, you formally agree to behave in compliance with applicable laws and ethical standards. It is strictly prohibited to:\n\n- Provide intentionally false, misleading, or defamatory information in your files.\n- Use the platform to harass, threaten, or extort third parties.\n- Upload corrupted files, viruses, Trojans, or any other malicious code likely to harm the platform's operation.\n- Attempt to bypass security systems, reverse-engineer our algorithms, or access data not intended for you.\n\nAny violation of these rules may result in the immediate suspension of your account, without prejudice to legal action."
      },
      {
        title: "5. Intellectual Property",
        content: "All elements constituting the Taswiya platform (structure, design, interfaces, databases, texts, images, logos, document generation algorithms) are protected by intellectual property rights and remain the exclusive property of Taswiya or its licensors.\n\nTaswiya grants you a personal, revocable, non-exclusive, and non-transferable license to use the platform and generated documents for your own needs. Any reproduction, representation, modification, publication, transmission, or distortion, in whole or in part, of the platform or its content, by any means whatsoever, is strictly prohibited without the express prior consent of Taswiya."
      },
      {
        title: "6. Privacy Policy and Data Processing",
        content: "The protection of your privacy and personal data is our core concern. Taswiya collects, stores, and processes your data in accordance with the strictest security standards.\n\nThe information entered in your files, as well as uploaded documents, are encrypted. They are strictly confidential and will never be sold to third parties. Sharing this information only occurs at your express request (for example, when forwarding a file to a partner bailiff). In accordance with applicable regulations, you have the right to access, rectify, port, and erase your personal data."
      },
      {
        title: "7. Liability and Warranties",
        content: "Taswiya strives to ensure continuous and optimal access to the platform, subject to technical maintenance periods. However, we are bound by an obligation of means and not of results.\n\nTaswiya cannot be held liable for:\n- Any errors, inaccuracies, or omissions in the documents generated by the user if the latter provided incorrect information.\n- The legal consequences arising from the use of documents downloaded from the platform.\n- Service interruptions related to the internet network or force majeure events."
      },
      {
        title: "8. Term and Termination",
        content: "These Terms are concluded for an indefinite period starting from your first use of the platform.\n\nYou are free to close your account at any time via your personal space settings. Taswiya reserves the right, at its sole discretion and without notice, to suspend or terminate your access in the event of a serious breach of these terms, illegal behavior, or fraud, without any compensation being claimable."
      },
      {
        title: "9. Governing Law and Dispute Resolution",
        content: "These Terms of Service are governed by Algerian law.\n\nIn the event of a dispute relating to the validity, interpretation, or execution of these Terms, the parties agree to seek an amicable solution as a priority. Failing an amicable agreement within one month, the dispute will be brought before the competent courts of Algiers, notwithstanding multiple defendants or third-party claims."
      },
      {
        title: "10. Modifications to the Terms and Contact",
        content: "Taswiya reserves the right to modify these Terms at any time to adapt them to technical or legal developments of our services. Users will be informed of any substantial changes by email or via a notification on the platform. Continuing to use the services after the publication of modifications constitutes acceptance of the latter.\n\nFor any questions, requests for clarification, or complaints, our team is at your disposal by email at the following address: contact@taswiya.dz"
      }
    ],
    footer: "Taswiya. All rights reserved."
  },
  ar: {
    back: "العودة للرئيسية",
    title: "الشروط العامة للاستخدام",
    lastUpdated: "آخر تحديث:",
    sections: [
      {
        icon: "FileText",
        title: "1. الديباجة وقبول الشروط",
        content: "تهدف هذه الشروط العامة للاستخدام (يشار إليها فيما يلي بـ \"الشروط\") إلى تحديد القواعد والبنود التي توفر بموجبها منصة \"تسوية\" خدماتها الرقمية لمستخدميها. استخدام المنصة يعني القبول الكامل والتام لهذه الشروط من قبل المستخدم. بمجرد وصولك إلى تسوية، أو إنشاء حساب، أو استخدام أي من ميزاتنا، فإنك تقر بأنك قد قرأت هذه الشروط وتتعهد بالالتزام بها دون تحفظ. إذا كنت لا توافق على أي من هذه الأحكام، يُطلب منك التوقف فوراً عن استخدام خدماتنا."
      },
      {
        icon: "ShieldCheck",
        title: "2. الوصف التفصيلي للخدمات",
        content: "تسوية هي حل برمجي مبتكر مصمم لتبسيط إدارة النزاعات، وإنشاء الملفات القانونية، واستخراج المستندات الآلية مثل الإنذارات ورسائل المطالبة. تغطي المنصة عدة فئات من النزاعات: العقارات، قانون العمل، السيارات، الأسرة، والنزاعات التجارية العامة.\n\nيُذكر صراحة أن منصة تسوية ليست مكتب محاماة. يتم إنشاء المستندات بناءً على نماذج آلية ولا تشكل بأي حال من الأحوال استشارة قانونية مخصصة. للحصول على أي نصيحة خاصة بحالتك، نوصي بشدة باستشارة محامٍ أو متخصص قانوني مؤهل."
      },
      {
        title: "3. إنشاء الحساب والتزامات الأمان",
        content: "يتطلب الوصول إلى معظم ميزات تسوية إنشاء حساب مستخدم. أثناء التسجيل، تتعهد بتقديم معلومات دقيقة وكاملة ومحدثة، بما في ذلك هويتك الحقيقية، عنوان بريدك الإلكتروني، رقم هاتفك، والمستندات الداعمة المطلوبة إن وجدت.\n\nالمستخدم هو المسؤول الوحيد عن أمان وسرية بيانات تسجيل الدخول الخاصة به. أي إجراء يتم اتخاذه من حسابك سيُفترض أنك من قمت به. في حالة الاستخدام الاحتيالي لحسابك أو حدوث خرق أمني، يُطلب منك إبلاغ دعم تسوية على الفور. نحتفظ بالحق في تعليق أي حساب يتبين أن معلوماته خاطئة أو في حالة الاشتباه في سرقة الهوية بشكل مؤقت أو دائم."
      },
      {
        title: "4. قواعد السلوك والاستخدام المقبول",
        content: "باستخدامك لتسوية، تتعهد رسمياً بتبني سلوك يتوافق مع القوانين المعمول بها والأخلاق العامة. يُمنع منعاً باتاً:\n\n- تقديم معلومات كاذبة أو مضللة أو تشهيرية عن قصد في ملفاتك.\n- استخدام المنصة لمضايقة أو تهديد أو ابتزاز أطراف ثالثة.\n- تحميل ملفات تالفة، أو فيروسات، أو فيروسات أحصنة طروادة، أو أي رموز ضارة أخرى من شأنها الإضرار بعمل المنصة.\n- محاولة التحايل على أنظمة الأمان، أو إجراء هندسة عكسية لخوارزمياتنا، أو الوصول إلى بيانات غير مخصصة لك.\n\nأي انتهاك لهذه القواعد قد يؤدي إلى التعليق الفوري لحسابك، دون الإخلال بالمتابعات القضائية."
      },
      {
        title: "5. الملكية الفكرية",
        content: "جميع العناصر المكونة لمنصة تسوية (الهيكلة، التصميم، الواجهات، قواعد البيانات، النصوص، الصور، الشعارات، خوارزميات إنشاء المستندات) محمية بموجب قانون الملكية الفكرية وتبقى الملكية الحصرية لتسوية أو المرخصين لها.\n\nتمنحك تسوية ترخيصاً شخصياً، قابلاً للإلغاء، غير حصري، وغير قابل للتحويل لاستخدام المنصة والمستندات المنشأة لاحتياجاتك الخاصة. يُحظر تماماً أي استنساخ، أو تمثيل، أو تعديل، أو نشر، أو نقل، أو تشويه، كلياً أو جزئياً، للمنصة أو محتواها، بأي وسيلة كانت، دون الحصول على إذن صريح ومسبق من تسوية."
      },
      {
        title: "6. سياسة الخصوصية ومعالجة البيانات",
        content: "حماية خصوصيتك وبياناتك الشخصية هي في صميم اهتماماتنا. تقوم تسوية بجمع وتخزين ومعالجة بياناتك وفقاً لأعلى معايير الأمان.\n\nيتم تشفير المعلومات المدخلة في ملفاتك، وكذلك المستندات المحملة. إنها سرية للغاية ولن يتم بيعها أبدًا لأطراف ثالثة. لا يتم مشاركة هذه المعلومات إلا بناءً على طلب صريح منك (على سبيل المثال، عند إرسال ملف إلى محضر قضائي شريك). وفقاً للوائح المعمول بها، يحق لك الوصول إلى بياناتك الشخصية وتصحيحها ونقلها ومسحها."
      },
      {
        title: "7. المسؤولية والضمانات",
        content: "تسعى تسوية جاهدة لضمان وصول مستمر ومثالي للمنصة، مع مراعاة فترات الصيانة الفنية. ومع ذلك، نحن ملزمون بالتزام بذل العناية وليس تحقيق نتيجة.\n\nلا تتحمل تسوية المسؤولية عن:\n- أي أخطاء أو عدم دقة أو إغفالات في المستندات التي ينشئها المستخدم إذا قدم هذا الأخير معلومات خاطئة.\n- التبعات القانونية الناشئة عن استخدام المستندات المحملة من المنصة.\n- انقطاعات الخدمة المتعلقة بشبكة الإنترنت أو حالات القوة القاهرة."
      },
      {
        title: "8. المدة والإنهاء",
        content: "تُبرم هذه الشروط لمدة غير محددة ابتداءً من أول استخدام لك للمنصة.\n\nأنت حر في إغلاق حسابك في أي وقت عبر إعدادات مساحتك الشخصية. من جانبها، تحتفظ تسوية بالحق، وفقاً لتقديرها الخاص ودون إشعار مسبق، في تعليق أو حذف وصولك في حالة حدوث انتهاك خطير لهذه الشروط، أو سلوك غير قانوني، أو احتيال، دون أن يكون لك الحق في المطالبة بأي تعويض."
      },
      {
        title: "9. القانون المعمول به وتسوية النزاعات",
        content: "تخضع هذه الشروط العامة للاستخدام للقانون الجزائري.\n\nفي حالة وجود نزاع يتعلق بصحة أو تفسير أو تنفيذ هذه الشروط، يتعهد الطرفان بالسعي أولاً لإيجاد حل ودي. في حالة عدم التوصل إلى اتفاق ودي في غضون شهر واحد، يُرفع النزاع أمام المحاكم المختصة في الجزائر العاصمة، بغض النظر عن تعدد المدعى عليهم أو دعاوى الضمان."
      },
      {
        title: "10. تعديلات الشروط والاتصال",
        content: "تحتفظ تسوية بالحق في تعديل هذه الشروط في أي وقت لتكييفها مع التطورات الفنية أو القانونية لخدماتنا. سيتم إبلاغ المستخدمين بأي تعديل جوهري عبر البريد الإلكتروني أو من خلال إشعار على المنصة. الاستمرار في استخدام الخدمات بعد نشر التعديلات يعتبر قبولاً لها.\n\nلأي أسئلة، أو طلبات توضيح، أو شكاوى، فريقنا تحت تصرفكم عبر البريد الإلكتروني على العنوان التالي: contact@taswiya.dz"
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
    <div className={`min-h-screen bg-transparent font-sans text-gray-800 dark:text-gray-200 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
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
