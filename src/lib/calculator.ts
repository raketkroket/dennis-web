// Price calculator rules, shared by the website, the admin preview and the
// quote API (api/offerte.ts), so the server recalculates every total itself.
// This file must stay free of runtime imports: the API and the Node test
// runner load it directly.

export type RoomType = 'badkamer' | 'wc';
export const roomTypes: RoomType[] = ['badkamer', 'wc'];

export type OptionGroupId = 'afwerking' | 'tegelwerk' | 'installatie' | 'toilet';
export const optionGroups: { id: OptionGroupId; labelNl: string; labelEn: string }[] = [
  { id: 'afwerking', labelNl: 'Afwerking', labelEn: 'Finishing' },
  { id: 'tegelwerk', labelNl: 'Tegelwerk', labelEn: 'Tiling' },
  { id: 'installatie', labelNl: 'Installatie', labelEn: 'Installation' },
  { id: 'toilet', labelNl: 'Toilet', labelEn: 'Toilet' },
];

export interface PriceTier {
  /** Area in m² from which this rate applies, up to the next tier. */
  fromArea: number;
  ratePerM2: number;
}

export interface CalculatorRoom {
  roomType: RoomType;
  labelNl: string;
  labelEn: string;
  descriptionNl: string;
  descriptionEn: string;
  basePrice: number;
  /** Area in m² covered by the base price. */
  includedArea: number;
  tiers: PriceTier[];
  isActive: boolean;
}

export interface CalculatorOption {
  id: string;
  group: OptionGroupId;
  labelNl: string;
  labelEn: string;
  price: number;
  includedNl: string;
  includedEn: string;
  noteNl: string;
  noteEn: string;
  rooms: RoomType[];
  /** Options that cover the same work and therefore cannot be combined. */
  conflictsWith: string[];
  isActive: boolean;
  sortOrder: number;
}

export interface CalculatorConfig {
  rooms: CalculatorRoom[];
  options: CalculatorOption[];
}

export const dimensionLimits = { min: 0.5, max: 20 } as const;

// Prices and rules as they were in the original configurator. The only
// change is conflictsWith on the toilet-frame options, which stops the same
// frame being counted twice (see README "Calculator").
export const defaultCalculatorConfig: CalculatorConfig = {
  rooms: [
    {
      roomType: 'badkamer',
      labelNl: 'Badkamer',
      labelEn: 'Bathroom',
      descriptionNl: 'Volledige badkamerrenovatie',
      descriptionEn: 'Complete bathroom renovation',
      basePrice: 7950,
      includedArea: 5,
      tiers: [
        { fromArea: 5, ratePerM2: 900 },
        { fromArea: 8, ratePerM2: 1100 },
      ],
      isActive: true,
    },
    {
      roomType: 'wc',
      labelNl: 'WC',
      labelEn: 'Toilet',
      descriptionNl: 'Toiletrenovatie',
      descriptionEn: 'Toilet renovation',
      basePrice: 3950,
      includedArea: 2,
      tiers: [{ fromArea: 2, ratePerM2: 800 }],
      isActive: true,
    },
  ],
  options: [
    { id: 'verlaagd_plafond', group: 'afwerking', labelNl: 'Verlaagd plafond', labelEn: 'Lowered ceiling', price: 750, includedNl: 'Vochtwerend plafond, montage.', includedEn: 'Moisture-resistant ceiling, installation.', noteNl: 'Stucwerk en spotjes apart.', noteEn: 'Plastering and spotlights are separate.', rooms: ['badkamer', 'wc'], conflictsWith: [], isActive: true, sortOrder: 10 },
    { id: 'spotjes', group: 'afwerking', labelNl: 'Spotjes', labelEn: 'Spotlights', price: 500, includedNl: 'Montage en bekabeling.', includedEn: 'Installation and wiring.', noteNl: 'Extra spot €125 per stuk.', noteEn: 'Additional spotlight €125 each.', rooms: ['badkamer', 'wc'], conflictsWith: [], isActive: true, sortOrder: 20 },
    { id: 'stucwerk', group: 'afwerking', labelNl: 'Stucwerk', labelEn: 'Plastering', price: 450, includedNl: 'Voorbereiding en glad afwerken.', includedEn: 'Preparation and smooth finish.', noteNl: '', noteEn: '', rooms: ['badkamer', 'wc'], conflictsWith: [], isActive: true, sortOrder: 30 },
    { id: 'schilderwerk', group: 'afwerking', labelNl: 'Schilderwerk', labelEn: 'Painting', price: 350, includedNl: 'Twee lagen vochtbestendige verf.', includedEn: 'Two coats of moisture-resistant paint.', noteNl: '', noteEn: '', rooms: ['badkamer', 'wc'], conflictsWith: [], isActive: true, sortOrder: 40 },
    { id: 'tegelwerk_verstek', group: 'tegelwerk', labelNl: 'Tegelwerk in verstek', labelEn: 'Mitred tiling', price: 600, includedNl: 'Verstekafwerking.', includedEn: 'Mitred edges.', noteNl: 'Afhankelijk van het aantal strekkende meters.', noteEn: 'Depends on the number of running metres.', rooms: ['badkamer', 'wc'], conflictsWith: [], isActive: true, sortOrder: 50 },
    { id: 'niche', group: 'tegelwerk', labelNl: 'Nis', labelEn: 'Niche', price: 550, includedNl: 'Constructie en waterdichting.', includedEn: 'Construction and waterproofing.', noteNl: 'LED-verlichting + €250.', noteEn: 'LED lighting + €250.', rooms: ['badkamer', 'wc'], conflictsWith: [], isActive: true, sortOrder: 60 },
    { id: 'drain', group: 'installatie', labelNl: 'Drain', labelEn: 'Shower drain', price: 450, includedNl: 'Montage en aansluiting.', includedEn: 'Installation and connection.', noteNl: 'Drain zelf niet inbegrepen.', noteEn: 'The drain itself is not included.', rooms: ['badkamer', 'wc'], conflictsWith: [], isActive: true, sortOrder: 70 },
    { id: 'inbouwkraan', group: 'installatie', labelNl: 'Inbouwkraan', labelEn: 'Concealed tap', price: 550, includedNl: 'Montage en aansluiting.', includedEn: 'Installation and connection.', noteNl: 'Kraan zelf niet inbegrepen.', noteEn: 'The tap itself is not included.', rooms: ['badkamer', 'wc'], conflictsWith: [], isActive: true, sortOrder: 80 },
    { id: 'vloerverwarming', group: 'installatie', labelNl: 'Elektrische vloerverwarming', labelEn: 'Electric underfloor heating', price: 900, includedNl: 'Verwarmingsmat, thermostaat en montage.', includedEn: 'Heating mat, thermostat and installation.', noteNl: 'Tot ongeveer 6 m².', noteEn: 'Up to about 6 m².', rooms: ['badkamer', 'wc'], conflictsWith: [], isActive: true, sortOrder: 90 },
    { id: 'elektra', group: 'installatie', labelNl: 'Elektra', labelEn: 'Electrical work', price: 650, includedNl: 'Lichtpunten en wandcontactdozen.', includedEn: 'Light points and wall sockets.', noteNl: 'Meterkastwerk apart.', noteEn: 'Work on the meter cupboard is separate.', rooms: ['badkamer', 'wc'], conflictsWith: [], isActive: true, sortOrder: 100 },
    { id: 'sloopcontainer', group: 'installatie', labelNl: 'Sloopcontainer', labelEn: 'Demolition skip', price: 450, includedNl: 'Plaatsing en afvoer.', includedEn: 'Delivery and removal.', noteNl: '', noteEn: '', rooms: ['badkamer', 'wc'], conflictsWith: [], isActive: true, sortOrder: 110 },
    { id: 'inbouwreservoir', group: 'toilet', labelNl: 'Inbouwreservoir / toiletframe', labelEn: 'Concealed cistern / toilet frame', price: 750, includedNl: 'Montage en aansluiting.', includedEn: 'Installation and connection.', noteNl: 'Frame wordt door klant geleverd.', noteEn: 'Frame supplied by the customer.', rooms: ['badkamer', 'wc'], conflictsWith: ['geberit_duofix', 'hangtoilet_systeem'], isActive: true, sortOrder: 120 },
    { id: 'geberit_duofix', group: 'toilet', labelNl: 'Geberit Duofix inclusief montage', labelEn: 'Geberit Duofix including installation', price: 1250, includedNl: 'Frame en montage.', includedEn: 'Frame and installation.', noteNl: 'Toilet niet inbegrepen.', noteEn: 'Toilet not included.', rooms: ['badkamer', 'wc'], conflictsWith: ['inbouwreservoir', 'hangtoilet_systeem'], isActive: true, sortOrder: 130 },
    { id: 'toiletframe_ombouwen', group: 'toilet', labelNl: 'Toiletframe ombouwen', labelEn: 'Boxing in the toilet frame', price: 500, includedNl: 'Betimmering.', includedEn: 'Boxing-in.', noteNl: 'Tegelwerk apart. Al inbegrepen in het complete hangtoilet-systeem.', noteEn: 'Tiling is separate. Already included in the complete wall-hung toilet system.', rooms: ['badkamer', 'wc'], conflictsWith: ['hangtoilet_systeem'], isActive: true, sortOrder: 140 },
    { id: 'hangtoilet_systeem', group: 'toilet', labelNl: 'Compleet hangtoilet-systeem', labelEn: 'Complete wall-hung toilet system', price: 1850, includedNl: 'Frame, ombouw en montage.', includedEn: 'Frame, boxing-in and installation.', noteNl: 'Toilet en tegelwerk deels niet inbegrepen.', noteEn: 'Toilet and tiling partly not included.', rooms: ['badkamer', 'wc'], conflictsWith: ['inbouwreservoir', 'geberit_duofix', 'toiletframe_ombouwen'], isActive: true, sortOrder: 150 },
  ],
};

/** Parses "2,5", "2.5", "2,50 m" and " 3 " to numbers; returns null for anything else. */
export function parseDecimal(value: string | number | null | undefined): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const cleaned = value.trim().toLowerCase().replace(/\s*m$/, '').replace(/\s+/g, '');
  if (!/^\d{1,3}([.,]\d{1,3})?$/.test(cleaned)) return null;
  return Number(cleaned.replace(',', '.'));
}

export type DimensionError = 'required' | 'invalid' | 'tooSmall' | 'tooLarge';

export function validateDimension(value: string): DimensionError | null {
  if (!value.trim()) return 'required';
  const parsed = parseDecimal(value);
  if (parsed === null) return 'invalid';
  if (parsed < dimensionLimits.min) return 'tooSmall';
  if (parsed > dimensionLimits.max) return 'tooLarge';
  return null;
}

export function roundArea(area: number): number {
  return Math.round(area * 100) / 100;
}

export interface AreaLine {
  fromArea: number;
  toArea: number;
  squareMetres: number;
  ratePerM2: number;
  amount: number;
}

export interface EstimateInput {
  roomType: RoomType;
  length: number;
  width: number;
  optionIds: string[];
}

export interface Estimate {
  roomType: RoomType;
  length: number;
  width: number;
  area: number;
  basePrice: number;
  includedArea: number;
  areaLines: AreaLine[];
  options: CalculatorOption[];
  total: number;
}

export type EstimateError =
  | { code: 'unknownRoom' | 'invalidDimensions' }
  | { code: 'unknownOption' | 'unavailableOption'; optionId: string }
  | { code: 'conflictingOptions'; optionId: string; conflictsWith: string };

export function optionsForRoom(config: CalculatorConfig, roomType: RoomType): CalculatorOption[] {
  return config.options
    .filter((option) => option.isActive && option.rooms.includes(roomType))
    .sort((first, second) => first.sortOrder - second.sortOrder || first.id.localeCompare(second.id));
}

/** Checks option ids for a room; returns the first problem, or null. */
export function findOptionError(config: CalculatorConfig, roomType: RoomType, optionIds: string[]): EstimateError | null {
  const seen = new Set<string>();
  for (const optionId of optionIds) {
    const option = config.options.find((candidate) => candidate.id === optionId);
    if (!option) return { code: 'unknownOption', optionId };
    if (!option.isActive || !option.rooms.includes(roomType) || seen.has(optionId)) return { code: 'unavailableOption', optionId };
    const conflict = option.conflictsWith.find((id) => seen.has(id))
      ?? [...seen].find((id) => config.options.find((candidate) => candidate.id === id)?.conflictsWith.includes(optionId));
    if (conflict) return { code: 'conflictingOptions', optionId, conflictsWith: conflict };
    seen.add(optionId);
  }
  return null;
}

/** Adds an option and drops any selected option it conflicts with. */
export function toggleOption(config: CalculatorConfig, selected: string[], optionId: string): string[] {
  if (selected.includes(optionId)) return selected.filter((id) => id !== optionId);
  const option = config.options.find((candidate) => candidate.id === optionId);
  if (!option) return selected;
  const kept = selected.filter((id) => !option.conflictsWith.includes(id)
    && !config.options.find((candidate) => candidate.id === id)?.conflictsWith.includes(optionId));
  return [...kept, optionId];
}

export function calculateEstimate(config: CalculatorConfig, input: EstimateInput): { ok: true; estimate: Estimate } | { ok: false; error: EstimateError } {
  const room = config.rooms.find((candidate) => candidate.roomType === input.roomType && candidate.isActive);
  if (!room) return { ok: false, error: { code: 'unknownRoom' } };
  const { min, max } = dimensionLimits;
  if (![input.length, input.width].every((value) => Number.isFinite(value) && value >= min && value <= max)) {
    return { ok: false, error: { code: 'invalidDimensions' } };
  }

  const optionError = findOptionError(config, input.roomType, input.optionIds);
  if (optionError) return { ok: false, error: optionError };

  const area = input.length * input.width;
  const tiers = [...room.tiers].sort((first, second) => first.fromArea - second.fromArea);
  const areaLines: AreaLine[] = [];
  tiers.forEach((tier, index) => {
    const start = Math.max(tier.fromArea, room.includedArea);
    const end = Math.min(area, tiers[index + 1]?.fromArea ?? Number.POSITIVE_INFINITY);
    if (end <= start) return;
    const squareMetres = end - start;
    areaLines.push({ fromArea: start, toArea: end, squareMetres, ratePerM2: tier.ratePerM2, amount: squareMetres * tier.ratePerM2 });
  });

  const options = input.optionIds.map((id) => config.options.find((option) => option.id === id) as CalculatorOption);
  const unrounded = room.basePrice
    + areaLines.reduce((sum, line) => sum + line.amount, 0)
    + options.reduce((sum, option) => sum + option.price, 0);

  return {
    ok: true,
    estimate: {
      roomType: room.roomType,
      length: input.length,
      width: input.width,
      area: roundArea(area),
      basePrice: room.basePrice,
      includedArea: room.includedArea,
      areaLines,
      options,
      total: Math.round(unrounded),
    },
  };
}

/** Problems an editor must fix before calculator settings can be saved. */
export function validateCalculatorConfig(config: CalculatorConfig): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  for (const room of config.rooms) {
    const name = room.labelNl || room.roomType;
    if (!Number.isInteger(room.basePrice) || room.basePrice < 0 || room.basePrice > 100000) problems.push(`${name}: de basisprijs moet een heel bedrag tussen €0 en €100.000 zijn.`);
    if (!(room.includedArea > 0 && room.includedArea <= 100)) problems.push(`${name}: de oppervlakte in de basisprijs moet tussen 0 en 100 m² liggen.`);
    const sorted = [...room.tiers].sort((first, second) => first.fromArea - second.fromArea);
    if (sorted.length === 0) problems.push(`${name}: voeg minstens één prijs per extra m² toe.`);
    sorted.forEach((tier, index) => {
      if (!Number.isInteger(tier.ratePerM2) || tier.ratePerM2 < 0 || tier.ratePerM2 > 20000) problems.push(`${name}: de prijs per m² moet een heel bedrag tussen €0 en €20.000 zijn.`);
      if (index > 0 && tier.fromArea === sorted[index - 1].fromArea) problems.push(`${name}: twee prijsregels beginnen bij ${tier.fromArea} m².`);
    });
    if (sorted[0] && sorted[0].fromArea !== room.includedArea) problems.push(`${name}: de eerste prijs per extra m² moet beginnen bij ${room.includedArea} m² (het einde van de basisprijs).`);
  }
  for (const option of config.options) {
    const name = option.labelNl || option.id;
    if (!/^[a-z0-9_]{2,60}$/.test(option.id)) problems.push(`${name}: ongeldige code.`);
    if (ids.has(option.id)) problems.push(`${name}: deze code bestaat al.`);
    ids.add(option.id);
    if (option.labelNl.trim().length < 2) problems.push(`Een optie heeft nog geen Nederlandse naam.`);
    if (!Number.isInteger(option.price) || option.price < 0 || option.price > 100000) problems.push(`${name}: de prijs moet een heel bedrag tussen €0 en €100.000 zijn.`);
    if (option.rooms.length === 0) problems.push(`${name}: kies voor welke ruimte deze optie geldt.`);
  }
  for (const option of config.options) {
    for (const id of option.conflictsWith) {
      if (!ids.has(id)) problems.push(`${option.labelNl}: kan niet samengaan met een optie die niet meer bestaat (${id}).`);
    }
  }
  return problems;
}

export function formatEuro(value: number, language: 'nl' | 'en' = 'nl'): string {
  return new Intl.NumberFormat(language === 'en' ? 'en-GB' : 'nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(value);
}

export function formatNumber(value: number, language: 'nl' | 'en' = 'nl', maximumFractionDigits = 2): string {
  return new Intl.NumberFormat(language === 'en' ? 'en-GB' : 'nl-NL', { maximumFractionDigits }).format(value);
}
