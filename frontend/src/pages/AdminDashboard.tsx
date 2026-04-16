import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Users, MessageSquare, BarChart3, Settings, 
  Plus, ArrowUpRight, ArrowDownRight, LogIn, LogOut, 
  Edit3, Trash2, Save, X, Globe, Briefcase, Phone, Mail, MapPin,
  Calendar, Clock, Video, RotateCcw, Star
} from 'lucide-react';
import AdminImageUpload from '../components/AdminImageUpload';
import { useToast } from '../components/Toast';
import { useContent } from '../context/ContentContext';
import { Project, Skill, Service, Testimonial } from '../types';
import { SERVICES, PROJECTS, SKILLS } from '../constants';

type Tab = 'overview' | 'leads' | 'hero' | 'about' | 'projects' | 'services' | 'skills' | 'testimonials' | 'contact' | 'booking' | 'bookedSessions';

export default function AdminDashboard() {
  const { content, updateContent, getImageUrl } = useContent();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [leads, setLeads] = useState<any[]>([]);
  const [bookedSessions, setBookedSessions] = useState<any[]>([]);
  const [user, setUser] = useState<any>({ displayName: 'Admin User' });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const API_URL = (import.meta as any).env?.VITE_API_URL || "https://myportfolio-07kr.onrender.com";

  // Fetch Data
  React.useEffect(() => {
    if (user) {
      // Fetch Bookings
      fetch(`${API_URL}/api/bookings`)
        .then(res => res.json())
        .then(data => setBookedSessions(data))
        .catch(err => console.error('Failed to fetch bookings:', err));

      // Fetch Leads
      fetch(`${API_URL}/api/leads`)
        .then(res => res.json())
        .then(data => setLeads(data))
        .catch(err => console.error('Failed to fetch leads:', err));
    }
  }, [user, activeTab, API_URL]);

  // Editing States
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Hero State
  const [heroForm, setHeroForm] = useState(content.hero || { name: '', roles: [], description: '', image: '' });
  
  // About State
  const [aboutForm, setAboutForm] = useState(content.about || { description: '', image: '', stats: [] });

  // Contact State
  const [contactForm, setContactForm] = useState(content.contactInfo || {
    email: '',
    phone: '',
    address: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    github: ''
  });
  
  // Booking State
  const [bookingForm, setBookingForm] = useState(content.booking || {
    availableTimes: [],
    sessionDuration: '',
    meetingPlatform: '',
    description: ''
  });

  // Sync states when content is loaded from DB
  React.useEffect(() => {
    setHeroForm(content.hero);
    setAboutForm(content.about);
    setContactForm(content.contactInfo);
    setBookingForm(content.booking);
  }, [content]);

  const handleLogin = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ displayName: 'Admin User' });
    setLoading(false);
    showToast('Logged in successfully!', 'success');
  };

  const handleLogout = async () => {
    setUser(null);
    showToast('Logged out successfully!', 'success');
  };

  const saveHero = async () => {
    await updateContent({ hero: heroForm });
    showToast('Hero content updated & synced!', 'success');
  };

  const saveAbout = async () => {
    await updateContent({ about: aboutForm });
    showToast('About content updated & synced!', 'success');
  };

  const saveContact = async () => {
    await updateContent({ contactInfo: contactForm });
    showToast('Contact info updated & synced!', 'success');
  };

  const saveBooking = async () => {
    await updateContent({ booking: bookingForm });
    showToast('Booking settings updated & synced!', 'success');
  };

  const deleteProject = (id: string) => {
    updateContent({ projects: content.projects.filter(p => p.id !== id) });
    showToast('Project removed', 'success');
  };

  const deleteService = (title: string) => {
    updateContent({ services: content.services.filter(s => s.title !== title) });
    showToast('Service removed', 'success');
  };

  const deleteSkill = (name: string) => {
    updateContent({ skills: content.skills.filter(s => s.name !== name) });
    showToast('Skill removed', 'success');
  };

  const deleteTestimonial = (id: string) => {
    updateContent({ testimonials: content.testimonials.filter(t => t.id !== id) });
    showToast('Testimonial removed', 'success');
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data.url; // Return relative URL to store in DB
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Image upload failed', 'error');
      return '';
    }
  };

  const resetServices = () => {
    updateContent({ services: SERVICES });
    showToast('Services reset to defaults', 'success');
  };

  const resetSkills = () => {
    updateContent({ skills: SKILLS });
    showToast('Skills reset to defaults', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="glass p-12 rounded-[40px] text-center max-w-md w-full">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8">
            <LogIn size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-dark mb-4">Admin Access</h1>
          <p className="text-slate-500 mb-8">Please sign in to access the dashboard.</p>
          <button onClick={handleLogin} className="btn-primary w-full flex items-center justify-center gap-3">
            <LogIn size={20} />
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Visitors', value: '1,240', change: '+12.5%', trend: 'up', icon: Users },
    { label: 'New Leads', value: leads.length.toString(), change: '+5.2%', trend: 'up', icon: MessageSquare },
    { label: 'Booked Sessions', value: bookedSessions.length.toString(), change: '+8.4%', trend: 'up', icon: Calendar },
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: MessageSquare },
    { id: 'hero', label: 'Hero Section', icon: Globe },
    { id: 'about', label: 'About Me', icon: Users },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'skills', label: 'Skills', icon: BarChart3 },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'contact', label: 'Contact Info', icon: Mail },
    { id: 'booking', label: 'Booking Settings', icon: Calendar },
    { id: 'bookedSessions', label: 'Booked Sessions', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-dark mb-2">Admin Dashboard</h1>
            <p className="text-slate-500 font-semibold">Welcome back, {user.displayName}.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[250px_1fr] gap-12">
          {/* Sidebar */}
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === item.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                    : 'text-slate-500 hover:bg-white hover:text-primary'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="glass p-10 rounded-[40px] shadow-sm min-h-[600px]">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-extrabold text-dark mb-8">System Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {stats.map((stat, i) => (
                      <div key={i} className="bg-slate-50 p-8 rounded-[32px]">
                        <div className="flex items-center justify-between mb-6">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-600 shadow-sm">
                            <stat.icon size={24} />
                          </div>
                          <div className={`flex items-center gap-1 text-sm font-bold ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                            {stat.change}
                          </div>
                        </div>
                        <div className="text-3xl font-extrabold text-dark mb-1">{stat.value}</div>
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-slate-50 p-8 rounded-[32px]">
                    <h3 className="text-xl font-bold text-dark mb-6">Analytics Trend</h3>
                    <div className="h-48 flex items-end gap-4">
                      {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                        <div key={i} className="flex-grow bg-white rounded-t-xl relative group overflow-hidden">
                          <div style={{ height: `${h}%` }} className="absolute bottom-0 left-0 right-0 bg-primary/20" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'leads' && (
                <motion.div
                  key="leads"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-extrabold text-dark mb-8">Recent Leads</h2>
                  <div className="space-y-4">
                    {leads.map((lead) => (
                      <div key={lead._id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold">
                            {lead.fullName?.[0] || '?'}
                          </div>
                          <div>
                            <div className="font-bold text-dark">{lead.fullName}</div>
                            <div className="text-sm text-slate-500">{lead.email}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-600 capitalize">{lead.service}</div>
                          <div className="text-xs text-slate-400">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'hero' && (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-2xl font-extrabold text-dark mb-8">Edit Hero Section</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Name</label>
                      <input 
                        value={heroForm.name}
                        onChange={(e) => setHeroForm({...heroForm, name: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <AdminImageUpload 
                        label="Display Image"
                        value={heroForm.image}
                        onChange={(url) => setHeroForm({...heroForm, image: url})}
                        onUpload={handleImageUpload}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Roles (Comma separated)</label>
                      <input 
                        value={heroForm?.roles?.join(', ') || ''}
                        onChange={(e) => setHeroForm({...heroForm, roles: e.target.value.split(',').map(r => r.trim())})}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Description</label>
                      <textarea 
                        value={heroForm?.description || ''}
                        onChange={(e) => setHeroForm({...heroForm, description: e.target.value})}
                        rows={4}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>
                    <button onClick={saveHero} className="btn-primary flex items-center gap-2">
                      <Save size={20} />
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-2xl font-extrabold text-dark mb-8">About Me Section</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Description</label>
                      <textarea 
                        value={aboutForm?.description || ''}
                        onChange={(e) => setAboutForm({...aboutForm, description: e.target.value})}
                        rows={6}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>
                    <div>
                      <AdminImageUpload 
                        label="About Section Image"
                        value={aboutForm.image}
                        onChange={(url) => setAboutForm({...aboutForm, image: url})}
                        onUpload={handleImageUpload}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-slate-600">Stats</label>
                      {aboutForm?.stats?.map((stat, i) => (
                        <div key={i} className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">Label</label>
                            <input 
                              value={stat.label}
                              onChange={(e) => {
                                const newStats = [...aboutForm.stats];
                                newStats[i].label = e.target.value;
                                setAboutForm({...aboutForm, stats: newStats});
                              }}
                              className="w-full bg-white border-none rounded-xl px-4 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">Value</label>
                            <input 
                              value={stat.value}
                              onChange={(e) => {
                                const newStats = [...aboutForm.stats];
                                newStats[i].value = e.target.value;
                                setAboutForm({...aboutForm, stats: newStats});
                              }}
                              className="w-full bg-white border-none rounded-xl px-4 py-2 text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={saveAbout} className="btn-primary flex items-center gap-2">
                      <Save size={20} />
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'projects' && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-extrabold text-dark">Manage Projects</h2>
                    <button 
                      onClick={() => setEditingProject({
                        id: Math.random().toString(36).substr(2, 9),
                        title: '',
                        description: '',
                        image: 'https://picsum.photos/seed/project/800/600',
                        tags: [],
                        liveUrl: '',
                        githubUrl: '',
                        category: 'web'
                      })}
                      className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Add Project
                    </button>
                  </div>

                  {editingProject && (
                    <div className="fixed inset-0 bg-dark/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                      <div className="glass p-10 rounded-[40px] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-2xl font-extrabold text-dark">
                            {editingProject.id ? 'Edit Project' : 'New Project'}
                          </h3>
                          <button onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-dark">
                            <X size={24} />
                          </button>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">Title</label>
                            <input 
                              value={editingProject.title}
                              onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">Description</label>
                            <textarea 
                              value={editingProject.description}
                              onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                              rows={3}
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 resize-none"
                            />
                          </div>
                          <div>
                            <AdminImageUpload 
                              label="Project Picture"
                              value={editingProject.image}
                              onChange={(url) => setEditingProject({...editingProject, image: url})}
                              onUpload={handleImageUpload}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-bold text-slate-600 mb-2">Live Demo URL</label>
                              <input 
                                value={editingProject.liveUrl || ''}
                                onChange={(e) => setEditingProject({...editingProject, liveUrl: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4"
                                placeholder="https://demo.example.com"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-600 mb-2">Source Code URL</label>
                              <input 
                                value={editingProject.githubUrl || ''}
                                onChange={(e) => setEditingProject({...editingProject, githubUrl: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4"
                                placeholder="https://github.com/user/repo"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">Category</label>
                            <select 
                              value={editingProject.category}
                              onChange={(e) => setEditingProject({...editingProject, category: e.target.value as any})}
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4"
                            >
                              <option value="web">Web Development</option>
                              <option value="mobile">Mobile App</option>
                              <option value="design">UI/UX Design</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">Tags (Comma separated)</label>
                            <input 
                              value={editingProject.tags.join(', ')}
                              onChange={(e) => setEditingProject({...editingProject, tags: e.target.value.split(',').map(t => t.trim())})}
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4"
                            />
                          </div>
                          <button 
                            onClick={() => {
                              const exists = content.projects.find(p => p.id === editingProject.id);
                              if (exists) {
                                updateContent({ projects: content.projects.map(p => p.id === editingProject.id ? editingProject : p) });
                              } else {
                                updateContent({ projects: [...content.projects, editingProject] });
                              }
                              setEditingProject(null);
                              showToast('Project saved!', 'success');
                            }}
                            className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2"
                          >
                            <Save size={20} />
                            Save Project
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-6">
                    {content.projects.map((project) => (
                      <div key={project.id} className="flex items-center gap-6 p-4 bg-slate-50 rounded-3xl">
                        <img src={getImageUrl(project.image)} className="w-24 h-24 rounded-2xl object-cover" alt="" />
                        <div className="flex-grow">
                          <h4 className="font-bold text-dark">{project.title}</h4>
                          <p className="text-sm text-slate-500 line-clamp-1">{project.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setEditingProject(project)}
                            className="p-3 bg-white text-slate-600 rounded-xl hover:text-primary transition-all"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => deleteProject(project.id)} className="p-3 bg-white text-slate-600 rounded-xl hover:text-red-500 transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'services' && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-extrabold text-dark">Manage Services</h2>
                    <div className="flex gap-4">
                      <button 
                        onClick={resetServices}
                        className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
                      >
                        <RotateCcw size={18} />
                        Reset to Defaults
                      </button>
                      <button 
                        onClick={() => setEditingService({
                          title: '',
                          price: '',
                          description: '',
                          icon: 'Globe',
                          features: []
                        })}
                        className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                      >
                        <Plus size={18} />
                        Add Service
                      </button>
                    </div>
                  </div>

                  {editingService && (
                    <div className="fixed inset-0 bg-dark/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                      <div className="glass p-10 rounded-[40px] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-2xl font-extrabold text-dark">
                            Edit Service
                          </h3>
                          <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-dark">
                            <X size={24} />
                          </button>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">Title</label>
                            <input 
                              value={editingService.title}
                              onChange={(e) => setEditingService({...editingService, title: e.target.value})}
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">Price</label>
                            <input 
                              value={editingService.price}
                              onChange={(e) => setEditingService({...editingService, price: e.target.value})}
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">Description</label>
                            <textarea 
                              value={editingService.description}
                              onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                              rows={3}
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">What's included (Comma separated)</label>
                            <textarea 
                              value={editingService.features?.join(', ') || ''}
                              onChange={(e) => setEditingService({...editingService, features: e.target.value.split(',').map(f => f.trim()).filter(f => f !== '')})}
                              rows={3}
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 resize-none"
                              placeholder="Feature 1, Feature 2, Feature 3"
                            />
                          </div>
                          <button 
                            onClick={() => {
                              const exists = content.services.find(s => s.title === editingService.title);
                              if (exists) {
                                updateContent({ services: content.services.map(s => s.title === editingService.title ? editingService : s) });
                              } else {
                                updateContent({ services: [...content.services, editingService] });
                              }
                              setEditingService(null);
                              showToast('Service saved!', 'success');
                            }}
                            className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2"
                          >
                            <Save size={20} />
                            Save Service
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-6">
                    {content.services.map((service) => (
                      <div key={service.title} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                        <div>
                          <h4 className="font-bold text-dark">{service.title}</h4>
                          <div className="text-sm font-bold text-primary">{service.price}</div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setEditingService(service)}
                            className="p-3 bg-white text-slate-600 rounded-xl hover:text-primary transition-all"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => deleteService(service.title)} className="p-3 bg-white text-slate-600 rounded-xl hover:text-red-500 transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-extrabold text-dark">Manage Skills</h2>
                    <div className="flex gap-4">
                      <button 
                        onClick={resetSkills}
                        className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
                      >
                        <RotateCcw size={18} />
                        Reset to Defaults
                      </button>
                      <button 
                        onClick={() => setEditingSkill({
                          name: '',
                          proficiency: 80,
                          category: 'frontend',
                          icon: 'Code'
                        })}
                        className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                      >
                        <Plus size={18} />
                        Add Skill
                      </button>
                    </div>
                  </div>

                  {editingSkill && (
                    <div className="fixed inset-0 bg-dark/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                      <div className="glass p-10 rounded-[40px] max-w-2xl w-full">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-2xl font-extrabold text-dark">
                            {content.skills.find(s => s.name === editingSkill.name) ? 'Edit Skill' : 'New Skill'}
                          </h3>
                          <button onClick={() => setEditingSkill(null)} className="text-slate-400 hover:text-dark">
                            <X size={24} />
                          </button>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">Name</label>
                            <input 
                              value={editingSkill.name}
                              onChange={(e) => setEditingSkill({...editingSkill, name: e.target.value})}
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">Proficiency (%)</label>
                            <input 
                              type="number"
                              value={editingSkill.proficiency}
                              onChange={(e) => setEditingSkill({...editingSkill, proficiency: parseInt(e.target.value)})}
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">Category</label>
                            <select 
                              value={editingSkill.category}
                              onChange={(e) => setEditingSkill({...editingSkill, category: e.target.value})}
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4"
                            >
                              <option value="frontend">Frontend</option>
                              <option value="backend">Backend</option>
                              <option value="design">Design</option>
                              <option value="tools">Tools</option>
                            </select>
                          </div>
                          <button 
                            onClick={() => {
                              const exists = content.skills.find(s => s.name === editingSkill.name);
                              if (exists) {
                                updateContent({ skills: content.skills.map(s => s.name === editingSkill.name ? editingSkill : s) });
                              } else {
                                updateContent({ skills: [...content.skills, editingSkill] });
                              }
                              setEditingSkill(null);
                              showToast('Skill saved!', 'success');
                            }}
                            className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2"
                          >
                            <Save size={20} />
                            Save Skill
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-8">
                    {['frontend', 'backend', 'design', 'tools'].map((category) => (
                      <div key={category}>
                        <h3 className="text-lg font-bold text-dark mb-4 uppercase tracking-widest text-slate-400">{category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {content.skills.filter(s => s.category === category).map((skill) => (
                            <div key={skill.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                              <div className="flex items-center gap-3">
                                <div className="font-bold text-dark">{skill.name}</div>
                                <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">{skill.proficiency}%</div>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => setEditingSkill(skill)}
                                  className="p-2 bg-white text-slate-600 rounded-xl hover:text-primary transition-all"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button onClick={() => deleteSkill(skill.name)} className="p-2 bg-white text-slate-600 rounded-xl hover:text-red-500 transition-all">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'testimonials' && (
                <motion.div
                  key="testimonials"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-extrabold text-dark">Client Testimonials</h2>
                    <button 
                      onClick={() => setEditingTestimonial({
                        id: Math.random().toString(36).substr(2, 9),
                        name: '',
                        role: '',
                        content: '',
                        image: 'https://i.pravatar.cc/150?u=' + Math.random(),
                        rating: 5
                      })}
                      className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Add Testimonial
                    </button>
                  </div>

                  {editingTestimonial && (
                    <div className="fixed inset-0 bg-dark/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                      <div className="glass p-10 rounded-[40px] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-2xl font-extrabold text-dark">
                            Edit Testimonial
                          </h3>
                          <button onClick={() => setEditingTestimonial(null)} className="text-slate-400 hover:text-dark">
                            <X size={24} />
                          </button>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <AdminImageUpload 
                              label="Client Photo"
                              value={editingTestimonial.image}
                              onChange={(url) => setEditingTestimonial({...editingTestimonial, image: url})}
                              onUpload={handleImageUpload}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-bold text-slate-600 mb-2">Name</label>
                              <input 
                                value={editingTestimonial.name}
                                onChange={(e) => setEditingTestimonial({...editingTestimonial, name: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-600 mb-2">Role/Company</label>
                              <input 
                                value={editingTestimonial.role}
                                onChange={(e) => setEditingTestimonial({...editingTestimonial, role: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">Rating</label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => setEditingTestimonial({...editingTestimonial, rating: star})}
                                  className={`p-2 rounded-xl transition-all ${
                                    editingTestimonial.rating >= star 
                                      ? 'bg-primary/10 text-primary' 
                                      : 'bg-slate-50 text-slate-300'
                                  }`}
                                >
                                  <Star size={24} fill={editingTestimonial.rating >= star ? 'currentColor' : 'none'} />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">Testimonial Content</label>
                            <textarea 
                              value={editingTestimonial.content}
                              onChange={(e) => setEditingTestimonial({...editingTestimonial, content: e.target.value})}
                              rows={4}
                              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 resize-none"
                            />
                          </div>
                          <button 
                            onClick={() => {
                              const exists = content.testimonials.find(t => t.id === editingTestimonial.id);
                              if (exists) {
                                updateContent({ testimonials: content.testimonials.map(t => t.id === editingTestimonial.id ? editingTestimonial : t) });
                              } else {
                                updateContent({ testimonials: [...content.testimonials, editingTestimonial] });
                              }
                              setEditingTestimonial(null);
                              showToast('Testimonial saved!', 'success');
                            }}
                            className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2"
                          >
                            <Save size={20} />
                            Save Testimonial
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-6">
                    {content.testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl">
                        <img src={testimonial.image} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-dark">{testimonial.name}</h4>
                            <div className="flex text-primary">
                              {Array.from({ length: testimonial.rating }).map((_, i) => (
                                <Star key={i} size={12} fill="currentColor" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{testimonial.role}</p>
                          <p className="text-sm text-slate-500 line-clamp-2 italic">"{testimonial.content}"</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setEditingTestimonial(testimonial)}
                            className="p-3 bg-white text-slate-600 rounded-xl hover:text-primary transition-all"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => deleteTestimonial(testimonial.id)} className="p-3 bg-white text-slate-600 rounded-xl hover:text-red-500 transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'contact' && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-2xl font-extrabold text-dark mb-8">Contact Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Office Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          value={contactForm.address}
                          onChange={(e) => setContactForm({...contactForm, address: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Instagram</label>
                        <input 
                          value={contactForm.instagram}
                          onChange={(e) => setContactForm({...contactForm, instagram: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20"
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">LinkedIn</label>
                        <input 
                          value={contactForm.linkedin}
                          onChange={(e) => setContactForm({...contactForm, linkedin: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20"
                          placeholder="https://linkedin.com/in/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Twitter</label>
                        <input 
                          value={contactForm.twitter}
                          onChange={(e) => setContactForm({...contactForm, twitter: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20"
                          placeholder="https://twitter.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">GitHub</label>
                        <input 
                          value={contactForm.github}
                          onChange={(e) => setContactForm({...contactForm, github: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20"
                          placeholder="https://github.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">CV / Resume URL (Docx/PDF)</label>
                        <input 
                          value={contactForm.cvUrl}
                          onChange={(e) => setContactForm({...contactForm, cvUrl: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20"
                          placeholder="https://drive.google.com/..."
                        />
                      </div>
                    </div>
                    <button onClick={saveContact} className="btn-primary flex items-center gap-2">
                      <Save size={20} />
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'booking' && (
                <motion.div
                  key="booking"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-2xl font-extrabold text-dark mb-8">Booking Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Session Description</label>
                      <textarea 
                        value={bookingForm.description}
                        onChange={(e) => setBookingForm({...bookingForm, description: e.target.value})}
                        rows={3}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Session Duration Label</label>
                        <div className="relative">
                          <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                          <input 
                            value={bookingForm.sessionDuration}
                            onChange={(e) => setBookingForm({...bookingForm, sessionDuration: e.target.value})}
                            className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-primary/20"
                            placeholder="e.g., 30-Minute Strategy Session"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Meeting Platform</label>
                        <div className="relative">
                          <Video className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                          <input 
                            value={bookingForm.meetingPlatform}
                            onChange={(e) => setBookingForm({...bookingForm, meetingPlatform: e.target.value})}
                            className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-primary/20"
                            placeholder="e.g., Google Meet or Zoom Call"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Available Times (Comma separated)</label>
                      <textarea 
                        value={bookingForm.availableTimes.join(', ')}
                        onChange={(e) => setBookingForm({...bookingForm, availableTimes: e.target.value.split(',').map(t => t.trim()).filter(t => t !== '')})}
                        rows={3}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 resize-none"
                        placeholder="09:00 AM, 10:00 AM, 11:00 AM, ..."
                      />
                    </div>
                    <button onClick={saveBooking} className="btn-primary flex items-center gap-2">
                      <Save size={20} />
                      Save Settings
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'bookedSessions' && (
                <motion.div
                  key="bookedSessions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-extrabold text-dark mb-8">Booked Sessions</h2>
                  <div className="space-y-4">
                    {bookedSessions.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-3xl">
                        <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 font-bold">No sessions booked yet.</p>
                      </div>
                    ) : (
                      bookedSessions.map((session) => (
                        <div key={session._id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-primary/20 transition-all">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold">
                                {session.name?.[0] || '?'}
                              </div>
                              <div>
                                <div className="font-bold text-dark text-lg">{session.name}</div>
                                <div className="text-sm text-slate-500 flex items-center gap-2">
                                  <Mail size={14} />
                                  {session.email}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              <div className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 shadow-sm">
                                <Calendar size={14} className="text-primary" />
                                {session.date}
                              </div>
                              <div className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 shadow-sm">
                                <Clock size={14} className="text-primary" />
                                {session.time}
                              </div>
                              <div className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
                                <Video size={14} />
                                {session.service}
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 pt-6 border-t border-slate-200">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Project Details</div>
                            <p className="text-slate-600 text-sm leading-relaxed">{session.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

