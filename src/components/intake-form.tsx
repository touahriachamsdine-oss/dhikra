"use client";

import { useState } from "react";
import terms from "@/lib/i18n/legal-terms.json";
import { UserCircle, MapPin, Receipt, CheckCircle, ArrowLeft, ArrowRight, X, ShieldCheck, HelpCircle } from "lucide-react";

type Language = "ar" | "fr" | "en";
type TermKey = keyof typeof terms;

interface IntakeFormProps {
    lang: Language;
    caseCategory: string; // e.g., 'catHousing'
    onCancel: () => void;
    onComplete: (data: any) => void;
}

export default function IntakeForm({ lang, caseCategory, onCancel, onComplete }: IntakeFormProps) {
    const [step, setStep] = useState(0); // 0 is situational logic
    const [formData, setFormData] = useState({
        situationalAnswer: "",
        plaintiffName: "",
        plaintiffAddress: "",
        defendantName: "",
        defendantAddress: "",
        amount: "",
        description: "",
    });

    const t = (key: TermKey | string) => {
        return (terms as any)[key]?.[lang] || key;
    };

    const isRtl = lang === "ar";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep((s) => Math.min(s + 1, 5));
    const prevStep = () => setStep((s) => Math.max(s - 1, 0));

    const handleSituational = (answer: string) => {
        setFormData({ ...formData, situationalAnswer: answer });
        setStep(1);
    };

    const submitForm = () => {
        onComplete(formData);
    };

    const steps = [
        { title: t('plaintiffInfo'), icon: <UserCircle className="w-5 h-5" /> },
        { title: t('defendantInfo'), icon: <MapPin className="w-5 h-5" /> },
        { title: t('disputeDetails'), icon: <Receipt className="w-5 h-5" /> },
        { title: t('reviewSend'), icon: <ShieldCheck className="w-5 h-5" /> },
    ];

    return (
        <div className={`fixed inset-0 z-50 bg-gray-50 flex flex-col ${isRtl ? 'rtl font-arabic' : 'ltr font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className="bg-white border-b p-6 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg"><ShieldCheck /></div>
                    <h2 className="text-xl font-bold text-gray-800">{t(caseCategory)}</h2>
                </div>
                <button onClick={onCancel} className="text-gray-400 hover:text-red-500 transition-colors bg-gray-100 p-2 rounded-full">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {step > 0 && (
                <div className="max-w-3xl w-full mx-auto mt-8 px-6">
                    <div className="flex">
                        {steps.map((s, idx) => {
                            const currentStepIdx = step - 1;
                            return (
                                <div key={idx} className={`flex-1 flex flex-col items-center gap-2 ${idx <= currentStepIdx ? 'text-blue-600' : 'text-gray-300'}`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${idx <= currentStepIdx ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-200 bg-white'}`}>
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
                            <h1 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">{t('funnelQuestion2')}</h1>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button onClick={() => handleSituational('yes')} className="flex-1 py-4 px-8 text-xl bg-white border-2 border-green-500 text-green-700 rounded-2xl hover:bg-green-50 hover:shadow-lg transition-all font-semibold">
                                    {t('yes')}
                                </button>
                                <button onClick={() => handleSituational('no')} className="flex-1 py-4 px-8 text-xl bg-white border-2 border-red-500 text-red-700 rounded-2xl hover:bg-red-50 hover:shadow-lg transition-all font-semibold">
                                    {t('no')}
                                </button>
                            </div>
                            <p className="mt-8 text-gray-500">{t('situationalNote')}</p>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('plaintiffInfo')}</h2>
                            <p className="text-gray-500 mb-8">{t('plaintiffHint')}</p>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">{t('name')}</label>
                                <input type="text" name="plaintiffName" value={formData.plaintiffName} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-2xl p-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" autoFocus />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">{t('address')}</label>
                                <input type="text" name="plaintiffAddress" value={formData.plaintiffAddress} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-2xl p-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('defendantInfo')}</h2>
                            <p className="text-gray-500 mb-8">{t('defendantHint')}</p>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">{t('name')}</label>
                                <input type="text" name="defendantName" value={formData.defendantName} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-2xl p-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" autoFocus />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">{t('address')}</label>
                                <input type="text" name="defendantAddress" value={formData.defendantAddress} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-2xl p-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('disputeDetails')}</h2>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">{t('amount')}</label>
                                <div className="relative">
                                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} className={`w-full border-2 border-gray-200 rounded-2xl p-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all ${isRtl ? 'pl-16' : 'pr-16'}`} autoFocus />
                                    <span className={`absolute top-1/2 -translate-y-1/2 text-gray-400 font-semibold ${isRtl ? 'left-4' : 'right-4'}`}>DZD</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">{t('description')}</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full border-2 border-gray-200 rounded-2xl p-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-8 animate-in slide-in-from-right duration-300">
                            <div className="text-center">
                                <ShieldCheck className="w-20 h-20 text-green-500 mx-auto mb-4" />
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('fileIsReady')}</h2>
                                <p className="text-gray-500">{t('verifyBeforePayment')}</p>
                            </div>

                            <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                    <div className="text-gray-500 uppercase tracking-wide text-sm font-semibold">{t('plaintiffInfo')}</div>
                                    <div className="font-bold text-gray-900 text-lg">{formData.plaintiffName}</div>

                                    <div className="text-gray-500 uppercase tracking-wide text-sm font-semibold">{t('defendantInfo')}</div>
                                    <div className="font-bold text-gray-900 text-lg">{formData.defendantName}</div>

                                    <div className="text-gray-500 uppercase tracking-wide text-sm font-semibold">{t('amount')}</div>
                                    <div className="font-bold text-blue-600 text-xl">{formData.amount} DZD</div>
                                </div>

                                <hr className="my-6 border-gray-100" />

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
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                    <div className="max-w-3xl mx-auto flex justify-between items-center">
                        <button
                            onClick={prevStep}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors text-gray-600 hover:bg-gray-100`}
                        >
                            {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                            {t('back')}
                        </button>

                        {step < 4 ? (
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
                                className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 shadow-xl shadow-green-200 font-bold transition-all text-lg hover:scale-105"
                            >
                                <div className="animate-pulse mr-2">🟢</div>
                                {t('submit')} — 3900 DZD
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
