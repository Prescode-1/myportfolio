import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteContent extends Document {
  projects: any[];
  services: any[];
  skills: any[];
  testimonials: {
    id: string;
    name: string;
    role: string;
    content: string;
    image: string;
    rating: number;
  }[];
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
  updatedAt: Date;
}

const SiteContentSchema = new Schema({
  projects: { type: Array, default: [] },
  services: { type: Array, default: [] },
  skills: { type: Array, default: [] },
  testimonials: { type: Array, default: [] },
  contactInfo: {
    email: String,
    phone: String,
    address: String,
    instagram: String,
    linkedin: String,
    twitter: String,
    github: String,
    cvUrl: String
  },
  hero: {
    name: String,
    roles: [String],
    description: String,
    image: String
  },
  about: {
    description: String,
    image: String,
    stats: [{ label: String, value: String, icon: String }]
  },
  booking: {
    availableTimes: [String],
    sessionDuration: String,
    meetingPlatform: String,
    description: String
  },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISiteContent>('SiteContent', SiteContentSchema);
