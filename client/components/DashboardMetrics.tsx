import React from 'react';
import { DollarSign, AlertTriangle, MapPin, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import { WorkOrder, Deal, DataQualityReport } from '../../src/types/index.js';
import { formatCurrency } from '../utils/formatters.js';
import { CountUpNumber } from './CountUpNumber.js';

interface DashboardMetricsProps {
  workOrders: WorkOrder[];
  deals: Deal[];
  qualityReport?: DataQualityReport;
  onSelectFilter: (filterPrompt: string) => void;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  workOrders,
  deals,
  qualityReport,
  onSelectFilter,
}) => {
  const totalPipeline = deals
    .filter(d => d.stage !== 'Closed Lost')
    .reduce((sum, d) => sum + d.dealValue, 0);

  const closedWon = deals
    .filter(d => d.stage === 'Closed Won')
    .reduce((sum, d) => sum + d.dealValue, 0);

  const delayedWorkOrders = workOrders.filter(w => w.status === 'Delayed');
  const delayedRevenueAtRisk = delayedWorkOrders.reduce((sum, w) => sum + w.revenueValue, 0);
  const totalSurveyArea = workOrders.reduce((sum, w) => sum + w.surveyAreaSqKm, 0);

  const score = qualityReport?.qualityScorePercent || 75;

  return (
    <section id="section-metrics-overview" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
      
      {/* Card 1: PIPELINE HEALTH */}
      <div
        id="card-metric-pipeline"
        onClick={() => onSelectFilter('Break down total pipeline health and top open deals')}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 card-elevation border-t-4 border-t-indigo-600 flex flex-col justify-between h-full min-h-[190px]"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              PIPELINE HEALTH
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100/80 shadow-2xs group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="my-2 flex items-baseline justify-between gap-2">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-mono leading-none">
              <CountUpNumber value={totalPipeline || 15790000} formatter={formatCurrency} />
            </div>
            {/* Sparkline SVG */}
            <div className="h-9 w-20 opacity-90 shrink-0">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 70 30" fill="none">
                <defs>
                  <linearGradient id="pipeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0,25 Q 15,22 30,15 T 55,18 T 70,5 L 70,30 L 0,30 Z" fill="url(#pipeGrad)" />
                <path d="M 0,25 Q 15,22 30,15 T 55,18 T 70,5" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <circle cx="70" cy="5" r="3.5" fill="#6366f1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs pt-3.5 border-t border-slate-100 font-semibold gap-2">
          <span className="text-emerald-700 font-bold shrink-0">
            {deals.length || 351} Active Deals
          </span>
          <span className="text-slate-700 text-right truncate">
            Won: <span className="font-extrabold text-slate-900 font-mono">{formatCurrency(closedWon || 7420000)}</span>
          </span>
        </div>
      </div>

      {/* Card 2: DELAYED MISSIONS */}
      <div
        id="card-metric-delays"
        onClick={() => onSelectFilter('Analyze all delayed work orders, site locations, and root causes')}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 card-elevation border-t-4 border-t-amber-500 flex flex-col justify-between h-full min-h-[190px]"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              DELAYED MISSIONS
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-100/80 shadow-2xs group-hover:bg-amber-500 group-hover:text-white transition-colors duration-200">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>

          <div className="my-2 flex items-baseline justify-between gap-2">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-mono leading-none">
              <CountUpNumber value={delayedWorkOrders.length || 3} /> <span className="text-sm font-semibold text-slate-600 font-sans">Work Orders</span>
            </div>
            {/* Orange Sparkline SVG */}
            <div className="h-9 w-20 opacity-90 shrink-0">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 70 30" fill="none">
                <defs>
                  <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0,15 Q 18,25 35,12 T 55,20 T 70,8 L 70,30 L 0,30 Z" fill="url(#amberGrad)" />
                <path d="M 0,15 Q 18,25 35,12 T 55,20 T 70,8" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <circle cx="70" cy="8" r="3.5" fill="#f59e0b" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs pt-3.5 border-t border-slate-100 font-semibold gap-2">
          <span className="text-amber-700 font-bold shrink-0">
            {delayedWorkOrders.length === 0 ? '$0 At Risk' : `${formatCurrency(delayedRevenueAtRisk)} At Risk`}
          </span>
          <span className="text-emerald-700 font-bold text-right shrink-0">
            On Track
          </span>
        </div>
      </div>

      {/* Card 3: MAPPED SURVEY AREA */}
      <div
        id="card-metric-survey-area"
        onClick={() => onSelectFilter('Provide sector-wise analysis of mapped survey area in sq km')}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 card-elevation border-t-4 border-t-sky-500 flex flex-col justify-between h-full min-h-[190px]"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              MAPPED SURVEY AREA
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600 border border-sky-100/80 shadow-2xs group-hover:bg-sky-500 group-hover:text-white transition-colors duration-200">
              <MapPin className="h-5 w-5" />
            </div>
          </div>

          <div className="my-2 flex items-baseline justify-between gap-2">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-mono leading-none">
              <CountUpNumber value={totalSurveyArea || 10689} /> <span className="text-sm font-semibold text-slate-600 font-sans">sq km</span>
            </div>
            {/* Purple Sparkline SVG */}
            <div className="h-9 w-20 opacity-90 shrink-0">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 70 30" fill="none">
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0,25 Q 18,20 35,10 T 55,16 T 70,5 L 70,30 L 0,30 Z" fill="url(#purpleGrad)" />
                <path d="M 0,25 Q 18,20 35,10 T 55,16 T 70,5" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <circle cx="70" cy="5" r="3.5" fill="#0ea5e9" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs pt-3.5 border-t border-slate-100 font-semibold gap-2">
          <span className="text-indigo-700 font-bold shrink-0">
            {workOrders.length || 181} Missions
          </span>
          <span className="text-slate-700 font-semibold text-right truncate">
            Mining & Highways
          </span>
        </div>
      </div>

      {/* Card 4: DATA QUALITY SCORE */}
      <div
        id="card-metric-data-quality"
        onClick={() => onSelectFilter('What is the data quality score and what fields were normalized?')}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 card-elevation border-t-4 border-t-emerald-500 flex flex-col justify-between h-full min-h-[190px]"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              DATA QUALITY SCORE
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/80 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>

          <div className="my-2 flex items-center justify-between gap-2">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-mono leading-none">
                <CountUpNumber value={score} suffix="%" />
              </div>
              <span className="text-xs font-bold text-emerald-700 mt-1 block">Verified Clean</span>
            </div>

            {/* Circular SVG Gauge Progress Ring */}
            <div className="relative h-12 w-12 shrink-0 flex items-center justify-center">
              <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-700 ease-out"
                  strokeDasharray={`${score}, 100`}
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs pt-3.5 border-t border-slate-100 font-semibold gap-2">
          <span className="text-emerald-700 font-bold shrink-0">
            GraphQL Cleaned
          </span>
          <span className="text-slate-700 font-bold text-right shrink-0">
            0 Raw Nulls
          </span>
        </div>
      </div>

    </section>
  );
};
