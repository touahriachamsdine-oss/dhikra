import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Articles are stored in the DB — no Supabase
export default async function ArticlesPage() {
  let articles: { id: string; slug: string; title: string; excerpt: string; category: string | null; coverImage: string | null; readTimeMinutes: number | null; publishedAt: Date | null }[] = [];

  try {
    // If you have an Article model in Prisma, use that.
    // For now we return an empty list until the model is added.
    articles = [];
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <header className="bg-white border-b border-neutral-200 py-4 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-xl font-black tracking-tight text-primary-900">Dhikra</span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full py-12 px-6 sm:px-12">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <div className="p-4 bg-primary-100 text-primary-600 rounded-2xl shadow-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">Sagesse & Réflexions</h1>
            <p className="text-lg md:text-xl text-neutral-600 mt-4 max-w-2xl mx-auto">
              Découvrez des articles pour approfondir votre foi et enrichir votre compréhension.
            </p>
          </div>
        </div>

        {!articles.length ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100 shadow-sm">
            <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Aucun article pour le moment</h3>
            <p className="text-neutral-500">Revenez plus tard pour du nouveau contenu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link href={`/articles/${article.slug}`} key={article.id} className="block group">
                <article className="h-full border border-neutral-100 bg-white rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  {article.coverImage && (
                    <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
                      <img src={article.coverImage} alt={article.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    {article.category && (
                      <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3 self-start">{article.category}</span>
                    )}
                    <h3 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-neutral-600 leading-relaxed mb-6 line-clamp-3 flex-1">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-neutral-500 font-medium pt-4 border-t border-neutral-100 mt-auto">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTimeMinutes || 5} min de lecture</span>
                      </div>
                      {article.publishedAt && (
                        <span>{new Date(article.publishedAt).toLocaleDateString('fr-DZ', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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
