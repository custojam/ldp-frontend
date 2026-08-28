import type { LeadStatus } from '@/types';

const styles: Record<LeadStatus, string> = {
  sent: 'bg-green-100 text-green-800',
  unsent: 'bg-yellow-100 text-yellow-800',
  duplicate: 'bg-purple-100 text-purple-800',
  failed: 'bg-red-100 text-red-800',
};

export default function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
