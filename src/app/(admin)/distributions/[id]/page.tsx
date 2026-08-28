'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { distributionsApi, brokersApi } from '@/lib/api';
import type { Distribution, Lead, Broker } from '@/types';
import LeadStatusBadge from '@/components/admin/LeadStatusBadge';
import Modal from '@/components/ui/Modal';

interface DistributionDetail extends Distribution {
  leads: Lead[];
}

export default function DistributionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [distribution, setDistribution] = useState<DistributionDetail | null>(null);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBroker, setEditingBroker] = useState<{ brokerId: number; percentage: number; isActive: boolean } | null>(null);
  const [showAddBroker, setShowAddBroker] = useState(false);
  const [newBrokerId, setNewBrokerId] = useState('');
  const [newPercentage, setNewPercentage] = useState(0);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    const [distRes, brokersRes] = await Promise.allSettled([
      distributionsApi.getById(Number(params.id)),
      brokersApi.getAll(),
    ]);
    if (distRes.status === 'fulfilled') setDistribution(distRes.value.data);
    if (brokersRes.status === 'fulfilled') setBrokers(brokersRes.value.data);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, [params.id]);

  async function handleUpdateBroker() {
    if (!editingBroker || !distribution) return;
    setSaving(true);
    try {
      await distributionsApi.updateBroker(distribution.id, editingBroker.brokerId, {
        percentage: editingBroker.percentage,
        isActive: editingBroker.isActive,
      });
      setEditingBroker(null);
      loadData();
    } finally {
      setSaving(false);
    }
  }

  async function handleAddBroker() {
    if (!distribution || !newBrokerId) return;
    setSaving(true);
    try {
      await distributionsApi.addBroker(distribution.id, { brokerId: Number(newBrokerId), percentage: newPercentage });
      setShowAddBroker(false);
      setNewBrokerId('');
      setNewPercentage(0);
      loadData();
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveBroker(brokerId: number) {
    if (!distribution || !confirm('Remove this broker from distribution?')) return;
    await distributionsApi.removeBroker(distribution.id, brokerId);
    loadData();
  }

  const existingBrokerIds = new Set(distribution?.distributionBrokers.map((db) => db.brokerId) ?? []);
  const availableBrokers = brokers.filter((b) => !existingBrokerIds.has(b.id));

  const leadsByStatus = distribution?.leads.reduce(
    (acc, lead) => { acc[lead.status] = (acc[lead.status] || 0) + 1; return acc; },
    {} as Record<string, number>
  ) ?? {};

  if (loading) return <div className="text-gray-500 p-8">Loading...</div>;
  if (!distribution) return <div className="text-red-600 p-8">Distribution not found</div>;

  return (
    <div>
      <button onClick={() => router.back()} className="text-sm text-blue-600 hover:underline mb-4 flex items-center gap-1">
        ← Back
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{distribution.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Form: {distribution.form?.name}</p>
        </div>
        <button onClick={() => setShowAddBroker(true)} disabled={availableBrokers.length === 0} className="btn-secondary text-sm">
          + Add Broker
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: distribution.leads.length, color: 'text-blue-600' },
          { label: 'Sent', value: leadsByStatus['sent'] ?? 0, color: 'text-green-600' },
          { label: 'Unsent', value: leadsByStatus['unsent'] ?? 0, color: 'text-yellow-600' },
          { label: 'Duplicate', value: leadsByStatus['duplicate'] ?? 0, color: 'text-purple-600' },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Broker settings */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Broker Settings</h2>
        {distribution.distributionBrokers.length === 0 ? (
          <p className="text-gray-500 text-sm">No brokers in this distribution.</p>
        ) : (
          <div className="space-y-2">
            {distribution.distributionBrokers.map((db) => (
              <div key={db.id} className="flex items-center gap-4 bg-gray-50 rounded-lg px-4 py-3">
                <div className="flex-1 font-medium text-sm">{db.broker.name}</div>
                <div className="text-sm">{db.percentage}%</div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${db.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {db.isActive ? 'Active' : 'Inactive'}
                </span>
                <button onClick={() => setEditingBroker({ brokerId: db.brokerId, percentage: db.percentage, isActive: db.isActive })} className="text-xs text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleRemoveBroker(db.brokerId)} className="text-xs text-red-500 hover:underline">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lead history */}
      <div className="card">
        <h2 className="font-semibold text-gray-700 mb-4">All Leads ({distribution.leads.length})</h2>
        {distribution.leads.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">No leads have passed through this distribution yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr>
                  {['Name', 'Email', 'Phone', 'IP Address', 'Broker', 'Status', 'Date'].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {distribution.leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium">{lead.name}</td>
                    <td className="px-3 py-2 text-gray-600">{lead.email}</td>
                    <td className="px-3 py-2 text-gray-600">{lead.phone}</td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-500">{lead.ipAddress}</td>
                    <td className="px-3 py-2 text-gray-600">{lead.broker?.name ?? '—'}</td>
                    <td className="px-3 py-2"><LeadStatusBadge status={lead.status} /></td>
                    <td className="px-3 py-2 text-gray-500 text-xs">{new Date(lead.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit broker modal */}
      <Modal isOpen={!!editingBroker} onClose={() => setEditingBroker(null)} title="Edit Broker Settings" size="sm">
        {editingBroker && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
              <input
                type="number"
                value={editingBroker.percentage}
                onChange={(e) => setEditingBroker({ ...editingBroker, percentage: Number(e.target.value) })}
                className="input-field"
                min={0}
                max={100}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="brokerActive"
                checked={editingBroker.isActive}
                onChange={(e) => setEditingBroker({ ...editingBroker, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="brokerActive" className="text-sm font-medium text-gray-700">Active in Distribution</label>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditingBroker(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleUpdateBroker} disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add broker modal */}
      <Modal isOpen={showAddBroker} onClose={() => setShowAddBroker(false)} title="Add Broker to Distribution" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Broker</label>
            <select value={newBrokerId} onChange={(e) => setNewBrokerId(e.target.value)} className="input-field">
              <option value="">Select a broker...</option>
              {availableBrokers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
            <input
              type="number"
              value={newPercentage}
              onChange={(e) => setNewPercentage(Number(e.target.value))}
              className="input-field"
              min={0}
              max={100}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowAddBroker(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleAddBroker} disabled={saving || !newBrokerId} className="btn-primary">
              {saving ? 'Adding...' : 'Add Broker'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
