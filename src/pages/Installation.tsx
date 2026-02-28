import { motion } from 'motion/react';
import { PackageOpen, MapPin, PlugZap, Settings, Eye, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Installation() {
  const steps = [
    {
      icon: PackageOpen,
      title: "1️⃣ Check the Package",
      content: (
        <>
          <p className="mb-3">Before installation, make sure you have:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Camera unit</li>
            <li>Power adapter</li>
            <li>Mounting accessories (if included)</li>
            <li>Network cable or Wi-Fi details</li>
          </ul>
        </>
      )
    },
    {
      icon: MapPin,
      title: "2️⃣ Choose the Right Location",
      content: (
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li>Place cameras where they have a clear view.</li>
          <li>Avoid direct sunlight pointing into the lens.</li>
          <li>Install at a height that reduces tampering.</li>
        </ul>
      )
    },
    {
      icon: PlugZap,
      title: "3️⃣ Power & Connection",
      content: (
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li>Connect the camera to power.</li>
          <li>For wired units, connect to your router or DVR/NVR.</li>
          <li>For Wi-Fi models, follow the app setup instructions.</li>
        </ul>
      )
    },
    {
      icon: Settings,
      title: "4️⃣ Configure the Camera",
      content: (
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li>Download the recommended mobile app or software.</li>
          <li>Connect the camera to your network.</li>
          <li>Set your password and security settings.</li>
        </ul>
      )
    },
    {
      icon: Eye,
      title: "5️⃣ Test Before Final Mounting",
      content: (
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li>Check live view and recording.</li>
          <li>Adjust camera angle as needed.</li>
          <li>Confirm night vision and motion detection work properly.</li>
        </ul>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Installation Guide (General)</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Thank you for choosing our security cameras. Follow these general steps for a smooth setup.
        </p>
      </motion.div>

      <div className="space-y-8 relative">
        {/* Vertical Line connecting steps */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 hidden md:block" />

        {steps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: idx * 0.1 }}
            className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
          >
            {/* Content */}
            <div className={`flex-1 w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative group hover:shadow-md transition-shadow ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
              <h3 className={`text-xl font-bold text-slate-900 mb-4 flex items-center gap-3 ${idx % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                {step.title}
              </h3>
              <div className={`text-slate-600 ${idx % 2 === 0 ? 'md:ml-auto' : ''}`}>
                {step.content}
              </div>
            </div>

            {/* Icon Circle */}
            <div className="w-12 h-12 rounded-full bg-orange-500 border-4 border-white shadow-lg flex items-center justify-center relative z-10 flex-shrink-0 text-white">
              <step.icon size={20} />
            </div>

            {/* Spacer for alternating layout */}
            <div className="flex-1 hidden md:block" />
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-orange-50 rounded-3xl p-8 md:p-10 border border-orange-100 shadow-sm mt-16"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <AlertTriangle className="text-orange-500" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">⚠️ Important Notes</h2>
        </div>
        
        <ul className="space-y-3 text-slate-700">
          <li className="flex items-start gap-3">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
            <span>Installation requirements may vary depending on model.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
            <span>Professional installation is recommended for complex setups.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
            <span>Improper installation may void warranty coverage.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
            <span className="font-medium">If you need help, <Link to="/contact" className="text-orange-600 hover:underline">contact us</Link> — we're happy to guide you.</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
