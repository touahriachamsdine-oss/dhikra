import { ArrowLeft, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Placeholder until Article model is added to Prisma schema
export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // TODO: once Article model is added to schema, query here:
  // const article = await prisma.article.findUnique({ where: { slug } })
  // if (!article) notFound()

  // For now serve a not-found page
  notFound();
}
