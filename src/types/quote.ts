export type QuoteRoomType = 'badkamer' | 'wc';

export interface QuoteOption {
  id: string;
  label: string;
  price: number;
}

export interface QuoteConfiguration {
  roomType: QuoteRoomType;
  length: number;
  width: number;
  area: number;
  selectedOptions: QuoteOption[];
  totalPrice: number;
}