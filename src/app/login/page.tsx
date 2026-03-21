"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scale, LogIn, KeyRound, Mail, ArrowLeft, Loader2, Globe, UserPlus } from "lucide-react";
import terms from "@/lib/i18n/legal-terms.json";

type Language = "ar" | "fr" | "en";
type TermKey = keyof typeof terms;

const ERRORS: Record<string, string> = {
  'Invalid credentials': 'Email ou mot de passe incorrect.',
  'Email and password required': 'Veuillez remplir tous les champs.',
  'Server error': 'Erreur serveur. Réessayez.',
};

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>("fr");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const t = (key: TermKey | string) => (terms as Record<string, Record<Language, string>>)[key]?.[lang] || key;
  const isRtl = lang === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        // Register new user
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(ERRORS[data.error] || data.error);
          return;
        }
        // Auto-login after register
      }

      // Login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(ERRORS[data.error] || data.error || 'Erreur de connexion');
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

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-50 font-sans ${isRtl ? 'rtl' : 'ltr'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-96 bg-primary-600 rounded-b-[4rem] shadow-xl -z-10" />
      <div className="fixed top-10 left-10 w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="fixed top-20 right-20 w-96 h-96 bg-secondary-500 rounded-full blur-3xl opacity-20 -z-10" />

      <div className="w-full max-w-md mx-4">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-8 font-medium"
        >
          {isRtl ? <ArrowLeft className="w-5 h-5 rotate-180" /> : <ArrowLeft className="w-5 h-5" />}
          {t('back')}
        </button>

        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-100">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-primary-100">
              <Scale className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-primary-500 mb-2 text-center">
              {isSignUp ? t('signUp') : t('signInToSettleUp')}
            </h1>
            <p className="text-gray-500 text-center">{t('welcomeBack')}</p>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-sm font-bold text-primary-500 mb-2">Nom complet</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={`w-full border-2 border-gray-200 rounded-xl p-3 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all ${isRtl ? 'text-right' : ''}`}
                  placeholder="Votre nom"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-primary-500 mb-2">{t('emailAddress')}</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`w-full border-2 border-gray-200 rounded-xl p-3 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all ${isRtl ? 'pl-4 pr-12' : 'pl-12 pr-4'}`}
                  placeholder="nom@email.com"
                />
                <Mail className={`absolute top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 ${isRtl ? 'right-4' : 'left-4'}`} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-primary-500 mb-2">{t('password')}</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full border-2 border-gray-200 rounded-xl p-3 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all ${isRtl ? 'pl-4 pr-12' : 'pl-12 pr-4'}`}
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
                <><Loader2 className="w-5 h-5 animate-spin" />{isSignUp ? 'Inscription...' : t('signingIn')}</>
              ) : (
                <>
                  {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  {isSignUp ? t('signUp') : t('signInButton')}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              {isSignUp ? 'Déjà un compte ?' : t('noAccount')}{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(null); }}
                className="text-secondary-600 font-bold hover:text-secondary-500 transition-colors"
              >
                {isSignUp ? t('signInButton') : t('signUp')}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 shadow-sm border border-white/20 text-white">
            <Globe className="w-4 h-4 opacity-70" />
            <select
              value={lang}
              onChange={e => setLang(e.target.value as Language)}
              className="bg-transparent border-none outline-none font-semibold cursor-pointer text-sm"
            >
              <option value="ar" className="text-gray-800">العربية</option>
              <option value="fr" className="text-gray-800">Français</option>
              <option value="en" className="text-gray-800">English</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
