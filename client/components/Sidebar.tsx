import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Layers,
  Database,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  qualityScore?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  qualityScore = 75,
}) => {
  const NAV_ITEMS = [
    { id: 'cockpit', label: 'Executive Cockpit', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Pipeline Overview', icon: TrendingUp },
    { id: 'workOrders', label: 'Work Orders', icon: FileText },
    { id: 'deals', label: 'Deals', icon: Layers },
    { id: 'briefings', label: 'Leadership Briefings', icon: FileText },
    { id: 'boards', label: 'Boards & Logs', icon: Database },
    { id: 'quality', label: 'Data Quality', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <aside id="main-sidebar" className="hidden lg:flex w-64 shrink-0 flex-col bg-[#0F172A] text-slate-200 min-h-screen border-r border-slate-800 justify-between select-none">
      <div>
        {/* Sidebar Brand Header */}
        <div className="flex items-center space-x-3 px-6 py-5 border-b border-slate-800/80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-base font-extrabold text-white tracking-tight">SkyInsight</h2>
              <span className="text-base font-extrabold text-indigo-400">BI</span>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Skylark Drones</span>
          </div>
        </div>

        {/* Navigation Item List */}
        <nav className="p-4 space-y-1.5 mt-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center space-x-3 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-150 text-left cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Metadata Widget */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 m-4 rounded-2xl text-xs space-y-3">
        <div>
          <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Data Last Synced</span>
          <span className="font-extrabold text-emerald-400">Just now</span>
        </div>

        <div>
          <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Source</span>
          <div className="flex items-center space-x-2 text-white font-bold mt-0.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Monday.com GraphQL</span>
          </div>
        </div>

        <div>
          <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Environment</span>
          <span className="font-bold text-slate-200">Production</span>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center space-x-2 text-emerald-400 font-bold">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{qualityScore}% Verified Data</span>
        </div>
      </div>
    </aside>
  );
};
