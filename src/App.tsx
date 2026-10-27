import { useState } from 'react';
import { useTuringMachine } from './hooks/useTuringMachine';
import { Header } from './components/Header';
import { TapeVisualizer } from './components/TapeVisualizer';
import { ControlPanel } from './components/ControlPanel';
import { TransitionTable } from './components/TransitionTable';
import { QuickGuideModal } from './components/QuickGuideModal';

export function App() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const {
    tape,
    headPosition,
    currentState,
    runningStatus,
    stepCount,
    statusMessage,
    currentSymbol,
    activeRule,
    initialInput,
    currentTemplateId,
    templates,
    rules,
    speedMs,
    historyLength,

    // Actions
    reset,
    loadInput,
    loadTemplate,
    stepForward,
    stepBackward,
    togglePlay,
    setSpeedMs,
    setHeadPosition,
    writeTapeCell,
    addBlanksLeft,
    addBlanksRight,
    addRule,
    updateRule,
    deleteRule,
  } = useTuringMachine();

  const currentTemplate = templates.find(t => t.id === currentTemplateId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sticky Header */}
      <Header
        runningStatus={runningStatus}
        currentTemplateName={currentTemplate?.name ?? 'Custom Machine'}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Tape Visualizer Section */}
        <section aria-label="Tape Visualizer">
          <TapeVisualizer
            tape={tape}
            headPosition={headPosition}
            currentState={currentState}
            onWriteCell={writeTapeCell}
            onAddBlanksLeft={addBlanksLeft}
            onAddBlanksRight={addBlanksRight}
            onSetHeadPosition={setHeadPosition}
          />
        </section>

        {/* Machine Controls and Status Section */}
        <section aria-label="Machine Controls">
          <ControlPanel
            initialInput={initialInput}
            runningStatus={runningStatus}
            statusMessage={statusMessage}
            stepCount={stepCount}
            headPosition={headPosition}
            currentState={currentState}
            currentSymbol={currentSymbol}
            activeRule={activeRule}
            speedMs={speedMs}
            historyLength={historyLength}
            templates={templates}
            currentTemplateId={currentTemplateId}
            onLoadInput={loadInput}
            onLoadTemplate={loadTemplate}
            onReset={reset}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
            onTogglePlay={togglePlay}
            onSpeedChange={setSpeedMs}
          />
        </section>

        {/* Transition Function δ Table Section */}
        <section aria-label="Transition Function Table">
          <TransitionTable
            rules={rules}
            currentState={currentState}
            currentSymbol={currentSymbol}
            onAddRule={addRule}
            onDeleteRule={deleteRule}
            onUpdateRule={updateRule}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-600 font-mono">
        <p>TuringViz • Interactive Turing Machine Simulator & Educational Automata Theory Visualizer</p>
      </footer>

      {/* Quick Theory & Controls Guide Modal */}
      <QuickGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}

export default App;
