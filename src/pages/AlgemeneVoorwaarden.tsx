import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const sections = [
  ['Artikel 1 - Identiteit en definities', [
    'Denra Badkamers en Renovaties, tevens handelend onder de naam Denra Badkamers, is de eenmanszaak van de heer D. Ramdayal, gevestigd aan Eva Besnyostraat 331, 1087 LG Amsterdam, ingeschreven in het Handelsregister onder KvK-nummer 68670397, hierna: Denra.',
    'Opdrachtgever is iedere natuurlijke persoon of rechtspersoon die met Denra onderhandelt, een aanbod ontvangt of een overeenkomst sluit. Consument is een opdrachtgever die handelt buiten zijn bedrijfs- of beroepsactiviteit. Zakelijke opdrachtgever is iedere andere opdrachtgever.',
    'Overeenkomst omvat iedere overeenkomst tot aanneming van werk, dienstverlening, koop en/of levering tussen Denra en opdrachtgever, met offerte, opdrachtbevestiging, tekeningen, werkomschrijving, meerwerkafspraken en deze voorwaarden. Schriftelijk omvat ook e-mail, WhatsApp of een ander duurzaam elektronisch communicatiemiddel waaruit inhoud en afzender voldoende blijken.',
  ]],
  ['Artikel 2 - Toepasselijkheid en rangorde', [
    'Deze voorwaarden gelden voor ieder aanbod, iedere overeenkomst en alle aanvullende of vervolgopdrachten van Denra. Voorwaarden van opdrachtgever worden uitdrukkelijk van de hand gewezen. Afwijkingen gelden uitsluitend wanneer Denra die schriftelijk heeft aanvaard en alleen voor de betreffende overeenkomst.',
    'Bij tegenstrijdigheid geldt de volgende rangorde: een door beide partijen ondertekende wijziging, de opdrachtbevestiging of offerte, de werkomschrijving en tekeningen, en daarna deze voorwaarden. Dwingendrechtelijke rechten van consumenten blijven steeds van toepassing.',
  ]],
  ['Artikel 3 - Aanbod, prijsindicatie en totstandkoming', [
    'Een aanbod is vrijblijvend totdat opdrachtgever het schriftelijk en ongewijzigd aanvaardt en Denra de opdracht schriftelijk bevestigt, dan wel feitelijk met instemming van opdrachtgever met uitvoering begint. Een aanbod is 30 dagen geldig, tenzij daarin anders staat.',
    'Online calculators, mondelinge prijzen, globale begrotingen en prijsindicaties zijn geen bindende vaste aanneemsom. Alleen een schriftelijke offerte waarin uitdrukkelijk vaste prijs staat, geldt als vaste prijs voor de daarin precies omschreven omvang.',
    'Kennelijke schrijf-, reken- of meetfouten, evidente omissies en vergissingen binden Denra niet. Afbeeldingen, renders, 3D-ontwerpen, stalen en sfeerbeelden zijn indicatief; normale kleur-, glans-, nerf-, voeg-, maat- en structuurverschillen vormen geen gebrek.',
    'De overeenkomst omvat uitsluitend uitdrukkelijk beschreven posten. Sloop, herstel van verborgen ondergronden, constructief werk, asbest, vergunningen, verplaatsing van nutsvoorzieningen, hak- en breekwerk, afvoer, schilderwerk, kitwerk, elektra, ventilatie, tijdelijke voorzieningen en schoonmaak zijn alleen inbegrepen als dat expliciet is vermeld.',
  ]],
  ['Artikel 4 - Herroeping bij consumenten', [
    'Sluit een consument de overeenkomst op afstand of buiten de verkoopruimte, dan kan hij de overeenkomst gedurende 14 dagen zonder opgave van redenen herroepen, tenzij een wettelijke uitzondering geldt. Denra verstrekt de wettelijk vereiste informatie en het model-herroepingsformulier.',
    'Denra begint binnen de herroepingstermijn alleen op uitdrukkelijk verzoek van de consument dat op een duurzame gegevensdrager is vastgelegd. Bij tijdige herroeping is de consument de wettelijk toegestane evenredige vergoeding verschuldigd voor wat tot dat moment is uitgevoerd.',
    'Een verzoek om spoedige aanvang, instemming met verlies van herroepingsrecht en eventuele maatwerkbevestiging worden afzonderlijk en aantoonbaar vastgelegd.',
  ]],
  ['Artikel 5 - Verplichtingen van opdrachtgever', [
    'Opdrachtgever zorgt tijdig en kosteloos voor vrije en veilige toegang, werkende elektriciteit, water, verwarming, sanitaire voorziening, opslagruimte, parkeren of parkeervergoeding en alle noodzakelijke informatie, maatvoering, toestemmingen en vergunningen.',
    'Opdrachtgever wijst voor aanvang alle bekende leidingen, kabels, vloerverwarming, constructiedelen, vochtproblemen, lekkages, asbestverdachte materialen en overige risico\'s schriftelijk aan. De werkplek moet leeg, bereikbaar en bouwrijp zijn.',
    'Opdrachtgever controleert keuzes, posities, draairichtingen, kleuren, tegelverdeling, sanitair, kranen, meubels en maatvoering vóór bestelling of montage. Schriftelijke goedkeuring is bindend, behoudens een voor Denra kenbare fout.',
  ]],
  ['Artikel 6 - Materialen van opdrachtgever en derden', [
    'Door opdrachtgever voorgeschreven, ingekochte of aangeleverde materialen, producten, ontwerpen en uitvoeringsmethoden zijn voor diens risico wat betreft geschiktheid, maatvoering, compleetheid, levertijd, compatibiliteit, garantie en gevolgschade. Denra voldoet aan haar wettelijke waarschuwingsplicht.',
    'Wachttijd, extra ritten, demontage, aanpassing of herstel door te late, onjuiste, beschadigde, onvolledige of ongeschikte klantmaterialen gelden als meerwerk. Voor rechtstreeks door opdrachtgever ingeschakelde derden is Denra niet verantwoordelijk.',
  ]],
  ['Artikel 7 - Uitvoering, planning en termijnen', [
    'Denra voert het werk uit naar goed vakmanschap en mag volgorde, methode en personeelsinzet bepalen. Denra mag geschikte werknemers, zelfstandigen, onderaannemers en leveranciers inschakelen.',
    'Opgegeven start-, uitvoerings- en oplevertermijnen zijn indicatief, tenzij uitdrukkelijk een fatale termijn is overeengekomen. De planning wordt verlengd door meerwerk, wijzigingen, wachttijd, droog- en uithardingstijden, weersomstandigheden, ziekte, leveringsproblemen, verborgen gebreken, overmacht, niet tijdige beslissingen of betalingen en omstandigheden in de risicosfeer van opdrachtgever of derden.',
    'Denra mag werkzaamheden stilleggen wanneer veilige, deugdelijke of wettige uitvoering niet mogelijk is. Bij aanneming van een bouwwerk wordt een waarschuwing over fouten, risico\'s, ongeschikte materialen of ondeugdelijke ondergrond schriftelijk, ondubbelzinnig en tijdig gegeven.',
  ]],
  ['Artikel 8 - Meerwerk, minderwerk en verborgen omstandigheden', [
    'Wijzigingen op verzoek van opdrachtgever en werkzaamheden die redelijkerwijs niet in de overeengekomen omvang zijn begrepen, gelden als meerwerk. Schriftelijke berichten, werkbonnen, foto\'s en mondelinge opdrachten die daarna schriftelijk zijn bevestigd, kunnen meerwerk bewijzen.',
    'Verborgen of onvoorziene omstandigheden, waaronder ondeugdelijke ondergronden, vocht, lekkage, rot, schimmel, asbest, afwijkende leidingloop, constructieve gebreken en eerdere ondeugdelijke werkzaamheden, geven recht op prijsaanpassing en termijnverlenging.',
    'Minderwerk wordt uitsluitend verrekend voor aantoonbare kostenbesparing. Reeds bestelde materialen, gereserveerde capaciteit, retourkosten en misgelopen inkoopvoordelen worden daarop in mindering gebracht.',
  ]],
  ['Artikel 9 - Prijzen en prijswijzigingen', [
    'Prijzen voor consumenten zijn inclusief btw, tenzij duidelijk anders vermeld. Prijzen voor zakelijke opdrachtgevers zijn exclusief btw, heffingen, parkeer-, reis-, afvoer- en verblijfskosten, tenzij anders overeengekomen.',
    'Bij regiewerk worden werkelijk bestede uren, materialen, materieel, onderaanneming en bijkomende kosten afgerekend tegen overeengekomen of gebruikelijke tarieven. Bij een richtprijs waarschuwt Denra tijdig zodra verdere overschrijding wordt verwacht.',
    'Bij een vaste aanneemsom kan Denra aanpassing verlangen voor kostenverhogende omstandigheden die na contractsluiting ontstaan of aan het licht komen en niet aan Denra zijn toe te rekenen, voor zover de wet of een uitdrukkelijke prijsindexeringsafspraak dit toestaat. Meerwerk is verschuldigd naast de aanneemsom.',
  ]],
  ['Artikel 10 - Facturering en betaling', [
    'Betaling vindt plaats volgens het termijnschema in de offerte. Zonder termijnschema mag Denra naar voortgang factureren en materialen vóór bestelling volledig laten betalen. Facturen zijn betaalbaar binnen 14 dagen na factuurdatum, tenzij schriftelijk anders overeengekomen.',
    'Betaling geschiedt zonder korting, verrekening of inhouding, voor consumenten uitsluitend voor zover wettelijk toegestaan. Bij gezamenlijke opdrachtgevers is ieder hoofdelijk aansprakelijk. Denra mag voldoende zekerheid, aanvullende aanbetaling of directe betaling van bestelde materialen verlangen bij redelijke twijfel over tijdige betaling.',
  ]],
  ['Artikel 11 - Te late betaling, opschorting en incasso', [
    'Een zakelijke opdrachtgever is na het verstrijken van de betalingstermijn zonder ingebrekestelling in verzuim en is wettelijke handelsrente en buitengerechtelijke incassokosten verschuldigd. Een consument is incassokosten verschuldigd nadat hij conform de wet kosteloos is aangemaand.',
    'Bij een opeisbare betalingsachterstand mag Denra werkzaamheden, bestellingen, leveringen, service en overige prestaties opschorten totdat volledige betaling en voldoende zekerheid zijn ontvangen. Redelijke kosten van stillegging, herplanning, opslag, terugkeer en prijsstijgingen komen voor rekening van opdrachtgever.',
  ]],
  ['Artikel 12 - Annulering en opzegging door opdrachtgever', [
    'Opdrachtgever kan een overeenkomst tot aanneming van werk opzeggen binnen de grenzen van de wet. Bij opzegging is de overeengekomen prijs verschuldigd, verminderd met de besparingen voor Denra.',
    'De vergoeding omvat in ieder geval verricht werk, voorbereiding, bestelde of niet-retourneerbare materialen, annulerings- en retourkosten, gereserveerde capaciteit, algemene kosten en winst voor zover wettelijk toegestaan. Verplaatsing of annulering van een geplande werkdag binnen 5 werkdagen vóór aanvang geeft recht aantoonbare schade in rekening te brengen.',
  ]],
  ['Artikel 13 - Opschorting en beëindiging door Denra', [
    'Denra mag uitvoering opschorten of de overeenkomst geheel of gedeeltelijk ontbinden wanneer opdrachtgever tekortschiet in betaling, medewerking, bereikbaarheid, veiligheid of informatieverstrekking, of wanneer voortzetting redelijkerwijs niet kan worden verlangd.',
    'Zonder nadere ingebrekestelling mag Denra passende maatregelen nemen bij faillissement, beslag, surseance, schuldsanering, bedrijfsbeëindiging, gegronde vrees voor niet-betaling, agressie, bedreiging, onveilige omstandigheden of onrechtmatige instructies. Verricht werk, bestelde materialen, gemaakte kosten en schade worden onmiddellijk opeisbaar.',
  ]],
  ['Artikel 14 - Oplevering en aanvaarding', [
    'Het werk is gereed voor oplevering zodra Denra dat schriftelijk meldt of opdrachtgever het werk in gebruik neemt. Opdrachtgever keurt het werk binnen 5 werkdagen na gereedmelding, of binnen een andere redelijke termijn, en meldt concrete gebreken of weigert gemotiveerd.',
    'Blijft reactie na een redelijke termijn uit, dan geldt het werk als stilzwijgend aanvaard en opgeleverd voor zover artikel 7:758 BW dit toestaat. Kleine gebreken die ingebruikneming niet verhinderen, zijn geen grond om oplevering of betaling van het volledige niet-betwiste bedrag te weigeren.',
  ]],
  ['Artikel 15 - Klachten en recht op herstel', [
    'Opdrachtgever meldt een ontdekt gebrek zo spoedig mogelijk schriftelijk, nauwkeurig omschreven en voorzien van relevante informatie. Voor consumenten geldt de wettelijke klachttermijn; een melding binnen twee maanden na ontdekking is in ieder geval tijdig voor zover die regel van toepassing is.',
    'Opdrachtgever beperkt schade en stelt Denra in staat het gebrek te onderzoeken en, indien Denra verantwoordelijk is, zelf binnen een redelijke termijn te herstellen. Ongegronde meldingen, vergeefse bezoeken en onderzoek naar niet aan Denra toe te rekenen oorzaken mogen tegen het geldende tarief worden berekend, mits vooraf geïnformeerd waar wettelijk vereist.',
  ]],
  ['Artikel 16 - Garantie en volledige betaling', [
    'Een aanvullende contractuele garantie geldt uitsluitend indien duur en omvang schriftelijk in offerte, opdrachtbevestiging of garantiebewijs zijn vermeld. Deze garantie komt bovenop dwingendrechtelijke rechten van consumenten.',
    'De aanvullende contractuele garantie ontstaat en de garantietermijn begint pas op de dag nadat het werk is opgeleverd én alle facturen uit de overeenkomst, inclusief goedgekeurd of verschuldigd meerwerk, rente en kosten, volledig en onvoorwaardelijk zijn betaald. Het laatste van deze twee momenten is beslissend.',
    'Zolang niet volledig is betaald, bestaat geen aanspraak op de aanvullende contractuele garantie en is Denra niet gehouden werkzaamheden uitsluitend op grond van die extra garantie uit te voeren. Volledige betaling na vervaldatum laat de garantietermijn pas vanaf dat moment aanvangen. Dwingendrechtelijke wettelijke rechten van consumenten blijven onverlet.',
    'Garantie geldt niet voor normale slijtage, verkleuring, kalk, vervuiling, schimmel door gebruik of ventilatie, werking van gebouwen of natuurproducten, bestaande constructies of ondergronden, verkeerd gebruik, gebrekkig onderhoud, eigen wijzigingen, derdenwerk of niet opgevolgde onderhouds- en gebruiksinstructies.',
  ]],
  ['Artikel 17 - Onderhoud, gebruik en ventilatie', [
    'Opdrachtgever volgt gebruiks-, droog-, schoonmaak-, ventilatie- en onderhoudsinstructies. De badkamer wordt voldoende verwarmd en na gebruik mechanisch geventileerd; roosters en afvoeropeningen blijven vrij en schoon.',
    'Onderhoud en normale vervanging wegens slijtage zijn niet in de aanneemsom of garantie inbegrepen, tenzij schriftelijk anders afgesproken.',
  ]],
  ['Artikel 18 - Aansprakelijkheid', [
    'Denra is aansprakelijk voor directe schade die het rechtstreekse en toerekenbare gevolg is van een tekortkoming. Voor zakelijke opdrachtgevers is aansprakelijkheid per gebeurtenis beperkt tot de verzekeringsuitkering vermeerderd met eigen risico, of bij uitblijven daarvan tot de netto factuurwaarde van het gebrekkige onderdeel met een maximum van EUR 25.000.',
    'Tegenover zakelijke opdrachtgevers is Denra niet aansprakelijk voor indirecte schade, gevolgschade, winst- of omzetderving, bedrijfsstagnatie, gemiste besparingen, reputatieschade en schade van derden. Beperkingen gelden niet bij opzet of bewuste roekeloosheid van Denra zelf en niet voor zover dwingend recht anders bepaalt.',
  ]],
  ['Artikel 19 - Overmacht', [
    'Denra is niet gehouden tot nakoming zolang een niet aan haar toe te rekenen omstandigheid nakoming verhindert of ernstig bemoeilijkt, waaronder ziekte, staking, brand, extreem weer, overheidsmaatregelen, transport- of leveringsproblemen, storingen in nutsvoorzieningen en tekortkomingen van leveranciers die Denra niet redelijkerwijs kon voorkomen.',
    'Verplichtingen en termijnen worden opgeschort gedurende de overmacht en een redelijke herstartperiode. Duurt overmacht langer dan 60 dagen, dan mag ieder de nog niet uitgevoerde overeenkomst schriftelijk beëindigen zonder schadevergoeding, met behoud van betaling voor verrichte prestaties en gemaakte kosten.',
  ]],
  ['Artikel 20 - Eigendom, retentierecht en risico', [
    'Geleverde roerende zaken blijven eigendom van Denra totdat opdrachtgever alle vorderingen uit de betreffende overeenkomst volledig heeft voldaan. Denra mag zaken, documenten en materialen die zij rechtmatig onder zich heeft onder zich houden totdat opeisbare vorderingen zijn voldaan, voor zover de wet dit toestaat.',
    'Het risico van door opdrachtgever aangeleverde of reeds geleverde materialen op de bouwplaats ligt bij opdrachtgever, behalve voor schade die aantoonbaar door een toerekenbare fout van Denra is veroorzaakt.',
  ]],
  ['Artikel 21 - Intellectuele eigendom en foto\'s', [
    'Ontwerpen, tekeningen, calculaties, werkwijzen, maatstaten, renders en ander door Denra ontwikkeld materiaal blijven intellectueel eigendom van Denra. Opdrachtgever krijgt na volledige betaling een niet-exclusief gebruiksrecht voor het overeengekomen project.',
    'Herkenbare foto\'s of video\'s van woning, opdrachtgever of persoonlijke eigendommen gebruikt Denra uitsluitend met afzonderlijke toestemming. Niet-herleidbare detail- en voortgangsfoto\'s mogen worden gemaakt voor bewijs, kwaliteitscontrole en dossieropbouw, met inachtneming van privacywetgeving.',
  ]],
  ['Artikel 22 - Personeel en rechtstreeks contracteren', [
    'Een zakelijke opdrachtgever zal gedurende de overeenkomst en 12 maanden daarna niet buiten Denra om rechtstreeks opdrachten geven aan medewerkers of zelfstandigen die Denra voor dit project heeft ingeschakeld, tenzij Denra schriftelijk instemt.',
    'Bij overtreding is de zakelijke opdrachtgever een onmiddellijk opeisbare, voor matiging vatbare boete verschuldigd van EUR 5.000 per overtreding plus EUR 250 per dag dat de overtreding voortduurt, met een maximum van EUR 25.000, onverminderd hogere aantoonbare schade. Dit artikel geldt niet tegenover consumenten.',
  ]],
  ['Artikel 23 - Verjaring en verval bij zakelijke opdrachtgevers', [
    'Een zakelijke opdrachtgever meldt zichtbare gebreken uiterlijk binnen 7 dagen na oplevering en overige gebreken uiterlijk binnen 7 dagen na ontdekking, bij gebreke waarvan aanspraken vervallen voor zover Denra daardoor in haar belangen is geschaad.',
    'Vorderingen van een zakelijke opdrachtgever wegens een gebrek verjaren 18 maanden nadat daarover schriftelijk is geprotesteerd, tenzij de verjaring voordien rechtsgeldig is gestuit. Voor consumenten gelden uitsluitend de wettelijke klacht-, verjarings- en vervalregels.',
  ]],
  ['Artikel 24 - Wijziging van voorwaarden', [
    'Op een overeenkomst geldt de versie die vóór of bij het sluiten daarvan is verstrekt. Een latere wijziging geldt alleen voor nieuwe overeenkomsten en vervolgopdrachten, tenzij opdrachtgever de wijziging uitdrukkelijk aanvaardt of de wijziging uitsluitend technisch of administratief is en opdrachtgever daardoor niet wordt benadeeld.',
  ]],
  ['Artikel 25 - Toepasselijk recht en geschillen', [
    'Op alle rechtsverhoudingen met Denra is Nederlands recht van toepassing. Het Weens Koopverdrag is uitgesloten. Partijen proberen een geschil eerst in goed overleg op te lossen en geven elkaar een redelijke termijn om schriftelijk te reageren en, waar passend, herstel uit te voeren.',
    'Geschillen met zakelijke opdrachtgevers worden uitsluitend voorgelegd aan de bevoegde rechter van de rechtbank Amsterdam, tenzij Denra kiest voor een andere wettelijk bevoegde rechter. Voor consumenten geldt de volgens de wet bevoegde rechter.',
  ]],
  ['Artikel 26 - Slotbepalingen', [
    'Het niet direct uitoefenen van een recht houdt geen afstand van dat recht in. Kennisgevingen worden rechtsgeldig verzonden naar het laatst opgegeven post- of e-mailadres of WhatsApp-nummer. Opdrachtgever meldt wijzigingen onverwijld.',
    'Deze voorwaarden zijn vastgesteld op 2 september 2026 en vervangen eerdere versies voor overeenkomsten die vanaf deze datum worden gesloten.',
  ]],
] as const;

export default function AlgemeneVoorwaarden() {
  return (
    <>
      <Header />
      <main className="bg-[#f8f3ec] pt-32 pb-20">
        <section className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="border-y border-[#cfbca7] py-6 mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="denra-label text-[#7a6552] mb-3">DENRA Badkamers & Renovaties</p>
              <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#231A12]">Algemene voorwaarden</h1>
            </div>
            <p className="text-sm text-[#6B5D50]">Versie 2 september 2026</p>
          </div>

          <div className="mb-12 border border-[#cfbca7]/70 bg-[#f4ede4] p-6 text-sm leading-relaxed text-[#4A3F35]">
            <p><strong className="text-[#231A12]">KvK:</strong> 68670397</p>
            <p><strong className="text-[#231A12]">Vestiging:</strong> Eva Besnyostraat 331, 1087 LG Amsterdam</p>
            <p className="mt-4">Deze voorwaarden maken integraal deel uit van iedere overeenkomst waarop zij van toepassing zijn.</p>
          </div>

          <div className="space-y-10">
            {sections.map(([title, paragraphs]) => (
              <section key={title}>
                <h2 className="font-serif text-2xl font-semibold text-[#231A12] mb-4">{title}</h2>
                <div className="space-y-3 text-sm md:text-base leading-relaxed text-[#4A3F35]">
                  {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {title === 'Artikel 4 - Herroeping bij consumenten' && (
                    <p>
                      <a href="#modelformulier-herroeping" className="font-medium text-[#231A12] underline underline-offset-4 hover:text-[#7a6552]">
                        Bekijk het modelformulier voor herroeping
                      </a>
                    </p>
                  )}
                </div>
              </section>
            ))}
          </div>

          <section id="modelformulier-herroeping" className="mt-14 border-t border-[#cfbca7] pt-10 scroll-mt-28">
            <p className="denra-label text-[#7a6552] mb-3">Bijlage</p>
            <h2 className="font-serif text-2xl font-semibold text-[#231A12] mb-4">Modelformulier voor herroeping</h2>
            <div className="bg-white/60 border border-[#cfbca7]/70 p-6 text-sm leading-relaxed text-[#4A3F35] space-y-3">
              <p>Gebruik dit formulier alleen als u de overeenkomst wilt herroepen.</p>
              <p>Aan: Denra Badkamers en Renovaties, Eva Besnyostraat 331, 1087 LG Amsterdam</p>
              <p>Hierbij deel ik/wij (*) u mede dat ik/wij (*) onze overeenkomst betreffende de verrichting van de volgende dienst / de verkoop van de volgende goederen (*) herroep/herroepen (*):</p>
              <p className="border-b border-[#8A7A6A]/40 pb-5">&nbsp;</p>
              <p>Overeenkomst gesloten op (*) / goederen ontvangen op (*):</p>
              <p className="border-b border-[#8A7A6A]/40 pb-5">&nbsp;</p>
              <p>Naam consument(en):</p><p className="border-b border-[#8A7A6A]/40 pb-5">&nbsp;</p>
              <p>Adres consument(en):</p><p className="border-b border-[#8A7A6A]/40 pb-5">&nbsp;</p>
              <p>Handtekening consument(en), alleen wanneer dit formulier op papier wordt ingediend:</p><p className="border-b border-[#8A7A6A]/40 pb-5">&nbsp;</p>
              <p>Datum:</p><p className="border-b border-[#8A7A6A]/40 pb-5">&nbsp;</p>
              <p>(*) Doorhalen wat niet van toepassing is.</p>
            </div>
          </section>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}