"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scale, FileText, Gavel, FileCheck, ArrowLeft, Globe } from "lucide-react";
import terms from "@/lib/i18n/legal-terms.json";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ServicesPage() {
    const router = useRouter();
    const [lang, setLang] = useState<"ar" | "fr" | "en">("fr");
    const t = (key: string) => (terms as any)[key]?.[lang] || key;
    const isRtl = lang === "ar";

    const services = [
        {
            title: t('automatedFormalNotices'),
            description: t('automatedFormalNoticesDesc'),
            icon: <FileText className="w-8 h-8 text-primary-600" />
        },

        {
            title: t('claimsManagement'),
            description: t('claimsManagementDesc'),
            icon: <FileCheck className="w-8 h-8 text-primary-600" />
        },
        {
            title: t('legalAdviceConsultation'),
            description: t('legalAdviceConsultationDesc'),
            icon: <Gavel className="w-8 h-8 text-primary-600" />
        }
    ];

    return (
        <div
            className={`min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col ${isRtl ? 'rtl font-arabic' : 'ltr font-sans'}`}
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 py-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/')}
                        className="p-2 hover:bg-gray-100 dark:bg-slate-800 rounded-full transition-colors text-gray-600 dark:text-gray-300"
                    >
                        {isRtl ? <ArrowLeft className="w-5 h-5 rotate-180" /> : <ArrowLeft className="w-5 h-5" />}
                    </button>
                    <div className="flex items-center gap-2">
                        <Scale className="w-6 h-6 text-secondary-500" />
                        <h1 className="text-xl font-black tracking-tight text-primary-500">
                            Settle<span className="text-secondary-500">Up</span>.dz
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-full px-3 py-1.5 shadow-sm border border-gray-200 dark:border-slate-700 text-gray-700">
                        <Globe className="w-4 h-4 opacity-70" />
                        <select
                            value={lang}
                            onChange={e => setLang(e.target.value as any)}
                            className="bg-transparent border-none outline-none font-semibold cursor-pointer text-sm"
                        >
                            <option value="ar">العربية</option>
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full py-16 px-6 sm:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-primary-900 dark:text-primary-100 mb-4">{t('services')}</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {t('servicesDesc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{service.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{service.description}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
