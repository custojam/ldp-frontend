'use client';

import { useEffect, useState, FormEvent } from 'react';
import { formsApi } from '@/lib/api';
import type { Form } from '@/types';
import Modal from '@/components/ui/Modal';

export default function FormsPage() {
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadForm() {
    try {
      const res = await formsApi.get();
      setForm(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadForm(); }, []);

  function handleNameChange(value: string) {
    setName(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await formsApi.create({ name, slug });
      setSuccess('Form created successfully!');
      setShowCreate(false);
      setName('');
      setSlug('');
      loadForm();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create form');
    } finally {
      setSaving(false);
    }
  }

  const publicUrl = typeof window !== 'undefined' && form
    ? `${window.location.origin}/${form.slug}`
    : '';

  if (loading) return <div className="text-gray-500 p-8">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Form</h1>
          <p className="text-sm text-gray-500 mt-1">Only one lead form can be created</p>
        </div>
        {!form && <button onClick={() => setShowCreate(true)} className="btn-primary">+ Create Form</button>}
      </div>

      {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm">{success}</div>}

      {form ? (
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{form.name}</h2>
              <p className="text-sm text-gray-500 mt-1">Created {new Date(form.createdAt).toLocaleDateString()}</p>
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">Active</span>
          </div>

          <div className="mt-6 space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">URL Slug</label>
              <p className="mt-1 font-mono text-sm text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">/{form.slug}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Public URL</label>
              <div className="mt-1 flex items-center gap-2">
                <p className="font-mono text-sm text-blue-600 bg-gray-50 px-3 py-2 rounded-lg flex-1">{publicUrl}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(publicUrl)}
                  className="btn-secondary text-xs px-3 py-2"
                >
                  Copy
                </button>
                <a href={`/${form.slug}`} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs px-3 py-2">
                  Open
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No lead form created yet.</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">Create Your Lead Form</button>
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Lead Form">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Form Name *</label>
            <input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="input-field"
              placeholder="Lead Registration"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Public URL Slug *</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="input-field"
                placeholder="lead-registration"
                pattern="[a-z0-9-]+"
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Lowercase letters, numbers, and hyphens only</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Creating...' : 'Create Form'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
