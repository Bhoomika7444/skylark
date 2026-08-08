import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div id="skeleton-loading" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 rounded-lg bg-slate-200"></div>
        <div className="space-y-1">
          <div className="h-4 w-48 rounded bg-slate-200"></div>
          <div className="h-3 w-28 rounded bg-slate-100"></div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <div className="h-4 w-full rounded bg-slate-200"></div>
        <div className="h-4 w-11/12 rounded bg-slate-200"></div>
        <div className="h-4 w-4/5 rounded bg-slate-200"></div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-3 sm:grid-cols-4">
        <div className="h-16 rounded-xl bg-slate-100"></div>
        <div className="h-16 rounded-xl bg-slate-100"></div>
        <div className="h-16 rounded-xl bg-slate-100"></div>
        <div className="h-16 rounded-xl bg-slate-100"></div>
      </div>

      <div className="space-y-2 pt-2">
        <div className="h-3 w-32 rounded bg-slate-200"></div>
        <div className="h-3 w-3/4 rounded bg-slate-100"></div>
        <div className="h-3 w-2/3 rounded bg-slate-100"></div>
      </div>
    </div>
  );
};
