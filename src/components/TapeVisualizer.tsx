import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Plus, Target, Edit2, Check, X } from 'lucide-react';
import { BLANK_SYMBOL } from '../constants/symbols';

interface TapeVisualizerProps {
  tape: string[];
  headPosition: number;
  currentState: string;
  onWriteCell: (index: number, symbol: string) => void;
  onAddBlanksLeft: () => void;
  onAddBlanksRight: () => void;
  onSetHeadPosition: (index: number) => void;
}

export const TapeVisualizer: React.FC<TapeVisualizerProps> = ({
  tape,
  headPosition,
  currentState,
  onWriteCell,
  onAddBlanksLeft,
  onAddBlanksRight,
  onSetHeadPosition,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCellRef = useRef<HTMLDivElement>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Auto-scroll the container to keep headPosition centered smoothly
  useEffect(() => {
    if (activeCellRef.current && containerRef.current) {
      const container = containerRef.current;
      const cell = activeCellRef.current;
      
      const cellLeft = cell.offsetLeft;
      const cellWidth = cell.offsetWidth;
      const containerWidth = container.offsetWidth;

      const targetScrollLeft = cellLeft - (containerWidth / 2) + (cellWidth / 2);

      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
      });
    }
  }, [headPosition]);

  const handleCenterHead = () => {
    if (activeCellRef.current && containerRef.current) {
      const container = containerRef.current;
      const cell = activeCellRef.current;
      container.scrollTo({
        left: cell.offsetLeft - (container.offsetWidth / 2) + (cell.offsetWidth / 2),
        behavior: 'smooth',
      });
    }
  };

  const startEditing = (index: number, currentSymbol: string) => {
    setEditingIndex(index);
    setEditValue(currentSymbol === BLANK_SYMBOL ? '' : currentSymbol);
  };

  const saveEdit = (index: number) => {
    onWriteCell(index, editValue);
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl shadow-black/30 relative overflow-hidden backdrop-blur-sm">
      {/* Background Decorative Tech Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

      {/* Top Header of the Visualizer */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase font-mono">
            Turing Machine Tape (Infinite Storage)
          </h2>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            • Length: {tape.length} cells
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCenterHead}
            className="flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Center tape on current read head"
          >
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span>Center Head</span>
          </button>
          
          <button
            onClick={onAddBlanksLeft}
            className="flex items-center space-x-1 text-xs px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Expand tape left (+3 blanks)"
          >
            <Plus className="w-3 h-3 text-slate-400" />
            <span>+Left</span>
          </button>

          <button
            onClick={onAddBlanksRight}
            className="flex items-center space-x-1 text-xs px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Expand tape right (+3 blanks)"
          >
            <Plus className="w-3 h-3 text-slate-400" />
            <span>+Right</span>
          </button>
        </div>
      </div>

      {/* Tape Strip Container (Overflow Scroll) */}
      <div
        ref={containerRef}
        className="overflow-x-auto py-6 px-4 scroll-smooth scrollbar-thin select-none relative z-10"
        style={{ scrollbarGutter: 'stable' }}
      >
        <div className="flex items-center justify-start min-w-max space-x-2 pb-2">
          {tape.map((symbol, index) => {
            const isHead = index === headPosition;
            const isBlank = symbol === BLANK_SYMBOL;

            return (
              <div
                key={`tape-cell-${index}`}
                ref={isHead ? activeCellRef : null}
                className="flex flex-col items-center group relative cursor-pointer"
                onClick={() => {
                  if (editingIndex === null) {
                    onSetHeadPosition(index);
                  }
                }}
              >
                {/* Index label above cell */}
                <span className={`text-[10px] font-mono mb-1 transition-colors ${
                  isHead ? 'text-indigo-400 font-bold' : 'text-slate-500'
                }`}>
                  [{index}]
                </span>

                {/* The Square Tape Cell */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center font-mono text-xl font-bold transition-all duration-200 relative ${
                    isHead
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-4 ring-indigo-400/50 scale-105 z-20'
                      : isBlank
                      ? 'bg-slate-800/60 text-slate-500 border border-slate-700/60 hover:border-slate-500 hover:bg-slate-800'
                      : 'bg-slate-800 text-slate-100 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-750'
                  }`}
                >
                  {/* Inline Cell Editing Modal/Popover */}
                  {editingIndex === index ? (
                    <div 
                      className="absolute inset-0 bg-slate-900 rounded-xl flex items-center justify-center p-1 z-30 border border-indigo-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        maxLength={1}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(index);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                        className="w-7 h-8 bg-slate-800 text-center font-mono text-white text-base rounded outline-none border border-slate-600 focus:border-indigo-400"
                        placeholder="Δ"
                      />
                      <button 
                        onClick={() => saveEdit(index)} 
                        className="p-0.5 ml-1 text-emerald-400 hover:text-emerald-300"
                        title="Save symbol"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={cancelEdit} 
                        className="p-0.5 text-slate-400 hover:text-rose-400"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span>{symbol}</span>
                  )}

                  {/* Hover edit icon */}
                  {editingIndex !== index && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(index, symbol);
                      }}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-slate-400 hover:text-white"
                      title="Edit this cell symbol"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>

                {/* Head Pointer Indicator Underneath */}
                <div className="h-10 mt-1 flex flex-col items-center justify-start">
                  {isHead ? (
                    <div className="flex flex-col items-center animate-bounce-subtle z-20">
                      <ArrowUp className="w-5 h-5 text-indigo-400 stroke-[3]" />
                      <div className="px-2 py-0.5 mt-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/50 text-[11px] font-mono font-bold text-indigo-300 whitespace-nowrap shadow-sm">
                        q: {currentState}
                      </div>
                    </div>
                  ) : (
                    <div className="h-5 w-px bg-transparent" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-2.5 mt-1 font-mono">
        <span>Click any cell to move read head directly • Hover cell to edit character</span>
        <span>Blank symbol: <strong className="text-slate-300 font-bold">{BLANK_SYMBOL}</strong> (Delta)</span>
      </div>
    </div>
  );
};
