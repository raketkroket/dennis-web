// The website texts Dennis can change under "Website aanpassen". Each key is
// a translation key from src/i18n/translations.ts; a saved value overrides
// the built-in text. "list" fields are stored one item per "|" internally
// but edited as separate rows; "lines" fields hold exactly two lines.
export type ContentFieldKind = 'text' | 'textarea' | 'list' | 'lines';

export interface ContentField {
  key: string;
  label: string;
  help?: string;
  kind: ContentFieldKind;
}

export interface ContentSection {
  id: string;
  title: string;
  description: string;
  page: string;
  fields: ContentField[];
}

export const contentSections: ContentSection[] = [
  {
    id: 'home',
    title: 'Homepage',
    description: 'De eerste teksten die bezoekers zien.',
    page: '/',
    fields: [
      { key: 'marketing.heroLabel', label: 'Kleine kop boven de titel', kind: 'text' },
      { key: 'marketing.heroTitle', label: 'Titel', kind: 'text' },
      { key: 'marketing.heroTitleAccent', label: 'Tweede deel van de titel (schuin gedrukt)', kind: 'text' },
      { key: 'marketing.heroDescription', label: 'Introductietekst', kind: 'textarea' },
      { key: 'marketing.servicesLabel', label: 'Diensten: kleine kop', kind: 'text' },
      { key: 'marketing.servicesTitle', label: 'Diensten: titel', kind: 'text' },
      { key: 'marketing.servicesDescription', label: 'Diensten: introductie', kind: 'textarea' },
      { key: 'marketing.estimateLabel', label: 'Prijscalculator: kleine kop', kind: 'text' },
      { key: 'marketing.estimateTitle', label: 'Prijscalculator: titel', kind: 'text' },
      { key: 'marketing.estimateSteps', label: 'Prijscalculator: stappen', kind: 'list' },
      { key: 'shared.whatCustomersSay', label: 'Ervaringen: titel', kind: 'text' },
      { key: 'shared.reviewsDescription', label: 'Ervaringen: introductie', kind: 'textarea' },
      { key: 'aboutPage.customersValue', label: 'Cijfer: tevreden klanten', help: 'Ook gebruikt op de pagina Over ons.', kind: 'text' },
      { key: 'aboutPage.experienceValue', label: 'Cijfer: ervaring', help: 'Ook gebruikt op de pagina Over ons.', kind: 'text' },
      { key: 'shared.callToAction', label: 'Onderaan: kleine kop', kind: 'text' },
      { key: 'shared.dreamRenovation', label: 'Onderaan: titel', kind: 'text' },
      { key: 'shared.ctaDescription', label: 'Onderaan: tekst', kind: 'textarea' },
    ],
  },
  {
    id: 'badkamer',
    title: 'Badkamerrenovatie',
    description: 'De pagina over badkamerrenovaties.',
    page: '/badkamerrenovatie',
    fields: [
      { key: 'bathroomPage.eyebrow', label: 'Kleine kop', kind: 'text' },
      { key: 'bathroomPage.title', label: 'Titel', kind: 'text' },
      { key: 'bathroomPage.description', label: 'Introductietekst', kind: 'textarea' },
      { key: 'bathroomPage.featuresTitle', label: 'Werkzaamheden: titel (twee regels)', kind: 'lines' },
      { key: 'bathroomPage.featuresDescription', label: 'Werkzaamheden: introductie', kind: 'textarea' },
      { key: 'bathroomPage.features', label: 'Werkzaamheden: lijst', kind: 'list' },
      { key: 'bathroomPage.guidanceTitle', label: 'Sanitair en tegels: titel', kind: 'text' },
      { key: 'bathroomPage.guidanceFirst', label: 'Sanitair en tegels: eerste alinea', kind: 'textarea' },
      { key: 'bathroomPage.guidanceSecond', label: 'Sanitair en tegels: tweede alinea', kind: 'textarea' },
      { key: 'bathroomPage.guidanceConclusion', label: 'Sanitair en tegels: slotzin', kind: 'textarea' },
    ],
  },
  {
    id: 'wc',
    title: 'WC-renovatie',
    description: 'De pagina over toiletrenovaties.',
    page: '/wc-renovatie',
    fields: [
      { key: 'wcPage.eyebrow', label: 'Kleine kop', kind: 'text' },
      { key: 'wcPage.title', label: 'Titel', kind: 'text' },
      { key: 'wcPage.description', label: 'Introductietekst', kind: 'textarea' },
      { key: 'wcPage.featuresTitle', label: 'Werkzaamheden: titel', kind: 'text' },
      { key: 'wcPage.featuresDescription', label: 'Werkzaamheden: introductie', kind: 'textarea' },
      { key: 'wcPage.features', label: 'Werkzaamheden: lijst', kind: 'list' },
      { key: 'wcPage.guidanceTitle', label: 'Sanitair en tegels: titel', kind: 'text' },
      { key: 'wcPage.guidanceFirst', label: 'Sanitair en tegels: eerste alinea', kind: 'textarea' },
      { key: 'wcPage.guidanceSecond', label: 'Sanitair en tegels: tweede alinea', kind: 'textarea' },
      { key: 'wcPage.guidanceConclusion', label: 'Sanitair en tegels: slotzin', kind: 'textarea' },
    ],
  },
  {
    id: 'binnen',
    title: 'Binnenrenovatie',
    description: 'De pagina over stucwerk, schilderwerk, vloeren en plafonds.',
    page: '/binnenrenovatie',
    fields: [
      { key: 'interiorPage.eyebrow', label: 'Kleine kop', kind: 'text' },
      { key: 'interiorPage.title', label: 'Titel', kind: 'text' },
      { key: 'interiorPage.description', label: 'Introductietekst', kind: 'textarea' },
      { key: 'interiorPage.servicesTitle', label: 'Diensten: titel', kind: 'text' },
      { key: 'interiorPage.services', label: 'Diensten: namen', kind: 'list', help: 'De beschrijvingen hieronder horen in dezelfde volgorde.' },
      { key: 'interiorPage.serviceDescriptions', label: 'Diensten: beschrijving per dienst', kind: 'list' },
    ],
  },
  {
    id: 'over-ons',
    title: 'Over ons',
    description: 'Het verhaal van Denra.',
    page: '/over-ons',
    fields: [
      { key: 'aboutPage.description', label: 'Introductie', kind: 'textarea' },
      { key: 'aboutPage.intro', label: 'Tweede alinea', kind: 'textarea' },
      { key: 'aboutPage.customersValue', label: 'Cijfer "tevreden klanten" (leeg laten om te verbergen)', kind: 'text', help: 'Alleen invullen als het klopt.' },
      { key: 'aboutPage.experienceValue', label: 'Cijfer "ervaring" (leeg laten om te verbergen)', kind: 'text', help: 'Alleen invullen als het klopt.' },
      { key: 'aboutPage.quote', label: 'Citaat', kind: 'textarea' },
      { key: 'aboutPage.whyTitle', label: 'Waarom Denra: titel', kind: 'text' },
      { key: 'aboutPage.whyDescription', label: 'Waarom Denra: tekst', kind: 'textarea' },
      { key: 'aboutPage.values', label: 'Waarom Denra: drie punten', kind: 'list' },
      { key: 'aboutPage.valueDescriptions', label: 'Waarom Denra: uitleg per punt', kind: 'list' },
      { key: 'aboutPage.promiseTitle', label: 'Belofte: titel', kind: 'text' },
      { key: 'aboutPage.promises', label: 'Belofte: punten', kind: 'list' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact en calculator',
    description: 'Teksten op de contactpagina en bij de prijsberekening.',
    page: '/contact',
    fields: [
      { key: 'home.getAcquainted', label: 'Contact: titel', kind: 'text' },
      { key: 'home.contactDescription', label: 'Contact: introductie', kind: 'textarea' },
      { key: 'home.contactWithin24', label: 'Contact: tekst boven het formulier', kind: 'text' },
      { key: 'configuratorPage.description', label: 'Calculator: introductie', kind: 'textarea' },
      { key: 'configurator.disclaimer', label: 'Calculator: wat wel en niet is inbegrepen', kind: 'textarea', help: 'Wordt getoond bij de prijsindicatie. Houd dit gelijk aan uw werkelijke voorwaarden.' },
      { key: 'configurator.materialsIncluded', label: 'Calculator: materialen', kind: 'text' },
      { key: 'configurator.includingVat', label: 'Calculator: btw-vermelding naast de prijs', kind: 'text', help: 'Bijvoorbeeld "incl. btw". Pas dit alleen aan als de prijzen anders berekend worden.' },
    ],
  },
];
