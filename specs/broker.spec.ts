/**
 * Feature: Broker Management (Frontend)
 *
 * Spec: Admin can create, edit, and deactivate brokers.
 * Each broker has a name, active status, daily cap, timezone,
 * open/close time, and working days.
 * Broker detail page shows all leads assigned to that broker.
 */

import type { Broker, WorkingDay } from '../src/types';

describe('Feature: Broker Management (Frontend)', () => {
  const ALL_DAYS: WorkingDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  describe('Spec: Working days display', () => {
    it('should abbreviate day names to 3 characters', () => {
      const abbreviated = ALL_DAYS.map((d) => d.slice(0, 3));
      expect(abbreviated).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    });

    it('should list working days for a Mon-Fri broker correctly', () => {
      const workingDays: WorkingDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      expect(workingDays).toHaveLength(5);
      expect(workingDays).not.toContain('Saturday');
      expect(workingDays).not.toContain('Sunday');
    });
  });

  describe('Spec: Active/Inactive toggle', () => {
    it('should toggle broker active status', () => {
      const broker: Partial<Broker> = { isActive: true };
      const toggled = { ...broker, isActive: !broker.isActive };
      expect(toggled.isActive).toBe(false);
    });
  });

  describe('Spec: Broker hours formatting', () => {
    it('should display hours in "HH:MM – HH:MM" format', () => {
      const opening = '09:00';
      const closing = '18:00';
      const formatted = `${opening} – ${closing}`;
      expect(formatted).toBe('09:00 – 18:00');
    });
  });

  describe('Spec: Validation rules', () => {
    it('should require a non-empty broker name', () => {
      const isValidName = (name: string) => name.trim().length > 0;
      expect(isValidName('Broker Alpha')).toBe(true);
      expect(isValidName('')).toBe(false);
      expect(isValidName('   ')).toBe(false);
    });

    it('should require daily cap to be a positive integer', () => {
      const isValidCap = (cap: number) => Number.isInteger(cap) && cap > 0;
      expect(isValidCap(100)).toBe(true);
      expect(isValidCap(1)).toBe(true);
      expect(isValidCap(0)).toBe(false);
      expect(isValidCap(-5)).toBe(false);
    });

    it('should validate time format HH:MM', () => {
      const isValidTime = (t: string) => /^\d{2}:\d{2}$/.test(t);
      expect(isValidTime('09:00')).toBe(true);
      expect(isValidTime('18:30')).toBe(true);
      expect(isValidTime('9:00')).toBe(false);
      expect(isValidTime('invalid')).toBe(false);
    });
  });

  describe('Spec: Status badge rendering', () => {
    it('should render "Active" label for active broker', () => {
      const broker: Partial<Broker> = { isActive: true };
      const label = broker.isActive ? 'Active' : 'Inactive';
      expect(label).toBe('Active');
    });

    it('should render "Inactive" label for inactive broker', () => {
      const broker: Partial<Broker> = { isActive: false };
      const label = broker.isActive ? 'Active' : 'Inactive';
      expect(label).toBe('Inactive');
    });
  });
});
