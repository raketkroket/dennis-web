import partoredjo1 from '../../fotos/Partoredjo1.jpg';
import partoredjo2 from '../../fotos/Partoredjo2.jpg';
import partoredjo3 from '../../fotos/Partoredjo3.jpg';
import partoredjo4 from '../../fotos/Partoredjo4.jpg';
import partoredjo5 from '../../fotos/Partoredjo5.jpg';
import partoredjo6 from '../../fotos/Partoredjo6.jpg';
import natalieDiemen1 from '../../fotos/natalie diemen 1.jpg';
import natalieDiemen2 from '../../fotos/nataliediemen2.jpg';
import karinAmsterdam1 from '../../fotos/karin amsterdam1.jpg';
import karinAmsterdam2 from '../../fotos/karinamsterdam2.jpg';
import karinAmsterdam3 from '../../fotos/karinamsterdam 3.jpg';
import joostAmsterdamReview from '../../fotos/joost amsterdam review.png';

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
  { id: 'karin-2021', name: 'Karin', city: 'Amsterdam', rating: 5, date: '20 maart 2021', project: 'Aanbouw plaatsen: 10 m²; Nee; Plat dak', text: 'Prachtige uitbouw gemaakt, vakkundig en precies. Netjes gewerkt, met kwalitatief goede materialen. Prettige communiceren.', images: [karinAmsterdam1, karinAmsterdam2, karinAmsterdam3] },
  { id: 'pieter-2019', name: 'Pieter', city: 'Amsterdam', rating: 5, date: '5 november 2019', project: 'Huisrenovatie: Badkamer / Toilet, Keuken, Slaapkamer(s)', text: 'Zeer vakkundige en betrouwbare partij, uitstekende communicatie, goed advies over werkzaamheden en materiaal.', images: [] },
  { id: 'werkspot-gebruiker-2019', name: 'Werkspot-gebruiker', city: 'Amsterdam', rating: 4, date: '21 juni 2019', project: 'Toilet renovatie: 2 m²; Staand', text: 'Zeer prettig contact met Dennis en zijn collega. Dennis houdt zich aan de afspraken en is ook goed bereikbaar. De klus is keurig uitgevoerd en ik zou de volgende keer weer van zijn diensten gebruik willen maken. Jola', images: [] },
  { id: 'natalie-2019', name: 'Natalie', city: 'Diemen', rating: 5, date: '10 april 2019', project: 'Badkamer: Complete renovatie; 6 m²', text: 'Vanaf eerste contact goede indruk. Op de dag van de bezichtiging vooraf nog even gebeld, of de afspraak nog uitkwam. Na bezichtiging snel een heldere gespecificeerde offerte. Snelle en nette afhandeling van alle werkzaamheden in de badkamer, van slopen tot aan afmonteren, binnen 8 werkdagen met een goede kwaliteit. Bij oplevering alles netjes opgeruimd en schoongemaakt. Fijne communicatie via WhatsApp. Afspraken worden netjes nagekomen. Top gedaan!!!', images: [natalieDiemen1, natalieDiemen2] },
  { id: 'mohhemed-2019', name: 'Mohhemed', rating: 5, date: '29 maart 2019', project: 'Camera en alarm Installatie', text: 'Zeer vriendelijk ben ook tevreden met het werk wat geleverd is. Mooie camera beelden en werk handig met de app. Top installatie aanrader', images: [] },
  { id: 'laila-2019', name: 'Laila', rating: 5, date: '11 maart 2019', project: 'Renovatie woning en badkamer', text: 'Mooi en snel resultaat zoals beloofd!', images: [] },
  { id: 'partoredjo-2019', name: 'Partoredjo', rating: 5, date: '27 februari 2019', project: 'Volledige Renovatie badkamer', text: 'Ontzettend blij met dit bedrijf! De planning was om binnen 3 weken een volledige badkamer op te leveren, dit is uiteindelijk binnen 2 weken gerealiseerd. Kwaliteit van oplevering is volledig naar wens en we zijn altijd op de hoogte gehouden van de voortgang. Bedankt mannen!', images: [partoredjo1, partoredjo2, partoredjo3, partoredjo4, partoredjo5, partoredjo6] },
  { id: 'denra-montage-2019', name: 'Klant van Denra montage en onderhoud', rating: 5, date: '7 januari 2019', project: 'Badkamer renovatie en stucwerk hele woning.', text: 'Goed meedenkend bedrijf! Wij hebben samen een plan van aanpak gemaakt. Tijdens de werkzaamheden in de badkamer hebben wij besloten voor meerwerk (stucwerk voor de gehele woning) mooie badkamer en strak stucwerk afgeleverd! Dennis is altijd transparant en goed bereikbaar geweest. In de zomer hebben wij nog meer verbouwplannen en zullen dan zeker weer gebruik maken van Denra montage & onderhoud. Kortom een aanrader...', images: [] },
  { id: 'mr-c-elmas-2019', name: 'Mr C Elmas', rating: 5, date: '7 januari 2019', project: 'Stucwerk, latexspuitwerk, spotjes, schilderwerk binnen', text: 'Zeer prettige ervaring met Denra Montage. Meerdere aannemers over de vloer gehad maar Dennis maakte door zijn eerlijke manier van communiceren en plan van aanpak het verschil. Afspraak is afspraak met Dennis wat ik als zeer prettig heb ervaren. Oplevering is conform afspraak en tijd opgeleverd. Voor andere klussen zal ik wederom gebruik maken van zijn diensten of hem aanbevelen bij vrienden/collega\'s.', images: [] },
  { id: 'danielle-2018', name: 'Danielle', city: 'Almere', rating: 3, date: '21 december 2018', project: 'Badkamer: Nieuwe badkamer; 6 m²', text: 'De communicatie was prima, de klus is niet door gegaan omdat de bouw van het huis en zijn tegenslagen dit nu nog niet toelaten. Daarom 1 ster voor kwaliteit en prijs. Dit kan ik niet beoordelen. Verder prima overleg geweest.', images: [] },
  // DEMO / PLACEHOLDER REVIEWS — replace with verified customer reviews before production
  { id: 'demo-sanne-2026', name: 'Sanne', city: 'Almere', rating: 4, date: '18 augustus 2026', project: 'Complete badkamer renovatie', text: 'Erg blij met onze nieuwe badkamer. Alles is mooi afgewerkt en schoon achtergelaten.' },
  { id: 'demo-yassin-2026', name: 'Yassin', city: 'Amsterdam West', rating: 4, date: '2 juli 2026', project: 'Badkamer volledig renoveren', text: 'Van het slopen tot de laatste kitrand is alles zorgvuldig gedaan. We konden goed overleggen over de indeling en de inloopdouche is precies geworden zoals we wilden. Het voelt nu als een veel ruimere badkamer.' },
  { id: 'demo-linda-2026', name: 'Linda', city: 'Almere Poort', rating: 4, date: '16 juni 2026', project: 'Badkamer vernieuwen', text: 'Fijne mensen over de vloer gehad. De nieuwe tegels en wastafel maken echt verschil, wij zijn er blij mee.' },
  { id: 'demo-dinesh-2026', name: 'Dinesh', city: 'Amsterdam Noord', rating: 4, date: '28 mei 2026', project: 'Badkamer renovatie', text: 'Mooi werk geleverd, badkamer ziet er top uit.' },
  { id: 'demo-esra-2026', name: 'Esra', city: 'Almere Buiten', rating: 4, date: '9 april 2026', project: 'Badkamer plaatsen', text: 'Vooral de rustige manier van werken vonden wij prettig. Er werd meegedacht over de nis en de plek van de kranen. De afwerking past goed bij de rest van ons huis.' },
  { id: 'demo-joost-2026', name: 'Joost', city: 'Amsterdam Centrum', rating: 4, date: '21 maart 2026', project: 'Badkamer renovatie', text: 'Onze badkamer is compleet aangepakt. Goede keuzes gemaakt in sanitair en tegelwerk, en na afloop was alles opgeruimd. Heel blij mee.', images: [joostAmsterdamReview] },
  { id: 'demo-nadia-2026', name: 'Nadia', city: 'Almere Stad', rating: 3, date: '5 februari 2026', project: 'Badkamer volledig renoveren', text: 'De badkamer is netjes geworden en het resultaat ziet er goed uit. Voor ons duurden de werkzaamheden iets langer dan verwacht, maar er is zorgvuldig gewerkt.' },
  { id: 'demo-mark-2025', name: 'Mark', city: 'Zoetermeer', rating: 4, date: '14 december 2025', project: 'Badkamer vernieuwen', text: 'Netjes gedaan en fijn meegedacht met de kleine ruimte.' },
  { id: 'demo-samira-2025', name: 'Samira', city: 'Amsterdam Zuid', rating: 3, date: '30 oktober 2025', project: 'Complete badkamer renovatie', text: 'We zijn tevreden met de badkamer en vooral met de strakke tegelverdeling. Een klein detail bij het meubel had ik zelf achteraf anders gekozen, maar het geheel is prachtig geworden.' },
  { id: 'demo-peter-2025', name: 'Peter', city: 'Almere Overgooi', rating: 4, date: '12 september 2025', project: 'Badkamer renovatie', text: 'Dennis dacht praktisch mee over leidingwerk en de plaats van het bad. Daardoor hebben we meer ruimte overgehouden dan verwacht. De badkamer is rustig en degelijk afgewerkt.' },
  { id: 'demo-ayse-2025', name: 'Ayse', city: 'Amsterdam Oost', rating: 4, date: '27 juli 2025', project: 'Badkamer volledig renoveren', text: 'Nieuwe douche, wastafel en verlichting laten plaatsen. Het resultaat is heel verzorgd en de ruimte is veel lichter geworden.' },
  { id: 'demo-robin-2025', name: 'Robin', city: 'Almere', rating: 4, date: '8 juni 2025', project: 'Badkamer vernieuwen', text: 'De badkamer ziet er weer modern uit. Vooral de kranen en het meubel zijn mooi geworden.' },
  { id: 'demo-fatima-2025', name: 'Fatima', city: 'Amsterdam Noord', rating: 4, date: '19 april 2025', project: 'Badkamer renovatie', text: 'We wilden een praktische badkamer zonder dat het kil zou worden. Door de combinatie van warme tegels en het houtlook meubel is dat goed gelukt.' },
  { id: 'demo-kevin-2025', name: 'Kevin', city: 'Almere Poort', rating: 3, date: '3 maart 2025', project: 'Badkamer plaatsen', text: 'Prima uitgevoerd en de afspraken waren duidelijk. Wij geven niet snel vijf sterren, maar zijn gewoon erg tevreden met de nieuwe badkamer.' },
  { id: 'demo-anita-2025', name: 'Anita', city: 'Amsterdam West', rating: 4, date: '17 januari 2025', project: 'Complete badkamer renovatie', text: 'Van tevoren goed gekeken naar wat mogelijk was in onze oude badkamer. De inloopdouche en de extra bergruimte zijn een grote verbetering. Alles ziet er verzorgd uit.' },
  { id: 'demo-bart-2026', name: 'Bart', city: 'Almere Stad', rating: 4, date: '6 augustus 2026', project: 'Toilet renovatie', text: 'Toilet helemaal vernieuwd en keurig afgewerkt.' },
  { id: 'demo-merve-2026', name: 'Merve', city: 'Amsterdam', rating: 4, date: '11 juni 2026', project: 'Toilet verbouwen', text: 'Onze wc is veel moderner geworden. Het fonteintje en de tegels zijn mooi gekozen en er is netjes gewerkt.' },
  { id: 'demo-willem-2026', name: 'Willem', city: 'Almere Buiten', rating: 4, date: '24 april 2026', project: 'Toilet volledig vernieuwen', text: 'Kleine ruimte slim benut. Het hangende toilet geeft meteen een veel rustiger beeld.' },
  { id: 'demo-rachida-2026', name: 'Rachida', city: 'Amsterdam Oost', rating: 4, date: '15 februari 2026', project: 'Toilet renovatie', text: 'Heel blij met de nieuwe wc.' },
  { id: 'demo-thomas-2025', name: 'Thomas', city: 'Almere Overgooi', rating: 3, date: '22 november 2025', project: 'Toilet verbouwen', text: 'Goed werk geleverd. De werkzaamheden namen wat meer tijd dan wij dachten, maar het toilet is netjes en strak geworden.' },
  { id: 'demo-priya-2025', name: 'Priya', city: 'Amsterdam Centrum', rating: 3, date: '4 september 2025', project: 'Toilet renovatie', text: 'De oude wc is volledig aangepakt, inclusief leidingwerk en een nieuwe nis. Fijn dat er aandacht was voor de details in zo een kleine ruimte.' },
  { id: 'demo-emre-2025', name: 'Emre', city: 'Zoetermeer', rating: 2, date: '18 juli 2025', project: 'Toilet volledig vernieuwen', text: 'Snel en verzorgd uitgevoerd. De afwerking bij het fonteintje is mooi strak.' },
  { id: 'demo-kim-2025', name: 'Kim', city: 'Almere', rating: 2, date: '25 mei 2025', project: 'Toilet renovatie', text: 'Netjes werk en alles weer schoon achtergelaten.' },
  { id: 'demo-omar-2025', name: 'Omar', city: 'Amsterdam Zuid', rating: 3, date: '7 maart 2025', project: 'Toilet verbouwen', text: 'Wij wilden een rustige uitstraling met een hangend toilet en lichte tegels. Er is goed geluisterd naar wat we voor ogen hadden. Het resultaat past precies.' },
  { id: 'demo-inge-2025', name: 'Inge', city: 'Almere Poort', rating: 2, date: '13 januari 2025', project: 'Toilet renovatie', text: 'Onze wc is klein, maar voelt nu veel ruimer. Mooie materialen gebruikt en de afwerking rondom de nis is echt fraai.' },
];

export function reviewCategory(review: Review): 'Badkamer' | 'Toilet' | 'Renovatie' | 'Aanbouw' {
  const project = review.project.toLowerCase();
  if (project.includes('aanbouw')) return 'Aanbouw';
  if (project.includes('toilet')) return 'Toilet';
  if (project.includes('badkamer')) return 'Badkamer';
  return 'Renovatie';
}