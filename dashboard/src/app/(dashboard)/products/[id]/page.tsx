'use client';

import { useParams } from 'next/navigation';
import { Card, StatCard } from '@/components/ui/card';
import { ArrowLeft, Package, Star, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;

  // Sample data - will be replaced with API call
  const product = {
    name: 'Ergonomic Chair Pro',
    platform: 'Amazon',
    reviews: 1240,
    sentiment: 4.1,
  };

  const recentReviews = [
    { rating: 5, title: 'Best chair I have ever owned', content: 'After using this for 3 months, my back pain has completely disappeared...', sentiment: 'positive', date: '2 days ago' },
    { rating: 3, title: 'Good but not great', content: 'The chair is comfortable but the lumbar support could be better...', sentiment: 'neutral', date: '5 days ago' },
    { rating: 1, title: 'Seat cushion flattened', content: 'After 3 months the cushion lost its shape. Disappointed with the quality...', sentiment: 'negative', date: '1 week ago' },
    { rating: 4, title: 'Great value for the price', content: 'Solid build quality and very comfortable for long work sessions...', sentiment: 'positive', date: '1 week ago' },
    { rating: 2, title: 'Armrests are wobbly', content: 'The armrests have too much play in them. Not what I expected...', sentiment: 'negative', date: '2 weeks ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/products" className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{product.name}</h1>
          <p className="text-zinc-500 dark:text-zinc-400">{product.platform} • {product.reviews.toLocaleString()} reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Average Rating" value={product.sentiment} subtitle="out of 5.0" icon={<Star className="w-5 h-5" />} />
        <StatCard title="Positive" value="68%" icon={<ThumbsUp className="w-5 h-5" />} />
        <StatCard title="Negative" value="12%" icon={<ThumbsDown className="w-5 h-5" />} />
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Recent Reviews</h2>
        <div className="space-y-4">
          {recentReviews.map((review, i) => (
            <div key={i} className="pb-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s < review.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-300 dark:text-zinc-600'}`} />
                  ))}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  review.sentiment === 'positive' ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30' :
                  review.sentiment === 'negative' ? 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30' :
                  'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30'
                }`}>
                  {review.sentiment}
                </span>
                <span className="text-xs text-zinc-400 ml-auto">{review.date}</span>
              </div>
              <p className="font-medium text-zinc-900 dark:text-white text-sm">{review.title}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{review.content}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}