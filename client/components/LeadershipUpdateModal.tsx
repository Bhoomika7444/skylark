import React, { useState } from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, ArrowRight, Download, Sparkles, Copy, Check } from 'lucide-react';
import { fetchLeadershipUpdate } from '../services/api.js';
import { LeadershipUpdateResponse } from '../../src/types/index.js';

interface LeadershipUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadershipUpdateModal: React.FC<LeadershipUpdateModalProps> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<LeadershipUpdateResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchLeadershipUpdate();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to generate leadership update');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && !data && !isLoading) {
      handleGenerate();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!data) return;
    const text = `
${data.title} (${data.period})
Generated: ${data.generatedAt}

SUMMARY:
${data.summary}

KEY WINS:
${data.wins.map(w => `- ${w}`).join('\n')}

RISKS & BLOCKERS:
${data.risks.map(r => `- ${r}`).join('\n')}

ACTION ITEMS:
${data.actionItems.map(a => `- ${a}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="modal-leadership-update" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Executive Leadership Update</h2>
              <p className="text-xs text-slate-400">Skylark Drones C-Suite Operational Briefing</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {data && (
              <button
                id="btn-copy-leadership"
                onClick={handleCopy}
                className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Briefing'}</span>
              </button>
            )}

            <button
              id="btn-close-leadership"
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-sky-600 border-t-transparent" />
              <p className="text-sm font-medium text-slate-700">Synthesizing live Monday.com operational data...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              {error}
            </div>
          ) : data ? (
            <div className="space-y-6">
              
              {/* Report Sub-Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{data.title}</h3>
                  <p className="text-xs text-slate-500">{data.period} • Generated on {data.generatedAt}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Monday.com Verified
                </span>
              </div>

              {/* High Level Summary */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Executive Briefing
                </h4>
                <p className="text-xs text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                  {data.summary}
                </p>
              </div>

              {/* Key Metrics Grid */}
              {data.keyMetrics && data.keyMetrics.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {data.keyMetrics.map((km, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                      <span className="block text-[11px] font-medium text-slate-500">{km.label}</span>
                      <span className="block text-lg font-bold text-slate-900 mt-1">{km.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Wins vs Risks 2 Column Layout */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                
                {/* Wins */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3 flex items-center space-x-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Quarterly Wins & Milestones</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-emerald-950">
                    {data.wins.map((w, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="font-bold text-emerald-600">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risks */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-3 flex items-center space-x-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span>Risks & Operational Blockers</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-amber-950">
                    {data.risks.map((r, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="font-bold text-amber-600">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Action Items */}
              <div className="rounded-xl border border-slate-900 bg-slate-900 p-4 text-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3 flex items-center space-x-1.5">
                  <Sparkles className="h-4 w-4" />
                  <span>Strategic Action Items for Founders</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-200">
                  {data.actionItems.map((act, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-sky-400 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">
          <button
            id="btn-re-generate"
            onClick={handleGenerate}
            disabled={isLoading}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            Re-generate Report
          </button>
          <button
            id="btn-close-leadership-footer"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
