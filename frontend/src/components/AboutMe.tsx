import React from 'react';
import { motion } from 'motion/react';
import { Award, Users, Briefcase } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function AboutMe() {
  const { content } = useContent();
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
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative z-10 glass p-4 rounded-[40px] rotate-3 hover:rotate-0 transition-transform duration-500">
            <img
              src={about.image}
              alt="About Me"
              className="w-full aspect-square object-cover rounded-[32px] shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -z-10" />
        </motion.div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-dark mb-6"
          >
            About <span className="text-primary">Me</span>
          </motion.h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed whitespace-pre-wrap">
            {about.description}
          </p>

          <div className="grid grid-cols-3 gap-6 mb-10">
            {about.stats.map((stat, i) => {
              const Icon = getIcon(stat.icon);
              const colors = [
                'text-orange-600 bg-orange-50',
                'text-blue-600 bg-blue-50',
                'text-green-600 bg-green-50'
              ];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-14 h-14 ${colors[i % colors.length]} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm`}>
                    <Icon size={24} />
                  </div>
                  <div className="text-2xl font-extrabold text-dark">{stat.value}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              Learn More About My Process
            </button>
            {content.contactInfo.cvUrl && content.contactInfo.cvUrl !== '#' && (
              <a
                href={content.contactInfo.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Download CV
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
