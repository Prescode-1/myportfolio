import React from 'react';
import Hero from '../components/Hero';
import AboutMe from '../components/AboutMe';
import SkillMatrix from '../components/SkillMatrix';
import ProjectShowroom from '../components/ProjectShowroom';
import Process from '../components/Process';
import Services from '../components/Services';
import ConsultationBooking from '../components/ConsultationBooking';
import ContactForm from '../components/ContactForm';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-12"
    >
      <Hero />
      <AboutMe />
      <SkillMatrix />
      <ProjectShowroom />
      <Process />
      <Services />
      <ConsultationBooking />
      <ContactForm />
    </motion.div>
  );
}


