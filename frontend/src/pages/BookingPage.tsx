import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Video, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, User, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useContent } from '../context/ContentContext';

export default function BookingPage() {
  const { content } = useContent();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(content.services[0]?.title || '');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const times = content.booking.availableTimes;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      showToast('Please select a date and time', 'error');
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          service: selectedService,
          date: `March ${selectedDate}, 2026`,
          time: selectedTime,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to book session');
      }

      setStep(4);
      showToast('Session booked successfully!', 'success');
    } catch (error) {
      console.error('Booking error:', error);
      showToast('Failed to book session. Please try again.', 'error');
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-dark mb-4"
          >
            Book a <span className="text-primary">Session</span>
          </motion.h1>
          <p className="text-slate-500">{content.booking.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 max-w-md mx-auto relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-slate-400 border border-slate-200'
              }`}
            >
              {step > s ? <CheckCircle2 size={20} /> : s}
            </div>
          ))}
        </div>

        <div className="glass p-8 md:p-12 rounded-[40px] shadow-xl bg-white">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold text-dark mb-6">Select a Service</h2>
                <div className="grid gap-4">
                  {content.services.map((service) => (
                    <button
                      key={service.title}
                      onClick={() => setSelectedService(service.title)}
                      className={`p-6 rounded-3xl text-left transition-all flex items-center justify-between group ${
                        selectedService === service.title
                          ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-lg mb-1">{service.title}</div>
                        <div className={`text-sm ${selectedService === service.title ? 'text-white/80' : 'text-slate-400'}`}>
                          {service.description}
                        </div>
                      </div>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        selectedService === service.title ? 'bg-white/20' : 'bg-white'
                      }`}>
                        <ArrowRight size={20} />
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2"
                >
                  Continue to Schedule
                  <ArrowRight size={20} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-dark">March 2026</h3>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded-xl transition-all"><ChevronLeft size={20} /></button>
                        <button className="p-2 hover:bg-slate-100 rounded-xl transition-all"><ChevronRight size={20} /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center mb-4">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                        <div key={d} className="text-xs font-bold text-slate-400">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {days.map(d => (
                        <button
                          key={d}
                          onClick={() => setSelectedDate(d)}
                          className={`h-10 rounded-xl text-sm font-bold transition-all ${
                            selectedDate === d
                              ? 'bg-primary text-white shadow-lg shadow-primary/30'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-dark mb-6">Available Times</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {times.map(t => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border ${
                            selectedTime === t
                              ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-primary'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-12">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-secondary flex-1 py-4 rounded-2xl"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => step === 2 && selectedDate && selectedTime ? setStep(3) : showToast('Select date and time', 'error')}
                    className="btn-primary flex-[2] py-4 rounded-2xl"
                  >
                    Continue to Details
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-dark mb-8">Confirm Details</h2>
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 ml-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 ml-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 ml-2">Project Description</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-5 top-5 text-slate-400" size={20} />
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell me about your project..."
                        rows={4}
                        className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 mb-8">
                    <h4 className="font-bold text-dark mb-4">Booking Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={16} className="text-primary" />
                        March {selectedDate}, 2026
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock size={16} className="text-primary" />
                        {selectedTime}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Video size={16} className="text-primary" />
                        {content.booking.meetingPlatform}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <CheckCircle2 size={16} className="text-primary" />
                        {selectedService}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-secondary flex-1 py-4 rounded-2xl"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-[2] py-4 rounded-2xl"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-extrabold text-dark mb-4">Booking Confirmed!</h2>
                <p className="text-slate-500 mb-12 max-w-md mx-auto">
                  Thank you for booking a session. I've sent a calendar invitation to <span className="font-bold text-dark">{formData.email}</span> with all the meeting details.
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-primary px-12 py-4 rounded-2xl"
                >
                  Back to Home
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
