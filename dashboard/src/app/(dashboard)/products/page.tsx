'use client';

import { Card } from '@/components/ui/card';
import { Plus, Package, ExternalLink, Star, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

const products = [
  {
    id: '1',
    name: 'Ergonomic Chair Pro',
    platform: 'Amazon',
    reviews: 1240,
    sentiment: 4.1,
    lastReport: 'Mar 10, 2025',
    image: null,
  },
  {
    id: '2',
    name: 'Bluetooth Earbuds X2',
    platform: 'Amazon',
    reviews: 892,
    sentiment: 3.8,
    lastReport: 'Mar 9, 2025',
    image: null,
  },
  {
    id: '3',
    name: 'LED Desk Lamp',
    platform: 'Shopify',
    reviews: 456,
    sentiment: 4.5,
    lastReport: 'Mar 8, 2025',
    image: null,
  },
  {
    id: '4',
    name: 'Yoga Mat Premium',
    platform: 'Amazon',
    reviews: 723,
    sentiment: 3.9,
    lastReport: 'Mar 7, 2025',
    image: null,
  },
  {
    id: '5',
    name: 'Wireless Keyboard K3',
    platform: 'Shopify',
    reviews: 312,
    sentiment: 4.3,
    lastReport: 'Mar 6, 2025',
    image: null,
  },
  {
    id: '6',
    name: 'Smart Water Bottle',
    platform: 'Amazon',
    reviews: 219,
    sentiment: 4.0,
    lastReport: 'Mar 5, 2025',
    image: null,
  },
];

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Products</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your tracked products across platforms
          </p>
        </div>
        <Link
          href="/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <Card className="hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                  <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                </button>
              </div>

              <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                {product.name}
              </h3>

              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-medium">
                  {product.platform}
                </span>
                <span>{product.reviews.toLocaleString()} reviews</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {product.sentiment}
                  </span>
                </div>
                <span className="text-xs text-zinc-400">Last report: {product.lastReport}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}