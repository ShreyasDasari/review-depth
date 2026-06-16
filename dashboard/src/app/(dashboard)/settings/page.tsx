'use client';

import { Card } from '@/components/ui/card';
import { CreditCard, Users, Bell, Shield, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const sections = [
  { icon: CreditCard, title: 'Subscription', description: 'Manage your plan and billing', href: '#' },
  { icon: Users, title: 'Team', description: 'Invite team members', href: '#', badge: 'Pro' },
  { icon: Bell, title: 'Notifications', description: 'Email and Slack preferences', href: '#' },
  { icon: Shield, title: 'Security', description: 'Password and authentication', href: '#' },
];

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.title} href={section.href}>
              <Card className="flex items-center gap-4 hover:shadow-md transition-all cursor-pointer">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <Icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-zinc-900 dark:text-white">{section.title}</h3>
                    {section.badge && (
                      <span className="px-1.5 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 rounded">
                        {section.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{section.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Current plan info */}
      <Card>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">You are on the</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-white">Starter Plan</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">$19/month — 50 products max</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors">
            Upgrade
          </button>
        </div>
      </Card>
    </div>
  );
}