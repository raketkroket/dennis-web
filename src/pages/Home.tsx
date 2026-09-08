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
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}