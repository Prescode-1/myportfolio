import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './Navbar';
import FloatingContact from './components/FloatingContact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Blog from './pages/Blog';
import BookingPage from './pages/BookingPage';
import ProjectShowroom from './components/ProjectShowroom';
import Services from './components/Services';
import ContactForm from './components/ContactForm';
import { ToastProvider } from './components/Toast';
import { ContentProvider } from './context/ContentContext';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<div className="pt-32"><ProjectShowroom /></div>} />
          <Route path="/services" element={<div className="pt-32"><Services /></div>} />
          <Route path="/contact" element={<div className="pt-32"><ContactForm /></div>} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-4xl font-bold">404 - Not Found</div>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}


export default function App() {
  return (
    <ToastProvider>
      <ContentProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <AnimatedRoutes />
            </main>
            <FloatingContact />
            <Footer />
          </div>
        </Router>
      </ContentProvider>
    </ToastProvider>
  );
}



