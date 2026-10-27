import React, { useState, useMemo } from 'react';
import { 
  TransitionRule, 
  MoveDirection 
} from '../types/turing';
import { BLANK_SYMBOL } from '../constants/symbols';
import { 
  Plus, 
  Trash2, 
  Search, 
  ArrowRight, 
  Zap, 
  Filter, 
  Info,
  Check
} from 'lucide-react';

interface TransitionTableProps {
  rules: TransitionRule[];
  currentState: string;
  currentSymbol: string;
  onAddRule: (rule: Omit<TransitionRule, 'id'>) => void;
  onDeleteRule: (id: string) => void;
  onUpdateRule?: (id: string, updatedFields: Partial<TransitionRule>) => void;
}

export const TransitionTable: React.FC<TransitionTableProps> = ({
  rules,
  currentState,
  currentSymbol,
  onAddRule,
  onDeleteRule,
}) => {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterState, setFilterState] = useState<string>('ALL');

  // New Rule Form State
  const [newCurrentState, setNewCurrentState] = useState<string>('q0');
  const [newReadSymbol, setNewReadSymbol] = useState<string>('a');
  const [newWriteSymbol, setNewWriteSymbol] = useState<string>('X');
  const [newMoveDirection, setNewMoveDirection] = useState<MoveDirection>('R');
  const [newNextState, setNewNextState] = useState<string>('q1');
  const [newComment, setNewComment] = useState<string>('');

  // Extract all unique states for quick filtering
  const allStates = useMemo(() => {
    const states = new Set<string>();
    rules.forEach(r => {
      states.add(r.currentState);
      states.add(r.nextState);
    });
    return Array.from(states).sort();
  }, [rules]);

  // Filtered rules
  const filteredRules = useMemo(() => {
    return rules.filter(r => {
      const matchesSearch = 
        r.currentState.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.nextState.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.readSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.writeSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.comment && r.comment.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStateFilter = 
        filterState === 'ALL' || 
        r.currentState === filterState || 
        r.nextState === filterState;

      return matchesSearch && matchesStateFilter;
    });
  }, [rules, searchTerm, filterState]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCurrentState.trim() || !newNextState.trim()) return;

    onAddRule({
      currentState: newCurrentState.trim(),
      readSymbol: newReadSymbol.trim() || BLANK_SYMBOL,
      writeSymbol: newWriteSymbol.trim() || BLANK_SYMBOL,
      moveDirection: newMoveDirection,
      nextState: newNextState.trim(),
      comment: newComment.trim() || undefined,
    });

    // Reset some fields for easy multi-entry
    setNewComment('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl shadow-black/30 space-y-5">
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase font-mono">
              Transition Function Table (δ: Q × Γ → Γ × &#123;L,R,S&#125; × Q)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Total rules: <span className="text-indigo-300 font-mono font-bold">{rules.length}</span> • Highlighted row indicates active transition
          </p>
        </div>

        {/* Search & Filter tools */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {/* Search box */}
          <div className="relative flex-1 sm:w-44">
            <input
              type="text"
              placeholder="Filter rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-7 pr-3 py-1.5 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
          </div>

          {/* State filter dropdown */}
          <div className="relative">
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-mono appearance-none pr-6 cursor-pointer"
            >
              <option value="ALL">All States</option>
              {allStates.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
            <Filter className="w-3 h-3 text-slate-500 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 max-h-96 scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-mono uppercase text-[11px] sticky top-0 z-10">
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">State (q)</th>
              <th className="py-2.5 px-3">Read (σ)</th>
              <th className="py-2.5 px-3 text-center">→</th>
              <th className="py-2.5 px-3">Write (σ')</th>
              <th className="py-2.5 px-3">Move (D)</th>
              <th className="py-2.5 px-3">Next (q')</th>
              <th className="py-2.5 px-3">Description / Logic</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredRules.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500 font-sans">
                  No matching transition rules found.
                </td>
              </tr>
            ) : (
              filteredRules.map((rule) => {
                const isActive = 
                  rule.currentState === currentState && 
                  rule.readSymbol === currentSymbol;

                return (
                  <tr
                    key={rule.id}
                    className={`transition-colors duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-950/90 via-indigo-900/50 to-slate-900 border-l-4 border-l-indigo-400 font-semibold text-white shadow-inner'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    {/* Active Indicator Badge */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500 text-white animate-pulse">
                          <Zap className="w-2.5 h-2.5 fill-white" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="text-slate-600 pl-2">•</span>
                      )}
                    </td>

                    {/* Current State */}
                    <td className="py-2 px-3 font-bold text-indigo-400">
                      {rule.currentState}
                    </td>

                    {/* Read Symbol */}
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-bold">
                        {rule.readSymbol}
                      </span>
                    </td>

                    {/* Arrow */}
                    <td className="py-2 px-3 text-center text-slate-500">
                      <ArrowRight className="w-3.5 h-3.5 mx-auto" />
                    </td>

                    {/* Write Symbol */}
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 font-bold">
                        {rule.writeSymbol}
                      </span>
                    </td>

                    {/* Move Direction */}
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        rule.moveDirection === 'R'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : rule.moveDirection === 'L'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      }`}>
                        {rule.moveDirection === 'R' ? 'R (Right)' : rule.moveDirection === 'L' ? 'L (Left)' : 'S (Stay)'}
                      </span>
                    </td>

                    {/* Next State */}
                    <td className="py-2 px-3 font-bold text-indigo-300">
                      {rule.nextState}
                    </td>

                    {/* Comment */}
                    <td className="py-2 px-3 text-slate-400 font-sans text-xs max-w-xs truncate">
                      {rule.comment || '-'}
                    </td>

                    {/* Delete Action */}
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => onDeleteRule(rule.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Rule Form */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 font-mono">
          <Plus className="w-3.5 h-3.5 text-indigo-400" />
          <span>Add Custom Transition Rule</span>
        </div>

        <form onSubmit={handleAddSubmit} className="grid grid-cols-2 sm:grid-cols-7 gap-2.5 text-xs">
          {/* Current State */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-mono">State (q)</label>
            <input
              type="text"
              value={newCurrentState}
              onChange={(e) => setNewCurrentState(e.target.value)}
              placeholder="q0"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Read Symbol */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>Read (σ)</span>
              <button
                type="button"
                onClick={() => setNewReadSymbol(BLANK_SYMBOL)}
                className="text-indigo-400 hover:underline"
                title="Insert Delta"
              >
                Δ
              </button>
            </div>
            <input
              type="text"
              value={newReadSymbol}
              onChange={(e) => setNewReadSymbol(e.target.value)}
              placeholder="a or Δ"
              maxLength={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-white text-center focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Write Symbol */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>Write (σ')</span>
              <button
                type="button"
                onClick={() => setNewWriteSymbol(BLANK_SYMBOL)}
                className="text-indigo-400 hover:underline"
                title="Insert Delta"
              >
                Δ
              </button>
            </div>
            <input
              type="text"
              value={newWriteSymbol}
              onChange={(e) => setNewWriteSymbol(e.target.value)}
              placeholder="X or Δ"
              maxLength={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-white text-center focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Move Direction */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-mono">Move (D)</label>
            <select
              value={newMoveDirection}
              onChange={(e) => setNewMoveDirection(e.target.value as MoveDirection)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 font-mono text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="R">R (Right)</option>
              <option value="L">L (Left)</option>
              <option value="S">S (Stay)</option>
            </select>
          </div>

          {/* Next State */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-mono">Next (q')</label>
            <input
              type="text"
              value={newNextState}
              onChange={(e) => setNewNextState(e.target.value)}
              placeholder="q1"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Comment */}
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <label className="text-[10px] text-slate-400 font-mono">Comment (opt)</label>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Purpose of rule..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-end col-span-2 sm:col-span-1">
            <button
              type="submit"
              className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>
      </div>

      <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
        <Info className="w-3.5 h-3.5" />
        <span>Convention: States starting with <code>q_accept</code> or <code>q_final</code> are automatically designated as accepting halt states.</span>
      </div>
    </div>
  );
};
