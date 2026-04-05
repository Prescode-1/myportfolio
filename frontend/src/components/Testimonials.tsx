import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function Testimonials() {
  const { content } = useContent();
  const testimonials = content.testimonials || [];

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-dark mb-6"
          >
            Client <span className="text-primary">Feedback</span>
          </motion.h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Don't just take my word for it. Here's what my clients and partners have to say about our collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-[40px] relative group hover:shadow-2xl transition-all"
            >
              <div className="absolute top-10 right-10 text-primary/10 group-hover:text-primary/20 transition-colors">
                <Quote size={60} fill="currentColor" />
              </div>
              
              <div className="flex gap-1 mb-6 text-primary">
                {Array.from({ length: testimonial.rating }).map((_, idx) => (
                  <Star key={idx} size={16} fill="currentColor" />
                ))}
              </div>

              <p className="text-slate-600 mb-8 italic leading-relaxed relative z-10">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-2xl object-cover shadow-md"
                />
                <div>
                  <div className="font-bold text-dark">{testimonial.name}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
