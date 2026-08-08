import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sparkles, Calendar, FileSpreadsheet, ChevronRight, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useMondayData } from '../client/hooks/useMondayData.js';
import { useChat } from '../client/hooks/useChat.js';
import { Sidebar } from '../client/components/Sidebar.js';
import { Header } from '../client/components/Header.js';
import { DashboardMetrics } from '../client/components/DashboardMetrics.js';
import { SuggestedQuestions } from '../client/components/SuggestedQuestions.js';
import { DataCharts } from '../client/components/DataCharts.js';
import { PipelineOverview } from '../client/components/PipelineOverview.js';
import { ChatInterface } from '../client/components/ChatInterface.js';
import { LeadershipUpdateModal } from '../client/components/LeadershipUpdateModal.js';
import { BoardDataDrawer } from '../client/components/BoardDataDrawer.js';
import { SettingsModal } from '../client/components/SettingsModal.js';
import { formatDate } from '../client/utils/formatters.js';

const queryClient = new QueryClient();

function MainDashboard() {
  const {
    health,
    workOrders,
    workOrdersQuality,
    deals,
    dealsQuality,
    isLiveConnection,
    lastSyncedAt,
    isLoading,
    refetchAll,
  } = useMondayData();

  const { messages, isTyping, sendMessage, clearHistory } = useChat();

  const [activeTab, setActiveTab] = useState('cockpit');
  const [drawerInitialTab, setDrawerInitialTab] = useState<'workOrders' | 'deals' | 'quality'>('workOrders');
  const [isLeadershipOpen, setIsLeadershipOpen] = useState(false);
  const [isDataDrawerOpen, setIsDataDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSelectFilter = (filterPrompt: string) => {
    sendMessage(filterPrompt);
  };

  const handleSelectSidebarTab = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'boards' || tabId === 'workOrders') {
      setDrawerInitialTab('workOrders');
      setIsDataDrawerOpen(true);
    } else if (tabId === 'deals') {
      setDrawerInitialTab('deals');
      setIsDataDrawerOpen(true);
    } else if (tabId === 'quality') {
      setDrawerInitialTab('quality');
      setIsDataDrawerOpen(true);
    } else if (tabId === 'briefings') {
      setIsLeadershipOpen(true);
    } else if (tabId === 'settings') {
      setIsSettingsOpen(true);
    }
  };

  return (
    <div id="app-root" className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. Left Dark Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleSelectSidebarTab}
        qualityScore={workOrdersQuality?.qualityScorePercent || dealsQuality?.qualityScorePercent || 75}
      />

      {/* 2. Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Navigation */}
        <Header
          health={health}
          isLiveConnection={isLiveConnection}
          onOpenLeadership={() => setIsLeadershipOpen(true)}
          onOpenDataDrawer={() => setIsDataDrawerOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onRefresh={refetchAll}
        />

        {/* Dashboard Main Grid Area */}
        <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          
          {/* Executive Welcome Header + Selector Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Executive BI Cockpit
                </h1>
                <span className="inline-flex items-center space-x-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                  <span>Active</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                Real-time revenue operations & mission intelligence for Skylark Drones leadership.
              </p>
            </div>

            {/* Date Pill & Work Orders Counter Pill */}
            <div className="flex items-center space-x-3 shrink-0">
              <div
                className="flex items-center space-x-2 rounded-xl border border-slate-200/90 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-2xs"
                title={lastSyncedAt ? `Last synced: ${new Date(lastSyncedAt).toLocaleTimeString()}` : ''}
              >
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span>{lastSyncedAt ? formatDate(lastSyncedAt) : 'Syncing...'}</span>
              </div>

              <button
                onClick={() => setIsDataDrawerOpen(true)}
                className="flex items-center space-x-2 rounded-xl border border-slate-200/90 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer group"
              >
                <span>{workOrders.length || 181} Work Orders</span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Top Data Quality Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4.5 card-elevation text-xs">
            <div className="flex items-center space-x-3 text-slate-800 font-semibold">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>
                Data dynamically fetched from Monday.com GraphQL & cleaned (nulls, company names, date formats normalized).
              </span>
            </div>
            <button
              onClick={() => setIsDataDrawerOpen(true)}
              className="flex items-center space-x-1.5 font-bold text-indigo-700 hover:text-indigo-900 transition-colors shrink-0 cursor-pointer group"
            >
              <span>Inspect Raw Boards & Logs</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Main 2-Column Responsive Dashboard Layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            
            {/* Left 8-Columns: Dynamic Content View Based on activeTab */}
            <div className="lg:col-span-8 space-y-6 min-w-0">
              
              {activeTab === 'pipeline' ? (
                <PipelineOverview deals={deals} onSelectFilter={handleSelectFilter} />
              ) : (
                <>
                  {/* KPI Metrics Cards (4 Grid) */}
                  <DashboardMetrics
                    workOrders={workOrders}
                    deals={deals}
                    qualityReport={workOrdersQuality || dealsQuality}
                    onSelectFilter={handleSelectFilter}
                  />

                  {/* Executive Intelligence Prompts (6 Grid) */}
                  <SuggestedQuestions onSelectQuestion={handleSelectFilter} />

                  {/* Charts (Pipeline Trend & Deals by Stage) */}
                  <DataCharts deals={deals} />
                </>
              )}

            </div>

            {/* Right 4-Columns: Docked Responsive SkyInsight AI Assistant Widget */}
            <div className="lg:col-span-4 min-w-0">
              <ChatInterface
                messages={messages}
                isTyping={isTyping}
                onSendMessage={sendMessage}
                onClearHistory={clearHistory}
              />
            </div>

          </div>

        </main>
      </div>

      {/* Modals & Board Inspector Drawers */}
      <LeadershipUpdateModal
        isOpen={isLeadershipOpen}
        onClose={() => setIsLeadershipOpen(false)}
      />

      <BoardDataDrawer
        isOpen={isDataDrawerOpen}
        onClose={() => setIsDataDrawerOpen(false)}
        workOrders={workOrders}
        workOrdersQuality={workOrdersQuality}
        deals={deals}
        dealsQuality={dealsQuality}
        isLiveConnection={isLiveConnection}
        initialTab={drawerInitialTab}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        health={health}
        onRefresh={refetchAll}
      />

    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainDashboard />
    </QueryClientProvider>
  );
}
