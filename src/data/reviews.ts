import partoredjo1 from '../../fotos/Partoredjo1.jpg?w=1280&format=webp';
import partoredjo2 from '../../fotos/Partoredjo2.jpg?w=1280&format=webp';
import partoredjo3 from '../../fotos/Partoredjo3.jpg?w=1280&format=webp';
import partoredjo4 from '../../fotos/Partoredjo4.jpg?w=1280&format=webp';
import partoredjo5 from '../../fotos/Partoredjo5.jpg?w=1280&format=webp';
import partoredjo6 from '../../fotos/Partoredjo6.jpg?w=1280&format=webp';
import natalieDiemen1 from '../../fotos/natalie diemen 1.jpg?w=1280&format=webp';
import natalieDiemen2 from '../../fotos/nataliediemen2.jpg?w=1280&format=webp';
import karinAmsterdam1 from '../../fotos/karin amsterdam1.jpg?w=1280&format=webp';
import karinAmsterdam2 from '../../fotos/karinamsterdam2.jpg?w=1280&format=webp';
import karinAmsterdam3 from '../../fotos/karinamsterdam 3.jpg?w=1280&format=webp';
import joostAmsterdamReview from '../../fotos/joost amsterdam review.png?w=1280&format=webp';
import type { Language } from '../i18n/translations';

// What is visible in the review photos that are not in the photo library.
export const reviewPhotoAlt: Record<string, { nl: string; en: string }> = {
  [joostAmsterdamReview]: { nl: 'Aanbouw van rode baksteen met groene kozijnen en een tuindeur, aan een houten vlonder', en: 'Red-brick extension with green window frames and a garden door, next to wooden decking' },
  [karinAmsterdam1]: { nl: 'Bakstenen gevel met witte kozijnen, een tuindeur en een groot raam aan een terras', en: 'Brick facade with white window frames, a garden door and a large window on a terrace' },
  [karinAmsterdam2]: { nl: 'Terras met lichte vlonderplanken en witte openslaande deuren, verlicht in de avond', en: 'Terrace with light decking boards and white French doors, lit in the evening' },
  [karinAmsterdam3]: { nl: 'Woonkamer met verhoogde houten vloer, inbouwspots en openslaande deuren naar een balkon', en: 'Living room with a raised wooden floor, recessed spotlights and French doors to a balcony' },
};

export interface Review {
  id: string;
  name: string;
  city?: string;
  rating: number;
  date: string;
  project: string;
  text: string;
  images?: string[];
}

export interface PublishedReview {
  id: string;
  name: string;
  city: string;
  rating: number;
  project: string;
  text: string;
  createdAt: string;
}

export const reviews: Review[] = [
  { id: 'nikie-volkers-2026', name: 'Nikie Volkers', rating: 5, date: '7 oktober 2026', project: 'Badkamer laten plaatsen', text: 'Wij hebben onze badkamer laten plaatsen door Dennis. Top aannemer met fantastische alleskunners in dienst. Goede communicatie, prima prijs-kwaliteitverhouding en afspraken worden nagekomen.\n\nWij vonden het erg fijn dat één persoon eigenlijk alle verschillende klussen deed: van loodgieterswerk, elektra, tegels zetten, Mariusz deed alles en echt goed.\n\nHoeken in verstek gezaagd, een betegeld stopcontact, echt vakwerk!', images: ['/nikie-badkamer.jpg', '/nikie-detail.jpg'] },
  { id: 'joost-2021', name: 'Joost', city: 'Amsterdam', rating: 4, date: '22 september 2021', project: 'Aanbouw plaatsen: 5 m²; Ja; Plat dak', text: 'Erg tevreden met Dennis van Denra Bouw. In april offerte aangevraagd en viel lager uit dan in eerste instantie geschat, wat zijn eerlijkheid aangaf. In juni begonnen met een aanbouw die tot en met augustus duurde. Erg tevreden met de kwaliteit en zeker de communicatie. Erg helder en altijd bereikbaar. Ook meerwerk was in overleg goed en snel te realiseren. Ze denken mee met wat handig is voor de aanbouw met locaties als water en stroom. Eerlijke prijs en goeie communicatie zijn echt de basis voor hun werkzaamheden, erg tevreden!', images: [joostAmsterdamReview] },
  { id: 'carlo-2021', name: 'Carlo', city: 'Almere', rating: 5, date: '27 juli 2021', project: 'Aanbouw plaatsen: 10 m²; Ja; Plat dak', text: 'Heel prettig bedrijf, de mannen werken hard en denken goed mee. Kwaliteit van het werk is zeer goed, ook maken ze tijd voor wensen die tussentijds veranderen of erbij komen.', images: [] },
  { id: 'effendi-2021', name: 'Effendi', city: 'Amsterdam', rating: 5, date: '7 april 2021', project: 'Aanbouw plaatsen: 20 m²; In overleg; Plat dak met terras erop', text: 'Bij het bouwen van onze uitbouw zijn er een aantal tegenslagen geweest die naar tevredenheid uitgesproken en opgelost zijn. Tijdens de bouw bleek dat wij over de erfgrens zouden bouwen. Onacceptabel voor de buren. Denra heeft samen met de constructeur een nieuwe waterdichte constructie bedacht voor een eigen muur. Bij het openbreken van onze buitenmuur bleek de constructie van de woning toch anders dan de bouwtekening. Ook dit is opgelost. Deze tegenslagen, corona en de strenge winter hebben er wel toe geleid dat de bouw 3x langer duurde dan voorzien. Verder fijn dat Denra een door ons gekochte lichtstraat wel wilde plaatsen. De mannen zijn kundig, goed aan te spreken en denken mee. Tip: laat de mannen zelf nameten en gebruik hun constructeur (indien nodig).', images: [] },
  { id: 'karin-2021', name: 'Karin', city: 'Amsterdam', rating: 5, date: '20 maart 2021', project: 'Aanbouw plaatsen: 10 m²; Nee; Plat dak', text: 'Prachtige uitbouw gemaakt, vakkundig en precies. Netjes gewerkt, met kwalitatief goede materialen. Prettige communiceren.', images: [karinAmsterdam1, karinAmsterdam2, karinAmsterdam3] },
  { id: 'pieter-2019', name: 'Pieter', city: 'Amsterdam', rating: 5, date: '5 november 2019', project: 'Huisrenovatie: Badkamer / Toilet, Keuken, Slaapkamer(s)', text: 'Zeer vakkundige en betrouwbare partij, uitstekende communicatie, goed advies over werkzaamheden en materiaal.', images: [] },
  { id: 'werkspot-gebruiker-2019', name: 'Werkspot-gebruiker uit Amsterdam', city: 'Amsterdam', rating: 4, date: '21 juni 2019', project: 'Toilet renovatie: 2 m²; Staand', text: 'Zeer prettig contact met Dennis en zijn collega. Dennis houdt zich aan de afspraken en is ook goed bereikbaar. De klus is keurig uitgevoerd en ik zou de volgende keer weer van zijn diensten gebruik willen maken. Jola', images: [] },
  { id: 'natalie-2019', name: 'Natalie', city: 'Diemen', rating: 5, date: '10 april 2019', project: 'Badkamer: Complete renovatie; 6 m²', text: 'Vanaf eerste contact goede indruk. Op de dag van de bezichtiging vooraf nog even gebeld, of de afspraak nog uitkwam. Na bezichtiging snel een heldere gespecificeerde offerte. Snelle en nette afhandeling van alle werkzaamheden in de badkamer, van slopen tot aan afmonteren, binnen 8 werkdagen met een goede kwaliteit. Bij oplevering alles netjes opgeruimd en schoongemaakt. Fijne communicatie via WhatsApp. Afspraken worden netjes nagekomen. Top gedaan!!!', images: [natalieDiemen1, natalieDiemen2] },
  { id: 'mohhemed-2019', name: 'Mohhemed', rating: 5, date: '29 maart 2019', project: 'Camera en alarm Installatie', text: 'Zeer vriendelijk ben ook tevreden met het werk wat geleverd is. Mooie camera beelden en werk handig met de app. Top installatie aanrader', images: [] },
  { id: 'laila-2019', name: 'Laila', rating: 5, date: '11 maart 2019', project: 'Renovatie woning en badkamer', text: 'Mooi en snel resultaat zoals beloofd!', images: [] },
  { id: 'partoredjo-2019', name: 'Partoredjo', rating: 5, date: '27 februari 2019', project: 'Volledige Renovatie badkamer', text: 'Ontzettend blij met dit bedrijf! De planning was om binnen 3 weken een volledige badkamer op te leveren, dit is uiteindelijk binnen 2 weken gerealiseerd. Kwaliteit van oplevering is volledig naar wens en we zijn altijd op de hoogte gehouden van de voortgang. Bedankt mannen!', images: [partoredjo1, partoredjo2, partoredjo3, partoredjo4, partoredjo5, partoredjo6] },
  { id: 'denra-montage-2019', name: 'Klant van Denra montage en onderhoud', rating: 5, date: '7 januari 2019', project: 'Badkamer renovatie en stucwerk hele woning.', text: 'Goed meedenkend bedrijf! Wij hebben samen een plan van aanpak gemaakt. Tijdens de werkzaamheden in de badkamer hebben wij besloten voor meerwerk (stucwerk voor de gehele woning) mooie badkamer en strak stucwerk afgeleverd! Dennis is altijd transparant en goed bereikbaar geweest. In de zomer hebben wij nog meer verbouwplannen en zullen dan zeker weer gebruik maken van Denra montage & onderhoud. Kortom een aanrader...', images: [] },
  { id: 'mr-c-elmas-2019', name: 'Mr C Elmas', rating: 5, date: '7 januari 2019', project: 'Stucwerk, latexspuitwerk, spotjes, schilderwerk binnen', text: 'Zeer prettige ervaring met Denra Montage. Meerdere aannemers over de vloer gehad maar Dennis maakte door zijn eerlijke manier van communiceren en plan van aanpak het verschil. Afspraak is afspraak met Dennis wat ik als zeer prettig heb ervaren. Oplevering is conform afspraak en tijd opgeleverd. Voor andere klussen zal ik wederom gebruik maken van zijn diensten of hem aanbevelen bij vrienden/collega\'s.', images: [] },
  { id: 'danielle-2018', name: 'Danielle', city: 'Almere', rating: 3, date: '21 december 2018', project: 'Badkamer: Nieuwe badkamer; 6 m²', text: 'De communicatie was prima, de klus is niet door gegaan omdat de bouw van het huis en zijn tegenslagen dit nu nog niet toelaten. Daarom 1 ster voor kwaliteit en prijs. Dit kan ik niet beoordelen. Verder prima overleg geweest.', images: [] },
];

const englishMonths: Record<string, string> = {
  januari: 'January', februari: 'February', maart: 'March', april: 'April', mei: 'May', juni: 'June',
  juli: 'July', augustus: 'August', september: 'September', oktober: 'October', november: 'November', december: 'December',
};

const monthNumbers: Record<string, number> = {
  januari: 0, februari: 1, maart: 2, april: 3, mei: 4, juni: 5,
  juli: 6, augustus: 7, september: 8, oktober: 9, november: 10, december: 11,
};

function reviewTimestamp({ id, date }: Review): number {
  const match = /^(\d{1,2}) ([a-z]+) (\d{4})$/.exec(date);
  if (!match || monthNumbers[match[2]] === undefined) {
    throw new Error(`Review "${id}" has an invalid date: "${date}".`);
  }

  const [, day, month, year] = match;
  return Date.UTC(Number(year), monthNumbers[month], Number(day));
}

const byNewestThenId = (first: { timestamp: number; review: Review }, second: { timestamp: number; review: Review }) =>
  second.timestamp - first.timestamp || first.review.id.localeCompare(second.review.id);

export function getReviews(language: Language): Review[] {
  return reviews
    .map((review) => ({ timestamp: reviewTimestamp(review), review }))
    .sort(byNewestThenId)
    .map(({ review }) => formatReviewForLanguage(review, language));
}

const normalise = (value: string) => value.toLowerCase().replace(/\s+/g, ' ').trim();

/**
 * Combines the reviews in this file with reviews approved through the
 * website. A submitted review with the same name and text as one in this
 * file is shown once. Newest first; reviews from the same day keep a fixed
 * order (by id) so the list never jumps between visits.
 */
export function mergePublishedReviews(staticReviews: Review[], publishedReviews: PublishedReview[], language: Language): Review[] {
  const known = new Set(staticReviews.map((review) => `${normalise(review.name)}|${normalise(review.text)}`));
  const published = publishedReviews.flatMap((review) => {
    const timestamp = Date.parse(review.createdAt);
    if (Number.isNaN(timestamp)) {
      console.error(`Published review "${review.id}" has an invalid creation date; it is not shown.`);
      return [];
    }
    if (known.has(`${normalise(review.name)}|${normalise(review.text)}`)) return [];

    return [{
      timestamp,
      review: {
        id: review.id,
        name: review.name,
        city: review.city,
        rating: review.rating,
        project: review.project,
        text: review.text,
        date: new Intl.DateTimeFormat(language === 'nl' ? 'nl-NL' : 'en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'UTC',
        }).format(new Date(review.createdAt)),
      },
    }];
  });

  return [
    ...staticReviews.map((review) => ({ timestamp: reviewTimestamp(review), review: formatReviewForLanguage(review, language) })),
    ...published,
  ]
    .sort(byNewestThenId)
    .map(({ review }) => review);
}

/** Average star rating, rounded to one decimal; null when there are no reviews. */
export function averageRating(list: Review[]): number | null {
  if (!list.length) return null;
  return Math.round((list.reduce((sum, review) => sum + review.rating, 0) / list.length) * 10) / 10;
}

function formatReviewForLanguage(review: Review, language: Language): Review {
  return {
    ...review,
    date: language === 'nl'
      ? review.date
      : review.date.replace(/januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december/, (month) => englishMonths[month]),
  };
}

export function reviewCategory(review: Review): 'Badkamer' | 'Toilet' | 'Renovatie' | 'Aanbouw' {
  const project = review.project.toLowerCase();
  if (project.includes('aanbouw')) return 'Aanbouw';
  if (project.includes('toilet')) return 'Toilet';
  if (project.includes('badkamer')) return 'Badkamer';
  return 'Renovatie';
}
