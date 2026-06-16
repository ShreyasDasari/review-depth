import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function sentimentColor(sentiment: number): string {
  if (sentiment >= 0.7) return 'text-green-600 dark:text-green-400';
  if (sentiment >= 0.4) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

export function sentimentBg(sentiment: number): string {
  if (sentiment >= 0.7) return 'bg-green-100 dark:bg-green-900/30';
  if (sentiment >= 0.4) return 'bg-yellow-100 dark:bg-yellow-900/30';
  return 'bg-red-100 dark:bg-red-900/30';
}

export function planLabel(plan: string): string {
  const labels: Record<string, string> = {
    starter: 'Starter',
    growth: 'Growth',
    pro: 'Pro',
  };
  return labels[plan] || plan;
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
}