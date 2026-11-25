const statuses: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'Awaiting confirmation',
    className: 'bg-amber-100 text-amber-900',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-sky-100 text-sky-900',
  },
  processing: {
    label: 'In progress',
    className: 'bg-violet-100 text-violet-900',
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-indigo-100 text-indigo-900',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-emerald-100 text-emerald-900',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-stone-200 text-stone-700',
  },
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const normalized = status.trim().toLowerCase();
  const knownStatus = statuses[normalized];
  const label =
    knownStatus?.label ||
    normalized.replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) ||
    'Status unavailable';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        knownStatus?.className || 'bg-stone-100 text-stone-700'
      }`}
    >
      {label}
    </span>
  );
}
