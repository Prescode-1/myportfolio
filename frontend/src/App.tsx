import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './Navbar';
import FloatingContact from './components/FloatingContact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import ProjectShowroom from './components/ProjectShowroom';
import Services from './components/Services';
import ContactForm from './components/ContactForm';
import { ToastProvider } from './components/Toast';
import { ContentProvider } from './context/ContentContext';

// Lazy-load heavy/rarely-visited pages to reduce initial bundle size
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BookingPage = React.lazy(() => import('./pages/BookingPage'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));

// Loading spinner for lazy-loaded routes
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
        <span className="text-sm font-bold text-slate-400">Loading...</span>
      </div>
    </div>
  );
}

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
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<div className="pt-32"><ProjectShowroom /></div>} />
            <Route path="/services" element={<div className="pt-32"><Services /></div>} />
            <Route path="/contact" element={<div className="pt-32"><ContactForm /></div>} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-4xl font-bold">404 - Not Found</div>} />
          </Routes>
        </Suspense>
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
              <ErrorBoundary>
                <AnimatedRoutes />
              </ErrorBoundary>
            </main>
            <FloatingContact />
            <Footer />
          </div>
        </Router>
      </ContentProvider>
    </ToastProvider>
  );
}
