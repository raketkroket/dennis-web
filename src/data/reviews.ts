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
  // Reviews from Denra's Google profile (Google Maps), copied word for word on 4 November 2026.
  { id: 'google-tanja-matic-2026', name: 'Tanja Matic', rating: 5, date: '30 oktober 2026', project: 'Google-review: renovatie appartement', text: 'Dennis en zijn team zijn fantastisch! Ze hebben ons hele appartement gerenoveerd, veel meer dan alleen de badkamers: muren, isolatie, bedrading, leidingen, vloerverwarming, nieuwe ramen... Het is twee jaar geleden afgerond en we genieten er nog steeds van. We hebben nog steeds contact met Dennis, wat een goed teken is, want veel mensen hebben na een renovatie een vreselijke ervaring met hun aannemers. Maar Dennis heeft een geweldig team! Onlangs hebben ze ook het hele appartement van een vriendin van mij gerenoveerd en zij is er ook erg blij mee. Absoluut een aanrader!', images: [] },
  { id: 'google-karim-m-2026', name: 'Karim M', rating: 5, date: '31 oktober 2026', project: 'Google-review: toiletrenovatie', text: 'Supertevreden met het eindresultaat van onze wc renovatie! Er is echt topwerk afgeleverd. Alles is netjes, vakkundig en tot in de puntjes afgewerkt. Het resultaat is zelfs mooier geworden dan verwacht. Je merkt dat hier mensen werken die verstand hebben van hun vak en oog hebben voor detail. Absoluut een aanrader voor iedereen!', images: [] },
  { id: 'google-tanisha-nielo-2026', name: 'Tanisha Nielo', rating: 5, date: '31 oktober 2026', project: 'Google-review: nieuwe badkamer', text: 'Super tevreden met mijn nieuwe badkamer!!! Alles is mooi en netjes afgewerkt. Binnenkort ook de wc laten doen, kan niet wachten op het resultaat ;)', images: [] },
  { id: 'google-lisandra-chacon-2026', name: 'Lisandra Chacon', rating: 5, date: '31 oktober 2026', project: 'Google-review: badkamers', text: 'Maakt mooie badkamers. Hij luistert ook goed naar de wensen van de klanten en speelt goed daarop in. Top vakman.', images: [] },
  { id: 'google-c-f-2026', name: 'C F', rating: 5, date: '31 oktober 2026', project: 'Google-review: badkamerrenovatie', text: 'Mijn badkamer laten renoveren en ontzettend blij met het eindresultaat! De luxe uitstraling, hoogwaardige materialen en prachtige afwerking maken het helemaal af. Het personeel werkt bijzonder netjes en zorgvuldig, met oog voor ieder detail. Echte vakmensen die kwaliteit leveren. Een absolute aanrader!', images: [] },
  { id: 'google-sama-blake-2026', name: 'Sama Blake', rating: 5, date: '31 oktober 2026', project: 'Google-review: badkamerrenovatie', text: 'Ontzettend tevreden met de renovatie van onze badkamer! Vanaf het eerste contact tot aan de oplevering verliep alles professioneel en prettig. Er werd goed meegedacht, duidelijk gecommuniceerd en vooral met veel zorg en oog voor detail gewerkt. Het vakmanschap is echt terug te zien in het eindresultaat. Alles is tot in de puntjes netjes afgewerkt en onze badkamer is werkelijk prachtig geworden, zelfs mooier dan we hadden verwacht! Betrouwbaar, vriendelijk, vakkundig en iemand die zijn afspraken nakomt. Wij zijn ontzettend blij met het resultaat en kunnen dit bedrijf dan ook van harte aanbevelen! Nogmaals bedankt voor het fantastische werk!', images: [] },
  { id: 'google-cenk-isiker-2026', name: 'Cenk Isiker', rating: 5, date: '31 oktober 2026', project: 'Google-review: badkamerrenovatie', text: 'Wij zijn ontzettend tevreden over Denra Badkamers! Onze badkamer is door hen volledig gerenoveerd en het resultaat is werkelijk prachtig geworden. Vanaf het eerste contact tot aan de oplevering hebben wij de samenwerking als zeer prettig ervaren. Er is netjes en professioneel gewerkt, er werd goed meegedacht en alles is met oog voor detail uitgevoerd. Het eindresultaat heeft onze verwachtingen overtroffen! Wij willen het hele team van Denra Badkamers bedanken voor het mooie werk en de fijne samenwerking. Een echte aanrader voor iedereen die op zoek is naar kwaliteit, vakmanschap en betrouwbaarheid! Bedankt Denra Badkamers voor onze prachtige nieuwe badkamer!', images: [] },
  { id: 'google-arr-sastro-2026', name: 'Arr Sastro', rating: 5, date: '31 oktober 2026', project: 'Google-review: toiletrenovatie', text: 'Denra Badkamers heeft bij mij de toiletten op de verdiepingen gerenoveerd. Geweldig gedaan, met een prachtig resultaat! Er is netjes en zorgvuldig gewerkt en de prijs-kwaliteitverhouding is eerlijk en goed. Ik ben ontzettend tevreden. Zeker een aanrader!', images: [] },
  { id: 'google-garib-merwan-2026', name: 'Garib Merwan', rating: 5, date: '31 oktober 2026', project: 'Google-review', text: 'Absoluut een aanrader! Wij zijn ontzettend tevreden over Denra Badkamers! Vanaf het eerste contact merk je dat je met een echte vakman te maken hebt. Er wordt goed meegedacht, duidelijk gecommuniceerd en vooral met veel zorg en oog voor detail gewerkt. Wat wij bijzonder waarderen, is de betrouwbaarheid, het vakmanschap en de persoonlijke betrokkenheid. Er wordt echt de tijd genomen om alles netjes en tot in de puntjes af te werken. Het eindresultaat is prachtig! Het is tegenwoordig niet vanzelfsprekend om iemand te vinden die kwaliteit levert en zijn afspraken nakomt. Daarom verdient Denra Badkamers wat ons betreft absoluut vijf sterren! Nogmaals ontzettend bedankt voor het mooie werk. Wij kunnen Denra Badkamers van harte aanbevelen!', images: [] },
  { id: 'google-latisha-doest-2026', name: 'Latisha Doest', rating: 5, date: '31 oktober 2026', project: 'Google-review', text: 'Geweldige service, makkelijk contact, zou ik zeker aanraden.', images: [] },
  { id: 'google-benireuven90-2026', name: 'BeniReuven90', rating: 5, date: '31 oktober 2026', project: 'Google-review', text: 'BESTE !!!', images: [] },
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
  // Reviews from before the 23 October 2026 redesign, restored word for word from commit a20b552 on 4 November 2026. The owner confirmed them as genuine customer reviews; no public source (Google or Werkspot) is recorded for them.
  { id: 'sanne-2026', name: 'Sanne', city: 'Almere', rating: 4, date: '18 augustus 2026', project: 'Complete badkamer renovatie', text: 'Erg blij met onze nieuwe badkamer. Dennis en zijn team werkten netjes, hielden ons goed op de hoogte en lieten alles schoon achter.' },
  { id: 'linda-2026', name: 'Linda', city: 'Almere Poort', rating: 4, date: '16 juni 2026', project: 'Badkamer vernieuwen', text: 'Fijne mensen over de vloer gehad. De nieuwe tegels en wastafel maken echt verschil, wij zijn er blij mee.' },
  { id: 'dinesh-2026', name: 'Dinesh', city: 'Amsterdam Noord', rating: 4, date: '28 mei 2026', project: 'Badkamer renovatie', text: 'Dennis en zijn team hebben mooi werk geleverd. De badkamer ziet er top uit en de afspraken waren helder.' },
  { id: 'mark-2025', name: 'Mark', city: 'Zoetermeer', rating: 4, date: '14 december 2025', project: 'Badkamer vernieuwen', text: 'Netjes gedaan en fijn meegedacht met de kleine ruimte.' },
  { id: 'samira-2025', name: 'Samira', city: 'Amsterdam Zuid', rating: 3, date: '30 oktober 2025', project: 'Complete badkamer renovatie', text: 'We zijn tevreden met de badkamer en vooral met de strakke tegelverdeling. Een klein detail bij het meubel had ik zelf achteraf anders gekozen, maar het geheel is prachtig geworden.' },
  { id: 'peter-2025', name: 'Peter', city: 'Almere Overgooi', rating: 4, date: '12 september 2025', project: 'Badkamer renovatie', text: 'Dennis dacht praktisch mee over leidingwerk en de plaats van het bad. Hij was transparant over wat mogelijk was en stemde de materialen goed af met de leverancier. Daardoor hebben we meer ruimte overgehouden dan verwacht.' },
  { id: 'ayse-2025', name: 'Ayse', city: 'Amsterdam Oost', rating: 4, date: '27 juli 2025', project: 'Badkamer volledig renoveren', text: 'Nieuwe douche, wastafel en verlichting laten plaatsen. Het resultaat is heel verzorgd en de ruimte is veel lichter geworden.' },
  { id: 'robin-2025', name: 'Robin', city: 'Almere', rating: 4, date: '8 juni 2025', project: 'Badkamer vernieuwen', text: 'De badkamer ziet er weer modern uit. Vooral de kranen en het meubel zijn mooi geworden.' },
  { id: 'kevin-2025', name: 'Kevin', city: 'Almere Poort', rating: 3, date: '3 maart 2025', project: 'Badkamer plaatsen', text: 'Prima uitgevoerd en de afspraken waren duidelijk. Wij geven niet snel vijf sterren, maar zijn gewoon erg tevreden met de nieuwe badkamer.' },
  { id: 'anita-2025', name: 'Anita', city: 'Amsterdam West', rating: 4, date: '17 januari 2025', project: 'Complete badkamer renovatie', text: 'Dennis en zijn team hebben vooraf goed gekeken naar wat mogelijk was in onze oude badkamer. De communicatie over planning en kosten was transparant. De inloopdouche en extra bergruimte zijn een grote verbetering.' },
  { id: 'bart-2026', name: 'Bart', city: 'Almere Stad', rating: 4, date: '6 augustus 2026', project: 'Toilet renovatie', text: 'Toilet helemaal vernieuwd en keurig afgewerkt.' },
  { id: 'willem-2026', name: 'Willem', city: 'Almere Buiten', rating: 4, date: '24 april 2026', project: 'Toilet volledig vernieuwen', text: 'Kleine ruimte slim benut. Het hangende toilet geeft meteen een veel rustiger beeld.' },
  { id: 'thomas-2025', name: 'Thomas', city: 'Almere Overgooi', rating: 3, date: '22 november 2025', project: 'Toilet verbouwen', text: 'Goed werk geleverd. De werkzaamheden namen wat meer tijd dan wij dachten, maar het toilet is netjes en strak geworden.' },
  { id: 'priya-2025', name: 'Priya', city: 'Amsterdam Centrum', rating: 3, date: '4 september 2025', project: 'Toilet renovatie', text: 'Dennis was helder over de planning en werkte prettig samen met de leverancier. De oude wc is volledig aangepakt, inclusief leidingwerk en een nieuwe nis. Fijn dat er aandacht was voor de details in zo een kleine ruimte.' },
  { id: 'emre-2025', name: 'Emre', city: 'Zoetermeer', rating: 2, date: '18 juli 2025', project: 'Toilet volledig vernieuwen', text: 'Snel en verzorgd uitgevoerd. De afwerking bij het fonteintje is mooi strak.' },
  { id: 'kim-2025', name: 'Kim', city: 'Almere', rating: 2, date: '25 mei 2025', project: 'Toilet renovatie', text: 'Netjes werk en alles weer schoon achtergelaten.' },
  { id: 'inge-2025', name: 'Inge', city: 'Almere Poort', rating: 2, date: '13 januari 2025', project: 'Toilet renovatie', text: 'Onze wc is klein, maar voelt nu veel ruimer. Mooie materialen gebruikt en de afwerking rondom de nis is echt fraai.' },
  { id: 'jason-2026', name: 'Jason', city: 'Amsterdam West', rating: 4, date: '2 juli 2026', project: 'Badkamer volledig renoveren', text: 'Van het slopen tot de laatste kitrand is alles zorgvuldig gedaan. Dennis was transparant over de keuzes en kosten, en zijn team dacht goed mee over de indeling. De inloopdouche is precies geworden zoals we wilden.' },
  { id: 'emma-2026', name: 'Emma', city: 'Almere Buiten', rating: 4, date: '9 april 2026', project: 'Badkamer plaatsen', text: 'Vooral de rustige manier van werken vonden wij prettig. Er werd meegedacht over de nis en de plek van de kranen. De afwerking past goed bij de rest van ons huis.' },
  { id: 'joost-2026', name: 'Joost', city: 'Amsterdam Centrum', rating: 4, date: '21 maart 2026', project: 'Badkamer renovatie', text: 'Onze badkamer is compleet aangepakt. Dennis hielp ons met goede keuzes in sanitair en tegelwerk en had een fijne samenwerking met de leverancier. Na afloop was alles opgeruimd. Heel blij mee.' },
  { id: 'britt-2026', name: 'Britt', city: 'Almere Stad', rating: 3, date: '5 februari 2026', project: 'Badkamer volledig renoveren', text: 'De badkamer is netjes geworden en het resultaat ziet er goed uit. Voor ons duurden de werkzaamheden iets langer dan verwacht, maar er is zorgvuldig gewerkt.' },
  { id: 'denise-2025', name: 'Denise', city: 'Amsterdam Noord', rating: 4, date: '19 april 2025', project: 'Badkamer renovatie', text: 'We wilden een praktische badkamer zonder dat het kil zou worden. Dennis nam rustig de tijd voor onze vragen en werkte prettig samen met de leverancier. Door de warme tegels en het houtlook meubel is dat goed gelukt.' },
  { id: 'melissa-2026', name: 'Melissa', city: 'Amsterdam', rating: 4, date: '11 juni 2026', project: 'Toilet verbouwen', text: 'Dennis en zijn team hebben netjes gewerkt. Het fonteintje en de tegels zijn mooi gekozen en onze wc is veel moderner geworden.' },
  { id: 'laura-2026', name: 'Laura', city: 'Amsterdam Oost', rating: 4, date: '15 februari 2026', project: 'Toilet renovatie', text: 'Heel blij met de nieuwe wc.' },
  { id: 'brian-2025', name: 'Brian', city: 'Amsterdam Zuid', rating: 3, date: '7 maart 2025', project: 'Toilet verbouwen', text: 'Wij wilden een rustige uitstraling met een hangend toilet en lichte tegels. Er is goed geluisterd naar wat we voor ogen hadden. Het resultaat past precies.' },
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

const dutchMonths = Object.keys(monthNumbers);

/** A review's date as YYYY-MM-DD, e.g. for a date field in the admin. */
export const reviewIsoDate = (review: Review) => new Date(reviewTimestamp(review)).toISOString().slice(0, 10);

/** "2026-10-31" → "31 oktober 2026", the format of the review dates above. */
export function dutchReviewDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} ${dutchMonths[month - 1]} ${year}`;
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
