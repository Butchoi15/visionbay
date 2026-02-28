import { motion } from 'motion/react';
import { ShieldAlert, Package, RefreshCcw, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Returns() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Return & Warranty Policy</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          At VisionBay, we carefully test all products before selling them to ensure they are fully functional and reliable. Please read our policy carefully.
        </p>
      </motion.div>

      <div className="grid gap-8">
        {/* Returns Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
              <Package className="text-orange-500" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Returns</h2>
          </div>
          
          <div className="space-y-6 text-slate-600">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">We accept returns under the following conditions:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>The item arrives damaged or not working.</li>
                <li>The item is significantly different from the description.</li>
                <li>The issue is reported within 7 days of receiving the item.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">To qualify for a return:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>The item must be in the same condition as received.</li>
                <li>All included accessories must be returned.</li>
                <li>Proof of purchase is required.</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-2">Please note:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Change-of-mind returns are not accepted.</li>
                <li>Items damaged due to improper installation or misuse are not eligible for return.</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Warranty Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <ShieldAlert className="text-blue-500" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Warranty</h2>
          </div>
          
          <div className="space-y-6 text-slate-600">
            <p>All cameras include a limited warranty covering functional defects.</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 text-green-600">Warranty coverage includes:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Power issues</li>
                  <li>Hardware malfunction</li>
                  <li>Camera feed or recording failure (not caused by user setup)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2 text-red-500">Warranty does NOT cover:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Physical damage</li>
                  <li>Water damage or misuse</li>
                  <li>Software or network configuration issues</li>
                  <li>Normal cosmetic wear</li>
                </ul>
              </div>
            </div>

            <div className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium">
              Warranty period: 15 Days from delivery date.
            </div>
          </div>
        </motion.section>

        {/* How to Request Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white shadow-xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <RefreshCcw className="text-orange-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold">How to Request a Return or Warranty Claim</h2>
          </div>
          
          <div className="space-y-6 text-slate-300">
            <ol className="list-decimal pl-5 space-y-3">
              <li><Link to="/contact" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">Contact us</Link> through our Contact Page.</li>
              <li>Provide your order number and a clear description of the issue.</li>
              <li>Include photos or videos showing the problem.</li>
              <li>Our team will review your request and guide you through the next steps.</li>
            </ol>

            <div className="pt-6 border-t border-white/10 flex items-center gap-3">
              <Mail className="text-orange-400" size={20} />
              <p className="font-medium text-white">We aim to make the process simple, fair, and fast.</p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
