export function formatCurrency(amount: number): string {
  if (!amount || amount === 0) {
    return 'No active deals in this category';
  }
  if (amount >= 1000000) {
    const millions = amount / 1000000;
    return `$${millions.toFixed(2)}M`;
  }
  if (amount >= 1000) {
    const thousands = Math.round(amount / 1000);
    return `$${thousands.toLocaleString('en-US')}k`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateString;
  }
}

export function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'Completed':
    case 'Closed Won':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    case 'In Progress':
    case 'Negotiation':
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800';
    case 'Delayed':
    case 'Closed Lost':
      return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    case 'Scheduled':
    case 'Proposal Sent':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800';
  }
}
