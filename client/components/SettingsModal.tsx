import React, { useState } from 'react';
import { X, Key, Database, SlidersHorizontal, CheckCircle2, ShieldAlert } from 'lucide-react';
import { HealthStatus } from '../../src/types/index.js';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  health?: HealthStatus;
  onRefresh: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  health,
  onRefresh,
}) => {
  if (!isOpen) return null;

  return (
    <div id="modal-settings" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center space-x-3">
            <SlidersHorizontal className="h-5 w-5 text-sky-400" />
            <div>
              <h2 className="text-base font-bold text-white">System Configuration</h2>
              <p className="text-xs text-slate-400">Monday.com & Gemini API Integration Settings</p>
            </div>
          </div>
          <button
            id="btn-close-settings"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          
          {/* Status Overview */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <h3 className="font-bold uppercase tracking-wider text-slate-500">Live Status Overview</h3>
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-medium text-slate-700">Monday.com API Connection</span>
              <span className={`font-semibold ${health?.mondayConnected ? 'text-emerald-600' : 'text-amber-600'}`}>
                {health?.mondayConnected ? 'Connected (Live GraphQL)' : 'Fallback Reference Mode'}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-medium text-slate-700">Gemini 3.6 AI Engine</span>
              <span className={`font-semibold ${health?.geminiConnected ? 'text-emerald-600' : 'text-amber-600'}`}>
                {health?.geminiConnected ? 'Active' : 'Deterministic Fallback Active'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700">API Version</span>
              <span className="font-mono text-slate-900">2025-04</span>
            </div>
          </div>

          {/* Environment Variables Reference */}
          <div className="space-y-3">
            <h3 className="font-bold uppercase tracking-wider text-slate-500">Configured Environment Variables</h3>
            
            <div className="space-y-2 font-mono text-[11px]">
              <div className="rounded-lg border border-slate-200 bg-slate-900 p-3 text-slate-200">
                <p><span className="text-sky-400">MONDAY_API_KEY</span>={health?.environment?.hasMondayKey ? '••••••••••••' : '(Not Configured)'}</p>
                <p><span className="text-sky-400">MONDAY_API_VERSION</span>=2025-04</p>
                <p><span className="text-sky-400">WORK_ORDER_BOARD_ID</span>={health?.boards?.workOrdersBoardId || '5030485390'}</p>
                <p><span className="text-sky-400">DEALS_BOARD_ID</span>={health?.boards?.dealsBoardId || '5030486158'}</p>
                <p><span className="text-sky-400">GEMINI_API_KEY</span>={health?.environment?.hasGeminiKey ? '••••••••••••' : '(Not Configured)'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-3 text-sky-900">
            <p className="font-medium">
              Note: Credentials are managed via environment variables in <code className="font-bold">.env.example</code> or AI Studio Secrets.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 flex justify-end">
          <button
            id="btn-close-settings-footer"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
