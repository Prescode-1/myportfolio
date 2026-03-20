import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function ConsultationBooking() {
  const { content } = useContent();
  
  return (
    <section className="py-24 px-6 bg-primary/5">
      <div className="max-w-7xl mx-auto glass p-12 rounded-[50px] shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold text-dark mb-6"
            >
              Ready to <span className="text-primary">Scale?</span>
            </motion.h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              {content.booking.description}
            </p>

            <div className="space-y-6 mb-10">
              {[
                { icon: Clock, text: content.booking.sessionDuration },
                { icon: Video, text: content.booking.meetingPlatform },
                { icon: Calendar, text: 'Flexible Scheduling' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-lg font-bold text-slate-700">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <item.icon size={20} />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>

            <Link to="/book" className="btn-primary flex items-center gap-3">
              Book Your Session
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="relative">
            {/* Mock Calendar UI */}
            <div className="glass p-8 rounded-3xl shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-dark">March 2026</h3>
                <div className="flex gap-2">
                  <button className="w-8 h-8 glass flex items-center justify-center rounded-lg text-slate-400">{'<'}</button>
                  <button className="w-8 h-8 glass flex items-center justify-center rounded-lg text-slate-400">{'>'}</button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={`${d}-${i}`} className="text-xs font-bold text-slate-400">{d}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2 text-center">
                {Array.from({ length: 31 }).map((_, i) => (
                  <button
                    key={i}
                    className={`h-10 w-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                      i + 1 === 17 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 
                      [18, 19, 20].includes(i + 1) ? 'bg-orange-50 text-primary hover:bg-orange-100' : 
                      'text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="text-sm font-bold text-slate-400 mb-4">Available Times</div>
                <div className="grid grid-cols-2 gap-3">
                  {content.booking.availableTimes.slice(0, 4).map(time => (
                    <button key={time} className="py-2 px-4 glass rounded-xl text-sm font-bold text-slate-600 hover:border-primary transition-all">
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
