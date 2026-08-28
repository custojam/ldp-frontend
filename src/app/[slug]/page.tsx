'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import { publicApi } from '@/lib/api';

interface FormData {
  id: number;
  name: string;
  slug: string;
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error' | 'not_found';

export default function PublicFormPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [formData, setFormData] = useState<FormData | null>(null);
  const [pageState, setPageState] = useState<SubmitState>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadForm() {
      try {
        const res = await publicApi.getForm(slug);
        setFormData(res.data);
        setPageState('idle');
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setPageState('not_found');
        } else {
          setPageState('error');
        }
      }
    }
    loadForm();
  }, [slug]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setErrorMsg('');
    setSubmitState('loading');

    try {
      await publicApi.submitLead(slug, { name, email, phone });
      setSubmitState('success');
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        const errors: Record<string, string> = {};
        data.errors.forEach((e: { path?: string; param?: string; msg: string }) => {
          const field = e.path || e.param || 'general';
          errors[field] = e.msg;
        });
        setFieldErrors(errors);
      } else {
        setErrorMsg(data?.error || 'Submission failed. Please try again.');
      }
      setSubmitState('error');
    }
  }

  if (pageState === 'not_found') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h1>
          <p className="text-gray-500">The form you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (submitState === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600">Your information has been submitted successfully. We'll be in touch shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{formData?.name || 'Loading...'}</h1>
          <p className="text-gray-500 mt-1 text-sm">Fill out the form below and we'll get back to you.</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{errorMsg}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`input-field ${fieldErrors.name ? 'border-red-400' : ''}`}
              placeholder="John Doe"
              required
            />
            {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`input-field ${fieldErrors.email ? 'border-red-400' : ''}`}
              placeholder="john@example.com"
              required
            />
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`input-field ${fieldErrors.phone ? 'border-red-400' : ''}`}
              placeholder="+1 (555) 000-0000"
              required
            />
            {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
          </div>

          <button
            type="submit"
            disabled={submitState === 'loading'}
            className="btn-primary w-full py-3 mt-2"
          >
            {submitState === 'loading' ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
