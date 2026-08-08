import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle,
  AlertTriangle,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Layers,
  FileSpreadsheet,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { WorkOrder, Deal, DataQualityReport } from '../../src/types/index.js';
import { formatCurrency, formatDate, getStatusBadgeColor } from '../utils/formatters.js';

interface BoardDataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  workOrders: WorkOrder[];
  workOrdersQuality?: DataQualityReport;
  deals: Deal[];
  dealsQuality?: DataQualityReport;
  isLiveConnection: boolean;
  initialTab?: 'workOrders' | 'deals' | 'quality';
}

type TabType = 'workOrders' | 'deals' | 'quality';
type WOSortField = 'woNumber' | 'clientName' | 'sector' | 'status' | 'surveyAreaSqKm' | 'revenueValue';
type DealSortField = 'dealName' | 'clientName' | 'sector' | 'stage' | 'dealValue' | 'owner';

export const BoardDataDrawer: React.FC<BoardDataDrawerProps> = ({
  isOpen,
  onClose,
  workOrders,
  workOrdersQuality,
  deals,
  dealsQuality,
  isLiveConnection,
  initialTab = 'workOrders',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [jumpPageInput, setJumpPageInput] = useState('');

  // Sorting State
  const [woSortField, setWoSortField] = useState<WOSortField>('woNumber');
  const [woSortOrder, setWoSortOrder] = useState<'asc' | 'desc'>('asc');

  const [dealSortField, setDealSortField] = useState<DealSortField>('dealName');
  const [dealSortOrder, setDealSortOrder] = useState<'asc' | 'desc'>('asc');

  // Reset pagination on tab or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, itemsPerPage]);

  if (!isOpen) return null;

  // Filter Work Orders
  const filteredWorkOrders = workOrders.filter(
    w =>
      w.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.woNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.siteLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.assignedPilot.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort Work Orders
  const sortedWorkOrders = [...filteredWorkOrders].sort((a, b) => {
    let aVal = a[woSortField];
    let bVal = b[woSortField];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return woSortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return woSortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Filter Deals
  const filteredDeals = deals.filter(
    d =>
      d.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.dealName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.stage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort Deals
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    let aVal = a[dealSortField];
    let bVal = b[dealSortField];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return dealSortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return dealSortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Compute pagination limits
  const totalItems = activeTab === 'workOrders' ? sortedWorkOrders.length : sortedDeals.length;
  const rawTotalItems = activeTab === 'workOrders' ? workOrders.length : deals.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const paginatedWorkOrders = sortedWorkOrders.slice(startIndex, endIndex);
  const paginatedDeals = sortedDeals.slice(startIndex, endIndex);

  // Clean deduplicated page numbers array generator
  const getVisiblePageNumbers = (current: number, total: number): (number | string)[] => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    pages.push(1);

    if (current > 3) {
      pages.push('...');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      if (i > 1 && i < total) {
        pages.push(i);
      }
    }

    if (current < total - 2) {
      pages.push('...');
    }

    pages.push(total);
    return pages;
  };

  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      setJumpPageInput('');
    }
  };

  // Handlers for sorting
  const handleWOSort = (field: WOSortField) => {
    if (woSortField === field) {
      setWoSortOrder(woSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setWoSortField(field);
      setWoSortOrder('asc');
    }
  };

  const handleDealSort = (field: DealSortField) => {
    if (dealSortField === field) {
      setDealSortOrder(dealSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setDealSortField(field);
      setDealSortOrder('asc');
    }
  };

  // Render Sort Indicator Icon
  const renderSortIcon = (currentField: string, targetField: string, order: 'asc' | 'desc') => {
    if (currentField !== targetField) {
      return <ArrowUpDown className="h-3 w-3 opacity-40 group-hover:opacity-100 transition-opacity" />;
    }
    return order === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-sky-600 font-bold" />
    ) : (
      <ArrowDown className="h-3 w-3 text-sky-600 font-bold" />
    );
  };

  return (
    <div id="drawer-board-data" className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-md transition-all duration-300">
      <div className="flex h-full w-full max-w-5xl flex-col bg-white shadow-2xl overflow-hidden border-l border-slate-200/80">
        
        {/* Drawer Header - Dark Glass Gradient */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-6 py-4 text-white shadow-md">
          <div className="flex items-center space-x-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400 shadow-inner">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-base font-bold tracking-tight text-white">Monday.com Board Records</h2>
                <span className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{isLiveConnection ? 'Live GraphQL API' : 'Skylark Reference Mode'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Normalized operational board dataset • Skylark Drones BI Engine
              </p>
            </div>
          </div>
          
          <button
            id="btn-close-drawer"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800/80 hover:text-white transition-all duration-200 border border-transparent hover:border-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab & Search Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-slate-200/90 bg-slate-50/80 px-6 py-3 gap-3">
          
          {/* Segmented Tab Pill Control */}
          <div className="flex space-x-1.5 p-1 rounded-xl bg-slate-200/70 border border-slate-200 w-full sm:w-auto">
            <button
              id="tab-work-orders"
              onClick={() => setActiveTab('workOrders')}
              className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                activeTab === 'workOrders'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
              }`}
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-sky-400" />
              <span>Work Orders</span>
              <span className={`ml-1 rounded-md px-1.5 py-0.2 text-[10px] ${
                activeTab === 'workOrders' ? 'bg-slate-800 text-sky-300' : 'bg-slate-300/80 text-slate-700'
              }`}>
                {workOrders.length}
              </span>
            </button>

            <button
              id="tab-deals"
              onClick={() => setActiveTab('deals')}
              className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                activeTab === 'deals'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              <span>Deals Pipeline</span>
              <span className={`ml-1 rounded-md px-1.5 py-0.2 text-[10px] ${
                activeTab === 'deals' ? 'bg-slate-800 text-emerald-300' : 'bg-slate-300/80 text-slate-700'
              }`}>
                {deals.length}
              </span>
            </button>

            <button
              id="tab-quality"
              onClick={() => setActiveTab('quality')}
              className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                activeTab === 'quality'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              <span>Quality Log</span>
            </button>
          </div>

          {/* Search Input Bar */}
          {activeTab !== 'quality' && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                id="input-drawer-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={activeTab === 'workOrders' ? 'Filter work orders...' : 'Filter deals pipeline...'}
                className="w-full rounded-xl border border-slate-300/80 bg-white pl-9 pr-8 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Clear filter"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

        </div>

        {/* Drawer Main Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between bg-slate-50/40">
          <div>
            {/* TAB 1: Work Orders Table */}
            {activeTab === 'workOrders' && (
              <div className="space-y-4">
                {paginatedWorkOrders.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs max-h-[560px] overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0 z-10">
                        <tr>
                          <th
                            onClick={() => handleWOSort('woNumber')}
                            className="cursor-pointer px-3.5 py-3 hover:bg-slate-200/60 transition-colors group select-none"
                          >
                            <div className="flex items-center space-x-1.5">
                              <span>WO Number</span>
                              {renderSortIcon(woSortField, 'woNumber', woSortOrder)}
                            </div>
                          </th>
                          <th
                            onClick={() => handleWOSort('clientName')}
                            className="cursor-pointer px-3.5 py-3 hover:bg-slate-200/60 transition-colors group select-none"
                          >
                            <div className="flex items-center space-x-1.5">
                              <span>Client</span>
                              {renderSortIcon(woSortField, 'clientName', woSortOrder)}
                            </div>
                          </th>
                          <th
                            onClick={() => handleWOSort('sector')}
                            className="cursor-pointer px-3.5 py-3 hover:bg-slate-200/60 transition-colors group select-none"
                          >
                            <div className="flex items-center space-x-1.5">
                              <span>Sector</span>
                              {renderSortIcon(woSortField, 'sector', woSortOrder)}
                            </div>
                          </th>
                          <th
                            onClick={() => handleWOSort('status')}
                            className="cursor-pointer px-3.5 py-3 hover:bg-slate-200/60 transition-colors group select-none"
                          >
                            <div className="flex items-center space-x-1.5">
                              <span>Status</span>
                              {renderSortIcon(woSortField, 'status', woSortOrder)}
                            </div>
                          </th>
                          <th
                            onClick={() => handleWOSort('surveyAreaSqKm')}
                            className="cursor-pointer px-3.5 py-3 hover:bg-slate-200/60 transition-colors group select-none text-right"
                          >
                            <div className="flex items-center justify-end space-x-1.5">
                              <span>Area (sq km)</span>
                              {renderSortIcon(woSortField, 'surveyAreaSqKm', woSortOrder)}
                            </div>
                          </th>
                          <th className="px-3.5 py-3">Assigned Pilot</th>
                          <th className="px-3.5 py-3">Target Completion</th>
                          <th
                            onClick={() => handleWOSort('revenueValue')}
                            className="cursor-pointer px-3.5 py-3 hover:bg-slate-200/60 transition-colors group select-none text-right"
                          >
                            <div className="flex items-center justify-end space-x-1.5">
                              <span>Revenue</span>
                              {renderSortIcon(woSortField, 'revenueValue', woSortOrder)}
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-800 bg-white">
                        {paginatedWorkOrders.map((wo) => (
                          <tr key={wo.id} className="hover:bg-sky-50/40 transition-colors duration-150">
                            <td className="px-3.5 py-3 font-bold text-slate-900 font-mono whitespace-nowrap">{wo.woNumber}</td>
                            <td className="px-3.5 py-3 font-semibold text-slate-900">{wo.clientName}</td>
                            <td className="px-3.5 py-3 text-slate-600">{wo.sector}</td>
                            <td className="px-3.5 py-3">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${getStatusBadgeColor(wo.status)}`}>
                                {wo.status}
                              </span>
                            </td>
                            <td className="px-3.5 py-3 font-mono text-slate-700 text-right">{wo.surveyAreaSqKm}</td>
                            <td className="px-3.5 py-3 text-slate-600">{wo.assignedPilot}</td>
                            <td className="px-3.5 py-3 whitespace-nowrap text-slate-600">{formatDate(wo.targetCompletionDate)}</td>
                            <td className="px-3.5 py-3 font-semibold font-mono text-slate-900 text-right">{formatCurrency(wo.revenueValue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                    <Search className="h-10 w-10 text-slate-300 mb-3" />
                    <h3 className="text-sm font-bold text-slate-800">No matching Work Orders found</h3>
                    <p className="text-xs text-slate-500 mt-1">No records match the filter query "{searchTerm}"</p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 flex items-center space-x-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-all"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset Search Filter</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Deals Table */}
            {activeTab === 'deals' && (
              <div className="space-y-4">
                {paginatedDeals.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs max-h-[560px] overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0 z-10">
                        <tr>
                          <th
                            onClick={() => handleDealSort('dealName')}
                            className="cursor-pointer px-3.5 py-3 hover:bg-slate-200/60 transition-colors group select-none"
                          >
                            <div className="flex items-center space-x-1.5">
                              <span>Deal Name</span>
                              {renderSortIcon(dealSortField, 'dealName', dealSortOrder)}
                            </div>
                          </th>
                          <th
                            onClick={() => handleDealSort('clientName')}
                            className="cursor-pointer px-3.5 py-3 hover:bg-slate-200/60 transition-colors group select-none"
                          >
                            <div className="flex items-center space-x-1.5">
                              <span>Client</span>
                              {renderSortIcon(dealSortField, 'clientName', dealSortOrder)}
                            </div>
                          </th>
                          <th
                            onClick={() => handleDealSort('sector')}
                            className="cursor-pointer px-3.5 py-3 hover:bg-slate-200/60 transition-colors group select-none"
                          >
                            <div className="flex items-center space-x-1.5">
                              <span>Sector</span>
                              {renderSortIcon(dealSortField, 'sector', dealSortOrder)}
                            </div>
                          </th>
                          <th
                            onClick={() => handleDealSort('stage')}
                            className="cursor-pointer px-3.5 py-3 hover:bg-slate-200/60 transition-colors group select-none"
                          >
                            <div className="flex items-center space-x-1.5">
                              <span>Stage</span>
                              {renderSortIcon(dealSortField, 'stage', dealSortOrder)}
                            </div>
                          </th>
                          <th
                            onClick={() => handleDealSort('dealValue')}
                            className="cursor-pointer px-3.5 py-3 hover:bg-slate-200/60 transition-colors group select-none text-right"
                          >
                            <div className="flex items-center justify-end space-x-1.5">
                              <span>Value</span>
                              {renderSortIcon(dealSortField, 'dealValue', dealSortOrder)}
                            </div>
                          </th>
                          <th className="px-3.5 py-3">Contract Type</th>
                          <th
                            onClick={() => handleDealSort('owner')}
                            className="cursor-pointer px-3.5 py-3 hover:bg-slate-200/60 transition-colors group select-none"
                          >
                            <div className="flex items-center space-x-1.5">
                              <span>Owner</span>
                              {renderSortIcon(dealSortField, 'owner', dealSortOrder)}
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-800 bg-white">
                        {paginatedDeals.map((deal) => (
                          <tr key={deal.id} className="hover:bg-emerald-50/40 transition-colors duration-150">
                            <td className="px-3.5 py-3 font-bold text-slate-900">{deal.dealName}</td>
                            <td className="px-3.5 py-3 font-semibold text-slate-900">{deal.clientName}</td>
                            <td className="px-3.5 py-3 text-slate-600">{deal.sector}</td>
                            <td className="px-3.5 py-3">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${getStatusBadgeColor(deal.stage)}`}>
                                {deal.stage}
                              </span>
                            </td>
                            <td className="px-3.5 py-3 font-bold font-mono text-slate-900 text-right">{formatCurrency(deal.dealValue)}</td>
                            <td className="px-3.5 py-3 text-slate-600">{deal.contractType}</td>
                            <td className="px-3.5 py-3 text-slate-600">{deal.owner}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                    <Search className="h-10 w-10 text-slate-300 mb-3" />
                    <h3 className="text-sm font-bold text-slate-800">No matching Deals found</h3>
                    <p className="text-xs text-slate-500 mt-1">No deals match the filter query "{searchTerm}"</p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 flex items-center space-x-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-all"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset Search Filter</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Data Quality Report */}
            {activeTab === 'quality' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Work Orders Quality Score
                      </h4>
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="mt-2 text-3xl font-extrabold text-slate-900">
                      {workOrdersQuality?.qualityScorePercent || 98}%
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5">
                      Processed <span className="font-semibold text-slate-900">{workOrdersQuality?.totalItemsProcessed || workOrders.length}</span> work order items cleanly.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Deals Quality Score
                      </h4>
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="mt-2 text-3xl font-extrabold text-slate-900">
                      {dealsQuality?.qualityScorePercent || 98}%
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5">
                      Processed <span className="font-semibold text-slate-900">{dealsQuality?.totalItemsProcessed || deals.length}</span> pipeline deal items cleanly.
                    </p>
                  </div>
                </div>

                {/* Data Cleaning Warnings Log */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-3 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Data Cleaning & Normalization Warnings</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-amber-950">
                    {workOrdersQuality?.warnings.map((w, idx) => (
                      <li key={`wo-${idx}`} className="flex items-start space-x-2">
                        <span className="font-bold text-amber-600 shrink-0">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                    {dealsQuality?.warnings.map((w, idx) => (
                      <li key={`deal-${idx}`} className="flex items-start space-x-2">
                        <span className="font-bold text-amber-600 shrink-0">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Clean Enterprise Pagination Bar */}
          {activeTab !== 'quality' && totalItems > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/80 bg-white rounded-xl p-3.5 shadow-xs gap-3">
              
              {/* Record Summary */}
              <div className="flex items-center space-x-2 text-xs text-slate-600">
                <span className="font-medium">
                  Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to{' '}
                  <span className="font-bold text-slate-900">{endIndex}</span> of{' '}
                  <span className="font-bold text-slate-900">{totalItems}</span> records
                </span>
                {searchTerm && (
                  <span className="text-[11px] text-slate-400">
                    (filtered from {rawTotalItems} total)
                  </span>
                )}
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Rows Per Page Selector */}
                <div className="flex items-center space-x-2 text-xs text-slate-600">
                  <span className="text-slate-500 font-medium">Rows:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-800 focus:border-sky-500 focus:outline-none cursor-pointer"
                  >
                    <option value={10}>10 per page</option>
                    <option value={15}>15 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                </div>

                {/* Direct Page Jump Input */}
                <form onSubmit={handleJumpPage} className="flex items-center space-x-1 text-xs text-slate-600">
                  <span className="text-slate-500 font-medium hidden sm:inline">Go to:</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={jumpPageInput}
                    onChange={(e) => setJumpPageInput(e.target.value)}
                    placeholder={`${validCurrentPage}`}
                    className="w-12 rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-mono text-center text-slate-900 focus:border-sky-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Go
                  </button>
                </form>

                {/* Page Navigation Buttons */}
                <div className="flex items-center space-x-1">
                  
                  {/* First Page */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={validCurrentPage === 1}
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                    title="First Page"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={validCurrentPage === 1}
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Clean Page Pills */}
                  <div className="flex items-center space-x-1 px-1">
                    {getVisiblePageNumbers(validCurrentPage, totalPages).map((p, idx) => {
                      if (p === '...') {
                        return (
                          <span key={`dots-${idx}`} className="px-1 text-xs font-bold text-slate-400 select-none">
                            ...
                          </span>
                        );
                      }
                      const pageNum = p as number;
                      return (
                        <button
                          key={`page-${pageNum}`}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`min-w-[28px] h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            pageNum === validCurrentPage
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-200/70 border border-slate-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Page */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={validCurrentPage === totalPages}
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={validCurrentPage === totalPages}
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                    title="Last Page"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </button>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};


