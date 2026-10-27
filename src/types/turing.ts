export type MoveDirection = 'L' | 'R' | 'S';

export type RunningStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'ACCEPTED' | 'REJECTED';

export interface TransitionRule {
  id: string;
  currentState: string;
  readSymbol: string;
  writeSymbol: string;
  moveDirection: MoveDirection;
  nextState: string;
  comment?: string;
}

export interface TuringMachineState {
  tape: string[];
  headPosition: number;
  currentState: string;
  runningStatus: RunningStatus;
  stepCount: number;
  statusMessage?: string;
}

export interface MachineTemplate {
  id: string;
  name: string;
  description: string;
  formalLanguage?: string;
  initialInput: string;
  initialState: string;
  acceptStates: string[];
  rules: TransitionRule[];
}

export interface StepHistoryItem {
  tape: string[];
  headPosition: number;
  currentState: string;
  stepCount: number;
  runningStatus: RunningStatus;
  statusMessage?: string;
  executedRule?: TransitionRule;
}
