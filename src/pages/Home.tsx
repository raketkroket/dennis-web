import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import TrustBar from '../components/TrustBar';
import ServicesSection from '../components/ServicesSection';
import ProjectsSection from '../components/ProjectsSection';
import StatsSection from '../components/StatsSection';
import ReviewsSection from '../components/ReviewsSection';
import CTASection from '../components/CTASection';
import FaqList from '../components/FaqList';
import WhatsAppButton from '../components/WhatsAppButton';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TrustBar />
        <ServicesSection />
        <StatsSection />
        <ReviewsSection preview />
        <ProjectsSection />
        <FaqList pages={['algemeen', 'badkamer', 'wc']} id="home-faq" />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}