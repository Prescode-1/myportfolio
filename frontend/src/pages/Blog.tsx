import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight, Search, Tag } from 'lucide-react';

const POSTS = [
  {
    title: 'Scaling SaaS Architecture in 2026',
    excerpt: 'Learn the latest patterns for building high-performance, scalable software-as-a-service platforms.',
    date: 'March 15, 2026',
    readTime: '8 min read',
    category: 'Architecture',
    image: 'https://picsum.photos/seed/tech1/800/400',
  },
  {
    title: 'The Future of UI/UX: Beyond the Screen',
    excerpt: 'Exploring how spatial computing and AI are redefining the way we interact with digital products.',
    date: 'March 10, 2026',
    readTime: '6 min read',
    category: 'Design',
    image: 'https://picsum.photos/seed/tech2/800/400',
  },
  {
    title: 'Optimizing React Performance for Enterprise',
    excerpt: 'Deep dive into advanced React patterns and optimization techniques for large-scale applications.',
    date: 'March 5, 2026',
    readTime: '12 min read',
    category: 'Development',
    image: 'https://picsum.photos/seed/tech3/800/400',
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-dark mb-6"
          >
            Insights & <span className="text-primary">Thought</span>
          </motion.h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Exploring the intersection of technology, design, and business strategy.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-16">
          <div className="flex-grow relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full glass py-4 pl-14 pr-6 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'Architecture', 'Design', 'Development', 'Business'].map(cat => (
              <button key={cat} className="px-6 py-4 glass rounded-2xl font-bold whitespace-nowrap hover:text-primary transition-colors">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {POSTS.map((post, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-[40px] overflow-hidden group hover:shadow-2xl transition-all"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-md text-dark text-xs font-bold px-4 py-2 rounded-xl shadow-lg">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-10">
                <div className="flex items-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    {post.readTime}
                  </div>
                </div>
                <h2 className="text-2xl font-extrabold text-dark mb-4 group-hover:text-primary transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
                <button className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                  Read Article
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
