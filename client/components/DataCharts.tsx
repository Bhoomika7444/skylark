import React from 'react';
import { TrendingUp, Layers, PieChart, ShieldCheck, ArrowRight } from 'lucide-react';
import { Deal } from '../../src/types/index.js';
import { formatCurrency } from '../utils/formatters.js';

interface DataChartsProps {
  deals: Deal[];
}

export const DataCharts: React.FC<DataChartsProps> = ({ deals }) => {
  const SECTORS = [
    { name: 'Mining & Excavation', value: 6850000, percent: 43, area: '4,520 sq km', color: 'bg-indigo-600' },
    { name: 'Infrastructure & Highways', value: 4200000, percent: 27, area: '3,100 sq km', color: 'bg-sky-500' },
    { name: 'Solar & Renewable Energy', value: 3140000, percent: 20, area: '1,890 sq km', color: 'bg-amber-500' },
    { name: 'Logistics & Smart Cities', value: 1600000, percent: 10, area: '1,179 sq km', color: 'bg-emerald-500' },
  ];

  const STAGES = [
    { stage: 'Qualification', count: 45, value: 3200000, badgeBg: 'bg-sky-50 text-sky-800 border-sky-200' },
    { stage: 'Proposal', count: 38, value: 4700000, badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { stage: 'Negotiation', count: 29, value: 3900000, badgeBg: 'bg-rose-50 text-rose-800 border-rose-200' },
    { stage: 'Closed Won', count: 165, value: 7420000, badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  ];

  return (
    <div id="section-executive-summary-charts" className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      
      {/* 1. Sector Revenue Breakdown (Horizontal Progress Bars) */}
      <div className="lg:col-span-6 rounded-2xl border border-slate-200/90 bg-white p-6 card-elevation space-y-5 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center space-x-2">
              <PieChart className="h-4 w-4 text-indigo-600" />
              <span>SECTOR REVENUE DISTRIBUTION</span>
            </h4>
            <p className="text-xs text-slate-600 mt-1 font-medium">Mapped survey area & revenue by industry</p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-lg shrink-0">
            4 Core Sectors
          </span>
        </div>

        <div className="space-y-4">
          {SECTORS.map((sec) => (
            <div key={sec.name} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-900 font-bold">{sec.name}</span>
                <div className="flex items-center space-x-4 shrink-0">
                  <span className="text-slate-600 font-semibold">{sec.area}</span>
                  <span className="font-extrabold text-slate-950 font-mono min-w-[90px] text-right">{formatCurrency(sec.value)}</span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full ${sec.color} animate-progress-fill transition-all duration-700`}
                  style={{ width: `${sec.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold">
          <span>Total Mapped Territory</span>
          <span className="font-bold text-slate-900 font-mono">10,689 sq km</span>
        </div>
      </div>

      {/* 2. Deals Lifecycle Distribution (Stage Summary Panel) */}
      <div className="lg:col-span-6 rounded-2xl border border-slate-200/90 bg-white p-6 card-elevation space-y-5 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center space-x-2">
              <Layers className="h-4 w-4 text-indigo-600" />
              <span>PIPELINE STAGE BREAKDOWN</span>
            </h4>
            <p className="text-xs text-slate-600 mt-1 font-medium">Contract value across sales lifecycle stages</p>
          </div>
          <span className="text-xs font-bold text-slate-900 font-mono bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg shrink-0">
            277 Active Deals
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {STAGES.map((stg) => (
            <div key={stg.stage} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <span className={`rounded-lg border px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider ${stg.badgeBg}`}>
                  {stg.stage}
                </span>
                <span className="text-slate-600 font-semibold">{stg.count} Opportunities</span>
              </div>

              <span className="font-extrabold text-slate-950 font-mono text-sm">
                {formatCurrency(stg.value)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold">
          <span>Overall Conversion Rate</span>
          <span className="font-bold text-emerald-700 font-mono">64% Win Rate</span>
        </div>
      </div>

    </div>
  );
};
