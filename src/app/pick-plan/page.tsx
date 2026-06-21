"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Scale, 
  ArrowLeft, 
  Loader2, 
  Globe, 
  Check, 
  CreditCard, 
  Lock, 
  ShieldCheck 
} from "lucide-react";
import Image from "next/image";
import terms from "@/lib/i18n/legal-terms.json";
import { ThemeToggle } from "@/components/theme-toggle";

type Language = "ar" | "fr" | "en";
type TermKey = keyof typeof terms;

export default function PickPlanPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>("ar");
  const [user, setUser] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("ONETIME_SERVICE");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Credit card states
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  
  // Payment simulation states
  const [simulationPhase, setSimulationPhase] = useState<"idle" | "verifying" | "securing" | "processing">("idle");

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) {
          res.json().then(data => {
            if (data.user) {
              setUser(data.user);
            } else {
              router.push('/login');
            }
          });
        } else {
          router.push('/login');
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const t = (key: TermKey | string) => (terms as Record<string, Record<Language, string>>)[key]?.[lang] || key;
  const isRtl = lang === "ar";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!cardName || cardNumber.replace(/\s+/g, "").length < 16 || cardExpiry.length < 5 || cardCvv.length < 3) {
      setErrorMsg(lang === 'ar' ? 'يرجى إكمال بيانات البطاقة' : (lang === 'en' ? 'Please complete card details' : 'Veuillez compléter les détails de la carte'));
      return;
    }

    setIsLoading(true);

    // Dynamic high-fidelity simulated loading phases
    setSimulationPhase("verifying");
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setSimulationPhase("securing");
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setSimulationPhase("processing");
    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      const res = await fetch('/api/user/pick-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName: selectedPlan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Server error');
        setSimulationPhase("idle");
        setIsLoading(false);
        return;
      }
      
      // On success, redirect to landing page
      router.push('/');
    } catch {
      setErrorMsg('Network error. Check your connection.');
    } finally {
      setSimulationPhase("idle");
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-transparent font-sans py-12 ${isRtl ? 'rtl' : 'ltr'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-full h-96 bg-primary-600 rounded-b-[4rem] shadow-xl -z-10 transition-all duration-500" />
      <div className="fixed top-10 left-10 w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="fixed top-20 right-20 w-96 h-96 bg-secondary-500 rounded-full blur-3xl opacity-20 -z-10" />

      <div className="w-full max-w-2xl mx-4 relative">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-6 font-medium"
        >
          {isRtl ? <ArrowLeft className="w-5 h-5 rotate-180" /> : <ArrowLeft className="w-5 h-5" />}
          {t('back')}
        </button>

        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 relative overflow-hidden">
          
          {/* Simulation Status Overlays */}
          {simulationPhase !== "idle" && (
            <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 z-50 rounded-3xl flex flex-col items-center justify-center p-8 text-center animate-fade-in">
              <div className="relative mb-6">
                <Loader2 className="w-16 h-16 animate-spin text-primary-500" />
                <ShieldCheck className="w-8 h-8 text-secondary-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                {simulationPhase === "verifying" && t('verifyingCard')}
                {simulationPhase === "securing" && t('securingTransaction')}
                {simulationPhase === "processing" && (lang === 'ar' ? 'جاري معالجة الدفع التجريبي...' : (lang === 'en' ? 'Processing simulated checkout...' : 'Traitement du paiement simulé...'))}
              </h3>
              <p className="text-xs text-slate-400 max-w-xs">
                {lang === 'ar' ? 'هذه محاكاة آمنة بالكامل على جانب العميل لتسهيل عملية التثبيت والتسجيل.' : 'This is a secure offline checkout simulation created to complete the onboarding process.'}
              </p>
            </div>
          )}

          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100 dark:border-slate-800">
              <Image 
                src="/logo.png" 
                alt="Taswiya Logo" 
                width={36} 
                height={36} 
                className="w-9 h-9 object-contain"
              />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white text-center">
              {t('planSelection')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm mt-1">
              {t('selectPlanDesc')}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-medium text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Single Premium One-Time Plan Presentation */}
            <div className="max-w-md mx-auto">
              <div className="border-2 border-amber-500 bg-amber-50/10 dark:bg-amber-950/10 rounded-3xl p-6 relative overflow-hidden shadow-xl scale-[1.01] hover:scale-[1.02] transition-all duration-300">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {lang === 'ar' ? 'رسوم الخدمة' : (lang === 'en' ? 'SERVICE FEE' : 'FRAIS DE SERVICE')}
                </div>
                
                <div className="text-center mt-3">
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                    {lang === 'ar' ? 'تفعيل مستند قانوني واحد' : (lang === 'en' ? 'Single Legal Document' : 'Document Juridique Unique')}
                  </h3>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-semibold">
                    {lang === 'ar' ? 'توليد وتنزيل مستندك الحالي' : (lang === 'en' ? 'Generate & download your current document' : 'Générer & télécharger votre document actuel')}
                  </p>
                  <div className="text-4xl font-black text-amber-600 dark:text-amber-500 mt-5 mb-2 flex items-center justify-center gap-1">
                    <span>5,000</span>
                    <span className="text-lg font-bold text-slate-500 dark:text-slate-400">DZD</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {lang === 'ar' ? 'الدفع لكل مستند تقوم بإنشائه' : (lang === 'en' ? 'Pay only for the document you create' : 'Payez uniquement pour le document que vous créez')}
                  </p>
                </div>

                <div className="border-t border-gray-100 dark:border-slate-800/80 my-5" />

                <ul className="text-sm text-slate-650 dark:text-slate-350 space-y-3 px-2">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>{lang === 'ar' ? 'توليد وتنزيل مستند قانوني كامل' : (lang === 'en' ? 'Generate and download one complete legal document' : 'Génération d\'un document juridique complet')}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>{lang === 'ar' ? 'الوصول لجميع النماذج الحالية والمستقبلية' : (lang === 'en' ? 'Access to all current & future templates' : 'Accès à tous les modèles actuels & futurs')}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>{lang === 'ar' ? 'تصدير بصيغة PDF عالية الجودة' : (lang === 'en' ? 'High-fidelity PDF export' : 'Exportation PDF haute fidélité')}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>{lang === 'ar' ? 'توقيعات رقمية وإزالة العلامات المائية' : (lang === 'en' ? 'Digital signatures & watermark removal' : 'Signatures numériques & retrait du filigrane')}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Payment Section */}
            <div className="border-t border-gray-150 dark:border-slate-800 pt-8 space-y-6">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white text-center flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-500" />
                {t('checkoutSecure')}
              </h2>

              {/* Card visualizer */}
              <div className="w-full max-w-sm mx-auto mb-6 perspective-1000">
                <div className={`relative w-full h-48 rounded-2xl transition-transform duration-700 preserve-3d cursor-pointer ${isCardFlipped ? 'rotate-y-180' : ''}`}>
                  {/* Front */}
                  <div className={`absolute inset-0 w-full h-full rounded-2xl p-6 text-white backface-hidden flex flex-col justify-between shadow-xl ${currentBrand.gradient}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] uppercase opacity-75 tracking-wider font-semibold">Taswiya Premium Card</p>
                        <p className="text-xs font-bold mt-0.5">{selectedPlan === "ONETIME_SERVICE" ? "SINGLE DOCUMENT" : selectedPlan.toUpperCase()} ACCESS</p>
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
                      This card is used solely for the client-side registration checkout simulation of the Taswiya Legal automated platform. No real funds are transferred.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4 max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{t('cardholderName')}</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="E.g. CHAMSDINE TOUAHRI"
                    className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{t('cardNumber')}</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      placeholder="6280 •••• •••• ••••"
                      className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 pl-12 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all bg-transparent"
                    />
                    <CreditCard className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {t('mockCardPlaceholder')} (Prefix 4 = Visa, 5 = MasterCard, 6280/606 = Dahabia, 981 = CIB)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{t('expiryDate')}</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all bg-transparent text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{t('cvv')}</label>
                    <input
                      type="text"
                      required
                      value={cardCvv}
                      onChange={(e) => handleCvvChange(e.target.value)}
                      onFocus={() => setIsCardFlipped(true)}
                      onBlur={() => setIsCardFlipped(false)}
                      placeholder="123"
                      className="w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all bg-transparent text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 max-w-md mx-auto">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white p-4 rounded-xl font-bold hover:bg-amber-600 shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />{t('processing')}</>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      {t('payAndRegister')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Floating actions & Language Toggle */}
        <div className="absolute top-6 right-6 flex items-center gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-full px-3 py-1.5 shadow-sm border border-gray-100 dark:border-slate-800 text-gray-700 dark:text-gray-300">
            <Globe className="w-4 h-4 opacity-70" />
            <select
              value={lang}
              onChange={e => setLang(e.target.value as Language)}
              className="bg-transparent border-none outline-none font-semibold cursor-pointer text-sm"
            >
              <option value="ar" className="text-gray-800 dark:text-gray-200">العربية</option>
              <option value="fr" className="text-gray-800 dark:text-gray-200">Français</option>
              <option value="en" className="text-gray-800 dark:text-gray-200">English</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
