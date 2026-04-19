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
    <section className="relative min-h-[90vh] flex items-center pt-20 md:pt-32 pb-20 overflow-hidden px-4 sm:px-6">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-blue-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-center lg:text-left"
        >
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://xsgames.co/randomusers/avatar.php?g=${i % 2 === 0 ? 'female' : 'male'}&u=${i}`}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                  alt="User"
                />
              ))}
            </div>
            <div className="h-px w-8 bg-slate-200 mx-2" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Trusted by 100+ Clients</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-[900] text-dark leading-[1.1] mb-8 tracking-tight">
            Hi, I'm <span className="text-primary">{hero.name}</span>
            <div className="h-16 sm:h-24 text-3xl sm:text-5xl lg:text-6xl text-slate-400 mt-4 font-extrabold italic">
              <Typewriter
                options={{
                  strings: hero.roles,
                  autoStart: true,
                  loop: true,
                  deleteSpeed: 50,
                  delay: 80,
                }}
              />
            </div>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            {hero.description}
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-16">
            <button 
              onClick={handleDownloadCV}
              className="btn-primary flex items-center gap-3 px-8 py-4 text-base"
            >
              <Download size={20} />
              Grab My Resume
            </button>
            <Link to="/book" className="btn-secondary flex items-center gap-3 px-8 py-4 text-base">
              Book a Talk
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Let's Connect</span>
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
                  className="w-12 h-12 glass flex items-center justify-center rounded-2xl text-slate-500 hover:text-white hover:bg-primary border-slate-200/50 hover:border-primary hover:scale-110 active:scale-95 transition-all duration-300"
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
          transition={{ duration: 1.2, type: 'spring', bounce: 0.4 }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 p-4">
            <img
              src={getImageUrl(hero.image)}
              alt="Hero Illustration"
              className="w-full max-w-xl aspect-[4/5] mx-auto object-cover drop-shadow-2xl rounded-[60px] shadow-2xl border-[16px] border-white/50"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800';
              }}
            />
            
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 glass p-6 rounded-3xl shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-primary font-black text-xl">🚀</div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Status</div>
                  <div className="text-sm font-black text-dark">Open to Projects</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -left-10 glass p-6 rounded-3xl shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl">💡</div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Core Skill</div>
                  <div className="text-sm font-black text-dark">Full-Stack Dev</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Decorative Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border-2 border-slate-200/50 rounded-full -z-10 opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] border border-slate-200/20 rounded-full -z-10 opacity-30" />
        </motion.div>
      </div>
    </section>
  );
}

