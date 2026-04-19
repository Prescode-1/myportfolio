import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import { useToast } from './Toast';
import { useContent } from '../context/ContentContext';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message is too short'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const { content } = useContent();
  const API_URL = "https://backend-rho-nine-57.vercel.app";
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showToast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for Render cold starts

      const res = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || `Server error (${res.status})`);
      }
      
      setIsSubmitted(true);
      showToast('Message sent successfully! Check your email for confirmation.', 'success');
      reset();
    } catch (error: any) {
      console.error('Submission failed:', error);
      if (error.name === 'AbortError') {
        showToast('Request timed out. The server might be starting up — please try again in 30 seconds.', 'error');
      } else {
        showToast(`Failed to send: ${error.message}. Please try again.`, 'error');
      }
    }
  };




  return (
    <section className="py-24 px-6 relative overflow-hidden" id="contact">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-dark mb-6"
          >
            Get In <span className="text-primary">Touch</span>
          </motion.h2>
          <p className="text-lg text-slate-500 mb-12 leading-relaxed">
            Have a project in mind? Let's discuss how we can build something amazing together. 
            Fill out the form and I'll get back to you within 24 hours.
          </p>

          <div className="space-y-8">
            {[
              { icon: Mail, title: 'Email', value: content.contactInfo.email, color: 'bg-blue-50 text-blue-600' },
              { icon: Phone, title: 'Phone', value: content.contactInfo.phone, color: 'bg-green-50 text-green-600' },
              { icon: MapPin, title: 'Office', value: content.contactInfo.address, color: 'bg-orange-50 text-primary' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-6"
              >
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                  <item.icon size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.title}</div>
                  <div className="text-lg font-bold text-dark">{item.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass p-10 rounded-[40px] shadow-2xl relative"
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: 20 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Full Name</label>
                    <input
                      {...register('fullName')}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="text-xs font-bold text-red-500 ml-1">{errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Email Address</label>
                    <input
                      {...register('email')}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-xs font-bold text-red-500 ml-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Phone Number</label>
                    <input
                      {...register('phone')}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && <p className="text-xs font-bold text-red-500 ml-1">{errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Service Interest</label>
                    <select
                      {...register('service')}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                    >
                      <option value="">Select a service</option>
                      {content.services.map(s => (
                        <option key={s.title} value={s.title}>{s.title}</option>
                      ))}
                      <option value="other">Other</option>
                    </select>
                    {errors.service && <p className="text-xs font-bold text-red-500 ml-1">{errors.service.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Your Message</label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && <p className="text-xs font-bold text-red-500 ml-1">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-extrabold text-dark mb-4">Message Sent!</h3>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                  Thank you for reaching out. I'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="btn-secondary"
                >
                  Send Another Message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
