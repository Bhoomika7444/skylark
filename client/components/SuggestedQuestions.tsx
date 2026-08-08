import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  PieChart,
  Users,
  Layers,
  Zap,
} from 'lucide-react';

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelectQuestion }) => {
  const PROMPTS = [
    {
      icon: TrendingUp,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      question: 'What is our current pipeline health and ARR run-rate?',
      category: 'Revenue Ops',
      badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    {
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      question: 'Which work orders are delayed and what are the root causes?',
      category: 'Missions',
      badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    },
    {
      icon: PieChart,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
      question: 'Break down revenue by sector (Mining vs Infrastructure vs Solar)',
      category: 'Analytics',
      badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    {
      icon: Users,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      question: 'Who are our top 3 enterprise customers by contract value?',
      category: 'Key Accounts',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      icon: Layers,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      question: 'What high-priority deals ($50k+) are closing in Q3?',
      category: 'Pipeline',
      badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    {
      icon: Zap,
      iconBg: 'bg-orange-50 text-orange-600 border-orange-100',
      question: 'Are recurring contracts outperforming one-off drone survey deals?',
      category: 'Strategy',
      badgeBg: 'bg-orange-50 text-orange-900 border-orange-200',
    },
  ];

  return (
    <section id="section-suggested-questions" className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
            EXECUTIVE INTELLIGENCE PROMPTS
          </h3>
        </div>
        <button
          onClick={() => onSelectQuestion('List all executive BI prompt scenarios')}
          className="flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer group"
        >
          <span>View all prompts</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 3-Column Equal Height Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROMPTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => onSelectQuestion(item.question)}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 card-elevation hover:border-indigo-400 cursor-pointer min-h-[145px] h-full"
            >
              <div className="flex items-start space-x-3.5">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${item.iconBg} shadow-2xs group-hover:scale-105 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                  {item.question}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${item.badgeBg}`}>
                  {item.category}
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
