import Link from "next/link";
import { getRelatedByCategory } from "@/lib/db.server";

export default async function RelatedAnswers({
  category,
  currentSlug,
  limit = 6,
}: {
  category: string;
  currentSlug: string;
  limit?: number;
}) {
  const related = await getRelatedByCategory(category, currentSlug, limit);
  if (!related?.length) return null;

  return (
    <section className="mt-16 border-t border-gray-200 pt-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Related answers</h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((q) => (
          <li key={q.slug} className="rounded-xl border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all">
            <Link href={`/answers/${q.slug}`} className="font-medium text-blue-700 hover:underline">
              {q.question}
            </Link>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">{q.short_answer}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}


