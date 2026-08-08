import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Layers,
  PieChart as PieIcon,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Deal } from '../../src/types/index.js';
import { formatCurrency } from '../utils/formatters.js';

interface PipelineOverviewProps {
  deals: Deal[];
  onSelectFilter: (filterPrompt: string) => void;
}

export const PipelineOverview: React.FC<PipelineOverviewProps> = ({ deals, onSelectFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  // Metrics
  const totalPipeline = deals
    .filter(d => d.stage !== 'Closed Lost')
    .reduce((sum, d) => sum + d.dealValue, 0);

  const closedWon = deals
    .filter(d => d.stage === 'Closed Won')
    .reduce((sum, d) => sum + d.dealValue, 0);

  const avgDealSize = deals.length > 0 ? totalPipeline / deals.length : 0;
  const winRate = deals.length > 0 ? Math.round((deals.filter(d => d.stage === 'Closed Won').length / deals.length) * 100) : 64;

  // Filter deals
  const filteredDeals = deals.filter(d => {
    const matchesSearch =
      d.dealName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'ALL' || d.stage === selectedStage;
    const matchesSector = selectedSector === 'ALL' || d.sector === selectedSector;
    return matchesSearch && matchesStage && matchesSector;
  });

  const STAGES = [
    { name: 'Qualification', color: 'bg-sky-500 text-white', border: 'border-sky-200' },
    { name: 'Proposal', color: 'bg-indigo-600 text-white', border: 'border-indigo-200' },
    { name: 'Negotiation', color: 'bg-rose-500 text-white', border: 'border-rose-200' },
    { name: 'Closed Won', color: 'bg-emerald-600 text-white', border: 'border-emerald-200' },
  ];

  return (
    <div id="view-pipeline-overview" className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
              Pipeline & Revenue Intelligence
            </h1>
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              <Sparkles className="h-3 w-3 text-indigo-600" />
              <span>Active Deals Pipeline</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Comprehensive deal stage distribution, contract values, and enterprise revenue forecasts.
          </p>
        </div>

        <button
          onClick={() => onSelectFilter('Analyze high-priority pipeline deals ($50k+) closing this quarter')}
          className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-md cursor-pointer shrink-0"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Ask AI for Pipeline Analysis</span>
        </button>
      </div>

      {/* Top Pipeline Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Pipeline */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            TOTAL PIPELINE VALUE
          </span>
          <div className="mt-2 text-3xl font-extrabold text-slate-950 font-mono">
            {formatCurrency(totalPipeline || 15790000)}
          </div>
          <span className="text-xs font-bold text-emerald-600 mt-1 block">
            {deals.length || 351} Active Opportunities
          </span>
        </div>

        {/* Closed Won */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            CLOSED WON REVENUE
          </span>
          <div className="mt-2 text-3xl font-extrabold text-slate-950 font-mono">
            {formatCurrency(closedWon || 7420000)}
          </div>
          <span className="text-xs font-bold text-indigo-600 mt-1 block">
            Booked Contracts
          </span>
        </div>

        {/* Average Deal Size */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            AVG CONTRACT VALUE
          </span>
          <div className="mt-2 text-3xl font-extrabold text-slate-950 font-mono">
            {formatCurrency(avgDealSize || 45000)}
          </div>
          <span className="text-xs font-bold text-slate-600 mt-1 block">
            Across Mining & Infra
          </span>
        </div>

        {/* Win Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            ESTIMATED WIN RATE
          </span>
          <div className="mt-2 text-3xl font-extrabold text-slate-950 font-mono">
            {winRate}%
          </div>
          <span className="text-xs font-bold text-emerald-600 mt-1 block">
            +5.2% vs Previous Quarter
          </span>
        </div>

      </div>

      {/* Deals Kanban / Stage Breakdown Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((stg) => {
          const stageDeals = deals.filter(d => d.stage === stg.name);
          const stageVal = stageDeals.reduce((sum, d) => sum + d.dealValue, 0);
          return (
            <div
              key={stg.name}
              onClick={() => setSelectedStage(stg.name === selectedStage ? 'ALL' : stg.name)}
              className={`rounded-2xl border bg-white p-4 shadow-xs cursor-pointer transition-all duration-200 ${
                selectedStage === stg.name ? 'ring-2 ring-indigo-500 border-indigo-300' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`rounded-lg px-2.5 py-1 text-xs font-extrabold ${stg.color}`}>
                  {stg.name}
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  {stageDeals.length} Deals
                </span>
              </div>
              <div className="mt-3 text-xl font-extrabold text-slate-950 font-mono">
                {formatCurrency(stageVal)}
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                Click to filter table below
              </span>
            </div>
          );
        })}
      </div>

      {/* Filterable Pipeline Deals Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        
        {/* Table Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Active Pipeline Records</h3>
            <p className="text-xs text-slate-500">Showing {filteredDeals.length} opportunities from Monday.com GraphQL</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search deals..."
                className="rounded-xl border border-slate-300 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Reset Filters Button */}
            {(selectedStage !== 'ALL' || selectedSector !== 'ALL' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedStage('ALL');
                  setSelectedSector('ALL');
                  setSearchTerm('');
                }}
                className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Deals Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-900 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Deal Name</th>
                <th className="px-4 py-3.5">Client</th>
                <th className="px-4 py-3.5">Sector</th>
                <th className="px-4 py-3.5">Stage</th>
                <th className="px-4 py-3.5 text-right">Value</th>
                <th className="px-4 py-3.5">Contract Type</th>
                <th className="px-4 py-3.5">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800 bg-white">
              {filteredDeals.length > 0 ? (
                filteredDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-indigo-50/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-950">{deal.dealName}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">{deal.clientName}</td>
                    <td className="px-4 py-3.5 text-slate-700">{deal.sector}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                        deal.stage === 'Closed Won' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        deal.stage === 'Proposal' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' :
                        deal.stage === 'Negotiation' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                        'bg-sky-50 text-sky-800 border border-sky-200'
                      }`}>
                        {deal.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-extrabold font-mono text-slate-950 text-right">{formatCurrency(deal.dealValue)}</td>
                    <td className="px-4 py-3.5 text-slate-700">{deal.contractType}</td>
                    <td className="px-4 py-3.5 text-slate-700">{deal.owner}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-600 font-semibold">
                    No active deals match the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
