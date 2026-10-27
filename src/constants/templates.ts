import { MachineTemplate } from '../types/turing';
import { BLANK_SYMBOL } from './symbols';

export const TEMPLATES: MachineTemplate[] = [
  {
    id: 'an_bn_cn',
    name: 'Accept Language aⁿbⁿcⁿ',
    formalLanguage: 'L = { aⁿbⁿcⁿ | n ≥ 1 }',
    description: 'Validates strings with equal numbers of a, b, and c symbols in sequence. Replaces each trio with X, Y, Z.',
    initialInput: 'aabbcc',
    initialState: 'q0',
    acceptStates: ['q_accept', 'q_final'],
    rules: [
      // Step 1: Mark 'a' with 'X' and proceed right to find matching 'b'
      { id: 'r1', currentState: 'q0', readSymbol: 'a', writeSymbol: 'X', moveDirection: 'R', nextState: 'q1', comment: 'Mark first a as X, search b' },
      
      // Step 2: Skip any remaining 'a's and already-marked 'Y's
      { id: 'r2', currentState: 'q1', readSymbol: 'a', writeSymbol: 'a', moveDirection: 'R', nextState: 'q1', comment: 'Skip a' },
      { id: 'r3', currentState: 'q1', readSymbol: 'Y', writeSymbol: 'Y', moveDirection: 'R', nextState: 'q1', comment: 'Skip Y' },
      
      // Step 3: Find first 'b', mark with 'Y', and proceed right to find matching 'c'
      { id: 'r4', currentState: 'q1', readSymbol: 'b', writeSymbol: 'Y', moveDirection: 'R', nextState: 'q2', comment: 'Mark first b as Y, search c' },
      
      // Step 4: Skip any remaining 'b's and already-marked 'Z's
      { id: 'r5', currentState: 'q2', readSymbol: 'b', writeSymbol: 'b', moveDirection: 'R', nextState: 'q2', comment: 'Skip b' },
      { id: 'r6', currentState: 'q2', readSymbol: 'Z', writeSymbol: 'Z', moveDirection: 'R', nextState: 'q2', comment: 'Skip Z' },
      
      // Step 5: Find first 'c', mark with 'Z', and rewind left towards 'X'
      { id: 'r7', currentState: 'q2', readSymbol: 'c', writeSymbol: 'Z', moveDirection: 'L', nextState: 'q3', comment: 'Mark first c as Z, rewind left' },
      
      // Step 6: Rewind left through Z, b, Y, a until hitting 'X'
      { id: 'r8', currentState: 'q3', readSymbol: 'Z', writeSymbol: 'Z', moveDirection: 'L', nextState: 'q3', comment: 'Rewind past Z' },
      { id: 'r9', currentState: 'q3', readSymbol: 'b', writeSymbol: 'b', moveDirection: 'L', nextState: 'q3', comment: 'Rewind past b' },
      { id: 'r10', currentState: 'q3', readSymbol: 'Y', writeSymbol: 'Y', moveDirection: 'L', nextState: 'q3', comment: 'Rewind past Y' },
      { id: 'r11', currentState: 'q3', readSymbol: 'a', writeSymbol: 'a', moveDirection: 'L', nextState: 'q3', comment: 'Rewind past a' },
      
      // Step 7: Hit 'X', step one cell right back into q0 for the next round
      { id: 'r12', currentState: 'q3', readSymbol: 'X', writeSymbol: 'X', moveDirection: 'R', nextState: 'q0', comment: 'Found X, restart cycle at next symbol' },
      
      // Step 8: If in q0 we read 'Y', all 'a's have been consumed! Enter verify state q4
      { id: 'r13', currentState: 'q0', readSymbol: 'Y', writeSymbol: 'Y', moveDirection: 'R', nextState: 'q4', comment: 'No more a\'s, verify only Y and Z remain' },
      
      // Step 9: In q4, ensure everything remaining is only Y or Z until blank Δ
      { id: 'r14', currentState: 'q4', readSymbol: 'Y', writeSymbol: 'Y', moveDirection: 'R', nextState: 'q4', comment: 'Verify Y' },
      { id: 'r15', currentState: 'q4', readSymbol: 'Z', writeSymbol: 'Z', moveDirection: 'R', nextState: 'q4', comment: 'Verify Z' },
      
      // Step 10: Hit blank Δ without encountering extra characters -> ACCEPT!
      { id: 'r16', currentState: 'q4', readSymbol: BLANK_SYMBOL, writeSymbol: BLANK_SYMBOL, moveDirection: 'S', nextState: 'q_accept', comment: 'All verified, accept input!' }
    ]
  },
  {
    id: 'binary_increment',
    name: 'Binary Increment (+1)',
    formalLanguage: 'f(w) = w + 1 in binary',
    description: 'Increments an arbitrary unsigned binary number by 1. Traverses to LSB, flips 1s to 0s carrying left, and writes 1.',
    initialInput: '1011',
    initialState: 'q0',
    acceptStates: ['q_accept', 'q_final'],
    rules: [
      // Move right across 0 and 1 until blank Δ
      { id: 'bi1', currentState: 'q0', readSymbol: '0', writeSymbol: '0', moveDirection: 'R', nextState: 'q0', comment: 'Seek end of number' },
      { id: 'bi2', currentState: 'q0', readSymbol: '1', writeSymbol: '1', moveDirection: 'R', nextState: 'q0', comment: 'Seek end of number' },
      { id: 'bi3', currentState: 'q0', readSymbol: BLANK_SYMBOL, writeSymbol: BLANK_SYMBOL, moveDirection: 'L', nextState: 'q1', comment: 'Hit blank, step left to LSB' },
      
      // Carry addition backwards
      { id: 'bi4', currentState: 'q1', readSymbol: '1', writeSymbol: '0', moveDirection: 'L', nextState: 'q1', comment: '1 + 1 = 0 with carry left' },
      { id: 'bi5', currentState: 'q1', readSymbol: '0', writeSymbol: '1', moveDirection: 'S', nextState: 'q_accept', comment: '0 + 1 = 1, finished' },
      { id: 'bi6', currentState: 'q1', readSymbol: BLANK_SYMBOL, writeSymbol: '1', moveDirection: 'S', nextState: 'q_accept', comment: 'Overflow carry: write 1 at front' }
    ]
  },
  {
    id: 'binary_palindrome',
    name: 'Palindrome Checker (0, 1)',
    formalLanguage: 'L = { w ∈ {0,1}* | w = wᴿ }',
    description: 'Checks whether a binary string is a palindrome. Matches the first symbol with the last symbol recursively.',
    initialInput: '10101',
    initialState: 'q0',
    acceptStates: ['q_accept', 'q_final'],
    rules: [
      // q0: Read and remember first symbol, or accept if empty/single
      { id: 'pal1', currentState: 'q0', readSymbol: BLANK_SYMBOL, writeSymbol: BLANK_SYMBOL, moveDirection: 'S', nextState: 'q_accept', comment: 'Empty tape is palindrome' },
      { id: 'pal2', currentState: 'q0', readSymbol: '0', writeSymbol: BLANK_SYMBOL, moveDirection: 'R', nextState: 'q_find0', comment: 'Read 0, search matching 0 at right' },
      { id: 'pal3', currentState: 'q0', readSymbol: '1', writeSymbol: BLANK_SYMBOL, moveDirection: 'R', nextState: 'q_find1', comment: 'Read 1, search matching 1 at right' },

      // Searching right for matching 0
      { id: 'pal4', currentState: 'q_find0', readSymbol: '0', writeSymbol: '0', moveDirection: 'R', nextState: 'q_find0', comment: 'Skip 0' },
      { id: 'pal5', currentState: 'q_find0', readSymbol: '1', writeSymbol: '1', moveDirection: 'R', nextState: 'q_find0', comment: 'Skip 1' },
      { id: 'pal6', currentState: 'q_find0', readSymbol: BLANK_SYMBOL, writeSymbol: BLANK_SYMBOL, moveDirection: 'L', nextState: 'q_match0', comment: 'End reached, step back to check symbol' },
      
      { id: 'pal7', currentState: 'q_match0', readSymbol: '0', writeSymbol: BLANK_SYMBOL, moveDirection: 'L', nextState: 'q_rewind', comment: 'Matched 0! Erase and rewind' },
      { id: 'pal8', currentState: 'q_match0', readSymbol: BLANK_SYMBOL, writeSymbol: BLANK_SYMBOL, moveDirection: 'S', nextState: 'q_accept', comment: 'Only one symbol was left, accept' },

      // Searching right for matching 1
      { id: 'pal9', currentState: 'q_find1', readSymbol: '0', writeSymbol: '0', moveDirection: 'R', nextState: 'q_find1', comment: 'Skip 0' },
      { id: 'pal10', currentState: 'q_find1', readSymbol: '1', writeSymbol: '1', moveDirection: 'R', nextState: 'q_find1', comment: 'Skip 1' },
      { id: 'pal11', currentState: 'q_find1', readSymbol: BLANK_SYMBOL, writeSymbol: BLANK_SYMBOL, moveDirection: 'L', nextState: 'q_match1', comment: 'End reached, step back to check symbol' },
      
      { id: 'pal12', currentState: 'q_match1', readSymbol: '1', writeSymbol: BLANK_SYMBOL, moveDirection: 'L', nextState: 'q_rewind', comment: 'Matched 1! Erase and rewind' },
      { id: 'pal13', currentState: 'q_match1', readSymbol: BLANK_SYMBOL, writeSymbol: BLANK_SYMBOL, moveDirection: 'S', nextState: 'q_accept', comment: 'Only one symbol was left, accept' },

      // Rewind to left end
      { id: 'pal14', currentState: 'q_rewind', readSymbol: '0', writeSymbol: '0', moveDirection: 'L', nextState: 'q_rewind', comment: 'Rewind left' },
      { id: 'pal15', currentState: 'q_rewind', readSymbol: '1', writeSymbol: '1', moveDirection: 'L', nextState: 'q_rewind', comment: 'Rewind left' },
      { id: 'pal16', currentState: 'q_rewind', readSymbol: BLANK_SYMBOL, writeSymbol: BLANK_SYMBOL, moveDirection: 'R', nextState: 'q0', comment: 'Hit blank, start next comparison round' }
    ]
  },
  {
    id: 'equal_0_1',
    name: 'Accept Language 0ⁿ1ⁿ',
    formalLanguage: 'L = { 0ⁿ1ⁿ | n ≥ 1 }',
    description: 'Validates that a string has n zeros followed by n ones. Replaces each 0 with X and each matching 1 with Y.',
    initialInput: '000111',
    initialState: 'q0',
    acceptStates: ['q_accept', 'q_final'],
    rules: [
      { id: 'eq1', currentState: 'q0', readSymbol: '0', writeSymbol: 'X', moveDirection: 'R', nextState: 'q1', comment: 'Mark 0 as X, search matching 1' },
      { id: 'eq2', currentState: 'q0', readSymbol: 'Y', writeSymbol: 'Y', moveDirection: 'R', nextState: 'q3', comment: 'All 0s matched, verify remaining Ys' },
      { id: 'eq3', currentState: 'q1', readSymbol: '0', writeSymbol: '0', moveDirection: 'R', nextState: 'q1', comment: 'Skip 0s' },
      { id: 'eq4', currentState: 'q1', readSymbol: 'Y', writeSymbol: 'Y', moveDirection: 'R', nextState: 'q1', comment: 'Skip Ys' },
      { id: 'eq5', currentState: 'q1', readSymbol: '1', writeSymbol: 'Y', moveDirection: 'L', nextState: 'q2', comment: 'Found matching 1, mark as Y and rewind' },
      { id: 'eq6', currentState: 'q2', readSymbol: 'Y', writeSymbol: 'Y', moveDirection: 'L', nextState: 'q2', comment: 'Rewind past Y' },
      { id: 'eq7', currentState: 'q2', readSymbol: '0', writeSymbol: '0', moveDirection: 'L', nextState: 'q2', comment: 'Rewind past 0' },
      { id: 'eq8', currentState: 'q2', readSymbol: 'X', writeSymbol: 'X', moveDirection: 'R', nextState: 'q0', comment: 'Hit X, advance to next 0' },
      { id: 'eq9', currentState: 'q3', readSymbol: 'Y', writeSymbol: 'Y', moveDirection: 'R', nextState: 'q3', comment: 'Verify Ys' },
      { id: 'eq10', currentState: 'q3', readSymbol: BLANK_SYMBOL, writeSymbol: BLANK_SYMBOL, moveDirection: 'S', nextState: 'q_accept', comment: 'End of string reached, accept' }
    ]
  },
  {
    id: 'bit_inverter',
    name: 'Bit Inverter (NOT)',
    formalLanguage: 'f(w) = NOT(w) for w ∈ {0,1}*',
    description: 'Inverts each bit: replaces 0 with 1 and 1 with 0 along the tape until blank Δ is encountered.',
    initialInput: '10110',
    initialState: 'q0',
    acceptStates: ['q_accept', 'q_final'],
    rules: [
      { id: 'inv1', currentState: 'q0', readSymbol: '0', writeSymbol: '1', moveDirection: 'R', nextState: 'q0', comment: 'Invert 0 to 1' },
      { id: 'inv2', currentState: 'q0', readSymbol: '1', writeSymbol: '0', moveDirection: 'R', nextState: 'q0', comment: 'Invert 1 to 0' },
      { id: 'inv3', currentState: 'q0', readSymbol: BLANK_SYMBOL, writeSymbol: BLANK_SYMBOL, moveDirection: 'S', nextState: 'q_accept', comment: 'All bits inverted, accept' }
    ]
  },
  {
    id: 'name_recognizer_rofiq',
    name: 'Name Recognizer ("rofiq")',
    formalLanguage: 'L = { "rofiq" }',
    description: 'Mengenali dan memvalidasi kata "rofiq" karakter per karakter, mengubah setiap huruf menjadi kapital (R-O-F-I-Q), dan berhenti di state ACCEPT.',
    initialInput: 'rofiq',
    initialState: 'q0',
    acceptStates: ['q_accept', 'q_final'],
    rules: [
      { id: 'rofiq_1', currentState: 'q0', readSymbol: 'r', writeSymbol: 'R', moveDirection: 'R', nextState: 'q_o', comment: 'Baca "r", ubah ke "R", cari "o"' },
      { id: 'rofiq_1b', currentState: 'q0', readSymbol: 'R', writeSymbol: 'R', moveDirection: 'R', nextState: 'q_o', comment: 'Baca "R", cari "o"' },
      { id: 'rofiq_2', currentState: 'q_o', readSymbol: 'o', writeSymbol: 'O', moveDirection: 'R', nextState: 'q_f', comment: 'Baca "o", ubah ke "O", cari "f"' },
      { id: 'rofiq_2b', currentState: 'q_o', readSymbol: 'O', writeSymbol: 'O', moveDirection: 'R', nextState: 'q_f', comment: 'Baca "O", cari "f"' },
      { id: 'rofiq_3', currentState: 'q_f', readSymbol: 'f', writeSymbol: 'F', moveDirection: 'R', nextState: 'q_i', comment: 'Baca "f", ubah ke "F", cari "i"' },
      { id: 'rofiq_3b', currentState: 'q_f', readSymbol: 'F', writeSymbol: 'F', moveDirection: 'R', nextState: 'q_i', comment: 'Baca "F", cari "i"' },
      { id: 'rofiq_4', currentState: 'q_i', readSymbol: 'i', writeSymbol: 'I', moveDirection: 'R', nextState: 'q_q', comment: 'Baca "i", ubah ke "I", cari "q"' },
      { id: 'rofiq_4b', currentState: 'q_i', readSymbol: 'I', writeSymbol: 'I', moveDirection: 'R', nextState: 'q_q', comment: 'Baca "I", cari "q"' },
      { id: 'rofiq_5', currentState: 'q_q', readSymbol: 'q', writeSymbol: 'Q', moveDirection: 'R', nextState: 'q_end', comment: 'Baca "q", ubah ke "Q", cek akhir kata' },
      { id: 'rofiq_5b', currentState: 'q_q', readSymbol: 'Q', writeSymbol: 'Q', moveDirection: 'R', nextState: 'q_end', comment: 'Baca "Q", cek akhir kata' },
      { id: 'rofiq_6', currentState: 'q_end', readSymbol: BLANK_SYMBOL, writeSymbol: BLANK_SYMBOL, moveDirection: 'S', nextState: 'q_accept', comment: 'Akhir kata tercapai, nama "rofiq" diterima!' }
    ]
  }
];

export const DEFAULT_TEMPLATE = TEMPLATES[0]; // a^n b^n c^n
