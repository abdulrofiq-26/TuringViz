import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  StepForward, 
  StepBack, 
  Gauge, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2, 
  FileCode, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { RunningStatus, MachineTemplate, TransitionRule } from '../types/turing';

interface ControlPanelProps {
  initialInput: string;
  runningStatus: RunningStatus;
  statusMessage?: string;
  stepCount: number;
  headPosition: number;
  currentState: string;
  currentSymbol: string;
  activeRule: TransitionRule | null;
  speedMs: number;
  historyLength: number;
  templates: MachineTemplate[];
  currentTemplateId: string;
  onLoadInput: (input: string) => void;
  onLoadTemplate: (templateId: string) => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onTogglePlay: () => void;
  onSpeedChange: (speedMs: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  initialInput,
  runningStatus,
  statusMessage,
  stepCount,
  headPosition,
  currentState,
  currentSymbol,
  activeRule,
  speedMs,
  historyLength,
  templates,
  currentTemplateId,
  onLoadInput,
  onLoadTemplate,
  onReset,
  onStepForward,
  onStepBackward,
  onTogglePlay,
  onSpeedChange,
}) => {
  const [inputVal, setInputVal] = useState<string>(initialInput);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoadInput(inputVal);
  };

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    onLoadTemplate(selectedId);
    const tmpl = templates.find(t => t.id === selectedId);
    if (tmpl) {
      setInputVal(tmpl.initialInput);
    }
  };

  // Status configuration for badges
  const getStatusBadge = () => {
    switch (runningStatus) {
      case 'ACCEPTED':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          label: 'ACCEPTED',
          colorClass: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 ring-2 ring-emerald-500/20',
        };
      case 'REJECTED':
        return {
          icon: <XCircle className="w-5 h-5 text-rose-400" />,
          label: 'REJECTED',
          colorClass: 'bg-rose-500/15 border-rose-500/40 text-rose-300 ring-2 ring-rose-500/20',
        };
      case 'RUNNING':
        return {
          icon: <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />,
          label: 'RUNNING',
          colorClass: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 ring-2 ring-indigo-500/20',
        };
      case 'PAUSED':
        return {
          icon: <Pause className="w-5 h-5 text-amber-400" />,
          label: 'PAUSED',
          colorClass: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
        };
      case 'IDLE':
      default:
        return {
          icon: <Clock className="w-5 h-5 text-slate-400" />,
          label: 'IDLE',
          colorClass: 'bg-slate-800 border-slate-700 text-slate-300',
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl shadow-black/30 space-y-6">
      {/* Row 1: Template Loader & Initial Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Template Selector Dropdown */}
        <div className="md:col-span-5 space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Preset Template
          </label>
          <div className="relative">
            <select
              value={currentTemplateId}
              onChange={handleTemplateSelect}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition cursor-pointer appearance-none pr-8 font-sans"
            >
              {templates.map(tmpl => (
                <option key={tmpl.id} value={tmpl.id} className="bg-slate-900 text-slate-100">
                  {tmpl.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <FileCode className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Input String & Load to Tape */}
        <div className="md:col-span-7">
          <form onSubmit={handleInputSubmit} className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center justify-between">
              <span>Initial String (Tape Input)</span>
              <span className="text-[11px] text-slate-500 lowercase">Use letters or digits (e.g. aabbcc)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="aabbcc"
                className="flex-1 bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5 active:scale-95"
              >
                <span>Load to Tape</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Row 2: Status Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${statusBadge.colorClass}`}>
        <div className="flex items-center space-x-3">
          {statusBadge.icon}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-sm tracking-wider">
                {statusBadge.label}
              </span>
              <span className="text-xs opacity-75 font-mono">
                (Step {stepCount})
              </span>
            </div>
            <p className="text-xs opacity-90 mt-0.5 font-sans">
              {statusMessage || 'Machine initialized.'}
            </p>
          </div>
        </div>

        {/* Next/Current Transition Rule info */}
        {activeRule ? (
          <div className="text-xs font-mono bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center gap-2 self-stretch sm:self-auto justify-center">
            <span className="text-slate-400">Next Action:</span>
            <span className="text-indigo-300 font-bold">δ({activeRule.currentState}, '{activeRule.readSymbol}')</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-emerald-300">('{activeRule.writeSymbol}', {activeRule.moveDirection}, {activeRule.nextState})</span>
          </div>
        ) : (
          runningStatus === 'RUNNING' && (
            <div className="text-xs font-mono text-rose-300">
              No matching rule! Halting on next step.
            </div>
          )
        )}
      </div>

      {/* Row 3: Playback Controls & Speed Slider */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
        {/* Playback Buttons */}
        <div className="flex items-center space-x-2">
          {/* Reset */}
          <button
            onClick={onReset}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition active:scale-95 flex items-center justify-center"
            title="Reset Machine"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step Back (Undo) */}
          <button
            onClick={onStepBackward}
            disabled={historyLength === 0}
            className={`p-2.5 rounded-xl border transition active:scale-95 flex items-center justify-center ${
              historyLength === 0
                ? 'bg-slate-800/40 border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border-slate-700'
            }`}
            title="Step Backward (Undo last step)"
          >
            <StepBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={onTogglePlay}
            className={`px-5 py-2.5 rounded-xl text-white font-semibold flex items-center gap-2 shadow-lg transition active:scale-95 ${
              runningStatus === 'RUNNING'
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
            }`}
          >
            {runningStatus === 'RUNNING' ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Auto Play</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={runningStatus === 'ACCEPTED' || runningStatus === 'REJECTED'}
            className={`px-4 py-2.5 rounded-xl border font-semibold flex items-center gap-1.5 transition active:scale-95 ${
              runningStatus === 'ACCEPTED' || runningStatus === 'REJECTED'
                ? 'bg-slate-800/40 border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/40 hover:border-indigo-400'
            }`}
            title="Step Forward (Execute 1 rule)"
          >
            <StepForward className="w-4 h-4" />
            <span className="hidden sm:inline">Step</span>
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center space-x-3 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
          <Gauge className="w-4 h-4 text-indigo-400" />
          <div className="flex flex-col">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>Speed:</span>
              <span className="font-bold text-indigo-300">{speedMs}ms / step</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={speedMs}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="w-32 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => onSpeedChange(600)}
              className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${speedMs === 600 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              0.5x
            </button>
            <button
              onClick={() => onSpeedChange(300)}
              className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${speedMs === 300 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              1x
            </button>
            <button
              onClick={() => onSpeedChange(100)}
              className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${speedMs === 100 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              3x
            </button>
          </div>
        </div>
      </div>

      {/* Row 4: Machine 7-Tuple State Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Current State (q)</span>
          <span className="text-lg font-bold font-mono text-indigo-400 mt-0.5">{currentState}</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Symbol Under Head (σ)</span>
          <span className="text-lg font-bold font-mono text-emerald-400 mt-0.5">{currentSymbol}</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Head Index (pos)</span>
          <span className="text-lg font-bold font-mono text-amber-400 mt-0.5">[{headPosition}]</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Total Steps (t)</span>
          <span className="text-lg font-bold font-mono text-purple-400 mt-0.5">{stepCount}</span>
        </div>
      </div>
    </div>
  );
};
