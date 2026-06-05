"use client";

import { useState } from "react";
import terms from "@/lib/i18n/legal-terms.json";
import { 
  UserCircle, 
  MapPin, 
  Receipt, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  HelpCircle, 
  Globe, 
  FileText,
  CreditCard,
  Lock,
  Loader2,
  Sparkles
} from "lucide-react";

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
        file: null as File | null,
        agreedToTerms: false,
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Mock credit card states
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const [simulationPhase, setSimulationPhase] = useState<"idle" | "verifying" | "securing" | "processing">("idle");
    const [paymentMode, setPaymentMode] = useState<"card" | "trial">("card");

    const t = (key: TermKey | string) => {
        return (terms as any)[key]?.[localLang] || key;
    };

    const isRtl = localLang === "ar";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 40 * 1024 * 1024) {
                setValidationError(t('fileTooLarge') || 'File size exceeds 40MB limit.');
                return;
            }
            setFormData({ ...formData, file });
            setValidationError(null);
        }
    };

    const validateStep = () => {
        if (step === 2) {
            if (!formData.plaintiffName || !formData.plaintiffAddress || !formData.plaintiffPhone) return false;
        }
        if (step === 3) {
            if (!formData.defendantName || !formData.defendantAddress || !formData.defendantPhone) return false;
        }
        if (step === 4) {
            if (!formData.amount || !formData.description || !formData.deadlineDays) return false;
        }
        return true;
    };

    // Card formatting helpers
    const handleCardNumberChange = (value: string) => {
        const clean = value.replace(/\D/g, "").substring(0, 16);
        const parts = [];
        for (let i = 0; i < clean.length; i += 4) {
            parts.push(clean.substring(i, i + 4));
        }
        setCardNumber(parts.join(" "));
    };

    const handleExpiryChange = (value: string) => {
        let clean = value.replace(/\D/g, "").substring(0, 4);
        if (clean.length > 2) {
            clean = clean.substring(0, 2) + "/" + clean.substring(2);
        }
        setCardExpiry(clean);
    };

    const handleCvvChange = (value: string) => {
        const clean = value.replace(/\D/g, "").substring(0, 3);
        setCardCvv(clean);
    };

    // Card brand detection
    const getCardBrand = (num: string) => {
        const clean = num.replace(/\s+/g, "");
        if (clean.startsWith("6280") || clean.startsWith("606")) return { name: "Dahabia", logo: "الذهبية", gradient: "bg-gradient-to-tr from-yellow-500 via-amber-600 to-yellow-800" };
        if (clean.startsWith("981")) return { name: "CIB", logo: "CIB", gradient: "bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-700" };
        if (clean.startsWith("4")) return { name: "Visa", logo: "VISA", gradient: "bg-gradient-to-tr from-indigo-900 via-slate-900 to-indigo-700" };
        if (clean.startsWith("5")) return { name: "MasterCard", logo: "MasterCard", gradient: "bg-gradient-to-tr from-rose-600 via-red-700 to-amber-600" };
        return { name: "Default", logo: "CARD", gradient: "bg-gradient-to-tr from-slate-700 via-slate-800 to-slate-900" };
    };

    const currentBrand = getCardBrand(cardNumber);

    const nextStep = () => {
        if (step === 5) {
            if (!formData.agreedToTerms) {
                setValidationError(localLang === 'ar' ? 'يجب الموافقة على شروط الخدمة للمتابعة' : (localLang === 'en' ? 'You must agree to the terms to continue' : 'Vous devez accepter les conditions pour continuer'));
                return;
            }
            setValidationError(null);
            setStep(6);
            return;
        }

        if (validateStep()) {
            setValidationError(null);
            setStep((s) => Math.min(s + 1, 6));
        } else {
            setValidationError(t('fieldsRequired'));
        }
    };

    const prevStep = () => {
        setValidationError(null);
        setStep((s) => Math.max(s - 1, 0));
    };

    const handleSituational = (answer: string) => {
        setFormData({ ...formData, situationalAnswer: answer });
        setStep(1);
    };

    const handleDefendantType = (type: string) => {
        setFormData({ ...formData, defendantType: type });
        setStep(2);
    };

    const handlePaymentAndSubmit = async () => {
        if (paymentMode === "card") {
            // Mock card: passes with whatever information is filled
        }

        setValidationError(null);
        setIsSubmitting(true);
        
        if (paymentMode === "card") {
            // Simulating secure Algerian multi-bank payment phases
            setSimulationPhase("verifying");
            await new Promise((resolve) => setTimeout(resolve, 1200));

            setSimulationPhase("securing");
            await new Promise((resolve) => setTimeout(resolve, 1200));

            setSimulationPhase("processing");
            await new Promise((resolve) => setTimeout(resolve, 1200));
        } else {
            // Simulating free trial activation
            setSimulationPhase("verifying");
            await new Promise((resolve) => setTimeout(resolve, 1200));

            setSimulationPhase("processing");
            await new Promise((resolve) => setTimeout(resolve, 1200));
        }

        try {
            await onComplete(formData, isDone);
            setIsDone(true);
        } catch (err) {
            console.error(err);
        } finally {
            setSimulationPhase("idle");
            setIsSubmitting(false);
        }
    };

    const steps = [
        { title: t('plaintiffInfo'), icon: <UserCircle className="w-5 h-5" /> },
        { title: t('defendantInfo'), icon: <MapPin className="w-5 h-5" /> },
        { title: t('disputeDetails'), icon: <Receipt className="w-5 h-5" /> },
        { title: t('reviewSend'), icon: <ShieldCheck className="w-5 h-5" /> },
        { title: t('payAndGenerate'), icon: <CreditCard className="w-5 h-5" /> },
    ];

    return (
        <div className={`fixed inset-0 z-50 bg-gray-50 dark:bg-slate-950 flex flex-col ${isRtl ? 'rtl font-arabic' : 'ltr font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b p-4 sm:p-6 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-blue-800 text-white p-1.5 sm:p-2 rounded-lg scale-75 sm:scale-100"><ShieldCheck /></div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 truncate max-w-[150px] sm:max-w-none">{t(caseCategory)}</h2>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Language Switcher */}
                    <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 dark:bg-slate-800 rounded-full px-2 sm:px-3 py-1 border border-gray-200 dark:border-slate-700">
                        <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        <select
                            value={localLang}
                            onChange={(e) => setLocalLang(e.target.value as Language)}
                            className="bg-transparent border-none outline-none font-bold text-gray-700 dark:text-gray-300 cursor-pointer text-xs sm:text-sm"
                        >
                            <option value="ar">AR</option>
                            <option value="fr">FR</option>
                            <option value="en">EN</option>
                        </select>
                    </div>

                    <button onClick={onCancel} className="text-gray-400 hover:text-red-500 transition-colors bg-gray-100 dark:bg-slate-800 p-1.5 sm:p-2 rounded-full">
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>
            </div>

            {step >= 2 && (
                <div className="max-w-3xl w-full mx-auto mt-8 px-6">
                    <div className="flex">
                        {steps.map((s, idx) => {
                            const currentStepIdx = step - 2;
                            return (
                                <div key={idx} className={`flex-1 flex flex-col items-center gap-2 ${idx <= currentStepIdx ? 'text-blue-800' : 'text-gray-300'}`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${idx <= currentStepIdx ? 'border-blue-800 bg-blue-50 shadow-md' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}>
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
            <div className="flex-1 overflow-y-auto flex items-start sm:items-center justify-center p-4 sm:p-6 pb-40 sm:pb-32">
                <div className="max-w-2xl w-full mx-auto py-8 sm:py-0 relative">
                    {step === 0 && (
                        <div className="text-center animate-in zoom-in-95 duration-300">
                            <HelpCircle className="w-12 h-12 sm:w-16 sm:h-16 text-blue-700 mx-auto mb-6" />
                            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 leading-tight">{t('funnelQuestion2')}</h1>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button onClick={() => handleSituational('yes')} className="flex-1 py-4 px-8 text-lg sm:text-xl bg-white dark:bg-slate-900 border-2 border-green-500 text-green-700 rounded-2xl hover:bg-green-50 hover:shadow-lg transition-all font-semibold">
                                    {t('yes')}
                                </button>
                                <button onClick={() => handleSituational('no')} className="flex-1 py-4 px-8 text-lg sm:text-xl bg-white dark:bg-slate-900 border-2 border-red-500 text-red-700 rounded-2xl hover:bg-red-50 hover:shadow-lg transition-all font-semibold">
                                    {t('no')}
                                </button>
                            </div>
                            <p className="mt-8 text-sm sm:text-base text-gray-500 dark:text-gray-400">{t('situationalNote')}</p>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="text-center animate-in zoom-in-95 duration-300">
                            <UserCircle className="w-12 h-12 sm:w-16 sm:h-16 text-blue-700 mx-auto mb-6" />
                            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 leading-tight">{t('defendantTypeQuestion')}</h1>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button onClick={() => handleDefendantType('INDIVIDUAL')} className="flex-1 py-4 px-8 text-lg sm:text-xl bg-white dark:bg-slate-900 border-2 border-blue-700 text-blue-700 rounded-2xl hover:bg-blue-50 hover:shadow-lg transition-all font-semibold">
                                    {t('naturalPerson')}
                                </button>
                                <button onClick={() => handleDefendantType('CORPORATE')} className="flex-1 py-4 px-8 text-lg sm:text-xl bg-white dark:bg-slate-900 border-2 border-blue-700 text-blue-700 rounded-2xl hover:bg-blue-50 hover:shadow-lg transition-all font-semibold">
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
                                <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{t('name')} <span className="text-red-500">*</span></label>
                                <input type="text" name="plaintiffName" value={formData.plaintiffName} onChange={handleChange} className={`w-full border-2 rounded-2xl p-4 text-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all bg-transparent ${validationError && !formData.plaintiffName ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-blue-700'}`} autoFocus />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{t('address')} <span className="text-red-500">*</span></label>
                                <input type="text" name="plaintiffAddress" value={formData.plaintiffAddress} onChange={handleChange} className={`w-full border-2 rounded-2xl p-4 text-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all bg-transparent ${validationError && !formData.plaintiffAddress ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-blue-700'}`} />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{t('phoneNumber')} <span className="text-red-500">*</span></label>
                                <input type="tel" name="plaintiffPhone" value={formData.plaintiffPhone} onChange={handleChange} className={`w-full border-2 rounded-2xl p-4 text-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all bg-transparent ${validationError && !formData.plaintiffPhone ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-blue-700'}`} placeholder="05/06/07..." />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('defendantInfo')}</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-8">{t('defendantHint')}</p>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{t('name')} <span className="text-red-500">*</span></label>
                                <input type="text" name="defendantName" value={formData.defendantName} onChange={handleChange} className={`w-full border-2 rounded-2xl p-4 text-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all bg-transparent ${validationError && !formData.defendantName ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-blue-700'}`} autoFocus />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{t('address')} <span className="text-red-500">*</span></label>
                                <input type="text" name="defendantAddress" value={formData.defendantAddress} onChange={handleChange} className={`w-full border-2 rounded-2xl p-4 text-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all bg-transparent ${validationError && !formData.defendantAddress ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-blue-700'}`} />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{t('phoneNumber')} <span className="text-red-500">*</span></label>
                                <input type="tel" name="defendantPhone" value={formData.defendantPhone} onChange={handleChange} className={`w-full border-2 rounded-2xl p-4 text-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all bg-transparent ${validationError && !formData.defendantPhone ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-blue-700'}`} placeholder="05/06/07..." />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('disputeDetails')}</h2>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{t('amount')} <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} className={`w-full border-2 rounded-2xl p-4 text-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all bg-transparent ${isRtl ? 'pl-16' : 'pr-16'} ${validationError && !formData.amount ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-blue-700'}`} autoFocus />
                                    <span className={`absolute top-1/2 -translate-y-1/2 text-gray-400 font-semibold ${isRtl ? 'left-4' : 'right-4'}`}>DZD</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2">{t('noticeType')} <span className="text-red-500">*</span></label>
                                    <select name="noticeType" value={formData.noticeType} onChange={handleChange} className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:border-blue-700 outline-none bg-white dark:bg-slate-900">
                                        <option value="GENERAL">{t('noticeGeneral')}</option>
                                        <option value="DEBT">{t('noticeDebt')}</option>
                                        <option value="RENT">{t('noticeRent')}</option>
                                        <option value="CONTRACT">{t('noticeContract')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2">{t('deadlineDays')} <span className="text-red-500">*</span></label>
                                    <input type="number" name="deadlineDays" value={formData.deadlineDays} onChange={handleChange} className={`w-full border-2 rounded-xl p-3 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none bg-transparent ${validationError && !formData.deadlineDays ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-blue-700'}`} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{t('description')} <span className="text-red-500">*</span></label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className={`w-full border-2 rounded-2xl p-4 text-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all bg-transparent ${validationError && !formData.description ? 'border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-blue-700'}`} />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-bold text-gray-400 uppercase mb-2">{t('uploadSupportingDocuments') || 'Upload Supporting Documents (Optional, Max 40MB)'}</label>
                                <div className={`border-2 border-dashed ${formData.file ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-slate-700'} rounded-2xl p-6 text-center transition-all hover:bg-gray-50 dark:hover:bg-slate-800`}>
                                    <input type="file" id="file-upload" accept=".pdf,image/*" onChange={handleFileChange} className="hidden" />
                                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                        <FileText className={`w-10 h-10 mb-2 ${formData.file ? 'text-green-500' : 'text-gray-400'}`} />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            {formData.file ? formData.file.name : (t('clickToUpload') || 'Click to upload PDF or Image')}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Maximum size: 40MB</span>
                                    </label>
                                    {formData.file && (
                                        <button type="button" onClick={(e) => { e.preventDefault(); setFormData({...formData, file: null}) }} className="mt-2 text-xs text-red-500 hover:text-red-700">
                                            {t('removeFile') || 'Remove file'}
                                        </button>
                                    )}
                                </div>
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

                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border-2 border-gray-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                                    <div className="space-y-1">
                                        <div className="text-gray-500 dark:text-gray-400 uppercase tracking-wide text-xs font-semibold">{t('plaintiffInfo')}</div>
                                        <div className="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg">
                                            {formData.plaintiffName} {formData.plaintiffPhone && `(${formData.plaintiffPhone})`}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-gray-500 dark:text-gray-400 uppercase tracking-wide text-xs font-semibold">{t('defendantInfo')}</div>
                                        <div className="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg">
                                            {formData.defendantName} {formData.defendantPhone && `(${formData.defendantPhone})`}
                                            <div className="text-xs font-normal text-gray-500 mt-1">
                                                {formData.defendantType === 'CORPORATE' ? t('legalEntity') : t('naturalPerson')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-gray-500 dark:text-gray-400 uppercase tracking-wide text-xs font-semibold">{t('amount')}</div>
                                        <div className="font-bold text-blue-800 text-lg sm:text-xl">{formData.amount} DZD</div>
                                    </div>
                                </div>

                                <hr className="my-6 border-gray-100 dark:border-slate-800" />

                                <div className="bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-400 p-4 sm:p-5 rounded-2xl border border-yellow-200 dark:border-yellow-900/30 flex items-start gap-3 sm:gap-4">
                                    <ShieldCheck className="w-5 h-5 shrink-0 text-yellow-600 mt-0.5" />
                                    <p className="font-medium text-xs sm:text-sm leading-relaxed">
                                        {t('legalWarning')}
                                    </p>
                                </div>
                                
                                <div className="mt-6 flex flex-col items-center">
                                    <label className="flex items-center gap-3 cursor-pointer mb-2">
                                        <input 
                                            type="checkbox" 
                                            name="agreedToTerms" 
                                            checked={formData.agreedToTerms} 
                                            onChange={handleChange} 
                                            className="w-5 h-5 rounded border-gray-300 text-blue-800 focus:ring-blue-700" 
                                        />
                                        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                            {localLang === 'ar' ? 'أوافق على ' : (localLang === 'en' ? 'I agree to the ' : 'J\'accepte les ')}
                                            <a href="/terms" target="_blank" className="underline text-blue-800 hover:text-blue-700">
                                                {localLang === 'ar' ? 'شروط الخدمة' : (localLang === 'en' ? 'Terms of Service' : 'Conditions d\'Utilisation')}
                                            </a>
                                        </span>
                                    </label>
                                    {!formData.agreedToTerms && <p className="text-red-500 text-xs">{localLang === 'ar' ? 'يجب الموافقة على شروط الخدمة للمتابعة' : (localLang === 'en' ? 'You must agree to the terms to continue' : 'Vous devez accepter les conditions pour continuer')}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 6: Visual Credit Card checkout with e-receipt */}
                    {step === 6 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            {simulationPhase !== "idle" && (
                                <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 z-[70] rounded-3xl flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                                    <div className="relative mb-6">
                                        <Loader2 className="w-16 h-16 animate-spin text-blue-800" />
                                        <ShieldCheck className="w-8 h-8 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                        {simulationPhase === "verifying" && (paymentMode === "card" ? t('verifyingCard') : (localLang === 'ar' ? 'جاري تفعيل المحاولات المجانية...' : (localLang === 'en' ? 'Activating free tries...' : 'Activation des essais gratuits...')))}
                                        {simulationPhase === "securing" && t('securingTransaction')}
                                        {simulationPhase === "processing" && (paymentMode === "card" ? (localLang === 'ar' ? 'جاري معالجة الدفع التجريبي...' : (localLang === 'en' ? 'Processing simulated checkout...' : 'Traitement du paiement simulé...')) : (localLang === 'ar' ? 'جاري توليد المستند...' : (localLang === 'en' ? 'Generating document...' : 'Génération du document...')))}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
                                        {localLang === 'ar' ? 'هذه محاكاة آمنة بالكامل على جانب العميل لتسهيل عملية التثبيت والتسجيل.' : 'This is a secure offline checkout simulation created to complete the document generation process.'}
                                    </p>
                                </div>
                            )}

                            <div className="text-center">
                                <CreditCard className="w-12 h-12 text-blue-800 mx-auto mb-2" />
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('checkoutSecure')}</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('funnelQuestion2')}</p>
                            </div>

                            {/* Payment mode selector */}
                            <div className="flex border-2 border-gray-200 dark:border-slate-800 rounded-2xl p-1.5 max-w-sm mx-auto mb-6 bg-gray-50/50 dark:bg-slate-900/50">
                                <button
                                    onClick={() => { setPaymentMode("card"); setValidationError(null); }}
                                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${paymentMode === "card" ? 'bg-white dark:bg-slate-800 text-blue-800 dark:text-blue-400 shadow-md border border-gray-100 dark:border-slate-700' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    <CreditCard className="w-4 h-4" />
                                    <span>{t('singleCasePayment')}</span>
                                </button>
                                <button
                                    onClick={() => { setPaymentMode("trial"); setValidationError(null); }}
                                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${paymentMode === "trial" ? 'bg-white dark:bg-slate-800 text-blue-800 dark:text-blue-400 shadow-md border border-gray-100 dark:border-slate-700' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    <span>{t('startFreeTrial')}</span>
                                </button>
                            </div>

                            {paymentMode === "card" ? (
                                <>
                                    {/* Live Credit Card interactive visualizer */}
                                    <div className="w-full max-w-sm mx-auto mb-6 perspective-1000">
                                        <div className={`relative w-full h-48 rounded-2xl transition-transform duration-700 preserve-3d cursor-pointer ${isCardFlipped ? 'rotate-y-180' : ''}`}>
                                            {/* Front */}
                                            <div className={`absolute inset-0 w-full h-full rounded-2xl p-6 text-white backface-hidden flex flex-col justify-between shadow-xl ${currentBrand.gradient}`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-[10px] uppercase opacity-75 tracking-wider font-semibold">Taswiya Pay Card</p>
                                                        <p className="text-xs font-bold mt-0.5">LEGAL AUTO NOTICE</p>
                                                    </div>
                                                    <span className="text-lg font-black italic tracking-wide">{currentBrand.logo}</span>
                                                </div>

                                                <div className="my-3">
                                                    <p className="text-xl font-mono tracking-widest text-center">{cardNumber || "•••• •••• •••• ••••"}</p>
                                                </div>

                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[9px] uppercase opacity-70">{t('cardholderName')}</p>
                                                        <p className="text-xs font-mono tracking-wider font-bold truncate max-w-[180px]">{cardName.toUpperCase() || "NAME SURNAME"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] uppercase opacity-70">{t('expiryDate')}</p>
                                                        <p className="text-xs font-mono font-bold">{cardExpiry || "MM/YY"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Back */}
                                            <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white backface-hidden rotate-y-180 flex flex-col justify-between shadow-xl">
                                                <div className="w-full h-10 bg-black -mx-6 mt-2 opacity-90" />
                                                
                                                <div className="my-2">
                                                    <p className="text-[9px] text-right opacity-70 mr-2 uppercase">Signature / CVV</p>
                                                    <div className="bg-white/10 w-full h-9 rounded flex items-center justify-end px-3 mt-1">
                                                        <span className="text-sm font-mono italic text-black bg-white px-2 py-0.5 rounded shadow tracking-widest">{cardCvv || "•••"}</span>
                                                    </div>
                                                </div>

                                                <p className="text-[8px] text-slate-400 leading-tight">
                                                    Simulated legal case processing fee: 2,000 DZD. Client-side payment simulation. No real financial operations.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* E-Receipt visualizer */}
                                    <div className="bg-gray-100 dark:bg-slate-900 p-5 rounded-3xl border border-gray-200 dark:border-slate-800 space-y-3 max-w-sm mx-auto shadow-sm">
                                        <h3 className="font-extrabold text-xs text-gray-500 uppercase tracking-wider">{t('receiptTitle')}</h3>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">{t('noticeType')}</span>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">
                                                {t(`notice${formData.noticeType}`)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs border-t border-dashed border-gray-200 dark:border-slate-800 pt-3">
                                            <span className="text-gray-500 font-bold">{t('amountPaid')}</span>
                                            <span className="font-black text-blue-800 dark:text-blue-400">2,000 DZD</span>
                                        </div>
                                    </div>

                                    {/* Payment inputs */}
                                    <div className="space-y-4 max-w-sm mx-auto">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('cardholderName')}</label>
                                            <input
                                                type="text"
                                                required
                                                value={cardName}
                                                onChange={(e) => setCardName(e.target.value)}
                                                placeholder="E.g. CHAMSDINE TOUAHRI"
                                                className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:border-blue-700 outline-none transition-all bg-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('cardNumber')}</label>
                                            <input
                                                type="text"
                                                required
                                                value={cardNumber}
                                                onChange={(e) => handleCardNumberChange(e.target.value)}
                                                placeholder="6280 •••• •••• ••••"
                                                className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:border-blue-700 outline-none transition-all bg-transparent"
                                            />
                                            <span className="text-[10px] text-gray-400 mt-1 block">
                                                {t('mockCardPlaceholder')} (Prefix 4 = Visa, 5 = MasterCard, 6280/606 = Dahabia, 981 = CIB)
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('expiryDate')}</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={cardExpiry}
                                                    onChange={(e) => handleExpiryChange(e.target.value)}
                                                    placeholder="MM/YY"
                                                    className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:border-blue-700 outline-none transition-all bg-transparent text-center"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('cvv')}</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={cardCvv}
                                                    onChange={(e) => handleCvvChange(e.target.value)}
                                                    onFocus={() => setIsCardFlipped(true)}
                                                    onBlur={() => setIsCardFlipped(false)}
                                                    placeholder="123"
                                                    className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:border-blue-700 outline-none transition-all bg-transparent text-center"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-6 max-w-sm mx-auto animate-in fade-in duration-300">
                                    {/* Premium Trial Promo Card */}
                                    <div className="bg-gradient-to-tr from-blue-900 to-indigo-850 dark:from-slate-900 dark:to-blue-950 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden border border-blue-700/30">
                                        {/* Background elements */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10 blur-xl"></div>
                                        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-500/20 rounded-full blur-lg"></div>
                                        
                                        <div className="relative z-10 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                                    {localLang === 'ar' ? 'عرض خاص' : (localLang === 'en' ? 'Special Offer' : 'Offre Spéciale')}
                                                </span>
                                                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse animate-duration-1000" />
                                            </div>
                                            
                                            <div>
                                                <h4 className="text-xl font-extrabold tracking-tight">Taswiya Premium</h4>
                                                <p className="text-xs text-blue-100/80 mt-1">{t('freeTrialSubtitle')}</p>
                                            </div>
                                            
                                            <hr className="border-white/10 my-3" />
                                            
                                            <ul className="space-y-2.5 text-xs font-semibold text-blue-50">
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                                    <span>{localLang === 'ar' ? 'توليد 3 مستندات رسمية مجاناً' : (localLang === 'en' ? '3 official document generations for free' : '3 générations de documents officiels gratuites')}</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                                    <span>{localLang === 'ar' ? 'تنزيل فوري للمستندات بصيغة PDF عالية الجودة' : (localLang === 'en' ? 'Instant download of high-quality PDF files' : 'Téléchargement instantané des PDF de haute qualité')}</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                                    <span>{localLang === 'ar' ? 'لا حاجة لبطاقة دفع ولا التزام' : (localLang === 'en' ? 'No credit card or payment info needed' : 'Aucune carte de crédit ou information de paiement requise')}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* E-Receipt for Free Trial */}
                                    <div className="bg-gray-100 dark:bg-slate-900 p-5 rounded-3xl border border-gray-200 dark:border-slate-800 space-y-3 shadow-sm">
                                        <h3 className="font-extrabold text-xs text-gray-500 uppercase tracking-wider">{t('receiptTitle')}</h3>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">{t('noticeType')}</span>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">
                                                {t(`notice${formData.noticeType}`)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs border-t border-dashed border-gray-200 dark:border-slate-800 pt-3">
                                            <span className="text-gray-500">{localLang === 'ar' ? 'السعر العادي' : (localLang === 'en' ? 'Standard Price' : 'Prix Standard')}</span>
                                            <span className="text-gray-500 line-through">2,000 DZD</span>
                                        </div>
                                        <div className="flex justify-between text-xs border-t border-dashed border-gray-200 dark:border-slate-800 pt-3">
                                            <span className="text-gray-500 font-bold">{localLang === 'ar' ? 'المجموع المستحق' : (localLang === 'en' ? 'Total Due' : 'Total Dû')}</span>
                                            <span className="font-black text-green-600 dark:text-green-400 text-sm">0 DZD</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {validationError && (
                <div className="fixed bottom-24 left-0 right-0 px-6 animate-in slide-in-from-bottom-2 duration-300 z-50">
                    <div className="max-w-2xl mx-auto bg-red-100 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-2 rounded-xl text-center text-sm font-bold shadow-lg">
                        {validationError}
                    </div>
                </div>
            )}

            {/* Footer Controls Fixed */}
            {step > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t p-4 sm:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
                    <div className="max-w-3xl mx-auto flex justify-between items-center gap-4">
                        <button
                            onClick={prevStep}
                            className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:bg-slate-800 text-sm sm:text-base"
                        >
                            {isRtl ? <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /> : <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
                            <span>{t('back')}</span>
                        </button>

                        {step < 6 ? (
                            <button
                                onClick={nextStep}
                                className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 sm:px-8 py-3 bg-blue-800 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-300 font-bold transition-all text-base sm:text-lg"
                            >
                                <span>{step === 5 ? (localLang === 'ar' ? 'الذهاب للدفع' : (localLang === 'en' ? 'Proceed to Payment' : 'Passer au paiement')) : t('next')}</span>
                                {isRtl ? <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> : <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                            </button>
                        ) : (
                            <button
                                onClick={handlePaymentAndSubmit}
                                disabled={isSubmitting}
                                className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 sm:px-8 py-3 bg-blue-800 text-white rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-300 font-bold transition-all text-base sm:text-lg disabled:opacity-50"
                            >
                                <Lock className="w-4 h-4" />
                                <span>{isSubmitting ? t('processing') : (paymentMode === "card" ? t('payAndGenerate') : t('startTrialAndGenerate'))}</span>
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
                                onClick={async () => {
                                    setIsSubmitting(true);
                                    try {
                                        await onComplete(formData, true);
                                    } catch (err) {
                                        console.error(err);
                                    } finally {
                                        setIsSubmitting(false);
                                    }
                                }}
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-3 py-5 bg-blue-800 text-white rounded-2xl hover:bg-blue-700 shadow-2xl shadow-blue-300 font-bold transition-all text-xl disabled:opacity-50"
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
