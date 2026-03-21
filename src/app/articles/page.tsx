"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Clock, Globe, Scale } from "lucide-react";
import Link from "next/link";
import terms from "@/lib/i18n/legal-terms.json";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ArticlesPage() {
  const [lang, setLang] = useState<"ar" | "fr" | "en">("fr");
  const t = (key: string) => (terms as any)[key]?.[lang] || key;
  const isRtl = lang === "ar";

  let articles: { id: string; slug: string; title: string; excerpt: string; category: string | null; coverImage: string | null; readTimeMinutes: number | null; publishedAt: Date | null }[] = [];

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans ${isRtl ? 'rtl' : 'ltr'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 py-4 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 dark:bg-slate-800 rounded-full transition-colors text-gray-600 dark:text-gray-300">
            {isRtl ? <ArrowLeft className="w-5 h-5 rotate-180" /> : <ArrowLeft className="w-5 h-5" />}
          </Link>
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

      <main className="flex-1 max-w-5xl mx-auto w-full py-12 px-6 sm:px-12">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <div className="p-4 bg-primary-100 text-primary-600 rounded-2xl shadow-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary-900 dark:text-primary-100 tracking-tight">{t('articlesTitle')}</h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
              {t('articlesDesc')}
            </p>
          </div>
        </div>

        {!articles.length ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('noArticles')}</h3>
            <p className="text-gray-500 dark:text-gray-400">{t('noArticlesDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link href={`/articles/${article.slug}`} key={article.id} className="block group">
                <article className="h-full border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  {article.coverImage && (
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                      <img src={article.coverImage} alt={article.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    {article.category && (
                      <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3 self-start">{article.category}</span>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 line-clamp-3 flex-1">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 font-medium pt-4 border-t border-gray-100 dark:border-slate-800 mt-auto">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTimeMinutes || 5} {t('readTime')}</span>
                      </div>
                      {article.publishedAt && (
                        <span>{new Date(article.publishedAt).toLocaleDateString(lang === 'fr' ? 'fr-DZ' : lang === 'en' ? 'en-US' : 'ar-DZ', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
