import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, ArrowRight, Search, X } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

const POSTS: Post[] = [
  {
    id: '1',
    title: 'Scaling SaaS Architecture in 2026',
    excerpt: 'Learn the latest patterns for building high-performance, scalable software-as-a-service platforms.',
    content: `Building scalable SaaS applications in modern Web development requires a multi-layered approach to performance, reliability, and security.

### 1. Database Decoupling & Serverless Storage
Modern cloud platforms allow serverless edge caching combined with scalable relational databases (like Supabase PostgreSQL). Edge functions handle transient load while maintaining tight ACID guarantees.

### 2. Micro-frontends & Dynamic Code Splitting
By dynamically splitting non-critical routes, initial bundle sizes drop dramatically, driving Lighthouse scores to 95+.

### 3. Edge State Synchronization
Caching application configuration locally in the browser with background synchronization creates seamless offline-first experiences for users worldwide.`,
    date: 'March 15, 2026',
    readTime: '8 min read',
    category: 'Architecture',
    image: 'https://picsum.photos/seed/tech1/800/400',
  },
  {
    id: '2',
    title: 'The Future of UI/UX: Beyond the Screen',
    excerpt: 'Exploring how spatial computing and AI are redefining the way we interact with digital products.',
    content: `User interfaces are evolving from static pixel grids to fluid, context-aware interfaces driven by AI and motion design.

### Micro-Interactions & Glassmorphism
Tactile visual cues like glassmorphism depth, dynamic shadows, and subtle micro-animations give web apps an organic feel that invites interaction.

### Predictive User Interfaces
Interfaces that adapt to user intent in real-time reduce cognitive load, allowing users to achieve goals faster with less manual navigation.`,
    date: 'March 10, 2026',
    readTime: '6 min read',
    category: 'Design',
    image: 'https://picsum.photos/seed/tech2/800/400',
  },
  {
    id: '3',
    title: 'Optimizing React Performance for Enterprise',
    excerpt: 'Deep dive into advanced React patterns and optimization techniques for large-scale applications.',
    content: `Enterprise React applications require strict component boundaries, clean state management, and memory-conscious rendering loops.

### Key Optimization Strategies:
- **Memoization & Memoized Callbacks**: Prevent unnecessary re-renders in heavy list items.
- **Lazy Route Splitting**: Wrap route components in \`React.lazy\` and \`Suspense\` fallback boundaries.
- **Form State Scoping**: Use uncontrolled form libraries like \`react-hook-form\` combined with schema validation to isolate keystroke re-renders.`,
    date: 'March 5, 2026',
    readTime: '12 min read',
    category: 'Development',
    image: 'https://picsum.photos/seed/tech3/800/400',
  },
];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePost, setActivePost] = useState<Post | null>(null);

  const categories = ['All', 'Architecture', 'Design', 'Development', 'Business'];

  const filteredPosts = POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-dark mb-6"
          >
            Insights & <span className="text-primary">Thoughts</span>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full glass py-4 pl-14 pr-6 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-4 glass rounded-2xl font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-slate-600 hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 glass rounded-3xl">
            <p className="text-slate-500 text-lg font-bold">No articles found matching your query.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-4 btn-primary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-[40px] overflow-hidden group hover:shadow-2xl transition-all flex flex-col justify-between"
              >
                <div>
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
                  </div>
                </div>
                <div className="p-10 pt-0">
                  <button
                    onClick={() => setActivePost(post)}
                    className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all"
                  >
                    Read Article
                    <ArrowRight size={20} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {activePost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePost(null)}
              className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl glass rounded-[40px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto bg-white p-8 md:p-12"
            >
              <button
                onClick={() => setActivePost(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 glass flex items-center justify-center rounded-2xl text-dark hover:text-primary transition-all"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <span className="text-xs font-bold text-primary bg-orange-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                  {activePost.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-dark mb-4 leading-tight">
                {activePost.title}
              </h1>

              <div className="flex items-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {activePost.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  {activePost.readTime}
                </div>
              </div>

              <img
                src={activePost.image}
                alt={activePost.title}
                className="w-full aspect-video object-cover rounded-3xl mb-8 shadow-lg"
              />

              <div className="prose max-w-none text-slate-600 whitespace-pre-line leading-relaxed">
                {activePost.content}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
