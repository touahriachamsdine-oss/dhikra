"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import terms from "@/lib/i18n/legal-terms.json";
import IntakeForm from "@/components/intake-form";
import { Scale, Home, Briefcase, Car, ShoppingCart, Hammer, FileText, CheckCircle, Mail, Globe, Users, ShieldCheck, LogIn, ChevronDown, BookOpen, Download } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

type Language = "ar" | "fr" | "en";
type TermKey = keyof typeof terms;

function LandingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Language>("fr");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [user, setUser] = useState<any>(null);
  const [userCases, setUserCases] = useState<any[]>([]);
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [caseFiles, setCaseFiles] = useState<{ [key: string]: any[] }>({});
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);



  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : { user: null })
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (user && view === 'dashboard') {
      fetch('/api/cases')
        .then(res => res.json())
        .then(data => setUserCases(data.cases || []))
        .catch(() => setUserCases([]));
    }
  }, [user, view]);

  const fetchFiles = async (caseId: string) => {
    try {
      const res = await fetch(`/api/cases/${caseId}/files`);
      if (res.ok) {
        const data = await res.json();
        setCaseFiles(prev => ({ ...prev, [caseId]: data.files || [] }));
      }
    } catch (error) {
      console.error('Error fetching files', error);
    }
  };

  const handleFileUpload = async (caseId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(caseId);
    try {
      let finalUrl = `https://example.com/files/${Date.now()}_${file.name}`;

      // Attempt real upload if Supabase is configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${caseId}/${Date.now()}.${fileExt}`;

        const { data, error: uploadError } = await supabase.storage
          .from('legal-documents')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Supabase upload error:', uploadError);
        } else if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from('legal-documents')
            .getPublicUrl(fileName);
          finalUrl = publicUrl;
        }
      }

      const res = await fetch(`/api/cases/${caseId}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileUrl: finalUrl,
          fileType: file.type
        })
      });

      if (res.ok) {
        fetchFiles(caseId);
      } else {
        alert("Erreur lors de l'envoi du fichier.");
      }
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setIsUploading(null);
    }
  };



  // Trigger dashboard view if passed via URL after login
  useEffect(() => {
    if (searchParams.get('view') === 'dashboard') {
      setView('dashboard');
    }
  }, [searchParams]);

  const t = (key: TermKey | string) => (terms as any)[key]?.[lang] || key;
  const isRtl = lang === "ar";

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setView('landing');
    router.refresh();
  };

  const handleGeneratePDF = async (formData: any, isReDownload?: boolean) => {
    if (!user) {
      alert(t('pleaseLoginToSubmit'));
      router.push('/login');
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!isReDownload) {
        // 1. Post to API cases
        const caseRes = await fetch('/api/cases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentType: activeCategory,
            title: t('casePrefix') + String(t(activeCategory || 'document')),
            plaintiffName: formData.plaintiffName,
            plaintiffPhone: formData.plaintiffPhone,
            plaintiffAddress: formData.plaintiffAddress,
            defendantName: formData.defendantName,
            defendantPhone: formData.defendantPhone,
            defendantAddress: formData.defendantAddress,
            defendantType: formData.defendantType,
            description: formData.description || t('submittedViaForm'),
            amount: formData.amount,
            noticeType: formData.noticeType,
            deadlineDays: parseInt(formData.deadlineDays),
          })
        });

        if (!caseRes.ok) throw new Error('Failed to create case');
        await new Promise(r => setTimeout(r, 1000));
      }

      // 2. Download the generated PDF
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: activeCategory,
          plaintiffName: formData.plaintiffName,
          plaintiffPhone: formData.plaintiffPhone,
          plaintiffAddress: formData.plaintiffAddress,
          defendantName: formData.defendantName,
          defendantPhone: formData.defendantPhone,
          defendantAddress: formData.defendantAddress,
          defendantType: formData.defendantType,
          subject: formData.description,
          amount: formData.amount,
          noticeType: formData.noticeType,
          deadlineDays: formData.deadlineDays,
        }),
      });


      if (!response.ok) throw new Error('Failed to generate document');

      const contentType = response.headers.get('Content-Type');
      const isHtml = contentType?.includes('text/html');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = isHtml
        ? `Document_Legal_${new Date().getTime()}.html`
        : `Mise_en_Demeure_${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

    } catch (error) {
      console.error(error);
      alert('Error generating legal document');
    }
  };

  const categories = [
    { id: 'catHousing', icon: <Home className="w-8 h-8" />, color: 'text-primary-600', bg: 'bg-primary-50' },
    { id: 'catWork', icon: <Briefcase className="w-8 h-8" />, color: 'text-primary-600', bg: 'bg-primary-50' },
    { id: 'catAuto', icon: <Car className="w-8 h-8" />, color: 'text-primary-600', bg: 'bg-primary-50' },
    { id: 'catConsumer', icon: <ShoppingCart className="w-8 h-8" />, color: 'text-primary-600', bg: 'bg-primary-50' },
    { id: 'catSERVICES', icon: <Hammer className="w-8 h-8" />, color: 'text-primary-600', bg: 'bg-primary-50' },
    { id: 'catLegalNotice', icon: <Scale className="w-8 h-8" />, color: 'text-secondary-600', bg: 'bg-secondary-50' },
  ];


  return (
    <div className={`min-h-screen flex flex-col font-sans ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border border-emerald-400">
            <CheckCircle className="w-5 h-5" />
            {t('creationSuccess')}
          </div>
        </div>
      )}
      {/* Header with Navigation and Auth */}

      <header className="flex justify-between items-center py-4 px-8 max-w-7xl mx-auto w-full absolute top-0 left-0 right-0 z-20">
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="Taswiya Logo" 
            width={48} 
            height={48} 
            className="w-12 h-12 object-contain"
          />
          <h1 className="text-2xl font-black tracking-tight text-primary-500">
            Taswiya
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 bg-white dark:bg-slate-900/70 backdrop-blur-xl px-8 py-3 rounded-full shadow-sm border border-gray-100 dark:border-slate-800 font-semibold text-gray-700">
          <button onClick={() => router.push('/services')} className="flex items-center gap-1 hover:text-primary-600 transition-colors">
            {t('services')}
          </button>
          <button onClick={() => router.push('/articles')} className="flex items-center gap-1 hover:text-primary-600 transition-colors">
            <BookOpen className="w-4 h-4 text-gray-400" /> {t('articles')}
          </button>
        </nav>


        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* Language Toggle */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-full px-3 py-1 shadow-sm border border-gray-100 dark:border-slate-800">
            <Globe className="w-4 h-4 text-gray-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-transparent border-none outline-none font-semibold text-gray-700 cursor-pointer text-sm"
            >
              <option value="ar">AR</option>
              <option value="fr">FR</option>
              <option value="en">EN</option>
            </select>
          </div>

          {/* Auth Button */}
          {user ? (
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-sm font-bold text-gray-700 bg-gray-100 dark:bg-slate-800 rounded-full px-3 py-1 truncate max-w-[120px]">{user.name || user.email}</span>
              <button
                onClick={() => setView(view === 'dashboard' ? 'landing' : 'dashboard')}
                className="flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-primary-200 transition-colors"
              >
                {view === 'dashboard' ? t('home') : t('dashboard')}
              </button>
              <button
                onClick={() => router.push('/settings')}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                title="Settings"
              >
                <Hammer className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full font-bold hover:bg-red-100 transition-colors"
              >
                <LogIn className="w-4 h-4 rotate-180" />
                {t('logout')}
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="hidden sm:flex items-center gap-2 bg-primary-600 text-white px-5 py-2 rounded-full font-bold shadow-md hover:bg-primary-700 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              {t('login')}
            </button>
          )}
        </div>
      </header>

      {view === 'landing' && (
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 px-6 sm:px-12 border-b border-gray-100 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">

            {/* Split layout for Illustration and Text */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
              <div className="flex-1 text-left rtl:text-right">
                <span className="bg-secondary-500 text-primary-500 text-sm font-black px-4 py-1.5 rounded-full mb-6 inline-block uppercase tracking-wider shadow-sm">
                  #1 {t('trustedBy')}
                </span>
                <h1 className="text-5xl sm:text-6xl font-extrabold text-primary-500 mb-6 leading-tight tracking-tight">
                  {t('heroTitle')}
                </h1>
                <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl leading-relaxed">
                  {t('heroSubtitle')}
                </p>
                <div className="flex items-center gap-4">
                  <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-700 transition-transform hover:-translate-y-1 shadow-lg text-lg">
                    {t('startProcess')}
                  </button>
                  <div className="flex -space-x-4 rtl:space-x-reverse">
                    <img className="w-12 h-12 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=33" alt="User" />
                    <img className="w-12 h-12 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=47" alt="User" />
                    <img className="w-12 h-12 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=12" alt="User" />
                    <div className="w-12 h-12 rounded-full border-2 border-white bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs">+10k</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex justify-center lg:justify-end relative h-[500px]">
                {/* Abstract Interactive Legal Composition */}
                <div className="relative w-full max-w-md aspect-square group">
                  {/* Glowing background orbs */}
                  <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-500/20 rounded-full blur-[64px] group-hover:bg-secondary-500/30 transition-colors duration-700"></div>
                  <div className="absolute top-1/4 right-[20%] w-48 h-48 bg-primary-600/10 rounded-full blur-[48px] group-hover:bg-primary-600/20 transition-colors duration-700"></div>

                  {/* Center main piece */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 
                    bg-white dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-full border-4 border-white shadow-[0_0_40px_rgba(251,191,36,0.3)]
                    hover:scale-110 transition-transform duration-500 cursor-pointer">
                    <Image 
                      src="/logo.png" 
                      alt="Taswiya Center Logo" 
                      width={120} 
                      height={120} 
                      className="w-24 h-24 object-contain"
                    />
                  </div>

                  {/* Floating Document 1 */}
                  <div className="absolute top-[10%] left-[5%] z-10 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 
                    animate-float-slow hover:-translate-y-2 hover:rotate-3 transition-all duration-300 cursor-pointer flex flex-col gap-3 w-40">
                    <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full"></div>
                    <div className="h-2 w-2/3 bg-gray-100 dark:bg-slate-800 rounded-full"></div>
                    <div className="absolute -bottom-3 -right-3 bg-secondary-500 text-white rounded-full p-1.5 shadow-lg">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Floating Notification/Message 2 */}
                  <div className="absolute bottom-[10%] left-[0%] z-30 bg-primary-600 text-white p-4 rounded-2xl shadow-2xl 
                    animate-float-medium hover:scale-105 transition-transform duration-300 cursor-pointer flex items-center gap-4 w-48">
                    <Mail className="w-8 h-8 text-secondary-500" />
                    <div>
                      <div className="text-xs text-blue-200 font-bold mb-1">Mise en Demeure</div>
                      <div className="text-sm font-black">Envoyé LRAR</div>
                    </div>
                  </div>



                  {/* Floating Shield 4 */}
                  <div className="absolute bottom-[25%] right-[5%] z-20 bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 
                    animate-float-fast hover:-rotate-6 hover:scale-110 transition-all duration-300 cursor-pointer">
                    <ShieldCheck className="w-10 h-10 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Categories Section */}
          <section className="py-20 px-6 sm:px-12 bg-white dark:bg-slate-900 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-primary-500 mb-4">{t('categoriesTitle')}</h2>
              <div className="w-24 h-1.5 bg-secondary-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="group bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:border-primary-600 hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col items-center text-center gap-4 relative overflow-hidden text-lg"
                >
                  <div className={`p-4 rounded-2xl ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <span className="font-bold text-primary-500 group-hover:text-primary-600 transition-colors">
                    {t(cat.id)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-24 px-6 sm:px-12 bg-primary-500 text-white rounded-[3rem] mx-4 mb-20">
            <div className="max-w-6xl mx-auto relative">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold mb-4">{t('howItWorks')}</h2>
                <div className="w-24 h-1.5 bg-secondary-500 mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-24 h-24 bg-primary-600/50 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-primary-400">
                    <FileText className="w-12 h-12 text-blue-200" />
                  </div>
                  <h3 className="text-xl font-bold">{t('step1')}</h3>
                  <p className="text-blue-100 text-lg leading-relaxed">{t('step1Desc')}</p>
                </div>

                <div className="flex flex-col items-center gap-6">
                  <div className="w-24 h-24 bg-primary-600/50 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-primary-400">
                    <ShieldCheck className="w-12 h-12 text-blue-200" />
                  </div>
                  <h3 className="text-xl font-bold">{t('step2')}</h3>
                  <p className="text-blue-100 text-lg leading-relaxed">{t('step2Desc')}</p>
                </div>

                <div className="flex flex-col items-center gap-6">
                  <div className="w-24 h-24 bg-secondary-500/20 text-secondary-500 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-secondary-500/50">
                    <Mail className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold">{t('step3')}</h3>
                  <p className="text-blue-100 text-lg leading-relaxed">{t('step3Desc')}</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {view === 'dashboard' && (
        <main className="flex-1 bg-gray-50 dark:bg-slate-950 pt-32 px-6 sm:px-12 pb-24">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-3xl font-extrabold text-primary-500">{t('myCases')}</h2>
              <button
                onClick={() => setView('landing')}
                className="bg-primary-500 text-white px-4 py-2 text-sm rounded-lg font-bold hover:bg-primary-600 transition-colors"
              >
                + {t('createNewCase')}
              </button>
            </div>

            {userCases.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">{t('noCases')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userCases.map(c => (
                  <div key={c.id} className="space-y-2">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="flex-1 w-full">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg flex items-center gap-2">
                          <FileText className="w-5 h-5 text-secondary-500 flex-shrink-0" />
                          <span className="truncate">{c.title || t('legalCase')}</span>
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate">{t('against')} <span className="text-gray-700 dark:text-gray-200">{c.defendantName || t('notDefined')}</span></p>
                          <p className="text-xs text-gray-400 flex-shrink-0">{t('submittedOn')} {new Date(c.createdAt).toLocaleDateString('fr-DZ')}</p>
                          {c.trackingNumber && (
                            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-blue-100 dark:border-blue-800">
                              #{c.trackingNumber}
                            </span>
                          )}
                          {c.deadlineDays && (
                            <span className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-100 dark:border-amber-800">
                              {c.deadlineDays} {t('days')}
                            </span>
                          )}
                        </div>

                      </div>
                      <div className="w-full md:w-auto flex items-center gap-3 justify-end">
                        <button
                          onClick={() => {
                            if (expandedCase === c.id) setExpandedCase(null);
                            else {
                              setExpandedCase(c.id);
                              fetchFiles(c.id);
                            }
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
                            ${expandedCase === c.id
                              ? 'bg-primary-600 text-white shadow-lg'
                              : 'bg-white dark:bg-slate-800 text-primary-600 border border-primary-100 dark:border-slate-700 hover:border-primary-600 hover:shadow-md'}`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          {expandedCase === c.id ? t('close') : t('manageFiles')}
                        </button>
                        <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide
                           ${c.status === 'OPEN' ? 'bg-blue-50 text-blue-700 border border-blue-100' :

                            c.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                              c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                'bg-red-50 text-red-700 border border-red-100'}`}>
                          {c.status === 'OPEN' ? t('statusOpen') :
                            c.status === 'IN_PROGRESS' ? t('statusInProgress') :
                              c.status === 'RESOLVED' ? t('statusResolved') : t('statusRejected')}
                        </span>
                      </div>
                    </div>


                    {expandedCase === c.id && (
                      <div className="mx-6 bg-gray-50/50 dark:bg-slate-900/50 border-x border-b border-gray-100 dark:border-slate-800 rounded-b-2xl p-6 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('documents')}</h4>
                          <label className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition-colors ${isUploading === c.id ? 'opacity-50 pointer-events-none' : ''}`}>
                            <Download className="w-3 h-3 rotate-180" />
                            {isUploading === c.id ? 'Upload...' : t('uploadFile')}
                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(c.id, e)} disabled={isUploading === c.id} />
                          </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(caseFiles[c.id] || []).map(file => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <FileText className="w-4 h-4 text-primary-400 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{file.fileName}</span>
                              </div>
                              <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-secondary-600 hover:text-secondary-700 px-2 py-1">
                                {t('view')}
                              </a>
                            </div>
                          ))}
                          {(!caseFiles[c.id] || caseFiles[c.id].length === 0) && (
                            <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-xl">
                              <p className="text-sm text-gray-400">{t('noFilesYet')}</p>
                            </div>
                          )}
                        </div>

                        {c.adminNotes && (
                          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-800">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('adminNotes')}</h4>
                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                              {c.adminNotes}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

              </div>
            )}
          </div>
        </main>
      )}

      {activeCategory && (
        <IntakeForm
          lang={lang}
          caseCategory={activeCategory}
          onCancel={() => setActiveCategory(null)}
          onComplete={handleGeneratePDF}
        />
      )}
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LandingPageContent />
    </Suspense>
  )
}
