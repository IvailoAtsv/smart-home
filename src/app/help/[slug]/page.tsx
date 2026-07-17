import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HelpArticleBody } from "@/components/help/HelpArticleBody";
import { HelpShell } from "@/components/help/HelpShell";
import { helpArticles, helpBySlug } from "@/data/help/articles";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return helpArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = helpBySlug[slug];
  if (!article) return { title: "Ръководство" };
  return {
    title: `${article.title} · Умен дом`,
    description: article.description,
  };
}

export default async function HelpArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = helpBySlug[slug];
  if (!article) notFound();

  return (
    <HelpShell title={article.title} description={article.description}>
      <HelpArticleBody article={article} />
    </HelpShell>
  );
}
