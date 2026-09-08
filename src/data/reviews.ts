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

export const reviews: Review[] = [
  { id: 'carlo-2021', name: 'Carlo', city: 'Almere', rating: 5, date: '27 juli 2021', project: 'Aanbouw plaatsen: 10 m²; Ja; Plat dak', text: 'Heel prettig bedrijf, de mannen werken hard en denken goed mee. Kwaliteit van het werk is zeer goed, ook maken ze tijd voor wensen die tussentijds veranderen of erbij komen.', images: [] },
  { id: 'effendi-2021', name: 'Effendi', city: 'Amsterdam', rating: 5, date: '7 april 2021', project: 'Aanbouw plaatsen: 20 m²; In overleg; Plat dak met terras erop', text: 'Bij het bouwen van onze uitbouw zijn er een aantal tegenslagen geweest die naar tevredenheid uitgesproken en opgelost zijn. Tijdens de bouw bleek dat wij over de erfgrens zouden bouwen. Onacceptabel voor de buren. Denra heeft samen met de constructeur een nieuwe waterdichte constructie bedacht voor een eigen muur. Bij het openbreken van onze buitenmuur bleek de constructie van de woning toch anders dan de bouwtekening. Ook dit is opgelost. Deze tegenslagen, corona en de strenge winter hebben er wel toe geleid dat de bouw 3x langer duurde dan voorzien. Verder fijn dat Denra een door ons gekochte lichtstraat wel wilde plaatsen. De mannen zijn kundig, goed aan te spreken en denken mee. Tip: laat de mannen zelf nameten en gebruik hun constructeur (indien nodig).', images: [] },
  { id: 'karin-2021', name: 'Karin', city: 'Amsterdam', rating: 5, date: '20 maart 2021', project: 'Aanbouw plaatsen: 10 m²; Nee; Plat dak', text: 'Prachtige uitbouw gemaakt, vakkundig en precies. Netjes gewerkt, met kwalitatief goede materialen. Prettige communiceren.', images: [] },
  { id: 'pieter-2019', name: 'Pieter', city: 'Amsterdam', rating: 5, date: '5 november 2019', project: 'Huisrenovatie: Badkamer / Toilet, Keuken, Slaapkamer(s)', text: 'Zeer vakkundige en betrouwbare partij, uitstekende communicatie, goed advies over werkzaamheden en materiaal.', images: [] },
  { id: 'werkspot-gebruiker-2019', name: 'Werkspot-gebruiker', city: 'Amsterdam', rating: 4, date: '21 juni 2019', project: 'Toilet renovatie: 2 m²; Staand', text: 'Zeer prettig contact met Dennis en zijn collega. Dennis houdt zich aan de afspraken en is ook goed bereikbaar. De klus is keurig uitgevoerd en ik zou de volgende keer weer van zijn diensten gebruik willen maken. Jola', images: [] },
  { id: 'natalie-2019', name: 'Natalie', city: 'Diemen', rating: 5, date: '10 april 2019', project: 'Badkamer: Complete renovatie; 6 m²', text: 'Vanaf eerste contact goede indruk. Op de dag van de bezichtiging vooraf nog even gebeld, of de afspraak nog uitkwam. Na bezichtiging snel een heldere gespecificeerde offerte. Snelle en nette afhandeling van alle werkzaamheden in de badkamer, van slopen tot aan afmonteren, binnen 8 werkdagen met een goede kwaliteit. Bij oplevering alles netjes opgeruimd en schoongemaakt. Fijne communicatie via WhatsApp. Afspraken worden netjes nagekomen. Top gedaan!!!', images: [] },
  { id: 'mohhemed-2019', name: 'Mohhemed', rating: 5, date: '29 maart 2019', project: 'Camera en alarm Installatie', text: 'Zeer vriendelijk ben ook tevreden met het werk wat geleverd is. Mooie camera beelden en werk handig met de app. Top installatie aanrader', images: [] },
  { id: 'laila-2019', name: 'Laila', rating: 5, date: '11 maart 2019', project: 'Renovatie woning en badkamer', text: 'Mooi en snel resultaat zoals beloofd!', images: [] },
  { id: 'partoredjo-2019', name: 'Partoredjo', rating: 5, date: '27 februari 2019', project: 'Volledige Renovatie badkamer', text: 'Ontzettend blij met dit bedrijf! De planning was om binnen 3 weken een volledige badkamer op te leveren, dit is uiteindelijk binnen 2 weken gerealiseerd. Kwaliteit van oplevering is volledig naar wens en we zijn altijd op de hoogte gehouden van de voortgang. Bedankt mannen!', images: [] },
  { id: 'denra-montage-2019', name: 'Klant van Denra montage en onderhoud', rating: 5, date: '7 januari 2019', project: 'Badkamer renovatie en stucwerk hele woning.', text: 'Goed meedenkend bedrijf! Wij hebben samen een plan van aanpak gemaakt. Tijdens de werkzaamheden in de badkamer hebben wij besloten voor meerwerk (stucwerk voor de gehele woning) mooie badkamer en strak stucwerk afgeleverd! Dennis is altijd transparant en goed bereikbaar geweest. In de zomer hebben wij nog meer verbouwplannen en zullen dan zeker weer gebruik maken van Denra montage & onderhoud. Kortom een aanrader...', images: [] },
  { id: 'mr-c-elmas-2019', name: 'Mr C Elmas', rating: 5, date: '7 januari 2019', project: 'Stucwerk, latexspuitwerk, spotjes, schilderwerk binnen', text: 'Zeer prettige ervaring met Denra Montage. Meerdere aannemers over de vloer gehad maar Dennis maakte door zijn eerlijke manier van communiceren en plan van aanpak het verschil. Afspraak is afspraak met Dennis wat ik als zeer prettig heb ervaren. Oplevering is conform afspraak en tijd opgeleverd. Voor andere klussen zal ik wederom gebruik maken van zijn diensten of hem aanbevelen bij vrienden/collega\'s.', images: [] },
  { id: 'danielle-2018', name: 'Danielle', city: 'Almere', rating: 3, date: '21 december 2018', project: 'Badkamer: Nieuwe badkamer; 6 m²', text: 'De communicatie was prima, de klus is niet door gegaan omdat de bouw van het huis en zijn tegenslagen dit nu nog niet toelaten. Daarom 1 ster voor kwaliteit en prijs. Dit kan ik niet beoordelen. Verder prima overleg geweest.', images: [] },
];

export function reviewCategory(review: Review): 'Badkamer' | 'Toilet' | 'Renovatie' | 'Aanbouw' {
  const project = review.project.toLowerCase();
  if (project.includes('aanbouw')) return 'Aanbouw';
  if (project.includes('toilet')) return 'Toilet';
  if (project.includes('badkamer')) return 'Badkamer';
  return 'Renovatie';
}