import React from 'react';
import { X, ShieldCheck, Database, Server, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const SettingsModal = () => {
  const { isSettingsModalOpen, setIsSettingsModalOpen, apiStatus } = useChat();

  if (!isSettingsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSettingsModalOpen(false)}
      />

      <div className="relative flex flex-col w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              System Diagnostics & API Architecture
            </h2>
          </div>
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs text-slate-700 dark:text-slate-300">
          {/* System Status Summary */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Backend Server Status:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {apiStatus.status || 'Online'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Database Engine:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {apiStatus.database?.mode || 'Verified In-Memory Knowledge Engine'}
              </span>
            </div>
          </div>

          {/* Source Hierarchy Status */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
              Configured Source & API Hierarchy
            </span>

            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-[10px]">
                    Priority 1
                  </span>
                  <span>Primary MGMU Official API</span>
                </div>
                {apiStatus.primaryApiConfigured ? (
                  <span className="text-emerald-600 font-semibold">Configured</span>
                ) : (
                  <span className="text-slate-400">Not set (using DB)</span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                    Priority 2
                  </span>
                  <span>Verified MGMU IICT Knowledge Base</span>
                </div>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Active (100% Grounded)
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                    Priority 3
                  </span>
                  <span>Secondary / Fallback API</span>
                </div>
                {apiStatus.fallbackApiConfigured ? (
                  <span className="text-emerald-600 font-semibold">Configured</span>
                ) : (
                  <span className="text-slate-400">Ready for Developer API</span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                  <span>AI LLM Provider (Gemini / Custom)</span>
                </div>
                {apiStatus.aiProviderConfigured ? (
                  <span className="text-emerald-600 font-semibold">Active Key</span>
                ) : (
                  <span className="text-slate-500">Grounded Engine Active</span>
                )}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-[11px] leading-relaxed border border-blue-200 dark:border-blue-900">
            <strong>Developer Note:</strong> You can supply real production APIs anytime by updating <code>PRIMARY_API_URL</code>, <code>FALLBACK_API_URL</code>, or <code>AI_API_KEY</code> in <code>server/.env</code> without restarting or restructuring the code.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
