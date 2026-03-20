import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function Services() {
  const { content } = useContent();
  const services = content.services;

  return (
    <section className="py-24 px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-dark mb-4"
          >
            Service <span className="text-primary">Offerings</span>
          </motion.h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            I provide comprehensive solutions tailored to your business needs, from initial concept to final deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            // @ts-ignore
            const Icon = Icons[service.icon] || Icons.Code;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass p-10 rounded-[40px] flex flex-col hover:border-primary/50 transition-all group"
              >
                <div className="w-16 h-16 bg-orange-50 rounded-3xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  <Icon size={32} />
                </div>
                
                <h3 className="text-2xl font-extrabold text-dark mb-4">{service.title}</h3>
                <p className="text-slate-500 mb-8 flex-grow">{service.description}</p>
                
                <div className="mb-8">
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">What's included</div>
                  <ul className="space-y-3">
                    {service.features.map(feature => (
                      <li key={feature} className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                        <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                          <Check size={12} />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Starting at</div>
                    <div className="text-2xl font-extrabold text-dark">{service.price}</div>
                  </div>
                  <Link to="/book" className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-primary/30">
                    <ArrowRight size={24} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
