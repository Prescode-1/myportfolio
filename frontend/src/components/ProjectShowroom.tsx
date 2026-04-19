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
    <section id="projects" className="py-20 md:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-20 gap-8">
          <div className="text-center md:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-extrabold text-dark mb-6 leading-tight"
            >
              Featured <span className="text-primary">Work</span>
            </motion.h2>
            <p className="text-slate-500 max-w-xl mx-auto md:mx-0 text-lg">
              Explore my latest projects, where design meets functionality to create exceptional digital experiences.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <button className="btn-secondary flex items-center gap-2 px-8 py-4">
              View All Projects
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-[32px] overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src={getImageUrl(project.image)}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                {/* Desktop-only Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent opacity-0 md:group-hover:opacity-100 transition-all duration-300 flex items-end p-8">
                  <div className="flex gap-3 translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300">
                    <span className="bg-primary text-white text-[10px] font-bold px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg shadow-primary/30">View Details</span>
                  </div>
                </div>
                {/* Mobile-only Indicator */}
                <div className="absolute top-4 right-4 md:hidden">
                  <div className="w-10 h-10 glass rounded-full flex items-center justify-center text-primary">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-dark mb-3 group-hover:text-primary transition-colors duration-300">{project.title}</h3>
                <p className="text-slate-500 line-clamp-2 leading-relaxed">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-dark/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-5xl glass rounded-[40px] overflow-hidden shadow-2xl z-10 my-auto"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 sm:top-8 right-4 sm:right-8 z-20 w-12 h-12 glass flex items-center justify-center rounded-2xl text-dark hover:text-primary hover:rotate-90 transition-all duration-300"
              >
                <X size={24} />
              </button>

              <div className="grid lg:grid-cols-2 h-full max-h-[90vh] lg:max-h-none overflow-y-auto lg:overflow-visible">
                <div className="relative h-[300px] sm:h-[400px] lg:h-auto overflow-hidden">
                  <img
                    src={getImageUrl(selectedProject.image)}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent pointer-events-none" />
                </div>
                <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.tags.map(tag => (
                      <span key={tag} className="text-xs font-bold text-primary bg-orange-50 px-4 py-1.5 rounded-xl border border-orange-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-dark mb-6 leading-tight">{selectedProject.title}</h2>
                  <p className="text-slate-600 mb-10 text-lg leading-relaxed">
                    {selectedProject.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mt-auto">
                    <a
                      href={selectedProject.liveUrl}
                      className="btn-primary flex items-center gap-2 group/btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={20} className="group-hover/btn:rotate-12 transition-transform" />
                      Live Demo
                    </a>
                    <a
                      href={selectedProject.githubUrl}
                      className="btn-secondary flex items-center gap-2 group/btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={20} className="group-hover/btn:scale-110 transition-transform" />
                      View Code
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

