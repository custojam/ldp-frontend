'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { brokersApi } from '@/lib/api';
import type { Broker, Lead } from '@/types';
import LeadStatusBadge from '@/components/admin/LeadStatusBadge';

interface BrokerDetail extends Broker {
  leads: Lead[];
}

export default function BrokerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [broker, setBroker] = useState<BrokerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await brokersApi.getById(Number(params.id));
        setBroker(res.data);
      } catch {
        setError('Broker not found');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) return <div className="text-gray-500 p-8">Loading...</div>;
  if (error || !broker) return <div className="text-red-600 p-8">{error || 'Broker not found'}</div>;

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm text-blue-600 hover:underline mb-3 flex items-center gap-1">
          ← Back to Brokers
        </button>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{broker.name}</h1>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${broker.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {broker.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Daily Cap', value: broker.dailyCap },
          { label: 'Timezone', value: broker.timezone },
          { label: 'Open Hours', value: `${broker.openingTime} – ${broker.closingTime}` },
          { label: 'Working Days', value: Array.isArray(broker.workingDays) ? broker.workingDays.length + ' days' : 'N/A' },
        ].map((item) => (
          <div key={item.label} className="card">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</div>
            <div className="font-semibold text-gray-800 text-sm">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-700 mb-4">
          Leads Received ({broker.leads?.length ?? 0})
        </h2>

        {!broker.leads || broker.leads.length === 0 ? (
          <p className="text-gray-500 text-sm py-6 text-center">No leads assigned to this broker yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr>
                  {['Name', 'Email', 'Phone', 'IP Address', 'Form', 'Status', 'Date Received'].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {broker.leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-900">{lead.name}</td>
                    <td className="px-3 py-2 text-gray-600">{lead.email}</td>
                    <td className="px-3 py-2 text-gray-600">{lead.phone}</td>
                    <td className="px-3 py-2 text-gray-500 font-mono text-xs">{lead.ipAddress}</td>
                    <td className="px-3 py-2 text-gray-600">{lead.formName}</td>
                    <td className="px-3 py-2"><LeadStatusBadge status={lead.status} /></td>
                    <td className="px-3 py-2 text-gray-500">{new Date(lead.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
