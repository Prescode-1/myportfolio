import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Github, Linkedin, Twitter } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Process', path: '/#process' },
  { name: 'Projects', path: '/projects' },
  { name: 'Services', path: '/services' },
  { name: 'Book Session', path: '/book' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        scrolled ? 'py-3' : 'py-6'
      )}
    >
      <div className={cn(
        'max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between transition-all',
        scrolled && 'shadow-lg'
      )}>
        <Link to="/" className="text-xl sm:text-2xl font-extrabold text-dark flex items-center gap-2 group">
          <span className="bg-primary text-white w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">P</span>
          <span className="inline tracking-tighter">Pres<span className="text-primary">Code</span></span>
        </Link>


        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100/50 relative">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 relative z-10',
                  isActive ? 'text-white' : 'text-slate-500 hover:text-primary'
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-lg shadow-primary/30"
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </Link>
            );
          })}
          <div className="w-px h-6 bg-slate-200 mx-2" />
          <Link to="/contact" className="btn-primary py-2.5 px-6 text-sm rounded-xl">
            Hire Me
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-dark"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-24 left-6 right-6 glass rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'text-lg font-bold p-4 rounded-2xl transition-all flex items-center justify-between group',
                      isActive ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    {link.name}
                    {isActive && <motion.div layoutId="mobile-active" className="w-2 h-2 bg-white rounded-full" />}
                  </Link>
                );
              })}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="btn-primary text-center mt-4 py-4 rounded-2xl"
              >
                Hire Me
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
