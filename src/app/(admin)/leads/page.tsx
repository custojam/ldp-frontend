'use client';

import { useEffect, useState } from 'react';
import { leadsApi, brokersApi } from '@/lib/api';
import type { Lead, Broker } from '@/types';
import LeadStatusBadge from '@/components/admin/LeadStatusBadge';
import Modal from '@/components/ui/Modal';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [assigningLead, setAssigningLead] = useState<Lead | null>(null);
  const [selectedBrokerId, setSelectedBrokerId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadData(status?: string) {
    const [leadsRes, brokersRes] = await Promise.allSettled([
      leadsApi.getAll(status || undefined),
      brokersApi.getAll(),
    ]);
    if (leadsRes.status === 'fulfilled') setLeads(leadsRes.value.data);
    if (brokersRes.status === 'fulfilled') setBrokers(brokersRes.value.data);
    setLoading(false);
  }

  useEffect(() => { loadData(filterStatus); }, [filterStatus]);

  async function handleAssign() {
    if (!assigningLead || !selectedBrokerId) return;
    setSaving(true);
    setError('');
    try {
      await leadsApi.assign(assigningLead.id, Number(selectedBrokerId));
      setAssigningLead(null);
      setSelectedBrokerId('');
      loadData(filterStatus);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to assign lead');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-gray-500 p-8">Loading leads...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">{leads.length} lead{leads.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="sent">Sent</option>
            <option value="unsent">Unsent</option>
            <option value="duplicate">Duplicate</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No leads found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Email', 'Phone', 'IP Address', 'Form', 'Broker', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                  <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                  <td className="px-4 py-3 text-gray-600">{lead.phone}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{lead.ipAddress}</td>
                  <td className="px-4 py-3 text-gray-600">{lead.formName}</td>
                  <td className="px-4 py-3 text-gray-600">{lead.broker?.name ?? '—'}</td>
                  <td className="px-4 py-3"><LeadStatusBadge status={lead.status} /></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(lead.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {lead.status === 'unsent' && (
                      <button
                        onClick={() => { setAssigningLead(lead); setSelectedBrokerId(''); setError(''); }}
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        Assign
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={!!assigningLead} onClose={() => setAssigningLead(null)} title="Manual Assign Lead" size="sm">
        {assigningLead && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="font-medium">{assigningLead.name}</p>
              <p className="text-gray-500">{assigningLead.email}</p>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded px-3 py-2 text-sm">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Broker</label>
              <select value={selectedBrokerId} onChange={(e) => setSelectedBrokerId(e.target.value)} className="input-field">
                <option value="">Choose a broker...</option>
                {brokers.filter((b) => b.isActive).map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setAssigningLead(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleAssign} disabled={saving || !selectedBrokerId} className="btn-primary">
                {saving ? 'Assigning...' : 'Assign Lead'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
