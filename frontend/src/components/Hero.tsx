import React from 'react';
import { motion } from 'motion/react';
import Typewriter from 'typewriter-effect';
import { ArrowRight, Download, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

export default function Hero() {
  const { content, getImageUrl } = useContent();
  const { hero } = content;
  
  if (!hero) return null;

  const handleDownloadCV = () => {
    if (content.contactInfo.cvUrl && content.contactInfo.cvUrl !== '#') {
      window.open(content.contactInfo.cvUrl, '_blank');
      return;
    }

    const cvContent = `
      CURRICULUM VITAE - ${hero.name}
      
      ROLES: ${hero.roles.join(', ')}
      
      SUMMARY:
      ${hero.description}
      
      CONTACT:
      Email: ${content.contactInfo.email}
      Phone: ${content.contactInfo.phone}
      Address: ${content.contactInfo.address}
      
      PROJECTS:
      ${content.projects.map(p => `- ${p.title}: ${p.description}`).join('\n')}
      
      SKILLS:
      ${content.skills.map(s => `- ${s.name} (${s.proficiency}%)`).join('\n')}
    `;
    
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${hero.name}_CV.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden px-6">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://xsgames.co/randomusers/avatar.php?g=${i % 2 === 0 ? 'female' : 'male'}&u=${i}`}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  alt="User"
                />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-500">Trusted by 100+ Clients</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-dark leading-tight mb-6">
            Hi, I'm <span className="text-primary">{hero.name}</span>
            <div className="h-20 text-4xl md:text-5xl text-slate-600 mt-2">
              <Typewriter
                options={{
                  strings: hero.roles,
                  autoStart: true,
                  loop: true,
                  deleteSpeed: 50,
                }}
              />
            </div>
          </h1>

          <p className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed whitespace-pre-wrap">
            {hero.description}
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <button 
              onClick={handleDownloadCV}
              className="btn-primary flex items-center gap-2"
            >
              <Download size={20} />
              Download CV
            </button>
            <Link to="/book" className="btn-secondary flex items-center gap-2">
              Book Session
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Follow Me</span>
            <div className="flex gap-4">
              {[
                { Icon: Github, url: content.contactInfo.github },
                { Icon: Linkedin, url: content.contactInfo.linkedin },
                { Icon: Twitter, url: content.contactInfo.twitter },
                { Icon: Instagram, url: content.contactInfo.instagram }
              ].map(({ Icon, url }, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 glass flex items-center justify-center rounded-xl text-slate-600 hover:text-primary hover:scale-110 transition-all"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
          className="relative"
        >
          <div className="relative z-10">
            {/* 3D Character Illustration Placeholder */}
            <img
              src={getImageUrl(hero.image)}
              alt="Hero Illustration"
              className="w-full max-w-lg aspect-[4/5] mx-auto object-cover drop-shadow-2xl rounded-3xl"
            />
            
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 glass p-4 rounded-2xl shadow-2xl hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-primary font-bold">Hi</div>
                <div>
                  <div className="text-xs font-bold text-slate-400">Status</div>
                  <div className="text-sm font-bold text-dark">Available for Hire</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -left-10 glass p-4 rounded-2xl shadow-2xl hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">Ai</div>
                <div>
                  <div className="text-xs font-bold text-slate-400">Expertise</div>
                  <div className="text-sm font-bold text-dark">AI Integration</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Decorative Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-slate-200 rounded-full -z-10 opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-slate-200 rounded-full -z-10 opacity-30" />
        </motion.div>
      </div>
    </section>
  );
}


