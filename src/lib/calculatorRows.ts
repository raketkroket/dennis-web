// Converts calculator settings between database rows and CalculatorConfig.
// Used by the website, the admin and api/offerte.ts; keep it free of runtime
// imports other than ./calculator types.
import type { CalculatorConfig, CalculatorOption, CalculatorRoom, OptionGroupId, RoomType } from './calculator';

export interface CalculatorRoomRow { room_type: RoomType; label_nl: string; label_en: string; description_nl: string; description_en: string; base_price: number; included_area: number | string; is_active: boolean }
export interface CalculatorTierRow { room_type: RoomType; from_area: number | string; rate_per_m2: number }
export interface CalculatorOptionRow {
  id: string; group_id: OptionGroupId; label_nl: string; label_en: string; price: number; included_nl: string; included_en: string;
  note_nl: string; note_en: string; rooms: RoomType[]; conflicts_with: string[]; is_active: boolean; sort_order: number;
}

export function calculatorFromRows(rooms: CalculatorRoomRow[], tiers: CalculatorTierRow[], options: CalculatorOptionRow[]): CalculatorConfig {
  return {
    rooms: rooms.map((room): CalculatorRoom => ({
      roomType: room.room_type, labelNl: room.label_nl, labelEn: room.label_en, descriptionNl: room.description_nl, descriptionEn: room.description_en,
      basePrice: room.base_price, includedArea: Number(room.included_area), isActive: room.is_active,
      tiers: tiers.filter((tier) => tier.room_type === room.room_type).map((tier) => ({ fromArea: Number(tier.from_area), ratePerM2: tier.rate_per_m2 })).sort((a, b) => a.fromArea - b.fromArea),
    })),
    options: options.map((option): CalculatorOption => ({
      id: option.id, group: option.group_id, labelNl: option.label_nl, labelEn: option.label_en, price: option.price,
      includedNl: option.included_nl, includedEn: option.included_en, noteNl: option.note_nl, noteEn: option.note_en,
      rooms: option.rooms, conflictsWith: option.conflicts_with ?? [], isActive: option.is_active, sortOrder: option.sort_order,
    })).sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

export function calculatorToPayload(config: CalculatorConfig) {
  return {
    rooms: config.rooms.map((room) => ({
      room_type: room.roomType, label_nl: room.labelNl, label_en: room.labelEn, description_nl: room.descriptionNl, description_en: room.descriptionEn,
      base_price: room.basePrice, included_area: room.includedArea, is_active: room.isActive,
      tiers: room.tiers.map((tier) => ({ from_area: tier.fromArea, rate_per_m2: tier.ratePerM2 })),
    })),
    options: config.options.map((option, index) => ({
      id: option.id, group_id: option.group, label_nl: option.labelNl, label_en: option.labelEn, price: option.price,
      included_nl: option.includedNl, included_en: option.includedEn, note_nl: option.noteNl, note_en: option.noteEn,
      rooms: option.rooms, conflicts_with: option.conflictsWith, is_active: option.isActive, sort_order: (index + 1) * 10,
    })),
  };
}
