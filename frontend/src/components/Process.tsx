import React from 'react';
import { motion } from 'motion/react';
import { Search, PenTool, Code, Rocket } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const DEFAULT_PROCESS = [
  {
    icon: Search,
    title: 'Discovery',
    description: 'We start by understanding your goals, target audience, and project requirements to build a solid foundation.',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    icon: PenTool,
    title: 'Design',
    description: 'Creating intuitive user interfaces and seamless user experiences that align with your brand identity.',
    color: 'bg-orange-50 text-orange-600'
  },
  {
    icon: Code,
    title: 'Development',
    description: 'Transforming designs into high-performance, scalable code using the latest technologies and best practices.',
    color: 'bg-green-50 text-green-600'
  },
  {
    icon: Rocket,
    title: 'Deployment',
    description: 'Launching your product to the world and providing ongoing support to ensure its continued success.',
    color: 'bg-purple-50 text-purple-600'
  }
];

export default function Process() {
  const { content } = useContent();
  
  // In a real app, we might pull this from content.process, but for now we'll use a default
  // and make it editable in the future if needed.
  const processSteps = DEFAULT_PROCESS;

  return (
    <section id="process" className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-dark mb-4"
          >
            My <span className="text-primary">Process</span>
          </motion.h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            A streamlined approach to delivering high-quality digital products that drive results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10" />
          
          {processSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[32px] relative z-10 hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-dark text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                0{i + 1}
              </div>
              
              <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <step.icon size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-dark mb-4">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
