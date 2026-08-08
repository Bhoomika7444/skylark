import React from 'react';
import { Database, Cpu, RefreshCw, SlidersHorizontal, Sparkles, FileText } from 'lucide-react';
import { HealthStatus } from '../../src/types/index.js';

interface HeaderProps {
  health?: HealthStatus;
  isLiveConnection: boolean;
  onOpenLeadership: () => void;
  onOpenDataDrawer: () => void;
  onOpenSettings: () => void;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  isLiveConnection,
  onOpenLeadership,
  onOpenDataDrawer,
  onOpenSettings,
  onRefresh,
}) => {
  return (
    <header id="main-header" className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand & Workspace Name */}
        <div className="flex items-center space-x-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-extrabold tracking-tight text-slate-900">SkyInsight BI</h1>
              <span className="inline-flex items-center rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-800">
                Skylark Drones
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-semibold hidden sm:block">
              Enterprise Revenue Operations & Monday.com Intelligence
            </p>
          </div>
        </div>

        {/* Live Badges (Monday & Gemini) */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Monday.com Live Connection */}
          <button
            id="btn-monday-status"
            onClick={onOpenDataDrawer}
            className={`flex items-center space-x-2 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              isLiveConnection
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                : 'border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
            title="Inspect Monday.com Live GraphQL Data"
          >
            <Database className="h-3.5 w-3.5 text-emerald-600" />
            <span className="flex items-center space-x-1.5">
              <span className={`h-2 w-2 rounded-full ${isLiveConnection ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{isLiveConnection ? 'Monday GraphQL Live' : 'Skylark Reference Mode'}</span>
            </span>
          </button>

          {/* Gemini AI Engine Badge */}
          <div
            id="badge-gemini-status"
            className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-800"
          >
            <Cpu className="h-3.5 w-3.5 text-indigo-600" />
            <span>Gemini 3.6 Flash</span>
          </div>
        </div>

        {/* Header Action Controls & User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          
          <button
            id="btn-leadership-update"
            onClick={onOpenLeadership}
            className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-indigo-700 shadow-xs cursor-pointer active:scale-98"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Generate</span> Briefing
          </button>

          <button
            id="btn-data-drawer"
            onClick={onOpenDataDrawer}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-all cursor-pointer"
            title="Inspect Raw Monday.com Records"
          >
            <Database className="h-4 w-4 text-slate-700" />
            <span className="hidden sm:inline">Records</span>
          </button>

          <button
            id="btn-refresh-data"
            onClick={onRefresh}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-all cursor-pointer"
            title="Refresh Live Data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            id="btn-open-settings"
            onClick={onOpenSettings}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-all cursor-pointer"
            title="System Configuration"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
