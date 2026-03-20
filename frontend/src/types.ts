import { LucideIcon } from 'lucide-react';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: 'web' | 'mobile' | 'design';
}

export interface Skill {
  name: string;
  proficiency: number;
  category: 'frontend' | 'backend' | 'design' | 'tools';
  icon: string;
}

export interface Service {
  title: string;
  description: string;
  price: string;
  features: string[];
  icon: string;
}

export interface Lead {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  createdAt: any;
}
