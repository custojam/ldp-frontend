'use client';

import { useState, FormEvent } from 'react';
import type { Broker, WorkingDay } from '@/types';

const DAYS: WorkingDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Dubai', 'Asia/Kolkata',
  'Asia/Manila', 'Asia/Tokyo', 'Australia/Sydney',
];

interface BrokerFormProps {
  initial?: Partial<Broker>;
  onSubmit: (data: Partial<Broker>) => Promise<void>;
  onCancel: () => void;
}

export default function BrokerForm({ initial, onSubmit, onCancel }: BrokerFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [dailyCap, setDailyCap] = useState(initial?.dailyCap ?? 100);
  const [timezone, setTimezone] = useState(initial?.timezone ?? 'UTC');
  const [openingTime, setOpeningTime] = useState(initial?.openingTime ?? '09:00');
  const [closingTime, setClosingTime] = useState(initial?.closingTime ?? '18:00');
  const [workingDays, setWorkingDays] = useState<WorkingDay[]>(
    initial?.workingDays ?? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function toggleDay(day: WorkingDay) {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({ name, isActive, dailyCap, timezone, openingTime, closingTime, workingDays });
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Broker Name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Broker Alpha" required />
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4" />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Daily Cap</label>
        <input type="number" value={dailyCap} onChange={(e) => setDailyCap(Number(e.target.value))} className="input-field" min={1} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
        <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="input-field">
          {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
          <input type="time" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
          <input type="time" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} className="input-field" required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-3 py-1 text-xs rounded-full border font-medium transition-colors ${
                workingDays.includes(day)
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-blue-400'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : initial?.id ? 'Update Broker' : 'Create Broker'}
        </button>
      </div>
    </form>
  );
}
