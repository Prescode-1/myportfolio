import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../components/Toast';
import { PROJECTS, SERVICES, SKILLS } from '../constants';
import { Project, Service, Skill, Testimonial } from '../types';

interface SiteContent {
  projects: Project[];
  services: Service[];
  skills: Skill[];
  testimonials: Testimonial[];
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
  updateContent: (newContent: Partial<SiteContent>) => Promise<void>;
  isLoading: boolean;
  getImageUrl: (path: string | undefined) => string;
}

// These are ONLY used as absolute last resort if there's no cached data AND no backend response.
// They should NEVER override real user data.
const fallbackDefaults: SiteContent = {
  projects: PROJECTS,
  services: SERVICES,
  skills: SKILLS,
  testimonials: [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'CEO at TechStream',
      content: 'Working with this designer was an absolute pleasure. Their attention to detail and creative vision truly transformed our brand identity.',
      image: 'https://i.pravatar.cc/150?u=sarah',
      rating: 5
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Product Manager',
      content: 'The development speed and code quality were exceptional. Our MVP was delivered ahead of schedule and exceeded all expectations.',
      image: 'https://i.pravatar.cc/150?u=michael',
      rating: 5
    }
  ],
  contactInfo: {
    email: '',
    phone: '',
    address: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    github: '',
    cvUrl: '',
  },
  hero: {
    name: '',
    roles: [],
    description: '',
    image: ''
  },
  about: {
    description: '',
    image: '',
    stats: [
      { label: 'Years Experience', value: '0', icon: 'Award' },
      { label: 'Projects Completed', value: '0', icon: 'Briefcase' },
      { label: 'Happy Clients', value: '0', icon: 'Users' },
    ],
  },
  booking: {
    availableTimes: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
    sessionDuration: '30-Minute Strategy Session',
    meetingPlatform: 'Google Meet or Zoom Call',
    description: '',
  },
};

const CACHE_KEY = 'portfolio_site_content_cache';
const CACHE_TIMESTAMP_KEY = 'portfolio_site_content_cache_ts';

// Load from localStorage cache (this is INSTANT, no network needed)
function loadCachedContent(): SiteContent | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      console.log('[ContentContext] Loaded content from localStorage cache');
      return parsed;
    }
  } catch (e) {
    console.warn('[ContentContext] Failed to read cache:', e);
  }
  return null;
}

// Save to localStorage cache
function saveCachedContent(content: SiteContent): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(content));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    console.log('[ContentContext] Saved content to localStorage cache');
  } catch (e) {
    console.warn('[ContentContext] Failed to save cache:', e);
  }
}

// Safely merge backend data into a base content object
function mergeContent(base: SiteContent, data: any): SiteContent {
  if (!data) return base;
  return {
    ...base,
    ...data,
    projects: Array.isArray(data.projects) && data.projects.length > 0 ? data.projects : base.projects,
    services: Array.isArray(data.services) && data.services.length > 0 ? data.services : base.services,
    skills: Array.isArray(data.skills) && data.skills.length > 0 ? data.skills : base.skills,
    testimonials: Array.isArray(data.testimonials) && data.testimonials.length > 0 ? data.testimonials : base.testimonials,
    contactInfo: { ...base.contactInfo, ...(data.contactInfo || {}) },
    hero: { ...base.hero, ...(data.hero || {}) },
    about: {
      ...base.about,
      ...(data.about || {}),
      stats: Array.isArray(data.about?.stats) && data.about.stats.length > 0
        ? data.about.stats
        : base.about.stats,
    },
    booking: { ...base.booking, ...(data.booking || {}) },
  };
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // PRIORITY ORDER for initial content:
  // 1. localStorage cache (instant, most recent saved data)
  // 2. fallback defaults (only if no cache exists)
  const cachedContent = loadCachedContent();
  const [content, setContent] = useState<SiteContent>(cachedContent || fallbackDefaults);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const API_URL = (import.meta as any).env?.VITE_API_URL || "https://backend-rho-nine-57.vercel.app";

  useEffect(() => {
    let isMounted = true;
    const maxRetries = 3;

    const fetchContent = async (attempt: number) => {
      try {
        console.log(`[ContentContext] Fetching from backend (attempt ${attempt + 1}/${maxRetries})...`);
        
        const controller = new AbortController();
        // Give Render's free tier time to wake up (60s timeout)
        const timeoutId = setTimeout(() => controller.abort(), 60000);

        const res = await fetch(`${API_URL}/api/content?t=${Date.now()}`, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        if (!isMounted) return;

        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          // Backend returned real data — use it as the source of truth
          const merged = mergeContent(fallbackDefaults, data);
          setContent(merged);
          saveCachedContent(merged);
          console.log('[ContentContext] ✅ Backend data loaded and cached successfully');
        } else {
          // Backend returned null/empty — this means no content has ever been saved
          // Keep whatever we currently have (cache or defaults)
          console.log('[ContentContext] Backend returned empty — using cached/default content');
        }
      } catch (err: any) {
        console.error(`[ContentContext] Fetch attempt ${attempt + 1} failed:`, err.message);
        
        if (isMounted && attempt < maxRetries - 1) {
          // Retry after increasing delay (2s, 5s)
          const delay = attempt === 0 ? 2000 : 5000;
          console.log(`[ContentContext] Retrying in ${delay / 1000}s...`);
          setTimeout(() => {
            if (isMounted) fetchContent(attempt + 1);
          }, delay);
          return; // Don't set loading to false yet
        } else {
          // All retries exhausted — we're using cached data or defaults
          if (cachedContent) {
            console.log('[ContentContext] ⚠️ Using cached content (backend unreachable)');
          } else {
            console.log('[ContentContext] ⚠️ Using fallback defaults (no cache, backend unreachable)');
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchContent(0);

    return () => {
      isMounted = false;
    };
  }, [API_URL]);

  const updateContent = async (newContent: Partial<SiteContent>) => {
    // 1. Update local state for instant feedback
    const merged = { ...content, ...newContent };
    setContent(merged);

    // 2. IMMEDIATELY cache to localStorage
    saveCachedContent(merged);

    // 3. Sync to Backend with retry logic
    const maxRetries = 3;
    let success = false;
    let lastError: any = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout per attempt

        const res = await fetch(`${API_URL}/api/content`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newContent),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const savedData = await res.json();
        console.log(`[ContentContext] ✅ Content synced to backend (attempt ${attempt + 1})`);
        
        if (savedData && typeof savedData === 'object') {
          const finalContent = mergeContent(fallbackDefaults, savedData);
          setContent(finalContent);
          saveCachedContent(finalContent);
        }
        
        success = true;
        break; // Exit retry loop on success
      } catch (err) {
        lastError = err;
        console.warn(`[ContentContext] Sync attempt ${attempt + 1} failed:`, err);
        if (attempt < maxRetries - 1) {
          // Wait 2s, 4s between retries
          await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
        }
      }
    }

    if (!success) {
      console.error('[ContentContext] ❌ All sync attempts failed:', lastError);
      showToast('Warning: Connection unstable. Changes saved on this device but might not reach server yet.', 'warning');
    }
  };

  const getImageUrl = (path: string | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('data:')) return path;
    
    // Ensure relative paths have a leading slash for consistent root-relative loading
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // If it's a backend-managed path, prepend the API_URL
    if (normalizedPath.startsWith('/api/upload') || normalizedPath.startsWith('/uploads/')) {
      return `${API_URL}${normalizedPath}`;
    }
    
    // For local static assets in the public folder, return the root-relative path
    return normalizedPath;
  };


  return (
    <ContentContext.Provider value={{ content, updateContent, isLoading, getImageUrl }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within a ContentProvider');
  return context;
};
