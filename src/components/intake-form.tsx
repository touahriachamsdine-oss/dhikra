"use client";

import { useState } from "react";
import terms from "@/lib/i18n/legal-terms.json";
import { UserCircle, MapPin, Receipt, CheckCircle, ArrowLeft, ArrowRight, X, ShieldCheck, HelpCircle, Globe, FileText } from "lucide-react";

type Language = "ar" | "fr" | "en";
type TermKey = keyof typeof terms;

interface IntakeFormProps {
    lang: Language;
    caseCategory: string; // e.g., 'catHousing'
    onCancel: () => void;
    onComplete: (data: any, isReDownload?: boolean) => Promise<void>;
}

export default function IntakeForm({ lang, caseCategory, onCancel, onComplete }: IntakeFormProps) {
    const [localLang, setLocalLang] = useState<Language>(lang);
    const [step, setStep] = useState(0); // 0 is situational logic
    const [formData, setFormData] = useState({
        situationalAnswer: "",
        plaintiffName: "",
        plaintiffAddress: "",
        plaintiffPhone: "",
        defendantName: "",
        defendantAddress: "",
        defendantPhone: "",
        defendantType: "INDIVIDUAL",
        amount: "",
        description: "",
        noticeType: "GENERAL",
        deadlineDays: 15,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const t = (key: TermKey | string) => {
        return (terms as any)[key]?.[localLang] || key;
    };

    const isRtl = localLang === "ar";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const nextStep = () => setStep((s) => Math.min(s + 1, 5));
    const prevStep = () => setStep((s) => Math.max(s - 1, 0));

    const handleSituational = (answer: string) => {
        setFormData({ ...formData, situationalAnswer: answer });
        setStep(1);
    };

    const handleDefendantType = (type: string) => {
        setFormData({ ...formData, defendantType: type });
        setStep(2);
    };

    const submitForm = async () => {
        setIsSubmitting(true);
        try {
            await onComplete(formData, isDone);
            setIsDone(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        { title: t('plaintiffInfo'), icon: <UserCircle className="w-5 h-5" /> },
        { title: t('defendantInfo'), icon: <MapPin className="w-5 h-5" /> },
        { title: t('disputeDetails'), icon: <Receipt className="w-5 h-5" /> },
        { title: t('reviewSend'), icon: <ShieldCheck className="w-5 h-5" /> },
    ];

    return (
        <div className={`fixed inset-0 z-50 bg-gray-50 dark:bg-slate-950 flex flex-col ${isRtl ? 'rtl font-arabic' : 'ltr font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b p-6 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg"><ShieldCheck /></div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t(caseCategory)}</h2>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* Language Switcher */}
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 rounded-full px-3 py-1 border border-gray-200 dark:border-slate-700">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <select
                            value={localLang}
                            onChange={(e) => setLocalLang(e.target.value as Language)}
                            className="bg-transparent border-none outline-none font-semibold text-gray-700 dark:text-gray-300 cursor-pointer text-sm"
                        >
                            <option value="ar">AR</option>
                            <option value="fr">FR</option>
                            <option value="en">EN</option>
                        </select>
                    </div>

                    <button onClick={onCancel} className="text-gray-400 hover:text-red-500 transition-colors bg-gray-100 dark:bg-slate-800 p-2 rounded-full">
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {step >= 2 && (
                <div className="max-w-3xl w-full mx-auto mt-8 px-6">
                    <div className="flex">
                        {steps.map((s, idx) => {
                            const currentStepIdx = step - 2;
                            return (
                                <div key={idx} className={`flex-1 flex flex-col items-center gap-2 ${idx <= currentStepIdx ? 'text-blue-600' : 'text-gray-300'}`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${idx <= currentStepIdx ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}>
                                        {s.icon}
                                    </div>
                                    <span className="text-xs font-medium hidden md:block">{s.title}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Form Content - Full Screen Centered */}
            <div className="flex-1 flex items-center justify-center p-6 pb-32">
                <div className="max-w-2xl w-full mx-auto">
                    {step === 0 && (
                        <div className="text-center animate-in zoom-in-95 duration-300">
                            <HelpCircle className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 leading-tight">{t('funnelQuestion2')}</h1>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button onClick={() => handleSituational('yes')} className="flex-1 py-4 px-8 text-xl bg-white dark:bg-slate-900 border-2 border-green-500 text-green-700 rounded-2xl hover:bg-green-50 hover:shadow-lg transition-all font-semibold">
                                    {t('yes')}
                                </button>
                                <button onClick={() => handleSituational('no')} className="flex-1 py-4 px-8 text-xl bg-white dark:bg-slate-900 border-2 border-red-500 text-red-700 rounded-2xl hover:bg-red-50 hover:shadow-lg transition-all font-semibold">
                                    {t('no')}
                                </button>
                            </div>
                            <p className="mt-8 text-gray-500 dark:text-gray-400">{t('situationalNote')}</p>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="text-center animate-in zoom-in-95 duration-300">
                            <UserCircle className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 leading-tight">{t('defendantTypeQuestion')}</h1>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button onClick={() => handleDefendantType('INDIVIDUAL')} className="flex-1 py-4 px-8 text-xl bg-white dark:bg-slate-900 border-2 border-blue-500 text-blue-700 rounded-2xl hover:bg-blue-50 hover:shadow-lg transition-all font-semibold">
                                    {t('naturalPerson')}
                                </button>
                                <button onClick={() => handleDefendantType('CORPORATE')} className="flex-1 py-4 px-8 text-xl bg-white dark:bg-slate-900 border-2 border-blue-500 text-blue-700 rounded-2xl hover:bg-blue-50 hover:shadow-lg transition-all font-semibold">
                                    {t('legalEntity')}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('plaintiffInfo')}</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-8">{t('plaintiffHint')}</p>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">{t('name')}</label>
                                <input type="text" name="plaintiffName" value={formData.plaintiffName} onChange={handleChange} className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-2xl p-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" autoFocus />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">{t('address')}</label>
                                <input type="text" name="plaintiffAddress" value={formData.plaintiffAddress} onChange={handleChange} className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-2xl p-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">{t('phoneNumber')}</label>
                                <input type="tel" name="plaintiffPhone" value={formData.plaintiffPhone} onChange={handleChange} className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-2xl p-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" placeholder="05/06/07..." />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('defendantInfo')}</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-8">{t('defendantHint')}</p>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">{t('name')}</label>
                                <input type="text" name="defendantName" value={formData.defendantName} onChange={handleChange} className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-2xl p-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" autoFocus />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">{t('address')}</label>
                                <input type="text" name="defendantAddress" value={formData.defendantAddress} onChange={handleChange} className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-2xl p-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">{t('phoneNumber')}</label>
                                <input type="tel" name="defendantPhone" value={formData.defendantPhone} onChange={handleChange} className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-2xl p-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" placeholder="05/06/07..." />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('disputeDetails')}</h2>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">{t('amount')}</label>
                                <div className="relative">
                                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} className={`w-full border-2 border-gray-200 dark:border-slate-700 rounded-2xl p-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all ${isRtl ? 'pl-16' : 'pr-16'}`} autoFocus />
                                    <span className={`absolute top-1/2 -translate-y-1/2 text-gray-400 font-semibold ${isRtl ? 'left-4' : 'right-4'}`}>DZD</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2">{t('noticeType')}</label>
                                    <select name="noticeType" value={formData.noticeType} onChange={handleChange} className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:border-blue-500 outline-none bg-white dark:bg-slate-900">
                                        <option value="GENERAL">{t('noticeGeneral')}</option>
                                        <option value="DEBT">{t('noticeDebt')}</option>
                                        <option value="RENT">{t('noticeRent')}</option>
                                        <option value="CONTRACT">{t('noticeContract')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2">{t('deadlineDays')}</label>
                                    <input type="number" name="deadlineDays" value={formData.deadlineDays} onChange={handleChange} className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:border-blue-500 outline-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">{t('description')}</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-2xl p-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                            </div>

                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-8 animate-in slide-in-from-right duration-300">
                            <div className="text-center">
                                <ShieldCheck className="w-20 h-20 text-green-500 mx-auto mb-4" />
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('fileIsReady')}</h2>
                                <p className="text-gray-500 dark:text-gray-400">{t('verifyBeforePayment')}</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-gray-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                    <div className="text-gray-500 dark:text-gray-400 uppercase tracking-wide text-sm font-semibold">{t('plaintiffInfo')}</div>
                                    <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                                        {formData.plaintiffName} {formData.plaintiffPhone && `(${formData.plaintiffPhone})`}
                                    </div>

                                    <div className="text-gray-500 dark:text-gray-400 uppercase tracking-wide text-sm font-semibold">{t('defendantInfo')}</div>
                                    <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                                        {formData.defendantName} {formData.defendantPhone && `(${formData.defendantPhone})`}
                                        <div className="text-xs font-normal text-gray-500 mt-1">
                                            {formData.defendantType === 'CORPORATE' ? t('legalEntity') : t('naturalPerson')}
                                        </div>
                                    </div>

                                    <div className="text-gray-500 dark:text-gray-400 uppercase tracking-wide text-sm font-semibold">{t('amount')}</div>
                                    <div className="font-bold text-blue-600 text-xl">{formData.amount} DZD</div>
                                </div>

                                <hr className="my-6 border-gray-100 dark:border-slate-800" />

                                <div className="bg-yellow-50 text-yellow-800 p-5 rounded-2xl border border-yellow-200 flex items-start gap-4">
                                    <ShieldCheck className="w-6 h-6 shrink-0 text-yellow-600 mt-1" />
                                    <p className="font-medium text-sm leading-relaxed">
                                        {t('legalWarning')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Controls Fixed */}
            {step > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                    <div className="max-w-3xl mx-auto flex justify-between items-center">
                        <button
                            onClick={prevStep}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:bg-slate-800`}
                        >
                            {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                            {t('back')}
                        </button>

                        {step < 5 ? (
                            <button
                                onClick={nextStep}
                                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 font-bold transition-all text-lg"
                            >
                                {t('next')}
                                {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                            </button>
                        ) : (
                            <button
                                onClick={submitForm}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 font-bold transition-all text-lg hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
                            >
                                {isSubmitting ? t('processing') : t('submit')}
                            </button>
                        )}
                    </div>
                </div>
            )}
            {isDone && (
                <div className="fixed inset-0 z-[60] bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                    <div className="max-w-md w-full">
                        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                            <CheckCircle className="w-12 h-12" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-4">{t('thankYou')}</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-12 leading-relaxed">
                            {t('caseSubmitted')}
                        </p>
                        
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={submitForm}
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-2xl shadow-blue-200 font-bold transition-all text-xl disabled:opacity-50"
                            >
                                <FileText className="w-6 h-6" />
                                {isSubmitting ? t('processing') : t('downloadPDF')}
                            </button>
                            
                            <button
                                onClick={onCancel}
                                className="w-full py-4 text-gray-500 font-bold hover:text-gray-800 transition-colors"
                            >
                                {t('close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
