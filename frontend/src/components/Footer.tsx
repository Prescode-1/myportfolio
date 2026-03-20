import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, Instagram, ArrowUp, Lock } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function Footer() {
  const { content } = useContent();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-dark text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-extrabold flex items-center gap-2">
              <span className="bg-primary text-white w-10 h-10 flex items-center justify-center rounded-xl">P</span>
              <span>Pres<span className="text-primary">Code</span></span>
            </Link>
            <p className="text-slate-400 leading-relaxed">
              Building the future of digital experiences with cutting-edge technology and user-centric design.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Github, url: content.contactInfo.github },
                { Icon: Linkedin, url: content.contactInfo.linkedin },
                { Icon: Twitter, url: content.contactInfo.twitter },
                { Icon: Instagram, url: content.contactInfo.instagram },
                { Icon: Mail, url: `mailto:${content.contactInfo.email}` }
              ].map(({ Icon, url }, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-xl hover:bg-primary transition-all hover:scale-110"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-400">
              {['Home', 'Projects', 'Services', 'Book Session', 'Contact', 'Blog'].map(link => (
                <li key={link}>
                  <Link to={link === 'Home' ? '/' : link === 'Book Session' ? '/book' : `/${link.toLowerCase()}`} className="hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Services</h4>
            <ul className="space-y-4 text-slate-400">
              {['SaaS Development', 'Mobile Apps', 'Cloud Solutions', 'UI/UX Design', 'Consulting'].map(service => (
                <li key={service}>
                  <a href="#" className="hover:text-primary transition-colors">{service}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Newsletter</h4>
            <p className="text-slate-400 mb-6 text-sm">Subscribe to get the latest insights and project updates.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="bg-slate-800 border-none rounded-xl px-4 py-3 text-sm flex-grow focus:ring-2 focus:ring-primary/50"
              />
              <button className="bg-primary p-3 rounded-xl hover:scale-105 transition-all">
                <ArrowUp size={20} className="rotate-45" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} PresCode. All rights reserved.</p>
            <Link to="/admin" className="text-slate-700 hover:text-primary transition-colors">
              <Lock size={12} />
            </Link>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center hover:bg-primary transition-all text-white group"
          >
            <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
