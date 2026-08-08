import React from 'react';
import { ShieldCheck, Info, Database } from 'lucide-react';
import { DataQualityReport } from '../../src/types/index.js';

interface DataQualityNoticeProps {
  qualityReport?: DataQualityReport;
  isLiveConnection: boolean;
  onOpenDrawer: () => void;
}

export const DataQualityNotice: React.FC<DataQualityNoticeProps> = ({
  qualityReport,
  isLiveConnection,
  onOpenDrawer,
}) => {
  return (
    <div id="banner-data-quality" className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-medium text-slate-700">
            {isLiveConnection
              ? 'Data dynamically fetched from Monday.com GraphQL & cleaned (nulls, company names, date formats normalized).'
              : 'Operating on Skylark Drones reference dataset with automated normalization.'}
          </span>
        </div>
        <button
          id="btn-inspect-quality-notice"
          onClick={onOpenDrawer}
          className="text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors whitespace-nowrap text-left"
        >
          Inspect Raw Boards & Logs →
        </button>
      </div>
    </div>
  );
};
