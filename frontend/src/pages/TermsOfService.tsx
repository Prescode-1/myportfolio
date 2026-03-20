import { motion } from 'motion/react';

export default function TermsOfService() {
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
              Terms <span className="text-primary">of Service</span>
            </h1>
            
            <p className="text-slate-500 mb-8 italic">Last Updated: March 20, 2026</p>

            <div className="space-y-10 text-slate-600 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-dark mb-4">1. Agreement to Terms</h2>
                <p>By accessing or using our services at PresCode, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the services.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-dark mb-4">2. Professional Services</h2>
                <p>Any project timeline, cost, or deliverables discussed via our contact forms or booking systems are subject to a formal agreement or contract before work begins. Payments and deposits are handled separately.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-dark mb-4">3. Intellectual Property</h2>
                <p>The content, organization, graphics, and design aspects of this website are protected under applicable copyrights and trademarks. You may not reproduce, distribute, or otherwise use these materials without our express written permission.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-dark mb-4">4. Limitation of Liability</h2>
                <p>PresCode will not be liable for any indirect, incidental, or consequential damages arising out of your use of this website or its services.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-dark mb-4">5. Governing Law</h2>
                <p>These terms shall be governed by and interpreted in accordance with the laws of project location, without regard to its conflict of law provisions.</p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
