import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  HelpCircle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Minus,
} from 'lucide-react';
import { ChatMessage } from '../../src/types/index.js';
import { LoadingSkeleton } from './LoadingSkeleton.js';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  onClearHistory: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isTyping,
  onSendMessage,
  onClearHistory,
}) => {
  const [input, setInput] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const QUICK_PROMPTS = [
    'How is our pipeline looking?',
    'Show me delayed work orders',
    'What deals closed this month?',
  ];

  return (
    <div id="container-chat-widget" className="rounded-2xl border border-slate-200/90 bg-white card-elevation overflow-hidden flex flex-col h-full max-h-[780px] lg:h-[calc(100vh-7rem)] lg:max-h-none sticky top-24">
      
      {/* Widget Header */}
      <div className="bg-indigo-600 px-5 py-4 text-white flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-xs border border-white/20">
            <Sparkles className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse border-2 border-indigo-600" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-white tracking-tight">SkyInsight AI Assistant</h3>
            <p className="text-[10px] text-indigo-100 font-semibold">Revenue & Operations Copilot</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {messages.length > 0 && (
            <button
              onClick={onClearHistory}
              className="rounded-lg p-1.5 text-indigo-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Clear History"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
          <button
            className="rounded-lg p-1.5 text-indigo-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            title="Minimize"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/60 text-xs min-h-[320px]">
        {/* Default Welcome Message & Quick Chips */}
        {messages.length === 0 && (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-xs bg-white border border-slate-200/90 p-4 text-xs text-slate-800 leading-relaxed font-semibold shadow-2xs">
                Hi! I'm here to help you with real-time insights from your Skylark Drones data.
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Try asking me:</span>
              <div className="space-y-2">
                {QUICK_PROMPTS.map((promptText, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => onSendMessage(promptText)}
                    className="w-full text-left flex items-center justify-between rounded-xl border border-indigo-100 bg-white px-4 py-3 text-xs font-bold text-indigo-700 hover:bg-indigo-50/80 hover:border-indigo-200 transition-all shadow-2xs cursor-pointer group"
                  >
                    <span>{promptText}</span>
                    <ChevronRight className="h-4 w-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Chat Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
          >
            {msg.sender === 'user' ? (
              <div className="flex items-start space-x-2.5 max-w-[85%]">
                <div className="rounded-2xl rounded-tr-xs bg-slate-900 px-4 py-3 text-xs text-white shadow-xs leading-relaxed font-semibold">
                  {msg.text}
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                  <User className="h-4 w-4" />
                </div>
              </div>
            ) : (
              <div className="flex items-start space-x-3 max-w-[98%] w-full">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold shadow-xs mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>

                <div className="flex-1 space-y-3.5 rounded-2xl rounded-tl-xs border border-slate-200/90 bg-white p-4 text-slate-800 shadow-2xs">
                  <div className="prose prose-slate max-w-none text-xs leading-relaxed">
                    <p className="font-bold text-slate-900">{msg.text}</p>
                  </div>

                  {msg.isClarification && msg.biResponse?.clarificationQuestions && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 space-y-2.5">
                      <div className="flex items-center space-x-1.5 text-[10px] font-extrabold text-amber-900 uppercase tracking-wider">
                        <HelpCircle className="h-4 w-4 text-amber-600" />
                        <span>Clarification Required</span>
                      </div>
                      <div className="space-y-2">
                        {msg.biResponse.clarificationQuestions.map((q, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => onSendMessage(q)}
                            className="w-full text-left flex items-center justify-between rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-amber-950 hover:bg-amber-100 transition-colors"
                          >
                            <span>{q}</span>
                            <ChevronRight className="h-4 w-4 text-amber-600" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.biResponse && !msg.isClarification && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      {msg.biResponse.executiveSummary && (
                        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3">
                          <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                            Executive Summary
                          </h4>
                          <p className="text-xs text-slate-800 leading-relaxed font-medium">
                            {msg.biResponse.executiveSummary}
                          </p>
                        </div>
                      )}

                      {msg.biResponse.metrics && msg.biResponse.metrics.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {msg.biResponse.metrics.map((m, mIdx) => (
                            <div key={mIdx} className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs">
                              <span className="block text-[10px] font-bold text-slate-600">{m.label}</span>
                              <span className="block text-xs font-extrabold text-slate-950 mt-0.5 font-mono">{m.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.biResponse.keyInsights && msg.biResponse.keyInsights.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center space-x-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                            <span>Key Business Insights</span>
                          </h4>
                          <ul className="space-y-1.5 text-[11px] text-slate-800">
                            {msg.biResponse.keyInsights.map((ins, iIdx) => (
                              <li key={iIdx} className="flex items-start space-x-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                                <span className="font-semibold">{ins}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {msg.biResponse.suggestedFollowups && msg.biResponse.suggestedFollowups.length > 0 && (
                        <div className="pt-1">
                          <span className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider mb-1.5">
                            Follow-ups
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.biResponse.suggestedFollowups.map((f, fIdx) => (
                              <button
                                key={fIdx}
                                onClick={() => onSendMessage(f)}
                                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left"
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && <LoadingSkeleton />}
      </div>

      {/* Footer Form Input */}
      <div className="border-t border-slate-200/90 bg-white p-4 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            id="input-chat-query"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI anything..."
            className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 font-semibold focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
            disabled={isTyping}
          />
          <button
            id="btn-submit-chat"
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <span className="block text-[10px] text-center text-slate-500 mt-2 font-semibold">
          AI generated. Real-time data from Monday.com GraphQL.
        </span>
      </div>
    </div>
  );
};
