'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { leadsApi, brokersApi, formsApi, distributionsApi } from '@/lib/api';
import type { LeadStats } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [brokerCount, setBrokerCount] = useState(0);
  const [hasForm, setHasForm] = useState(false);
  const [hasDistribution, setHasDistribution] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, brokersRes, formRes, distRes] = await Promise.allSettled([
          leadsApi.getStats(),
          brokersApi.getAll(),
          formsApi.get(),
          distributionsApi.get(),
        ]);

        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
        if (brokersRes.status === 'fulfilled') setBrokerCount(brokersRes.value.data.length);
        if (formRes.status === 'fulfilled') setHasForm(!!formRes.value.data);
        if (distRes.status === 'fulfilled') setHasDistribution(!!distRes.value.data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Overview of your lead distribution platform</p>
      </div>

      {/* Setup checklist */}
      <div className="card mb-8">
        <h2 className="font-semibold text-gray-700 mb-4">Setup Checklist</h2>
        <div className="space-y-2">
          {[
            { done: brokerCount > 0, label: 'Create brokers', href: '/brokers' },
            { done: hasForm, label: 'Create lead form', href: '/forms' },
            { done: hasDistribution, label: 'Create distribution', href: '/distributions' },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-2 py-1.5 -mx-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${item.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {item.done ? '✓' : '○'}
              </span>
              <span className={`text-sm ${item.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Leads', value: stats?.total ?? 0, color: 'text-blue-600' },
          { label: 'Sent', value: stats?.sent ?? 0, color: 'text-green-600' },
          { label: 'Unsent', value: stats?.unsent ?? 0, color: 'text-yellow-600' },
          { label: 'Duplicate', value: stats?.duplicate ?? 0, color: 'text-purple-600' },
        ].map((stat) => (
          <div key={stat.label} className="card text-center">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: '/brokers', label: 'Manage Brokers', count: brokerCount },
          { href: '/leads', label: 'View All Leads', count: stats?.total ?? 0 },
          { href: '/distributions', label: 'Distribution', count: hasDistribution ? 1 : 0 },
          { href: '/forms', label: 'Lead Form', count: hasForm ? 1 : 0 },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card hover:shadow-md transition-shadow text-center"
          >
            <div className="text-2xl font-bold text-gray-800">{item.count}</div>
            <div className="text-sm text-gray-500 mt-1">{item.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
