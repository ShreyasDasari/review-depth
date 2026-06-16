'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { BarChart3, Package, FileText, TrendingUp, Star, Zap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setError('Check your email to confirm your account!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side — Brand / Hero */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 bg-gradient-to-br from-indigo-600 to-indigo-900 dark:from-indigo-950 dark:to-black text-white">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold">ReviewDepth</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Make smarter product decisions with AI-powered review analysis
          </h1>

          <p className="text-lg text-indigo-200 mb-10">
            Automatically scrape and analyze thousands of reviews. Get weekly
            reports on sentiment, complaints, feature requests, and SWOT
            analysis — without hiring a research team.
          </p>

          <div className="space-y-4">
            {[
              { icon: Star, text: 'Sentiment tracking across all your products' },
              { icon: Zap, text: 'Auto-detect top complaints & feature requests' },
              { icon: TrendingUp, text: 'Weekly SWOT reports delivered to your inbox' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-white/10">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-indigo-100">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-6 text-sm text-indigo-300">
            <span>Starter $19/mo</span>
            <span className="w-px h-4 bg-indigo-400/30" />
            <span>Growth $49/mo</span>
            <span className="w-px h-4 bg-indigo-400/30" />
            <span>Pro $79/mo</span>
          </div>
        </div>
      </div>

      {/* Right side — Auth form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-zinc-900">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">
            {isSignUp
              ? 'Start tracking your products today'
              : 'Sign in to your dashboard'}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading
                ? 'Please wait...'
                : isSignUp
                ? 'Create account'
                : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}