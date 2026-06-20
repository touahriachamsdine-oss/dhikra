"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Sparkles,
  LogIn
} from "lucide-react";

type Language = "ar" | "fr" | "en";

const localTranslations = {
    ar: {
        useYourPlan: "تفعيل الخدمة مدى الحياة",
        pickPlan: "تفعيل الخدمة (5,000 د.ج)",
        unlimitedAccess: "وصول غير محدود مدى الحياة",
        unlockUnlimited: "ادفع مرة واحدة بقيمة 5,000 د.ج للحصول على وصول غير محدود مدى الحياة لتوليد المستندات.",
        activePlanConfirm: "تم تفعيل الخدمة بنجاح!",
        activePlanDesc: "لقد قمت بدفع رسوم الخدمة لمرة واحدة. لديك الآن وصول غير محدود لتوليد وتنزيل جميع مستنداتك القانونية.",
        generateDocument: "توليد المستند",
        pleaseLoginToSubmit: "يرجى تسجيل الدخول للمتابعة",
        loginNow: "تسجيل الدخول الآن",
        loadingUserData: "جاري تحميل بيانات الحساب...",
    },
    en: {
        useYourPlan: "Lifetime Unlimited Service",
        pickPlan: "Activate Unlimited (5,000 DZD)",
        unlimitedAccess: "Lifetime Unlimited Access",
        unlockUnlimited: "Pay a one-time fee of 5,000 DZD to unlock lifetime unlimited document generation and premium features.",
        activePlanConfirm: "Service Activated Successfully!",
        activePlanDesc: "You have successfully paid the one-time service fee. You now have unlimited access to generate and download all your legal documents.",
        generateDocument: "Generate Document",
        pleaseLoginToSubmit: "Please log in to continue",
        loginNow: "Log In Now",
        loadingUserData: "Loading account data...",
    },
    fr: {
        useYourPlan: "Service Illimité à Vie",
        pickPlan: "Activer l'illimité (5 000 DA)",
        unlimitedAccess: "Accès Illimité à Vie",
        unlockUnlimited: "Payez des frais uniques de 5 000 DA pour débloquer la génération illimitée à vie et les fonctionnalités premium.",
        activePlanConfirm: "Service activé avec succès !",
        activePlanDesc: "Vous avez payé les frais de service uniques. Vous avez maintenant un accès illimité pour générer et télécharger tous vos documents.",
        generateDocument: "Générer le document",
        pleaseLoginToSubmit: "Veuillez vous connecter pour continuer",
        loginNow: "Se connecter maintenant",
        loadingUserData: "Chargement des données du compte...",
    }
};
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

    const [simulationPhase, setSimulationPhase] = useState<"idle" | "verifying" | "securing" | "processing">("idle");

    const [user, setUser] = useState<any>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error(err);
            setUser(null);
        } finally {
            setIsAuthLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [step]);

    // Restore state on mount
    useEffect(() => {
        const saved = localStorage.getItem("intake_form_state");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.formData) setFormData(parsed.formData);
                if (parsed.step !== undefined) setStep(parsed.step);
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    // Save state on change
    useEffect(() => {
        if (!isDone) {
            localStorage.setItem("intake_form_state", JSON.stringify({ formData, step }));
        }
    }, [formData, step, isDone]);

    const handlePlanSubmit = async () => {
        setValidationError(null);
        setIsSubmitting(true);
        setSimulationPhase("verifying");
        await new Promise((resolve) => setTimeout(resolve, 800));

        setSimulationPhase("processing");
        await new Promise((resolve) => setTimeout(resolve, 1200));

        try {
            // Clear localStorage progress upon successful generation
            localStorage.removeItem("intake_form_state");
            localStorage.removeItem("intake_active_category");

            await onComplete(formData, isDone);
            setIsDone(true);
        } catch (err: any) {
            console.error(err);
            setValidationError(err.message || 'An error occurred');
        } finally {
            setSimulationPhase("idle");
            setIsSubmitting(false);
        }
    };

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

                    {/* Step 6: Visual Checkout or Plan/Free Tries selection */}
                    {step === 6 && isAuthLoading && (
                        <div className="space-y-6 text-center py-12 animate-pulse">
                            <Loader2 className="w-12 h-12 text-blue-800 animate-spin mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 font-semibold">{localTranslations[localLang].loadingUserData}</p>
                        </div>
                    )}

                    {step === 6 && !isAuthLoading && !user && (
                        <div className="space-y-6 text-center py-12 max-w-sm mx-auto">
                            <LogIn className="w-16 h-16 text-blue-800 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{localTranslations[localLang].pleaseLoginToSubmit}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {localLang === 'ar' ? 'يجب تسجيل الدخول لحفظ مستنداتك وإدارتها لاحقاً.' : 'You must log in to save your documents and manage them later.'}
                            </p>
                            <button
                                onClick={() => router.push('/login')}
                                className="w-full py-3 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all"
                            >
                                {localTranslations[localLang].loginNow}
                            </button>
                        </div>
                    )}

                    {step === 6 && !isAuthLoading && user && user.hasCard === false && (
                        <div className="space-y-8 animate-in slide-in-from-right duration-300">
                            {simulationPhase !== "idle" && (
                                <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 z-[70] rounded-3xl flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                                    <div className="relative mb-6">
                                        <Loader2 className="w-16 h-16 animate-spin text-blue-800" />
                                        <ShieldCheck className="w-8 h-8 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                        {simulationPhase === "verifying" ? (localLang === 'ar' ? 'جاري التحقق...' : 'Verifying...') : (localLang === 'ar' ? 'جاري توليد المستند...' : 'Generating document...')}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
                                        {localLang === 'ar' ? 'جاري معالجة وتوليد مستندك القانوني بأمان.' : 'Processing and securely generating your legal document.'}
                                    </p>
                                </div>
                            )}

                            <div className="text-center">
                                <CreditCard className="w-16 h-16 text-blue-800 dark:text-blue-400 mx-auto mb-4 animate-bounce" />
                                <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-2">
                                    {localLang === 'ar' ? 'تفعيل الخدمة مدى الحياة' : (localLang === 'en' ? 'Activate Lifetime Service' : 'Activer le service à vie')}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-8">
                                    {localLang === 'ar' ? 'يرجى تفعيل الخدمة مدى الحياة لتتمكن من توليد مستندك القانوني.' : (localLang === 'en' ? 'Please activate the lifetime service to generate your legal document.' : 'Veuillez activer le service à vie pour générer votre document juridique.')}
                                </p>
                            </div>

                            <div className="max-w-md mx-auto">
                                {/* Option: Choose Plan */}
                                <div className="bg-gradient-to-tr from-blue-900 to-indigo-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border border-blue-800 flex flex-col justify-between min-h-[280px]">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10 blur-xl"></div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                {localTranslations[localLang].unlimitedAccess}
                                            </span>
                                            <CreditCard className="w-5 h-5 text-amber-300" />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-extrabold tracking-tight text-white">{localTranslations[localLang].useYourPlan}</h4>
                                            <p className="text-sm text-blue-105/80 mt-2 leading-relaxed">
                                                {localTranslations[localLang].unlockUnlimited}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => router.push('/pick-plan')}
                                        className="relative z-10 w-full py-4 mt-6 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-base"
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        <span>{localTranslations[localLang].pickPlan}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 6 && !isAuthLoading && user && user.hasCard === true && (
                        <div className="space-y-6 max-w-md mx-auto animate-in slide-in-from-right duration-300 text-center">
                            {simulationPhase !== "idle" && (
                                <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 z-[70] rounded-3xl flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                                    <div className="relative mb-6">
                                        <Loader2 className="w-16 h-16 animate-spin text-blue-800" />
                                        <ShieldCheck className="w-8 h-8 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                        {simulationPhase === "verifying" ? (localLang === 'ar' ? 'جاري التحقق...' : 'Verifying...') : (localLang === 'ar' ? 'جاري توليد المستند...' : 'Generating document...')}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
                                        {localLang === 'ar' ? 'جاري معالجة وتوليد مستندك القانوني بأمان.' : 'Processing and securely generating your legal document.'}
                                    </p>
                                </div>
                            )}

                            <div className="bg-gradient-to-tr from-emerald-800 to-teal-950 dark:from-slate-900 dark:to-teal-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border border-emerald-700/30">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10 blur-xl"></div>
                                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 animate-bounce" />
                                </div>
                                <h3 className="text-2xl font-black mb-3">{localTranslations[localLang].activePlanConfirm}</h3>
                                <p className="text-sm text-emerald-100/90 leading-relaxed mb-6">
                                    {localTranslations[localLang].activePlanDesc}
                                </p>
                                <div className="bg-white/10 rounded-2xl p-4 flex justify-between items-center text-xs">
                                    <span className="opacity-80">{localLang === 'ar' ? 'الخطة الحالية:' : 'Current Plan:'}</span>
                                    <span className="font-extrabold uppercase bg-emerald-500 px-2 py-0.5 rounded text-white tracking-widest">
                                        {user.plan === "ONETIME_SERVICE" ? (localLang === 'ar' ? 'مدى الحياة' : (localLang === 'en' ? 'LIFETIME' : 'À VIE')) : (user.plan || "PREMIUM")}
                                    </span>
                                </div>

                                <button
                                    onClick={handlePlanSubmit}
                                    disabled={isSubmitting}
                                    className="w-full py-4 mt-6 bg-white hover:bg-gray-100 text-slate-900 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <FileText className="w-5 h-5" />
                                    <span>{localTranslations[localLang].generateDocument}</span>
                                </button>
                            </div>
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
                            user?.hasCard === true ? (
                                <button
                                    onClick={handlePlanSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 sm:px-8 py-3 bg-blue-800 text-white rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-300 font-bold transition-all text-base sm:text-lg disabled:opacity-50"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>{isSubmitting ? t('processing') : localTranslations[localLang].generateDocument}</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => router.push('/pick-plan')}
                                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 sm:px-8 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl shadow-lg shadow-amber-300 font-bold transition-all text-base sm:text-lg"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    <span>{localTranslations[localLang].pickPlan}</span>
                                </button>
                            )
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
