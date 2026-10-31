// Brand colours are CSS variables (--c-<hex>), so a colour scheme chosen in
// the admin can recolour the whole site. The list comes from
// src/lib/themeColors.json; by default every variable is its own colour.
const { colors: themeHexes } = require('./src/lib/themeColors.json');
const channels = (hex) => [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ');
const themeVar = (hex) => `rgb(var(--c-${hex.toLowerCase()}) / <alpha-value>)`;
const themeTokens = Object.fromEntries(themeHexes.map((hex) => [`c-${hex}`, themeVar(hex)]));

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' }
    },
    extend: {
      colors: {
        ...themeTokens,
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        denra: {
          ivory: themeVar('f7f2ea'),
          paper: themeVar('fbf8f3'),
          cream: themeVar('faf6f0'),
          limestone: themeVar('eee6da'),
          stone: themeVar('e9e1d5'),
          sand: themeVar('ddd1c1'),
          greige: themeVar('cbb9a5'),
          taupe: themeVar('8e7a68'),
          bronze: themeVar('7a6552'),
          muted: themeVar('6b5d50'),
          ink: themeVar('231a12'),
          espresso: themeVar('231a12'),
          night: themeVar('1b1510'),
          charcoal: themeVar('2d261f'),
          line: themeVar('d9cdbd'),
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      maxWidth: {
        shell: '1320px',
      },
      fontFamily: {
        sans: ["'DM Sans'", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        serif: ["'Cormorant Garamond'", "ui-serif", "Georgia", "serif"],
        mono: ["'Space Mono'", "ui-monospace", "monospace"]
      },
      boxShadow: {
        "2xs": "var(--shadow-2xs)",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)"
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    ({ addBase }) => addBase({ ':root': Object.fromEntries(themeHexes.map((hex) => [`--c-${hex}`, channels(hex)])) }),
  ],
};