import React from 'react';
import { X, BookOpen, Layers, CheckCircle2, Play, Sparkles } from 'lucide-react';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-200 space-y-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Automata Theory & Turing Machine Guide
              </h2>
              <p className="text-xs text-slate-400">
                Understanding formal language recognition and simulator controls
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: The 7-Tuple Definition */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-2">
            <Layers className="w-4 h-4" />
            1. Formal Turing Machine Definition
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            In theoretical computer science, a standard 1-tape deterministic Turing Machine is formally defined as a 7-tuple:
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300">
            M = ⟨ Q, Σ, Γ, δ, q₀, B, F ⟩
          </div>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li><strong className="text-slate-200">Q</strong>: Finite set of states (e.g. <code>q0, q1, q2...</code>)</li>
            <li><strong className="text-slate-200">Σ</strong>: Input alphabet not containing the blank symbol (e.g. <code>&#123;a, b, c&#125;</code>)</li>
            <li><strong className="text-slate-200">Γ</strong>: Tape alphabet, where <code>Σ ⊆ Γ</code> and <code>B ∈ Γ</code> (e.g. <code>&#123;a, b, c, X, Y, Z, Δ&#125;</code>)</li>
            <li><strong className="text-slate-200">δ</strong>: Transition function: <code>δ: Q × Γ → Q × Γ × &#123;L, R, S&#125;</code></li>
            <li><strong className="text-slate-200">q₀</strong>: Initial starting state (<code>q0</code>)</li>
            <li><strong className="text-slate-200">B (or Δ)</strong>: Blank symbol filling the infinitely empty tape cells</li>
            <li><strong className="text-slate-200">F</strong>: Set of final or accepting states (names starting with <code>q_accept</code>)</li>
          </ul>
        </div>

        {/* Section 2: Language a^n b^n c^n */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            2. The Classic Language L = &#123; aⁿbⁿcⁿ | n ≥ 1 &#125;
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            This language cannot be recognized by Finite Automata (Regular) or Pushdown Automata (Context-Free) because a single stack cannot simultaneously count three separate unbounded quantities. It requires a <strong className="text-white">Turing Machine</strong> (Turing-recognizable / Decidable):
          </p>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
            <div className="text-slate-300">
              <span className="text-indigo-400 font-bold">1. Cycle Start (q0):</span> Read 'a', replace with 'X', move R → enter <code>q1</code>.
            </div>
            <div className="text-slate-300">
              <span className="text-indigo-400 font-bold">2. Find Matching 'b' (q1):</span> Skip all 'a's and 'Y's, match first 'b' with 'Y', move R → enter <code>q2</code>.
            </div>
            <div className="text-slate-300">
              <span className="text-indigo-400 font-bold">3. Find Matching 'c' (q2):</span> Skip all 'b's and 'Z's, match first 'c' with 'Z', reverse head L → enter <code>q3</code>.
            </div>
            <div className="text-slate-300">
              <span className="text-indigo-400 font-bold">4. Rewind (q3):</span> Move left past 'Z', 'b', 'Y', 'a' until reaching 'X', then step right → return to <code>q0</code>.
            </div>
            <div className="text-slate-300">
              <span className="text-indigo-400 font-bold">5. Verification (q4):</span> When no more 'a's remain in <code>q0</code>, verify only 'Y' and 'Z' exist until reaching blank <code>Δ</code> → transition to <code>q_accept</code>.
            </div>
          </div>
        </div>

        {/* Section 3: Interactive Controls */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-2">
            <Play className="w-4 h-4" />
            3. Interactive Controls in TuringViz
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="font-bold text-indigo-400">Step Forward:</span> Executes exactly one transition rule δ(q, σ) and updates the tape and head.
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="font-bold text-indigo-400">Step Backward:</span> Rewinds the machine execution by one step (Undo history).
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="font-bold text-indigo-400">Auto Play:</span> Runs steps automatically with configurable interval speed (50ms - 1000ms).
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="font-bold text-indigo-400">Direct Tape Editing:</span> Click any cell on the tape to move head or hover to edit the symbol directly.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Got it, let's explore!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
