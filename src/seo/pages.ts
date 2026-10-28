// Title and description per page, for search results and link previews.
// Used by the browser (RouteMeta) and by the build step that writes a ready
// HTML file per page (scripts/prerender.ts), so crawlers get the right text
// without running JavaScript.

export const siteUrl = 'https://denrabadkamers.nl';

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  /** Leave out of the sitemap and ask search engines not to index. */
  noindex?: boolean;
}

// /badkamer-renovatie (an older address) redirects to /badkamerrenovatie in vercel.json.
export const pages: PageMeta[] = [
  {
    path: '/',
    title: 'Badkamer & WC Renovatie Almere & Amsterdam | Denra Badkamers',
    description: 'Complete badkamer- en WC-renovaties in Almere, Amsterdam en de rest van Flevoland en Noord-Holland. Bereken direct de kosten of vraag een offerte aan.',
  },
  {
    path: '/badkamerrenovatie',
    title: 'Badkamerrenovatie: kosten en werkwijze | Denra Badkamers',
    description: 'Badkamer renoveren van sloop tot afwerking: leidingwerk, tegelwerk en sanitair door één vast team. Bekijk de kosten per m² en bereken direct uw prijs.',
  },
  {
    path: '/wc-renovatie',
    title: 'WC-renovatie en toilet renoveren | Denra Badkamers',
    description: 'Uw toilet compleet vernieuwd: hangtoilet, inbouwreservoir, tegelwerk en fonteintje. WC-renovatie in Almere, Amsterdam en omgeving. Bekijk prijzen en projecten.',
  },
  {
    path: '/binnenrenovatie',
    title: 'Binnenrenovatie: stucwerk en vloeren | Denra Badkamers',
    description: 'Binnenrenovatie door Denra: stucwerk, vloeren leggen, schilderwerk en verlaagde plafonds met spotjes. Strak afgewerkt in Flevoland en Noord-Holland.',
  },
  {
    path: '/badkamer-renovatie-almere',
    title: 'Badkamer renovatie Almere | Denra Badkamers',
    description: 'Complete badkamerrenovatie in Almere: van sloopwerk, leidingwerk en tegelwerk tot sanitair en afwerking. Vraag vrijblijvend een offerte aan bij Denra Badkamers.',
  },
  {
    path: '/badkamer-renovatie-amsterdam',
    title: 'Badkamer renovatie Amsterdam | Denra Badkamers',
    description: 'Badkamer renovatie in Amsterdam van sloop en leidingwerk tot tegelwerk, sanitair en luxe afwerking, in een strak werkproces. Vraag vrijblijvend een offerte aan.',
  },
  {
    path: '/wc-renovatie-almere',
    title: 'WC renovatie Almere | Toilet renovatie | Denra Badkamers',
    description: 'WC renovatie in Almere: van sloopwerk en tegelwerk tot hangtoilet, sanitair en afwerking. Vraag vrijblijvend een offerte aan bij Denra Badkamers.',
  },
  {
    path: '/wc-renovatie-amsterdam',
    title: 'WC renovatie Amsterdam | Toilet renovatie | Denra Badkamers',
    description: 'WC renovatie in Amsterdam: van sloopwerk en tegelwerk tot hangtoilet, sanitair en afwerking. Vraag vrijblijvend een offerte aan bij Denra Badkamers.',
  },
  {
    path: '/projecten',
    title: "Projecten: badkamers, wc's en interieurs | Denra Badkamers",
    description: 'Bekijk gerealiseerde badkamers, toiletten en binnenrenovaties van Denra in Almere, Amsterdam en omgeving.',
  },
  {
    path: '/ervaringen',
    title: 'Ervaringen en reviews van klanten | Denra Badkamers',
    description: 'Lees hoe klanten de samenwerking met Denra Badkamers hebben ervaren bij hun badkamer-, WC- en binnenrenovatie.',
  },
  {
    path: '/over-ons',
    title: 'Over Denra Badkamers | Badkamer- en binnenrenovaties',
    description: 'Denra maakt badkamers, toiletten en interieurs die strak aanvoelen en slim zijn opgebouwd. Duidelijke afspraken, vaste planning en een verzorgde afwerking.',
  },
  {
    path: '/configurator',
    title: 'Badkamer prijs berekenen | Denra Badkamers',
    description: 'Bereken in een paar stappen een prijsindicatie voor uw badkamer- of WC-renovatie, inclusief btw, en bekijk uw ruimte direct in 3D.',
  },
  {
    path: '/contact',
    title: 'Contact en offerte aanvragen | Denra Badkamers',
    description: 'Neem contact op met Denra Badkamers voor een vrijblijvende offerte voor uw badkamer-, WC- of binnenrenovatie. Wij reageren binnen 24 uur.',
  },
  {
    path: '/algemene-voorwaarden',
    title: 'Algemene voorwaarden | Denra Badkamers',
    description: 'De algemene voorwaarden van Denra Badkamers voor renovatiewerkzaamheden.',
  },
];

export const notFound: PageMeta = {
  path: '*',
  title: 'Pagina niet gevonden | Denra Badkamers',
  description: 'Deze pagina bestaat niet (meer). Ga naar de homepage van Denra Badkamers.',
  noindex: true,
};

export function metaFor(pathname: string): PageMeta {
  if (pathname.startsWith('/admin')) return { ...notFound, path: pathname, title: 'Beheer | Denra Badkamers' };
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return pages.find((page) => page.path === clean) ?? notFound;
}

export const canonicalUrl = (page: PageMeta) => `${siteUrl}${page.path === '*' ? '/' : page.path}`;
