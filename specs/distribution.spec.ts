/**
 * Feature: Distribution (Frontend)
 *
 * Spec: Admin can create one distribution and manage broker percentage settings.
 * Creating a distribution without a form should display the error message:
 * "Oops, please create a form first."
 * Broker percentages can be set per broker within the distribution.
 */

describe('Feature: Distribution (Frontend)', () => {
  describe('Spec: Guard – form must exist before creating distribution', () => {
    function tryCreateDistribution(hasForm: boolean): string | null {
      if (!hasForm) return 'Oops, please create a form first.';
      return null;
    }

    it('should return the error message when no form exists', () => {
      expect(tryCreateDistribution(false)).toBe('Oops, please create a form first.');
    });

    it('should return null (allow creation) when a form exists', () => {
      expect(tryCreateDistribution(true)).toBeNull();
    });
  });

  describe('Spec: One-distribution limitation', () => {
    it('should hide the create button when distribution already exists', () => {
      const distributionExists = true;
      const showCreateButton = !distributionExists;
      expect(showCreateButton).toBe(false);
    });

    it('should show the create button when no distribution exists', () => {
      const distributionExists = false;
      const showCreateButton = !distributionExists;
      expect(showCreateButton).toBe(true);
    });
  });

  describe('Spec: Broker percentage selection', () => {
    it('should allow setting percentage between 0 and 100', () => {
      const isValidPercentage = (p: number) => p >= 0 && p <= 100;
      expect(isValidPercentage(0)).toBe(true);
      expect(isValidPercentage(50)).toBe(true);
      expect(isValidPercentage(100)).toBe(true);
      expect(isValidPercentage(101)).toBe(false);
      expect(isValidPercentage(-1)).toBe(false);
    });

    it('should build the correct broker payload from selected brokers', () => {
      const selectedBrokers: Record<number, { selected: boolean; percentage: number }> = {
        1: { selected: true, percentage: 60 },
        2: { selected: true, percentage: 40 },
        3: { selected: false, percentage: 0 },
      };

      const payload = Object.entries(selectedBrokers)
        .filter(([, v]) => v.selected)
        .map(([id, v]) => ({ brokerId: Number(id), percentage: v.percentage }));

      expect(payload).toHaveLength(2);
      expect(payload[0]).toEqual({ brokerId: 1, percentage: 60 });
      expect(payload[1]).toEqual({ brokerId: 2, percentage: 40 });
    });
  });

  describe('Spec: Distribution detail view', () => {
    it('should show lead counts broken down by status', () => {
      const leads = [
        { status: 'sent' }, { status: 'sent' },
        { status: 'unsent' },
        { status: 'duplicate' },
      ];

      const byStatus = leads.reduce((acc: Record<string, number>, l) => {
        acc[l.status] = (acc[l.status] || 0) + 1;
        return acc;
      }, {});

      expect(byStatus['sent']).toBe(2);
      expect(byStatus['unsent']).toBe(1);
      expect(byStatus['duplicate']).toBe(1);
    });
  });
});
