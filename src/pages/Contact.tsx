import { motion } from 'motion/react';
import { Send, Clock, HeartHandshake, MessageSquare } from 'lucide-react';
import { useState, FormEvent } from 'react';

export function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Contact Us</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Have questions about a camera, availability, or installation? We're here to help.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
              <Send className="text-orange-500" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Send Us a Message</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Name</label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" placeholder="your@email.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Subject</label>
              <select required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all">
                <option value="">Select a topic...</option>
                <option value="product">Product inquiries</option>
                <option value="availability">Availability checks</option>
                <option value="warranty">Warranty & returns</option>
                <option value="installation">Installation questions</option>
                <option value="order">Order support</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Message</label>
              <textarea required rows={5} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none" placeholder="How can we help you?" />
            </div>

            <button 
              type="submit"
              className="w-full bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2"
            >
              {isSubmitted ? 'Message Sent!' : 'Send Message'}
            </button>
            <p className="text-sm text-slate-500 text-center mt-4">
              Fill out the contact form and our team will respond as soon as possible.
            </p>
          </form>
        </motion.div>

        {/* Info Cards */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full transition-transform duration-500 group-hover:scale-150" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="text-orange-400" size={24} />
                </div>
                <h2 className="text-2xl font-bold">You can contact us for:</h2>
              </div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Product inquiries</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Availability checks</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Warranty & returns</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Installation questions</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Order support</li>
              </ul>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-start gap-6"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Clock className="text-blue-500" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Response Time</h3>
              <p className="text-slate-600">We usually reply within 24 hours during business days.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-orange-50 rounded-3xl p-8 border border-orange-100 shadow-sm flex items-start gap-6"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <HeartHandshake className="text-orange-500" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Customer Support Promise</h3>
              <p className="text-slate-700">We believe security should be affordable and stress-free. Whether you're buying your first camera or upgrading your setup, we're happy to assist you every step of the way.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
