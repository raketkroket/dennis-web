import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, CircleHelp, MapPin, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { sitePhotos } from '../data/sitePhotos';

type LocalServicePageProps = {
  city: string;
  serviceType: 'badkamer' | 'wc';
  title: string;
  intro: string;
  bullets: string[];
  faq: { question: string; answer: string }[];
};

export default function LocalServicePage({
  city,
  serviceType,
  title,
  intro,
  bullets,
  faq,
}: LocalServicePageProps) {
  const isBathroom = serviceType === 'badkamer';

  return (
    <>
      <Header />
      <main>
        <section className="relative pt-40 pb-20 bg-[#f7f1ea]" aria-label={`${title} hero`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="denra-line" />
                  <span className="denra-label bg-[#efe4d8] text-[#4d3d33]">Denra Badkamers</span>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-[#231A12] leading-[0.95] mb-6">
                  {title}
                </h1>
                <p className="text-lg text-[#5f544a] leading-relaxed mb-8 max-w-xl">
                  {intro}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/configurator"
                    className="inline-flex items-center justify-center gap-2 bg-[#231A12] text-[#F6F0E8] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#3a2d23] transition-all duration-200 text-sm"
                  >
                    Vraag offerte aan
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 border border-[#7a6552]/20 text-[#231A12] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#231A12] hover:text-white transition-all duration-200 text-sm"
                  >
                    Plan adviesgesprek
                  </Link>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#4A3F35] font-medium">
                  <MapPin size={16} className="text-[#7a6552]" />
                  Servicegebied: {city} en omgeving
                </div>
              </div>

              <div className="rounded-[32px] overflow-hidden border border-[#d7c3a9] shadow-[0_20px_40px_rgba(40,30,25,0.08)] bg-[#efe4d5]">
                <img
                  src={isBathroom ? sitePhotos[0] : sitePhotos[8]}
                  alt={isBathroom ? `Badkamer renovatie ${city}` : `WC renovatie ${city}`}
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#faf6f0]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-6">
              {[
                `Complete ${isBathroom ? 'badkamerrenovatie' : 'WC-renovatie'} in ${city}`,
                `Wat kost ${isBathroom ? 'een badkamerrenovatie' : 'een WC renovatie'} in ${city}?`,
                `${isBathroom ? 'Van sloopwerk tot afwerking' : 'Van toilet tot luxe afwerking'}`,
              ].map((heading, index) => (
                <div key={heading} className="rounded-2xl border border-[#d9c7ae] bg-[#f6efe7] p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-[#efe4d5] flex items-center justify-center">
                      {index === 0 ? <Sparkles size={15} className="text-[#7a6552]" /> : <Check size={15} className="text-[#7a6552]" />}
                    </div>
                    <h2 className="font-serif text-2xl text-[#231A12]">{heading}</h2>
                  </div>
                  <p className="text-[#5f544a] leading-relaxed">
                    {index === 0 && `Wij verzorgen bij Denra Badkamers de volledige ${isBathroom ? 'badkamerrenovatie' : 'toiletrenovatie'} in ${city}. Van sloop, leidingwerk en tegelwerk tot sanitair, afwerking en styling.`}
                    {index === 1 && `De prijs hangt af van de oppervlakte, de mate van sloopwerk, het sanitair, het tegelwerk en eventuele extra wensen. Wij geven vooraf helder inzicht in de kosten.`}
                    {index === 2 && `U krijgt één aanspreekpunt, vaste communicatie en een strak werkproces. Zo blijft uw renovatie helder, efficiënt en professioneel van begin tot eind.`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#f4efe8]">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-semibold text-[#231A12] mb-4">
                Waarom {city} kiezen voor Denra Badkamers?
              </h2>
              <p className="text-[#5f544a] max-w-2xl mx-auto">
                {isBathroom
                  ? `Bij een badkamer renovatie in ${city} draait alles om kwaliteit, helderheid en een resultaat dat jaren meegaat.`
                  : `Bij een WC renovatie in ${city} combineren we praktische kwaliteit met een stijlvolle uitstraling die echt bij uw ruimte past.`}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {bullets.map((bullet) => (
                <div key={bullet} className="flex items-start gap-3 rounded-xl border border-[#d9c7ae] bg-[#faf6f0] p-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-[#efe4d5] flex items-center justify-center shrink-0">
                    <Check size={12} className="text-[#7a6552]" />
                  </div>
                  <p className="text-[#3d322d] leading-relaxed">{bullet}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#f7f1ea]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <h2 className="font-serif text-4xl font-semibold text-[#231A12] text-center mb-10">
              Veelgestelde vragen
            </h2>
            <div className="space-y-4">
              {faq.map((item) => (
                <div key={item.question} className="rounded-2xl border border-[#d7c3a9] bg-[#fbf7f3] p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-8 h-8 rounded-full bg-[#efe4d5] flex items-center justify-center shrink-0">
                      <CircleHelp size={15} className="text-[#7a6552]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#231A12] mb-2">{item.question}</h3>
                      <p className="text-[#5f544a] leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#231A12] text-[#F6F0E8]">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="font-serif text-4xl font-semibold mb-6">
              {isBathroom ? 'Plan jouw badkamer renovatie in ' : 'Plan jouw WC renovatie in '}{city}
            </h2>
            <p className="text-[#ddd3c5] max-w-2xl mx-auto mb-8">
              Wil je direct weten wat een complete renovatie in {city} kost? Laat je vrijblijvend adviseren en ontvang een duidelijke offerte zonder gedoe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#F6F0E8] text-[#231A12] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#e5dbcd] transition-all duration-200 text-sm"
              >
                Vraag offerte aan
              </Link>
              <Link
                to="/projecten"
                className="inline-flex items-center justify-center gap-2 border border-[#f6f0e8]/40 text-[#F6F0E8] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#F6F0E8] hover:text-[#231A12] transition-all duration-200 text-sm"
              >
                Bekijk projecten
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
