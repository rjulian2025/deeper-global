import Link from 'next/link';
import { CATEGORY_ROUTES } from '@/lib/internalLinkPolicy';

export default function Breadcrumbs({ category, slug }: { category: string; slug: string }) {
  const cat = CATEGORY_ROUTES[category] || '/answers';
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex gap-2 text-gray-600">
        <li><Link href="/" className="hover:text-gray-900 transition-colors">Home</Link></li>
        <li>/</li>
        <li><Link href="/answers" className="hover:text-gray-900 transition-colors">Answers</Link></li>
        <li>/</li>
        <li><Link href={cat} className="hover:text-gray-900 transition-colors">{category}</Link></li>
      </ol>
    </nav>
  );
}
