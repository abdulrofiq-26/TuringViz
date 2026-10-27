import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  TransitionRule, 
  RunningStatus, 
  StepHistoryItem 
} from '../types/turing';
import { BLANK_SYMBOL, createTapeFromInput, normalizeSymbol } from '../constants/symbols';
import { DEFAULT_TEMPLATE, TEMPLATES } from '../constants/templates';

const DEFAULT_SPEED_MS = 300; // ms per step

export function useTuringMachine() {
  // Current loaded template
  const [currentTemplateId, setCurrentTemplateId] = useState<string>(DEFAULT_TEMPLATE.id);
  
  // Turing Machine State
  const [initialInput, setInitialInput] = useState<string>(DEFAULT_TEMPLATE.initialInput);
  const [tape, setTape] = useState<string[]>(() => {
    return createTapeFromInput(DEFAULT_TEMPLATE.initialInput).tape;
  });
  const [headPosition, setHeadPosition] = useState<number>(() => {
    return createTapeFromInput(DEFAULT_TEMPLATE.initialInput).initialHead;
  });
  const [currentState, setCurrentState] = useState<string>(DEFAULT_TEMPLATE.initialState);
  const [runningStatus, setRunningStatus] = useState<RunningStatus>('IDLE');
  const [stepCount, setStepCount] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('Ready to start');
  
  // Transition Rules & Accept states
  const [rules, setRules] = useState<TransitionRule[]>(DEFAULT_TEMPLATE.rules);
  const [acceptStates, setAcceptStates] = useState<string[]>(DEFAULT_TEMPLATE.acceptStates);

  // Playback settings
  const [speedMs, setSpeedMs] = useState<number>(DEFAULT_SPEED_MS);
  
  // Execution history for stepping backward (Undo)
  const [history, setHistory] = useState<StepHistoryItem[]>([]);

  // Ref to track running status safely inside intervals
  const isRunningRef = useRef<boolean>(false);
  isRunningRef.current = runningStatus === 'RUNNING';

  // Current symbol under the head
  const currentSymbol = useMemo(() => {
    if (headPosition < 0 || headPosition >= tape.length) {
      return BLANK_SYMBOL;
    }
    return tape[headPosition] ?? BLANK_SYMBOL;
  }, [tape, headPosition]);

  // Active rule: The rule matching (currentState, currentSymbol)
  const activeRule = useMemo(() => {
    return rules.find(
      r => r.currentState === currentState && r.readSymbol === currentSymbol
    ) ?? null;
  }, [rules, currentState, currentSymbol]);

  // Check if a state is considered accepting
  const isAcceptState = useCallback((stateName: string) => {
    const s = stateName.toLowerCase();
    return s.startsWith('q_accept') || s.startsWith('q_final') || s === 'accept' || acceptStates.includes(stateName);
  }, [acceptStates]);

  /**
   * Reset tape and head to initial input
   */
  const reset = useCallback(() => {
    const { tape: newTape, initialHead } = createTapeFromInput(initialInput);
    setTape(newTape);
    setHeadPosition(initialHead);
    
    // Find template initial state or default to 'q0'
    const template = TEMPLATES.find(t => t.id === currentTemplateId);
    setCurrentState(template?.initialState ?? 'q0');
    
    setRunningStatus('IDLE');
    setStepCount(0);
    setHistory([]);
    setStatusMessage('Reset to initial input string.');
  }, [initialInput, currentTemplateId]);

  /**
   * Load a new input string into the tape
   */
  const loadInput = useCallback((newInput: string) => {
    setInitialInput(newInput);
    const { tape: newTape, initialHead } = createTapeFromInput(newInput);
    setTape(newTape);
    setHeadPosition(initialHead);

    const template = TEMPLATES.find(t => t.id === currentTemplateId);
    setCurrentState(template?.initialState ?? 'q0');

    setRunningStatus('IDLE');
    setStepCount(0);
    setHistory([]);
    setStatusMessage(`Loaded input: "${newInput}"`);
  }, [currentTemplateId]);

  /**
   * Load a pre-defined template
   */
  const loadTemplate = useCallback((templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId) ?? DEFAULT_TEMPLATE;
    setCurrentTemplateId(template.id);
    setInitialInput(template.initialInput);
    setRules(template.rules);
    setAcceptStates(template.acceptStates);

    const { tape: newTape, initialHead } = createTapeFromInput(template.initialInput);
    setTape(newTape);
    setHeadPosition(initialHead);
    setCurrentState(template.initialState);
    setRunningStatus('IDLE');
    setStepCount(0);
    setHistory([]);
    setStatusMessage(`Loaded template: ${template.name}`);
  }, []);

  /**
   * Core Step Execution
   */
  const stepForward = useCallback((): boolean => {
    // If already terminated, do not proceed
    if (runningStatus === 'ACCEPTED' || runningStatus === 'REJECTED') {
      return false;
    }

    // Check if current state is already an accepting state
    if (isAcceptState(currentState)) {
      setRunningStatus('ACCEPTED');
      setStatusMessage(`Machine accepted in state "${currentState}".`);
      return false;
    }

    const symbolRead = tape[headPosition] ?? BLANK_SYMBOL;

    // Look for matching rule
    const rule = rules.find(
      r => r.currentState === currentState && r.readSymbol === symbolRead
    );

    if (!rule) {
      // No rule found for (state, symbol) -> Machine halts and rejects!
      setRunningStatus('REJECTED');
      setStatusMessage(`Halted (Rejected): No rule for state "${currentState}" with symbol "${symbolRead}".`);
      return false;
    }

    // Record history for Step Backward capability
    const historySnapshot: StepHistoryItem = {
      tape: [...tape],
      headPosition,
      currentState,
      stepCount,
      runningStatus,
      statusMessage,
      executedRule: rule
    };
    setHistory(prev => [...prev, historySnapshot]);

    // Apply rule: 1. Write symbol
    let nextTape = [...tape];
    nextTape[headPosition] = rule.writeSymbol;

    // Apply rule: 2. Move head
    let nextHead = headPosition;
    if (rule.moveDirection === 'R') {
      nextHead += 1;
    } else if (rule.moveDirection === 'L') {
      nextHead -= 1;
    }

    // Handle Infinite Tape Expansion
    // If head moves past left bound (< 0), unshift blank symbols
    if (nextHead < 0) {
      const expansionCount = 4;
      const blanks = Array(expansionCount).fill(BLANK_SYMBOL);
      nextTape = [...blanks, ...nextTape];
      nextHead += expansionCount; // Shift head index to match new array
    } 
    // If head is close to or beyond right bound, push blank symbols
    else if (nextHead >= nextTape.length) {
      const expansionCount = 4;
      const blanks = Array(expansionCount).fill(BLANK_SYMBOL);
      nextTape = [...nextTape, ...blanks];
    }

    // Apply rule: 3. Transition to next state
    const nextState = rule.nextState;
    const nextStepCount = stepCount + 1;

    setTape(nextTape);
    setHeadPosition(nextHead);
    setCurrentState(nextState);
    setStepCount(nextStepCount);

    // Check if the new state is accepting
    if (isAcceptState(nextState)) {
      setRunningStatus('ACCEPTED');
      setStatusMessage(`Success! Reached accept state "${nextState}" in ${nextStepCount} steps.`);
      return false;
    }

    return true;
  }, [tape, headPosition, currentState, runningStatus, rules, isAcceptState, stepCount, statusMessage]);

  /**
   * Step Backward (Undo last step)
   */
  const stepBackward = useCallback(() => {
    if (history.length === 0) return;

    // If currently running, pause first
    if (runningStatus === 'RUNNING') {
      setRunningStatus('PAUSED');
    }

    setHistory(prev => {
      const newHistory = [...prev];
      const previous = newHistory.pop();
      if (previous) {
        setTape(previous.tape);
        setHeadPosition(previous.headPosition);
        setCurrentState(previous.currentState);
        setStepCount(previous.stepCount);
        setRunningStatus('PAUSED');
        setStatusMessage(`Stepped back to step ${previous.stepCount}.`);
      }
      return newHistory;
    });
  }, [history, runningStatus]);

  /**
   * Start Auto-Play
   */
  const play = useCallback(() => {
    if (runningStatus === 'ACCEPTED' || runningStatus === 'REJECTED') {
      // If completed, reset first
      reset();
    }
    setRunningStatus('RUNNING');
    setStatusMessage('Simulation running...');
  }, [runningStatus, reset]);

  /**
   * Pause Auto-Play
   */
  const pause = useCallback(() => {
    setRunningStatus('PAUSED');
    setStatusMessage('Simulation paused.');
  }, []);

  /**
   * Toggle Play / Pause
   */
  const togglePlay = useCallback(() => {
    if (runningStatus === 'RUNNING') {
      pause();
    } else {
      play();
    }
  }, [runningStatus, pause, play]);

  /**
   * Auto-Play Timer Effect
   */
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (runningStatus === 'RUNNING') {
      intervalId = setInterval(() => {
        // Run one step
        const canContinue = stepForward();
        if (!canContinue) {
          if (intervalId) clearInterval(intervalId);
        }
      }, speedMs);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [runningStatus, speedMs, stepForward]);

  /**
   * Tape modification helpers
   */
  const writeTapeCell = useCallback((index: number, symbol: string) => {
    if (index < 0 || index >= tape.length) return;
    setTape(prev => {
      const copy = [...prev];
      copy[index] = normalizeSymbol(symbol);
      return copy;
    });
  }, [tape.length]);

  const addBlanksLeft = useCallback((count: number = 3) => {
    setTape(prev => [...Array(count).fill(BLANK_SYMBOL), ...prev]);
    setHeadPosition(prev => prev + count);
  }, []);

  const addBlanksRight = useCallback((count: number = 3) => {
    setTape(prev => [...prev, ...Array(count).fill(BLANK_SYMBOL)]);
  }, []);

  /**
   * Rule Management (Add / Update / Delete)
   */
  const addRule = useCallback((newRule: Omit<TransitionRule, 'id'>) => {
    const id = 'rule_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const formattedRule: TransitionRule = {
      ...newRule,
      id,
      readSymbol: normalizeSymbol(newRule.readSymbol),
      writeSymbol: normalizeSymbol(newRule.writeSymbol),
    };
    setRules(prev => [...prev, formattedRule]);
  }, []);

  const updateRule = useCallback((id: string, updatedFields: Partial<TransitionRule>) => {
    setRules(prev => prev.map(r => {
      if (r.id !== id) return r;
      return {
        ...r,
        ...updatedFields,
        readSymbol: updatedFields.readSymbol !== undefined ? normalizeSymbol(updatedFields.readSymbol) : r.readSymbol,
        writeSymbol: updatedFields.writeSymbol !== undefined ? normalizeSymbol(updatedFields.writeSymbol) : r.writeSymbol,
      };
    }));
  }, []);

  const deleteRule = useCallback((id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  }, []);

  return {
    // Machine State
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
    templates: TEMPLATES,
    rules,
    acceptStates,
    speedMs,
    historyLength: history.length,

    // Actions
    reset,
    loadInput,
    loadTemplate,
    stepForward,
    stepBackward,
    play,
    pause,
    togglePlay,
    setSpeedMs,
    setHeadPosition,
    writeTapeCell,
    addBlanksLeft,
    addBlanksRight,
    setRules,
    addRule,
    updateRule,
    deleteRule,
  };
}
