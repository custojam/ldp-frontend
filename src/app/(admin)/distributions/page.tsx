'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { distributionsApi, brokersApi, formsApi } from '@/lib/api';
import type { Distribution, Broker } from '@/types';
import Modal from '@/components/ui/Modal';

export default function DistributionsPage() {
  const [distribution, setDistribution] = useState<Distribution | null>(null);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [hasForm, setHasForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [distName, setDistName] = useState('');
  const [selectedBrokers, setSelectedBrokers] = useState<Record<number, { selected: boolean; percentage: number }>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadData() {
    const [distRes, brokersRes, formRes] = await Promise.allSettled([
      distributionsApi.get(),
      brokersApi.getAll(),
      formsApi.get(),
    ]);

    if (distRes.status === 'fulfilled') setDistribution(distRes.value.data);
    if (brokersRes.status === 'fulfilled') {
      const b: Broker[] = brokersRes.value.data;
      setBrokers(b);
      const init: Record<number, { selected: boolean; percentage: number }> = {};
      b.forEach((broker) => { init[broker.id] = { selected: false, percentage: 0 }; });
      setSelectedBrokers(init);
    }
    if (formRes.status === 'fulfilled') setHasForm(!!formRes.value.data);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  function handleBrokerToggle(id: number, checked: boolean) {
    setSelectedBrokers((prev) => ({ ...prev, [id]: { ...prev[id], selected: checked } }));
  }

  function handlePercentageChange(id: number, pct: number) {
    setSelectedBrokers((prev) => ({ ...prev, [id]: { ...prev[id], percentage: pct } }));
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!hasForm) {
      setError('Oops, please create a form first.');
      return;
    }

    const brokersPayload = Object.entries(selectedBrokers)
      .filter(([, v]) => v.selected)
      .map(([id, v]) => ({ brokerId: Number(id), percentage: v.percentage }));

    setSaving(true);
    try {
      await distributionsApi.create({ name: distName, brokers: brokersPayload });
      setShowCreate(false);
      loadData();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create distribution');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-gray-500 p-8">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Distribution</h1>
          <p className="text-sm text-gray-500 mt-1">Only one distribution can be created</p>
        </div>
        {!distribution && (
          <button onClick={() => { setError(''); setShowCreate(true); }} className="btn-primary">
            + Create Distribution
          </button>
        )}
      </div>

      {distribution ? (
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{distribution.name}</h2>
              <p className="text-sm text-gray-500 mt-1">Linked to form: <strong>{distribution.form?.name}</strong></p>
            </div>
            <Link href={`/distributions/${distribution.id}`} className="btn-secondary text-sm">View Detail</Link>
          </div>

          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-3">Brokers in Distribution</h3>
            {distribution.distributionBrokers.length === 0 ? (
              <p className="text-gray-500 text-sm">No brokers added yet.</p>
            ) : (
              <div className="space-y-2">
                {distribution.distributionBrokers.map((db) => (
                  <div key={db.id} className="flex items-center gap-4 bg-gray-50 rounded-lg px-4 py-3">
                    <div className="flex-1 font-medium text-sm">{db.broker.name}</div>
                    <div className="text-sm text-gray-500">{db.percentage}%</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${db.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {db.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-2">No distribution created yet.</p>
          {!hasForm && <p className="text-amber-600 text-sm mb-4">You need to create a form first.</p>}
          <button onClick={() => { setError(''); setShowCreate(true); }} className="btn-primary">
            Create Distribution
          </button>
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Distribution" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Distribution Name *</label>
            <input value={distName} onChange={(e) => setDistName(e.target.value)} className="input-field" placeholder="Main Distribution" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Brokers & Set Percentages</label>
            {brokers.length === 0 ? (
              <p className="text-gray-500 text-sm">No brokers available. Create brokers first.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {brokers.map((broker) => (
                  <div key={broker.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={selectedBrokers[broker.id]?.selected ?? false}
                      onChange={(e) => handleBrokerToggle(broker.id, e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="flex-1 text-sm font-medium">{broker.name}</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={selectedBrokers[broker.id]?.percentage ?? 0}
                        onChange={(e) => handlePercentageChange(broker.id, Number(e.target.value))}
                        disabled={!selectedBrokers[broker.id]?.selected}
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-right disabled:opacity-50"
                        min={0}
                        max={100}
                        step={1}
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Creating...' : 'Create Distribution'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
