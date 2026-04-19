import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, X, ArrowRight } from 'lucide-react';
import { Project } from '../types';
import { useContent } from '../context/ContentContext';

export default function ProjectShowroom() {
  const { content, getImageUrl } = useContent();
  const projects = content.projects;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold text-dark mb-4"
            >
              My <span className="text-primary">Projects</span>
            </motion.h2>
            <p className="text-slate-500 max-w-xl">
              A showcase of my recent work, from enterprise platforms to creative experiments.
            </p>
          </div>
          <button className="btn-secondary flex items-center gap-2">
            View All Projects
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-3xl overflow-hidden group cursor-pointer hover:shadow-2xl transition-all"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={getImageUrl(project.image)}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="flex gap-3">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">View Details</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl glass rounded-[40px] overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 glass flex items-center justify-center rounded-2xl text-dark hover:text-primary transition-all"
              >
                <X size={24} />
              </button>

              <div className="grid md:grid-cols-2">
                <div className="h-full min-h-[300px]">
                  <img
                    src={getImageUrl(selectedProject.image)}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                </div>
                <div className="p-10 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.tags.map(tag => (
                      <span key={tag} className="text-xs font-bold text-primary bg-orange-50 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-3xl font-extrabold text-dark mb-4">{selectedProject.title}</h2>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    {selectedProject.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={selectedProject.liveUrl}
                      className="btn-primary flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={20} />
                      Live Demo
                    </a>
                    <a
                      href={selectedProject.githubUrl}
                      className="btn-secondary flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={20} />
                      Source Code
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
