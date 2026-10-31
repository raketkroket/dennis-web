import themeColors from './themeColors.json';

// Colour schemes Dennis can choose in the admin (Uitstraling). Every brand
// colour of the site is a CSS variable (--c-<hex>, see tailwind.config.cjs).
// A scheme moves the hue and saturation of each colour but keeps its
// lightness, so contrast and the calm, premium feel stay the same.

export type ThemeId = 'zand' | 'kalksteen' | 'salie' | 'nachtblauw' | 'terracotta' | 'antraciet';

export interface ThemeScheme {
  id: ThemeId;
  name: string;
  description: string;
  /** Target hue in degrees; undefined keeps each colour's own hue. */
  hue?: number;
  /** Multiplier for each colour's saturation. */
  saturation: number;
}

export const themeSchemes: ThemeScheme[] = [
  { id: 'zand', name: 'Warm zand', description: 'De huidige uitstraling: warm, licht en natuurlijk.', saturation: 1 },
  { id: 'kalksteen', name: 'Kalksteen', description: 'Koeler en neutraler, als lichte natuursteen.', hue: 38, saturation: 0.35 },
  { id: 'salie', name: 'Salie', description: 'Zachte groentinten met een natuurlijke rust.', hue: 95, saturation: 0.6 },
  { id: 'nachtblauw', name: 'Nachtblauw', description: 'Diep blauw met lichte, frisse vlakken.', hue: 215, saturation: 0.65 },
  { id: 'terracotta', name: 'Terracotta', description: 'Warmer en roder, zoals gebakken klei.', hue: 16, saturation: 1.25 },
  { id: 'antraciet', name: 'Antraciet', description: 'Bijna kleurloos: grijs, zwart en wit.', hue: 210, saturation: 0.1 },
];

export const defaultThemeId: ThemeId = 'zand';
export const themeContentKey = 'theme.scheme';

export const isThemeId = (value: unknown): value is ThemeId => themeSchemes.some((scheme) => scheme.id === value);

function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}

function hslToChannels(h: number, s: number, l: number): string {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((value) => Math.round(value * 255)).join(' ');
}

/** The value ("r g b") of one brand colour in a scheme. */
export function schemeColour(hex: string, scheme: ThemeScheme): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToChannels(scheme.hue ?? h, Math.min(1, s * scheme.saturation), l);
}

/** CSS variables for a scheme, e.g. for a style attribute or a stylesheet. */
export function themeVariables(id: ThemeId): Record<string, string> {
  const scheme = themeSchemes.find((candidate) => candidate.id === id) ?? themeSchemes[0];
  return Object.fromEntries(themeColors.colors.map((hex) => [`--c-${hex}`, schemeColour(hex, scheme)]));
}

/** A stylesheet that recolours the site, or '' for the default scheme. */
export function themeStylesheet(id: ThemeId): string {
  if (id === defaultThemeId) return '';
  return `:root{${Object.entries(themeVariables(id)).map(([name, value]) => `${name}:${value}`).join(';')}}`;
}

/** Hex colour for a swatch in the admin. */
export function swatch(hex: string, id: ThemeId): string {
  const scheme = themeSchemes.find((candidate) => candidate.id === id) ?? themeSchemes[0];
  return `rgb(${schemeColour(hex, scheme).split(' ').join(',')})`;
}
