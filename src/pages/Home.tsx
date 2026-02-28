import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Video, HardDrive, Bell, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db, Product } from '../lib/db';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const allProducts = await db.getProducts();
        setProducts(allProducts);

        // Load recently viewed
        const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const viewedProducts = viewedIds
          .map((id: string) => allProducts.find(p => p.id === id))
          .filter((p: Product | undefined): p is Product => p !== undefined);
        setRecentlyViewed(viewedProducts);
      } catch (e) {
        console.error("Failed to load products from Firebase:", e);
      }
    }
    loadData();
  }, []);

  const deals = products.filter(p => p.originalPrice).reverse().slice(0, 4);

  if (products.length === 0) return null;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Grid Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 bg-gradient-to-br from-slate-100 to-slate-200/50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group"
        >
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="z-10 max-w-md mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Upgrade Your Home Security
            </h1>
            <p className="text-slate-600 mb-8 text-lg">
              Explore high-quality 4K cameras, smart alarms, & NVR systems with fast, free shipping.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-600 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] group/btn"
            >
              Shop Now
              <motion.span
                className="inline-block"
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <ArrowRight size={18} />
              </motion.span>
            </Link>
          </div>
          <div className="z-10 relative">
            <motion.img
              src="/images/media__1772288490327.png"
              alt="Security System"
              className="w-full max-w-[300px] object-cover rounded-2xl shadow-2xl"
              whileHover={{ y: -10, rotate: 2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          </div>
        </motion.div>

        {/* Side Cards */}
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-50 rounded-3xl p-8 flex flex-col justify-between h-full relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border border-slate-100"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-full transition-transform duration-500 group-hover:scale-150" />
            <div className="z-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Top Security. Better Prices</h3>
              <p className="text-slate-600 mb-6">Explore smart cameras</p>
              <Link to="/search?category=cameras" className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors">
                Shop Now
              </Link>
            </div>
            <div className="mt-6 self-end z-10">
              <img src="/images/media__1772288490210.png" alt="Camera" className="w-32 h-32 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#f4f7f4] rounded-3xl p-8 flex flex-col justify-between h-full relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border border-green-50"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full transition-transform duration-500 group-hover:scale-150" />
            <div className="z-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Secure It With Confidence</h3>
              <p className="text-slate-600 mb-6">Explore genuine accessories</p>
              <Link to="/search?category=accessories" className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors">
                Shop Now
              </Link>
            </div>
            <div className="mt-6 self-end z-10">
              <img src="/images/media__1772288490305.png" alt="Accessories" className="w-32 h-32 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Row */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: 'CCTV Systems', icon: Video, link: '/search?category=cctv' },
            { name: 'IP Cameras', icon: Shield, link: '/search?category=cameras' },
            { name: 'Recorders', icon: HardDrive, link: '/search?category=recorders' },
            { name: 'Smart Alarms', icon: Bell, link: '/search?category=alarms' },
            { name: 'Accessories', icon: Zap, link: '/search?category=accessories' },
          ].map((cat, idx) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                <cat.icon size={28} className="text-slate-600 group-hover:text-orange-500 transition-colors" />
              </div>
              <span className="font-medium text-slate-700 group-hover:text-slate-900">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals Section */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 inline-block relative">
            Deals
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-orange-500 rounded-full" />
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={`/product/${product.id}`}
                className="block bg-white rounded-2xl p-4 border border-slate-100 hover:shadow-2xl hover:border-orange-200 transition-all duration-300 group relative"
              >
                {/* Discount Badge */}
                {product.originalPrice && (
                  <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </div>
                )}

                <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-slate-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <h3 className="font-medium text-slate-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>

                {product.condition && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                      {product.condition}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <section className="pt-8 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Recently Viewed</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentlyViewed.map((product, idx) => (
              <motion.div
                key={`recent-${product.id}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="block bg-white rounded-xl p-3 border border-slate-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-slate-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-medium text-sm text-slate-900 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="font-bold text-slate-900">${product.price.toFixed(2)}</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
