import type { RoomType } from '../lib/calculator';

export type QuoteRoomType = RoomType;

/** What the calculator hands to the quote form. Prices are recalculated from these choices. */
export interface QuoteConfiguration {
  roomType: RoomType;
  length: number;
  width: number;
  optionIds: string[];
}

export interface CalculatorDraft {
  step: number;
  roomType: RoomType | null;
  length: string;
  width: string;
  optionIds: string[];
}

const draftKey = 'denra-calculator-draft';
const quoteKey = 'denra-calculator-quote';

function read<T>(key: string): T | null {
  try {
    const value = window.sessionStorage.getItem(key);
    return value ? JSON.parse(value) as T : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    if (value === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Without session storage the calculator still works; it just forgets on reload.
  }
}

export const loadCalculatorDraft = () => read<CalculatorDraft>(draftKey);
export const saveCalculatorDraft = (draft: CalculatorDraft | null) => write(draftKey, draft);
export const loadQuoteConfiguration = () => read<QuoteConfiguration>(quoteKey);
export const saveQuoteConfiguration = (quote: QuoteConfiguration | null) => write(quoteKey, quote);
