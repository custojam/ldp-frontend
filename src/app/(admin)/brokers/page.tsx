'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { brokersApi } from '@/lib/api';
import type { Broker } from '@/types';
import Modal from '@/components/ui/Modal';
import BrokerForm from '@/components/admin/BrokerForm';

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editBroker, setEditBroker] = useState<Broker | null>(null);
  const [error, setError] = useState('');

  async function loadBrokers() {
    try {
      const res = await brokersApi.getAll();
      setBrokers(res.data);
    } catch {
      setError('Failed to load brokers');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBrokers(); }, []);

  async function handleCreate(data: Partial<Broker>) {
    await brokersApi.create(data);
    setShowCreate(false);
    loadBrokers();
  }

  async function handleUpdate(data: Partial<Broker>) {
    if (!editBroker) return;
    await brokersApi.update(editBroker.id, data);
    setEditBroker(null);
    loadBrokers();
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this broker? This cannot be undone.')) return;
    try {
      await brokersApi.delete(id);
      loadBrokers();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete broker');
    }
  }

  async function toggleActive(broker: Broker) {
    await brokersApi.update(broker.id, { isActive: !broker.isActive });
    loadBrokers();
  }

  if (loading) return <div className="text-gray-500 p-8">Loading brokers...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brokers</h1>
          <p className="text-sm text-gray-500 mt-1">{brokers.length} broker{brokers.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">+ Add Broker</button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>}

      {brokers.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No brokers yet. Add your first broker to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Status', 'Daily Cap', 'Timezone', 'Hours', 'Working Days', 'Leads', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {brokers.map((broker) => (
                <tr key={broker.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/brokers/${broker.id}`} className="font-medium text-blue-600 hover:underline">
                      {broker.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(broker)}>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${broker.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {broker.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{broker.dailyCap}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{broker.timezone}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{broker.openingTime} – {broker.closingTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {Array.isArray(broker.workingDays)
                      ? broker.workingDays.map((d) => d.slice(0, 3)).join(', ')
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{broker._count?.leads ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setEditBroker(broker)} className="text-xs text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(broker.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add Broker">
        <BrokerForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>

      <Modal isOpen={!!editBroker} onClose={() => setEditBroker(null)} title="Edit Broker">
        {editBroker && (
          <BrokerForm initial={editBroker} onSubmit={handleUpdate} onCancel={() => setEditBroker(null)} />
        )}
      </Modal>
    </div>
  );
}
