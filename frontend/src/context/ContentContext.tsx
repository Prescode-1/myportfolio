import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../components/Toast';
import { PROJECTS, SERVICES, SKILLS } from '../constants';
import { Project, Service, Skill } from '../types';

interface SiteContent {
  projects: Project[];
  services: Service[];
  skills: Skill[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    github: string;
    cvUrl: string;
  };
  hero: {
    name: string;
    roles: string[];
    description: string;
    image: string;
  };
  about: {
    description: string;
    image: string;
    stats: { label: string; value: string; icon: string }[];
  };
  booking: {
    availableTimes: string[];
    sessionDuration: string;
    meetingPlatform: string;
    description: string;
  };
}

interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: Partial<SiteContent>) => void;
}

const defaultContent: SiteContent = {
  projects: PROJECTS,
  services: SERVICES,
  skills: SKILLS,
  contactInfo: {
    email: 'pukwedeh@gmail.com',
    phone: '+1 (555) 000-0000',
    address: '123 Tech Avenue, Silicon Valley, CA',
    instagram: 'https://instagram.com/prescode',
    linkedin: 'https://linkedin.com/in/prescode',
    twitter: 'https://twitter.com/prescode',
    github: 'https://github.com/prescode',
    cvUrl: '#',
  },
  hero: {
    name: 'PresCode',
    roles: ['UI/UX Designer', 'Full Stack Developer', 'Mobile App Expert', 'System Architect'],
    description: 'I build high-performance, responsive digital experiences that help businesses scale. From concept to deployment, I deliver enterprise-grade solutions with a focus on user experience.',
    image: 'https://img.freepik.com/free-psd/3d-illustration-person-with-laptop_23-2149436188.jpg'
  },
  about: {
    description: 'I am a passionate Full Stack Developer and UI/UX Designer with over 5 years of experience in building enterprise-level applications. My approach combines technical excellence with a deep understanding of user behavior to create products that are not only functional but also delightful to use.',
    image: 'https://img.freepik.com/free-psd/3d-illustration-person-with-laptop_23-2149436188.jpg',
    stats: [
      { label: 'Years Experience', value: '5+', icon: 'Award' },
      { label: 'Projects Completed', value: '100+', icon: 'Briefcase' },
      { label: 'Happy Clients', value: '50+', icon: 'Users' },
    ],
  },
  booking: {
    availableTimes: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
    sessionDuration: '30-Minute Strategy Session',
    meetingPlatform: 'Google Meet or Zoom Call',
    description: "Let's discuss your project, identify bottlenecks, and explore how we can achieve your business goals.",
  },
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  // Priority: 1. Environment Variable, 2. Current Host (if 5000), 3. Localhost Default
  // Auto-detect backend host based on how the site is accessed
  const API_URL = (import.meta as any).env?.VITE_API_URL || "https://myportfolio-07kr.onrender.com";

  useEffect(() => {
    // 1. Initial Load from Backend
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_URL}/api/content?t=${Date.now()}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const data = await res.json();
        
        if (data) {
          // Robust merge
          setContent(prev => ({
            ...prev,
            ...data,
            projects: Array.isArray(data.projects) ? data.projects : prev.projects,
            services: Array.isArray(data.services) ? data.services : prev.services,
            skills: Array.isArray(data.skills) ? data.skills : prev.skills,
            contactInfo: { ...prev.contactInfo, ...(data.contactInfo || {}) },
            hero: { ...prev.hero, ...(data.hero || {}) },
            about: { ...prev.about, ...(data.about || {}) },
            booking: { ...prev.booking, ...(data.booking || {}) },
          }));
        }
      } catch (err) {
        console.error('Failed to load live content, using defaults/backup.', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [API_URL]);

  const updateContent = async (newContent: Partial<SiteContent>) => {
    // 1. Update local state for instant feedback
    const merged = { ...content, ...newContent };
    setContent(merged);

    // 2. Sync to Backend
    try {
      await fetch(`${API_URL}/api/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      });
    } catch (err) {
      console.error('Persistence failed:', err);
      showToast('Connection issue: Change saved locally only.', 'warning');
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within a ContentProvider');
  return context;
};
