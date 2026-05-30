"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Scale, 
  LogIn, 
  KeyRound, 
  Mail, 
  ArrowLeft, 
  Loader2, 
  Globe, 
  UserPlus, 
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

const ERRORS: Record<string, string> = {
  'Invalid credentials': 'Email ou mot de passe incorrect.',
  'Email and password required': 'Veuillez remplir tous les champs.',
  'Server error': 'Erreur serveur. Réessayez.',
  'Email not verified': 'Veuillez vérifier votre email avant de vous connecter.',
  'Your account has been banned. Please contact support.': 'Votre compte a été banni. Veuillez contacter le support.',
};

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>("ar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [showResendBtn, setShowResendBtn] = useState(false);

  // Multi-step registration states
  const [signUpStep, setSignUpStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium" | "enterprise">("premium");
  
  // Credit card states
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  
  // Payment simulation states
  const [simulationPhase, setSimulationPhase] = useState<"idle" | "verifying" | "securing" | "processing">("idle");

  useEffect(() => {
      if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          if (params.get('verified') === 'true') {
              setSuccessMsg(lang === 'ar' ? 'تم تفعيل حسابك بنجاح! يمكنك الآن تسجيل الدخول.' : 'Compte activé avec succès ! Vous pouvez maintenant vous connecter.');
          }
          const error = params.get('error');
          if (error === 'invalid_token') {
              setErrorMsg(lang === 'ar' ? 'رابط التفعيل غير صالح أو منتهي الصلاحية.' : 'Lien d\'activation invalide ou expiré.');
          } else if (error === 'server_error') {
              setErrorMsg(lang === 'ar' ? 'حدث خطأ في الخادم أثناء التفعيل.' : 'Erreur serveur lors de l\'activation.');
          }
      }

      // Check if already logged in
      fetch('/api/auth/me')
        .then(res => {
          if (res.ok) {
            res.json().then(data => {
              if (data.user) {
                if (data.user.role === 'ADMIN') {
                  router.push('/admin');
                } else {
                  router.push('/');
                }
              }
            });
          }
        })
        .catch(() => {});
  }, [lang, router]);

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

  const handleRegisterSubmit = async () => {
    // Basic validations
    if (!name || !nationalId || !phoneNumber || !email || !password) {
      setErrorMsg(t('fieldsRequired'));
      setSignUpStep(1);
      return;
    }

    if (!cardName || cardNumber.replace(/\s+/g, "").length < 16 || cardExpiry.length < 5 || cardCvv.length < 3) {
      setErrorMsg(lang === 'ar' ? 'يرجى إكمال بيانات البطاقة' : (lang === 'en' ? 'Please complete card details' : 'Veuillez compléter les détails de la carte'));
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    // Dynamic high-fidelity simulated loading phases
    setSimulationPhase("verifying");
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setSimulationPhase("securing");
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setSimulationPhase("processing");
    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, nationalId, phoneNumber }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(ERRORS[data.error] || data.error);
        setSimulationPhase("idle");
        setIsLoading(false);
        return;
      }
      
      if (data.needsVerification) {
          setSuccessMsg(lang === 'ar' ? 'تم إرسال بريد التفعيل. يرجى مراجعة بريدك الإلكتروني.' : 'Email de vérification envoyé. Veuillez consulter votre boîte mail.');
          setIsSignUp(false);
          setSignUpStep(1);
          setCardName("");
          setCardNumber("");
          setCardExpiry("");
          setCardCvv("");
      } else {
          // Auto login if no verification needed
          const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          if (loginRes.ok) {
            router.push('/');
          }
      }
    } catch {
      setErrorMsg('Erreur réseau. Vérifiez votre connexion.');
    } finally {
      setSimulationPhase("idle");
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setShowResendBtn(false);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.needsVerification) {
            setErrorMsg(lang === 'ar' ? 'يرجى تفعيل حسابك أولاً. تحقق من بريدك الإلكتروني.' : 'Veuillez activer votre compte. Vérifiez vos emails.');
            setShowResendBtn(true);
        } else {
            setErrorMsg(ERRORS[data.error] || data.error || 'Erreur de connexion');
        }
        return;
      }

      // Redirect by role
      const role = data.user?.role;
      if (role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch {
      setErrorMsg('Erreur réseau. Vérifiez votre connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    try {
      const res = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSuccessMsg(lang === 'ar' ? 'تم إرسال رابط تفعيل جديد.' : 'Un nouveau lien d\'activation a été envoyé.');
        setErrorMsg(null);
        setShowResendBtn(false);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to resend');
      }
    } catch {
      setErrorMsg('Network error');
    } finally {
      setIsResending(false);
    }
  };

  const handleNextStep = () => {
    setErrorMsg(null);
    if (signUpStep === 1) {
      if (!name || !nationalId || !phoneNumber || !email || !password) {
        setErrorMsg(t('fieldsRequired'));
        return;
      }
      setSignUpStep(2);
    } else if (signUpStep === 2) {
      setSignUpStep(3);
    }
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    if (signUpStep > 1) {
      setSignUpStep(signUpStep - 1);
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

      <div className="w-full max-w-xl mx-4 relative">
        <button
          onClick={() => {
            if (isSignUp && signUpStep > 1) {
              handlePrevStep();
            } else {
              router.push('/');
            }
          }}
          className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-6 font-medium"
        >
          {isRtl ? <ArrowLeft className="w-5 h-5 rotate-180" /> : <ArrowLeft className="w-5 h-5" />}
          {isSignUp && signUpStep > 1 ? t('backStep') : t('back')}
        </button>

        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800">
          <div className="flex flex-col items-center mb-6">
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
              {isSignUp ? t('signUp') : t('signInToTaswiya')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm mt-1">
              {isSignUp 
                ? (signUpStep === 1 ? t('welcomeBack') : (signUpStep === 2 ? t('selectPlanDesc') : t('checkoutSecure')))
                : t('welcomeBack')
              }
            </p>

            {/* Stepper indicator */}
            {isSignUp && (
              <div className="flex items-center gap-2 mt-4 w-full max-w-xs justify-center">
                <div className={`h-2 rounded-full transition-all duration-300 ${signUpStep >= 1 ? 'w-8 bg-primary-500' : 'w-2 bg-gray-200 dark:bg-slate-700'}`} />
                <div className={`h-2 rounded-full transition-all duration-300 ${signUpStep >= 2 ? 'w-8 bg-primary-500' : 'w-2 bg-gray-200 dark:bg-slate-700'}`} />
                <div className={`h-2 rounded-full transition-all duration-300 ${signUpStep >= 3 ? 'w-8 bg-primary-500' : 'w-2 bg-gray-200 dark:bg-slate-700'}`} />
              </div>
            )}
          </div>

          {/* Success / Error alerts */}
          {successMsg && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium text-center">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-medium text-center">
              {errorMsg}
              {showResendBtn && (
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="block w-full mt-2 text-xs font-bold underline hover:text-red-800 disabled:opacity-50"
                >
                  {isResending ? (lang === 'ar' ? 'جاري الإرسال...' : 'Envoi...') : (lang === 'ar' ? 'إعادة إرسال بريد التفعيل' : 'Renvoyer l\'email de vérification')}
                </button>
              )}
            </div>
          )}

          {/* Registration step 1 OR standard Login */}
          {(!isSignUp || signUpStep === 1) && (
            <form onSubmit={isSignUp ? (e) => { e.preventDefault(); handleNextStep(); } : handleLoginSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('name')}</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className={`w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all bg-transparent ${isRtl ? 'text-right' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('nationalId')}</label>
                    <input
                      type="text"
                      required
                      value={nationalId}
                      onChange={e => setNationalId(e.target.value)}
                      placeholder="1234567890123456"
                      className={`w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all bg-transparent ${isRtl ? 'text-right' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('phoneNumber')}</label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="05xxxxxxxx"
                      className={`w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all bg-transparent ${isRtl ? 'text-right' : ''}`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('emailAddress')}</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all bg-transparent ${isRtl ? 'pl-4 pr-12' : 'pl-12 pr-4'}`}
                    placeholder="name@email.com"
                  />
                  <Mail className={`absolute top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 ${isRtl ? 'right-4' : 'left-4'}`} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('password')}</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={`w-full border-2 border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all bg-transparent ${isRtl ? 'pl-4 pr-12' : 'pl-12 pr-4'}`}
                    placeholder="••••••••"
                  />
                  <KeyRound className={`absolute top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 ${isRtl ? 'right-4' : 'left-4'}`} />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white p-4 rounded-xl font-bold hover:bg-primary-700 shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" />{isSignUp ? t('signingUp') : t('signingIn')}</>
                ) : (
                  <>
                    {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                    {isSignUp ? t('continue') : t('signInButton')}
                  </>
                )}
              </button>
            </form>
          )}

          {/* Registration step 2: Pricing plans */}
          {isSignUp && signUpStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white text-center flex items-center justify-center gap-2">
                <Globe className="w-5 h-5 text-primary-500" />
                {t('planSelection')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Basic Plan */}
                <div 
                  onClick={() => setSelectedPlan("basic")}
                  className={`border-2 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between relative ${selectedPlan === "basic" ? "border-primary-500 bg-primary-50/30 dark:bg-primary-950/10 shadow-lg scale-[1.02]" : "border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700"}`}
                >
                  <div>
                    <h3 className="font-extrabold text-slate-800 dark:text-white">{t('basicPlan')}</h3>
                    <p className="text-xs text-slate-400 mt-1">For single users</p>
                    <div className="text-xl font-black text-primary-600 mt-3">1,500 <span className="text-xs font-normal text-slate-500">{t('dzdPerMonth')}</span></div>
                  </div>
                  <ul className="text-xs text-slate-500 space-y-2 mt-4">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" /> 1 Case/mo</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" /> PDF Export</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" /> Standard</li>
                  </ul>
                </div>

                {/* Premium Plan */}
                <div 
                  onClick={() => setSelectedPlan("premium")}
                  className={`border-2 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between relative ${selectedPlan === "premium" ? "border-amber-500 bg-amber-50/20 dark:bg-amber-950/10 shadow-lg scale-[1.02]" : "border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700"}`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">POPULAR</div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 dark:text-white">{t('premiumPlan')}</h3>
                    <p className="text-xs text-amber-600 mt-1">For professionals</p>
                    <div className="text-xl font-black text-amber-600 mt-3">3,500 <span className="text-xs font-normal text-slate-500">{t('dzdPerMonth')}</span></div>
                  </div>
                  <ul className="text-xs text-slate-500 space-y-2 mt-4">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" /> Unlimited</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" /> Premium Templates</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" /> Signature Removal</li>
                  </ul>
                </div>

                {/* Enterprise Plan */}
                <div 
                  onClick={() => setSelectedPlan("enterprise")}
                  className={`border-2 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between relative ${selectedPlan === "enterprise" ? "border-primary-500 bg-primary-50/30 dark:bg-primary-950/10 shadow-lg scale-[1.02]" : "border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700"}`}
                >
                  <div>
                    <h3 className="font-extrabold text-slate-800 dark:text-white">{t('enterprisePlan')}</h3>
                    <p className="text-xs text-slate-400 mt-1">For law firms</p>
                    <div className="text-xl font-black text-primary-600 mt-3">7,500 <span className="text-xs font-normal text-slate-500">{t('dzdPerMonth')}</span></div>
                  </div>
                  <ul className="text-xs text-slate-500 space-y-2 mt-4">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" /> Firm Templates</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" /> Team Accounts</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" /> Custom Templating</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 border-2 border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 p-3.5 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                >
                  {t('backStep')}
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 bg-primary-600 text-white p-3.5 rounded-xl font-bold hover:bg-primary-700 shadow-md transition-all active:scale-95"
                >
                  {t('continue')}
                </button>
              </div>
            </div>
          )}

          {/* Registration step 3: Simulated secure payment check out */}
          {isSignUp && signUpStep === 3 && (
            <div className="space-y-6">
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

              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white text-center flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-500" />
                {t('checkoutSecure')}
              </h2>

              {/* High fidelity credit card live-updating 3D visualizer */}
              <div className="w-full max-w-sm mx-auto mb-6 perspective-1000">
                <div className={`relative w-full h-48 rounded-2xl transition-transform duration-700 preserve-3d cursor-pointer ${isCardFlipped ? 'rotate-y-180' : ''}`}>
                  {/* Front of the Card */}
                  <div className={`absolute inset-0 w-full h-full rounded-2xl p-6 text-white backface-hidden flex flex-col justify-between shadow-xl ${currentBrand.gradient}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] uppercase opacity-75 tracking-wider font-semibold">Taswiya Premium Card</p>
                        <p className="text-xs font-bold mt-0.5">{selectedPlan.toUpperCase()} MEMBER</p>
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

                  {/* Back of the Card */}
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
              <div className="space-y-4">
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

              {/* Navigation controls */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 border-2 border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 p-3.5 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                >
                  {t('backStep')}
                </button>
                <button
                  type="button"
                  onClick={handleRegisterSubmit}
                  disabled={isLoading}
                  className="flex-1 bg-amber-500 text-white p-3.5 rounded-xl font-bold hover:bg-amber-600 shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {t('payAndRegister')}
                </button>
              </div>
            </div>
          )}

          {/* Toggle login vs signup */}
          {simulationPhase === "idle" && (
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {isSignUp ? t('alreadyAccount') : t('noAccount')}{' '}
                <button
                  type="button"
                  onClick={() => { 
                    setIsSignUp(!isSignUp); 
                    setErrorMsg(null); 
                    setSignUpStep(1);
                  }}
                  className="text-secondary-600 dark:text-secondary-400 font-bold hover:text-secondary-500 transition-colors"
                >
                  {isSignUp ? t('signInButton') : t('signUp')}
                </button>
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-4">
                {lang === 'ar' ? 'بمتابعتك، أنت توافق على ' : (lang === 'en' ? 'By continuing, you agree to our ' : 'En continuant, vous acceptez nos ')}
                <a href="/terms" className="underline hover:text-primary-500">
                  {lang === 'ar' ? 'شروط الخدمة' : (lang === 'en' ? 'Terms of Service' : 'Conditions d\'Utilisation')}
                </a>.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
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
    </div>
  );
}
