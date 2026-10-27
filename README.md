# TuringViz: Web-Based Turing Machine Simulator

## 🎯 Project Overview
TuringViz is a modern, client-side only, web-based Turing Machine simulator designed for educational purposes (Automata Theory). It allows users to define formal Turing Machine 7-tuples (specifically the transition functions), input a string on a tape, and visually step through the computation process.

**Target Output:** A single-page React application using Tailwind CSS. NO BACKEND. All state must be managed in the frontend.

## 🛠️ Tech Stack & Constraints
- **Framework:** React (Vite or Next.js frontend only).
- **Styling:** Tailwind CSS (Dark mode preferred, slate/zinc palettes).
- **Icons:** `lucide-react`.
- **Constraint:** Do not create separate files for CSS. Use Tailwind utility classes.
- **Constraint:** Keep the Turing Machine logic separated cleanly from the UI components, ideally in a custom hook (e.g., `useTuringMachine`).

## 🧠 Core Data Structures

### 1. The Machine State
The AI agent must implement a state object containing:
- `tape`: Array of strings (e.g., `['Δ', 'a', 'a', 'b', 'b', 'Δ', 'Δ']`). The blank symbol is `Δ` (Delta) or `_`.
- `headPosition`: Integer (index of the current cell being read). Must support infinite tape conceptually (dynamically unshift/push blank symbols if head moves out of current array bounds).
- `currentState`: String (e.g., 'q0').
- `runningStatus`: Enum/String (`IDLE`, `RUNNING`, `ACCEPTED`, `REJECTED`).
- `stepCount`: Integer.

### 2. Transition Rules (The Program)
An array of objects defining the machine's logic:
```javascript
{
  currentState: 'q0',
  readSymbol: 'a',
  writeSymbol: 'X',
  moveDirection: 'R', // 'R' (Right), 'L' (Left), or 'S' (Stay)
  nextState: 'q1'
}
```

## 🖥️ UI Requirements

1. **Header & Tape Visualizer:**
   - Render the `tape` array as a horizontal strip of square boxes.
   - Use absolute/relative positioning or clear visual indicators (like an arrow icon underneath) to show the `headPosition`.
   - The cell at `headPosition` should have a distinct border or background color.
   - Smooth transitions when the head moves are a plus, but instant updates are fine for MVP.

2. **Control Panel:**
   - Inputs: Text input for "Initial String" and a "Load to Tape" button.
   - Playback controls: `Reset`, `Step Forward`, `Auto Play` (using `setInterval`), and `Pause`.
   - Display current status (Running, Accepted, Rejected) prominently.

3. **Transition Table (Editor & Viewer):**
   - Display current transition rules in a readable HTML table.
   - Highlight the specific row in the table that matches the `(currentState, tape[headPosition])` combination. This is crucial for educational value.
   - Provide a way to add/delete rows to build custom machines.

## 🚀 Pre-built Templates (Crucial for MVP)
Include a "Load Template" dropdown. When selected, it populates the Transition Rules and a default Input String.

**Template 1: Accept $a^n b^n c^n$ (Example string: `aabbcc`)**
*Logic outline:*
1. (q0) Read 'a', replace with 'X', move R, go to q1.
2. (q1) Skip 'a's and 'Y's moving R.
3. (q1) Read 'b', replace with 'Y', move R, go to q2.
4. (q2) Skip 'b's and 'Z's moving R.
5. (q2) Read 'c', replace with 'Z', move L, go to q3.
6. (q3) Move L continuously skipping 'Z', 'b', 'Y', 'a' until hitting 'X'.
7. (q3) Read 'X', move R, go to q0 (repeat cycle).
8. If in q0 and reads 'Y' (all 'a's are gone), transition to q4 (verify phase).
9. (q4) Skip 'Y's and 'Z's moving R. If it hits 'Δ', transition to q_accept.

## 🤖 Instructions for AI Coding Agent
1. **First Pass:** Create the `useTuringMachine` hook. Ensure the `step` function correctly reads the tape, finds the matching rule, updates the tape, moves the head, and updates the state. If no rule is found, set status to `REJECTED`. If `currentState` starts with `q_accept` or `q_final`, set status to `ACCEPTED`.
2. **Second Pass:** Build the UI layout with Tailwind. Ensure the tape can scroll horizontally if it gets too long.
3. **Third Pass:** Wire the UI to the hook. Implement the Auto-Play functionality using a `useEffect` and `setInterval` that calls the step function.
4. **Final Pass:** Add the $a^n b^n c^n$ template to verify everything works perfectly.