import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useContent } from '../context/ContentContext';
import * as Icons from 'lucide-react';

export default function SkillMatrix() {
  const { content } = useContent();
  const [filter, setFilter] = useState<'all' | 'frontend' | 'backend' | 'design' | 'tools'>('all');

  const skills = content.skills;
  const filteredSkills = filter === 'all' ? skills : skills.filter(s => s.category === filter);

  return (
    <section className="py-24 px-6 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-dark mb-4"
          >
            My <span className="text-primary">Skills</span>
          </motion.h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Technologies and tools I work with to create amazing web experiences.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['all', 'frontend', 'backend', 'design', 'tools'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-6 py-2 rounded-xl font-bold transition-all capitalize ${
                filter === cat ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSkills.map((skill, index) => {
            // @ts-ignore
            const Icon = Icons[skill.icon] || Icons.Code2;
            return (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-3xl group hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:text-primary group-hover:bg-orange-50 transition-all">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark">{skill.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{skill.category}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-500">Proficiency</span>
                    <span className="text-primary">{skill.proficiency}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
