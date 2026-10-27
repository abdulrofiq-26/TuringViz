import React from 'react';
import { Cpu, BookOpen, Sparkles, HelpCircle } from 'lucide-react';
import { RunningStatus } from '../types/turing';

interface HeaderProps {
  runningStatus: RunningStatus;
  currentTemplateName: string;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  runningStatus,
  currentTemplateName,
  onOpenGuide,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            {runningStatus === 'RUNNING' && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                Turing<span className="text-indigo-400">Viz</span>
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Interactive Automata Theory & Turing Machine Visualizer
            </p>
          </div>
        </div>

        {/* Current Template & Guide Info */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden md:flex items-center space-x-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Active:</span>
            <span className="text-indigo-300 font-semibold">{currentTemplateName}</span>
          </div>

          <button
            onClick={onOpenGuide}
            className="flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 hover:border-indigo-500/50 transition-all duration-200"
            title="Open Automata Theory & Machine Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Automata Guide</span>
            <HelpCircle className="w-3 h-3 text-slate-400 sm:hidden" />
          </button>
        </div>
      </div>
    </header>
  );
};
