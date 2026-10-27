export const BLANK_SYMBOL = 'Δ';
export const ALT_BLANK_SYMBOL = '_';

export const PADDING_BLANKS = 6; // Number of blanks on the left and right of initial tape

/**
 * Normalizes an input symbol or string.
 * Converts empty strings or underscore '_' to the canonical BLANK_SYMBOL 'Δ'.
 */
export function normalizeSymbol(sym: string): string {
  if (!sym || sym === ALT_BLANK_SYMBOL || sym.trim() === '') {
    return BLANK_SYMBOL;
  }
  return sym;
}

/**
 * Builds an initial tape array given an input string and optional padding.
 * @param input The input string to write on the tape
 * @param padding Number of blank symbols to pad before and after
 */
export function createTapeFromInput(input: string, padding: number = PADDING_BLANKS): { tape: string[], initialHead: number } {
  const leftPad = Array(padding).fill(BLANK_SYMBOL);
  const rightPad = Array(padding).fill(BLANK_SYMBOL);
  
  const content = input.length > 0 
    ? input.split('').map(char => char === '_' ? BLANK_SYMBOL : char)
    : [BLANK_SYMBOL];

  const tape = [...leftPad, ...content, ...rightPad];
  const initialHead = leftPad.length; // Point to first character of input

  return { tape, initialHead };
}
