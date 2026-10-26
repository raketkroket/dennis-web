import { photoLibrary } from './photoLibrary';

// Alt text for the built-in photos: what is visible in each photo, nothing
// more (no materials, brands or places that cannot be seen). Photos uploaded
// in the admin get their alt text there (Foto's → Beschrijving).
export const photoAlt: Record<string, { nl: string; en: string }> = {
  'badkamer-1': { nl: 'Badkamer met twee witte waskommen op een zwart werkblad, een spiegel en een inloopdouche met zwarte kraan', en: 'Bathroom with two white basins on a black worktop, a mirror and a walk-in shower with a black tap' },
  'badkamer-2': { nl: 'Zwevend wastafelblad in natuursteenlook met waskom en een ovale spiegel met verlichting onder een schuin dak', en: 'Floating stone-look vanity with a basin and an oval illuminated mirror under a sloping roof' },
  'badkamer-3': { nl: 'Zolderbadkamer met hangtoilet, glazen douchecabine en inbouwspots', en: 'Attic bathroom with a wall-hung toilet, glass shower enclosure and recessed spotlights' },
  'badkamer-5': { nl: 'Zolderbadkamer met vrijstaand bad, waskommen op een zwart werkblad en een inloopdouche met glaswand', en: 'Attic bathroom with a freestanding bath, basins on a black worktop and a walk-in shower with a glass screen' },
  'badkamer-7': { nl: 'Badkamer met houten wastafelmeubel, ronde verlichte spiegel en glazen douchewand', en: 'Bathroom with a wooden vanity unit, round illuminated mirror and glass shower screen' },
  'badkamer-48': { nl: 'Inloopdouche met douchestang, verlichte nis en een betegelde zitbank', en: 'Walk-in shower with a shower rail, lit niche and a tiled bench' },
  'badkamer-66': { nl: 'Ruime inloopdouche met glazen wand, zwarte regendouche, handdoekradiator en nis', en: 'Spacious walk-in shower with a glass screen, black rain shower, towel radiator and niche' },
  'badkamer-77': { nl: 'Zolderbadkamer met hangtoilet, douchecabine met messing profielen en nis', en: 'Attic bathroom with a wall-hung toilet, shower enclosure with brass frames and a niche' },
  'badkamer-88': { nl: 'Wit hoekbad met zwarte kraan en handdouche onder een raam', en: 'White corner bath with a black tap and hand shower under a window' },
  'badkamer-89': { nl: 'Zolderbadkamer met twee dakramen, glazen schuifdeur naar de douche en verlichte nis', en: 'Attic bathroom with two roof windows, a glass sliding shower door and a lit niche' },
  'badkamer-99': { nl: 'Badkamer met verlichte spiegel, witte waskom op zwart werkblad en een douche met zwarte kranen', en: 'Bathroom with an illuminated mirror, white basin on a black worktop and a shower with black fittings' },
  'badkamer-790': { nl: 'Douchehoek met thermostaatkraan, douchestang, nis en designradiator', en: 'Shower corner with a thermostatic mixer, shower rail, niche and designer radiator' },
  'badkamer-denra-5': { nl: 'Twee witte waskommen op een marmerlook werkblad met zwarte wandkranen en ronde verlichte spiegels', en: 'Two white basins on a marble-look worktop with black wall-mounted taps and round illuminated mirrors' },
  'badkamer-dennis-1': { nl: 'Badkamer met vrijstaand bad, houten wastafelmeubel met twee waskommen en ovale verlichte spiegels', en: 'Bathroom with a freestanding bath, wooden vanity with two basins and oval illuminated mirrors' },
  'badkamer-dennis-2': { nl: 'Lichte badkamer met hangtoilet, wit wastafelmeubel, ronde spiegel en douche met zwarte glaswand', en: 'Light bathroom with a wall-hung toilet, white vanity, round mirror and a shower with a black-framed glass screen' },
  'badkamer-dennis-3': { nl: 'Badkamer met vrijstaand bad achter een halfhoge wand, verlichte nissen en waskommen op hout', en: 'Bathroom with a freestanding bath behind a half-height wall, lit niches and basins on wood' },
  'badkamer-dennis-4': { nl: 'Inloopdouche met natuursteenlook tegels, twee regendouches, verlichte nissen en zitbank', en: 'Walk-in shower with stone-look tiles, two rain showers, lit niches and a bench' },
  'badkamer-dennis-6': { nl: 'Dubbele witte wastafel op houten meubel met spiegelkast en zwarte kranen', en: 'Double white washbasin on a wooden unit with a mirror cabinet and black taps' },
  'badkamer-dennis-7': { nl: 'Vakman aan het werk in een douche met groene wandtegels en terrazzo vloer', en: 'Tradesman at work in a shower with green wall tiles and a terrazzo floor' },
  'badkamer-dennis-9': { nl: 'Badkamer met zwart wastafelmeubel, zwart hangtoilet, handdoekradiator en douchewand met zwart profiel', en: 'Bathroom with a black vanity unit, black wall-hung toilet, towel radiator and a black-framed shower screen' },
  'badkamer-dennis-10': { nl: 'Wit zwevend wastafelmeubel met twee waskommen, verlichte spiegel en designradiator', en: 'White floating vanity with two basins, illuminated mirror and designer radiator' },
  'badkamer-dennis-11': { nl: 'Vakman bij een wastafel in een zolderbadkamer met ligbad en hangtoilet', en: 'Tradesman at a washbasin in an attic bathroom with a bath and wall-hung toilet' },
  'badkamer-dennis-13': { nl: 'Badkamer met groene wandtegels, zwart wastafelmeubel met twee waskommen, ronde spiegel en terrazzo vloer', en: 'Bathroom with green wall tiles, a black vanity with two basins, round mirror and terrazzo floor' },
  'badkamer-amersfoort': { nl: 'Badkamer met grijze tegels, zwevend wit wastafelmeubel en ronde spiegel', en: 'Bathroom with grey tiles, a floating white vanity and a round mirror' },
  'wc-4': { nl: 'Toilet met zwart hangtoilet, inbouwreservoir met plank en zwart bedieningspaneel', en: 'Toilet room with a black wall-hung toilet, boxed-in cistern with shelf and a black flush plate' },
  'wc-5': { nl: 'Toilet met ingebouwde houten planken in een nis boven een wit bedieningspaneel', en: 'Toilet room with built-in wooden shelves in a niche above a white flush plate' },
  'wc-6': { nl: 'Toilet met hangtoilet, fonteintje met goudkleurige kraan en verlichte plank', en: 'Toilet room with a wall-hung toilet, small handbasin with a gold-coloured tap and a lit shelf' },
  'wc-000': { nl: 'Toilet met zwart hangtoilet, groengrijze wanden, houten plank en raampje', en: 'Toilet room with a black wall-hung toilet, green-grey walls, a wooden shelf and a small window' },
  'wc-534': { nl: 'Hangtoilet en douche met donkere wandtegels en een houtlook vloer', en: 'Wall-hung toilet and shower with dark wall tiles and a wood-look floor' },
  'wc-980': { nl: 'Toilet met natuursteenlook wand, verlichte nis, hangtoilet en fonteintje', en: 'Toilet room with a stone-look wall, lit niche, wall-hung toilet and small handbasin' },
  'wc-72934': { nl: 'Toilet met hangtoilet, houten planken in een nis en een houten kastwand', en: 'Toilet room with a wall-hung toilet, wooden shelves in a niche and a wooden cabinet wall' },
  'wc-reno-1': { nl: 'Toilet met verlichte nis, houtlook wand, hangtoilet en fonteintje', en: 'Toilet room with a lit niche, wood-look wall, wall-hung toilet and small handbasin' },
  'binnen': { nl: 'Lege kamer met wandpanelen, inbouwspots en een lichte vloer', en: 'Empty room with wall panelling, recessed spotlights and a light floor' },
  'binnen-22': { nl: 'Lege kamer met houten vloer, witte wanden en een raam', en: 'Empty room with a wooden floor, white walls and a window' },
  'binnen-34': { nl: 'Ruimte met ingebouwde kastenwand, wandlampen en een visgraatvloer', en: 'Room with a built-in wardrobe wall, wall lights and a herringbone floor' },
  'binnen-56': { nl: 'Lichte kamer met houten vloer en grote ramen', en: 'Bright room with a wooden floor and large windows' },
  'binnen-223': { nl: 'Kamer met wandpanelen in lichte tint en inbouwspots', en: 'Room with light-coloured wall panelling and recessed spotlights' },
  'binnen-890': { nl: 'Ruimte met wandpanelen, visgraatvloer en glazen deuren', en: 'Room with wall panelling, a herringbone floor and glass doors' },
  'binnen-slaapkamer-1': { nl: 'Slaapkamer met witte deuren, houten vloer en een bed op de voorgrond', en: 'Bedroom with white doors, a wooden floor and a bed in the foreground' },
  'binnen-slaapkamer-99': { nl: 'Slaapkamer met behang achter het bed, nachtkastjes met lampen en een raam', en: 'Bedroom with wallpaper behind the bed, bedside tables with lamps and a window' },
  'binnen-woonkamer-56': { nl: 'Lange woonruimte met houten vloer, inbouwspots en een open keuken', en: 'Long living space with a wooden floor, recessed spotlights and an open kitchen' },
  'binnenrenovatie-1': { nl: 'Zolderkamer met dakraam, lichte vloer, dressoir en planten', en: 'Attic room with a roof window, light floor, sideboard and plants' },
  'binnenrenovatie-2': { nl: 'Lange gang met houten vloer en inbouwspots richting een keuken', en: 'Long hallway with a wooden floor and recessed spotlights leading to a kitchen' },
  'binnenrenovatie-3': { nl: 'Zolderslaapkamer met dakraam, visgraatvloer en tweepersoonsbed', en: 'Attic bedroom with a roof window, herringbone floor and double bed' },
  'partoredjo-1': { nl: 'Regendouche met koperkleurige thermostaatkraan tegen grijze tegels', en: 'Rain shower with a copper-coloured thermostatic mixer against grey tiles' },
  'partoredjo-2': { nl: 'Badkamer met grijze tegels, hangtoilet en wastafel op een zwart onderstel', en: 'Bathroom with grey tiles, a wall-hung toilet and a washbasin on a black frame' },
  'partoredjo-3': { nl: 'Wastafel met koperkleurige kraan, spiegel en regendouche in een grijs betegelde badkamer', en: 'Washbasin with a copper-coloured tap, mirror and rain shower in a grey-tiled bathroom' },
  'partoredjo-4': { nl: 'Badkamer tijdens de verbouwing: kale wanden en leidingwerk', en: 'Bathroom during the renovation: bare walls and pipework' },
  'partoredjo-5': { nl: 'Zwarte handdoekradiator tegen grijze tegels', en: 'Black towel radiator against grey tiles' },
  'partoredjo-6': { nl: 'Grijs betegelde badkamer met inloopdouche, glaswand en wastafel met koperkleurige kraan', en: 'Grey-tiled bathroom with a walk-in shower, glass screen and washbasin with a copper-coloured tap' },
  'natalie-diemen-1': { nl: 'Wastafelmeubel met spiegel, planchet en witte handdoekradiator', en: 'Vanity unit with a mirror, shelf and white towel radiator' },
  'natalie-diemen-2': { nl: 'Inloopdouche met getinte glaswand en zwarte douchekranen', en: 'Walk-in shower with a tinted glass screen and black shower fittings' },
  'nikie-badkamer': { nl: 'Inloopdouche met douchestang naast een betegeld ligbad', en: 'Walk-in shower with a shower rail next to a tiled-in bath' },
  'nikie-detail': { nl: 'Dubbel stopcontact strak in het tegelwerk verwerkt', en: 'Double socket set neatly into the tiling' },
};

const keyBySrc = new Map(Object.entries(photoLibrary).map(([key, image]) => [image.src, key]));

/** Alt text for a built-in photo by its URL, or undefined for other images. */
export function altForSrc(src: string, language: 'nl' | 'en'): string | undefined {
  const key = keyBySrc.get(src);
  return key ? photoAlt[key]?.[language] : undefined;
}
