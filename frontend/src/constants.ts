import { Project, Skill, Service } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-featured online store with payment gateway integration and real-time inventory management.',
    image: 'https://picsum.photos/seed/shop/800/600',
    tags: ['React', 'Node.js', 'Stripe', 'Tailwind'],
    liveUrl: '#',
    githubUrl: '#',
    category: 'web',
  },
  {
    id: '2',
    title: 'Fitness Tracker App',
    description: 'Mobile-first application for tracking workouts, nutrition, and progress with detailed analytics.',
    image: 'https://picsum.photos/seed/fitness/800/600',
    tags: ['React Native', 'Firebase', 'Redux'],
    liveUrl: '#',
    githubUrl: '#',
    category: 'mobile',
  },
  {
    id: '3',
    title: 'AI Content Generator',
    description: 'SaaS platform leveraging GPT-4 to generate marketing copy, blog posts, and social media content.',
    image: 'https://picsum.photos/seed/ai/800/600',
    tags: ['Next.js', 'OpenAI', 'TypeScript'],
    liveUrl: '#',
    githubUrl: '#',
    category: 'web',
  },
  {
    id: '4',
    title: 'Crypto Dashboard',
    description: 'Real-time cryptocurrency tracking dashboard with live price updates and portfolio management.',
    image: 'https://picsum.photos/seed/crypto/800/600',
    tags: ['React', 'D3.js', 'WebSockets'],
    liveUrl: '#',
    githubUrl: '#',
    category: 'web',
  },
];

export const SKILLS: Skill[] = [
  { name: 'Figma', proficiency: 95, category: 'design', icon: 'Figma' },
  { name: 'Adobe XD', proficiency: 85, category: 'design', icon: 'PenTool' },
  { name: 'UserTesting', proficiency: 90, category: 'design', icon: 'FlaskConical' },
  { name: 'React', proficiency: 98, category: 'frontend', icon: 'Atom' },
  { name: 'Bootstrap', proficiency: 92, category: 'frontend', icon: 'Layout' },
  { name: 'Flutter', proficiency: 88, category: 'frontend', icon: 'Smartphone' },
  { name: 'React Native', proficiency: 90, category: 'frontend', icon: 'Smartphone' },
  { name: 'Node.js', proficiency: 94, category: 'backend', icon: 'Server' },
  { name: 'MongoDB', proficiency: 88, category: 'backend', icon: 'Database' },
  { name: 'Google Analytics', proficiency: 85, category: 'tools', icon: 'BarChart3' },
  { name: 'Postman', proficiency: 95, category: 'tools', icon: 'Send' },
  { name: 'AWS', proficiency: 82, category: 'tools', icon: 'Cloud' },
  { name: 'Vercel', proficiency: 96, category: 'tools', icon: 'Triangle' },
  { name: 'Render', proficiency: 92, category: 'tools', icon: 'Cloud' },
];

export const SERVICES: Service[] = [
  {
    title: 'UI Design',
    description: 'Elegant, brand-driven interfaces that captivate users.',
    price: '$1,800',
    features: [
      'Custom layouts, typography, and color systems',
      'Iconography and visual asset creation',
      'Interactive components for modern platforms',
      'Comprehensive style guides for consistency'
    ],
    icon: 'Palette',
  },
  {
    title: 'UX Research & Testing',
    description: 'Data-driven design decisions for seamless user experiences.',
    price: '$2,000',
    features: [
      'In-depth user interviews and surveys',
      'Usability testing with real-world scenarios',
      'Journey mapping and persona development',
      'Iterative design improvements based on analytics'
    ],
    icon: 'FlaskConical',
  },
  {
    title: 'Front-End Development',
    description: 'Pixel-perfect, responsive interfaces built with cutting-edge frameworks.',
    price: '$2,000',
    features: [
      'React, Angular, and Vue expertise',
      'Mobile-first responsive layouts',
      'Cross-browser and cross-device compatibility',
      'Performance optimization for speed and scalability'
    ],
    icon: 'Monitor',
  },
  {
    title: 'Back-End Development',
    description: 'Robust, secure, and scalable server-side solutions.',
    price: '$2,500',
    features: [
      'Node.js, Python, and PHP development',
      'RESTful & GraphQL API architecture',
      'Database design (MySQL, MongoDB, PostgreSQL)',
      'Advanced authentication and security protocols'
    ],
    icon: 'Server',
  },
  {
    title: 'Mobile App Development',
    description: 'High-performance apps tailored for iOS and Android ecosystems.',
    price: '$3,500',
    features: [
      'Native (Swift, Kotlin) and cross-platform (Flutter, React Native) builds',
      'Seamless UI/UX integration',
      'App store deployment and compliance',
      'Post-launch support and iterative updates'
    ],
    icon: 'Smartphone',
  },
  {
    title: 'API & System Integration',
    description: 'Connecting platforms for smarter, more powerful applications.',
    price: '$2,200',
    features: [
      'RESTful API integration with third-party services',
      'Payment gateway and cloud service connectivity',
      'CRM/ERP system integration',
      'Workflow automation and scalability solutions'
    ],
    icon: 'Plug2',
  },
];
