import React from 'react';
import { motion } from 'motion/react';
import { Award, Users, Briefcase } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function AboutMe() {
  const { content, getImageUrl } = useContent();
  const { about } = content;

  if (!about) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award': return Award;
      case 'Briefcase': return Briefcase;
      case 'Users': return Users;
      default: return Award;
    }
  };

  return (
    <section id="about" className="py-20 md:py-32 px-4 sm:px-6 relative overflow-hidden bg-white/50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative order-2 lg:order-1"
        >
          <div className="relative z-10 glass p-3 sm:p-5 rounded-[40px] rotate-2 hover:rotate-0 transition-transform duration-700 shadow-2xl">
            <img
              src={getImageUrl(about.image)}
              alt="About Me"
              className="w-full aspect-[4/5] sm:aspect-square object-cover rounded-[32px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -right-6 lg:-right-10 bg-primary text-white p-6 rounded-3xl shadow-2xl hidden sm:block">
               <div className="text-3xl font-black">5+</div>
               <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Years Exp.</div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
        </motion.div>

        <div className="order-1 lg:order-2 text-center lg:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold text-dark mb-8 leading-tight"
          >
            Passionate About <span className="text-primary">Design</span>
          </motion.h2>
          <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed whitespace-pre-wrap max-w-2xl mx-auto lg:mx-0">
            {about.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
            {about.stats.map((stat, i) => {
              const Icon = getIcon(stat.icon);
              const cardColors = [
                'bg-orange-50 border-orange-100/50',
                'bg-blue-50 border-blue-100/50',
                'bg-emerald-50 border-emerald-100/50'
              ];
              const iconColors = [
                'text-orange-600',
                'text-blue-600',
                'text-emerald-600'
              ];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-6 rounded-[24px] border ${cardColors[i % cardColors.length]} transition-all hover:scale-105 duration-300`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto lg:mx-0 bg-white shadow-sm ${iconColors[i % iconColors.length]}`}>
                    <Icon size={24} />
                  </div>
                  <div className="text-3xl font-black text-dark mb-1">{stat.value}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button
              onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary px-8 py-4"
            >
              My Creative Process
            </button>
            {content.contactInfo.cvUrl && content.contactInfo.cvUrl !== '#' && (
              <a
                href={content.contactInfo.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary px-8 py-4"
              >
                Download Resume
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

