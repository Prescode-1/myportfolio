import { motion } from 'motion/react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <section className="py-24 px-6 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto glass p-10 md:p-16 rounded-[40px] shadow-2xl bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-slate max-w-none"
          >
            <h1 className="text-4xl font-extrabold text-dark mb-8 underline decoration-primary decoration-4 underline-offset-8">
              Privacy <span className="text-primary">Policy</span>
            </h1>
            
            <p className="text-slate-500 mb-8 italic">Last Updated: March 20, 2026</p>

            <div className="space-y-10 text-slate-600 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-dark mb-4">1. Introduction</h2>
                <p>Welcome to PresCode. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-dark mb-4">2. The Data We Collect</h2>
                <p>When you use our contact form or book a session, we may collect the following information:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong>Identity Data:</strong> Full name.</li>
                  <li><strong>Contact Data:</strong> Email address, phone number, and physical address.</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, and location data.</li>
                  <li><strong>Inquiry Data:</strong> Details about the services you are interested in.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-dark mb-4">3. How We Use Your Data</h2>
                <p>We use your data strictly for business communication, session scheduling, and to provide the services you have requested. We do not sell your data to third parties.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-dark mb-4">4. Cookies</h2>
                <p>Our website uses "cookies" to enhance your experience. You can choose to refuse cookies through your browser settings, though some parts of the site may not function correctly.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-dark mb-4">5. Contact Us</h2>
                <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
                <div className="mt-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p><strong>Email:</strong> pukwedeh@gmail.com</p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
