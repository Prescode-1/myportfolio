import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FloatingContact() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass p-6 rounded-[32px] shadow-2xl mb-2 w-72 border border-white/20"
          >
            <h3 className="text-xl font-extrabold text-dark mb-4 flex items-center gap-2">
              Let's Chat <span className="animate-bounce">👋</span>
            </h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              Ready to start your next big project? I'm just a message away.
            </p>
            
            <div className="space-y-3">
              <Link 
                to="/contact" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 bg-primary text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all group"
              >
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Send size={16} />
                </div>
                Send a Message
              </Link>
              
              <a 
                href="mailto:homeyu324@gmail.com"
                className="flex items-center gap-3 p-3 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all border border-slate-100"
              >
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Mail size={16} className="text-primary" />
                </div>
                Email Me
              </a>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center gap-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available for new projects</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
          isOpen ? 'bg-dark text-white rotate-90' : 'bg-primary text-white'
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold">
            1
          </span>
        )}
      </motion.button>
    </div>
  );
}
