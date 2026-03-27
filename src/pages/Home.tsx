import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Video, HardDrive, Bell, Zap, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { db, Product } from '../lib/db';

const heroSlides = [
  {
    badge: 'Professional Security Solutions',
    title: ['Upgrade Your', 'Home Security'],
    desc: 'Explore high-quality 4K cameras, smart alarms & NVR systems with fast, free shipping.',
    primaryCta: { label: 'Shop Now', link: '/search' },
    secondaryCta: { label: 'View Deals', link: '/search?category=deals' },
    bgImage: '/images/media__1772288490305.png',
    sideImage: '/images/media__1772288490327.png',
  },
  {
    badge: 'Deals of the Week',
    title: ['Smart Security,', 'Better Prices'],
    desc: 'From entry-level IP cameras to full NVR systems — protect what matters most, for less.',
    primaryCta: { label: 'View Deals', link: '/search?category=deals' },
    secondaryCta: { label: 'Browse All', link: '/search' },
    bgImage: '/images/media__1772288490210.png',
    sideImage: null,
  },
  {
    badge: 'Remote Monitoring',
    title: ['Monitor From', 'Anywhere'],
    desc: 'Stay connected to your property with real-time alerts and remote access from any device.',
    primaryCta: { label: 'Shop Cameras', link: '/search?category=cameras' },
    secondaryCta: { label: 'CCTV Systems', link: '/search?category=cctv' },
    bgImage: '/images/media__1772288490327.png',
    sideImage: null,
  },
];

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const allProducts = await db.getProducts();
        setProducts(allProducts);
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

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(0);

  const goToSlide = useCallback((index: number, dir?: number) => {
    setDirection(dir ?? (index > currentSlide ? 1 : -1));
    setCurrentSlide(index);
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % heroSlides.length;
    goToSlide(next, 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
    goToSlide(prev, -1);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const deals = products.filter(p => p.originalPrice).reverse().slice(0, 4);
  const featuredProducts = products.slice(0, 8);

  if (products.length === 0) return null;

  const slide = heroSlides[currentSlide];

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <div className="space-y-10 pb-16">

      {/* Hero Carousel */}
      <section
        className="relative rounded-2xl overflow-hidden min-h-[420px] flex items-center bg-slate-900 select-none"
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
        }}
      >
        {/* Background image — fades on slide change */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`bg-${currentSlide}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={slide.bgImage}
              alt=""
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-slate-900/30" />
          </motion.div>
        </AnimatePresence>

        {/* Slide content */}
        <div className="relative z-10 px-6 sm:px-8 md:px-14 py-10 sm:py-14 max-w-2xl w-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`content-${currentSlide}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            >
              <span className="inline-block text-orange-400 text-xs font-bold uppercase tracking-[0.15em] mb-4 border border-orange-400/30 bg-orange-400/10 px-3 py-1.5 rounded-full">
                {slide.badge}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight tracking-tight">
                {slide.title[0]}<br />{slide.title[1]}
              </h1>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-lg">
                {slide.desc}
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <Link
                  to={slide.primaryCta.link}
                  className="inline-flex items-center gap-2 bg-orange-500 text-white px-7 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 text-sm"
                >
                  {slide.primaryCta.label}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to={slide.secondaryCta.link}
                  className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-7 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all text-sm backdrop-blur-sm"
                >
                  {slide.secondaryCta.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right side image */}
        <AnimatePresence mode="sync">
          {slide.sideImage && (
            <motion.div
              key={`side-${currentSlide}`}
              className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={slide.sideImage}
                alt="VisionBay"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/30 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prev / Next arrows — desktop only, swipe on mobile */}
        <button
          onClick={prevSlide}
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full items-center justify-center text-white transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={nextSlide}
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full items-center justify-center text-white transition-all"
          aria-label="Next slide"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all rounded-full ${idx === currentSlide ? 'w-6 h-2 bg-orange-500' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
          <motion.div
            key={currentSlide}
            className="h-full bg-orange-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5.5, ease: 'linear' }}
          />
        </div>
      </section>

      {/* Promo Cards Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-between p-8 min-h-[180px] group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="z-10">
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-2">Best Sellers</p>
            <h3 className="text-xl font-bold text-white mb-3">Top Security.<br />Better Prices.</h3>
            <Link
              to="/search?category=cameras"
              className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Shop Cameras <ArrowRight size={12} />
            </Link>
          </div>
          <div className="z-10 flex-shrink-0">
            <img
              src="/images/media__1772288490210.png"
              alt="Security Cameras"
              className="w-36 h-28 object-cover rounded-xl opacity-90 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden flex items-center justify-between p-8 min-h-[180px] group border border-slate-100"
          style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="z-10">
            <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest mb-2">Outdoor Protection</p>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Secure It With<br />Confidence.</h3>
            <Link
              to="/search?category=accessories"
              className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Shop Accessories <ArrowRight size={12} />
            </Link>
          </div>
          <div className="z-10 flex-shrink-0">
            <img
              src="/images/media__1772288490305.png"
              alt="Outdoor Camera"
              className="w-36 h-28 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </motion.div>
      </section>

      {/* Category Icons */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">Shop by Category</h2>
          <Link to="/search" className="text-orange-500 text-sm font-medium hover:text-orange-600 flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { name: 'CCTV Systems', icon: Video, link: '/search?category=cctv' },
            { name: 'IP Cameras', icon: Shield, link: '/search?category=cameras' },
            { name: 'Recorders', icon: HardDrive, link: '/search?category=recorders' },
            { name: 'Smart Alarms', icon: Bell, link: '/search?category=alarms' },
            { name: 'Accessories', icon: Zap, link: '/search?category=accessories' },
          ].map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
            >
              <Link
                to={cat.link}
                className="flex flex-col items-center justify-center gap-3 p-5 bg-white border border-slate-100 rounded-xl hover:border-orange-200 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                  <cat.icon size={22} className="text-orange-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="font-medium text-slate-700 text-sm text-center group-hover:text-slate-900">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Deals Section */}
      {deals.length > 0 && (
        <section className="bg-slate-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 rounded-none sm:rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Limited Time</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Deals of the Day</h2>
            </div>
            <Link to="/search?category=deals" className="text-orange-500 text-sm font-medium hover:text-orange-600 flex items-center gap-1 border border-orange-200 bg-orange-50 px-4 py-2 rounded-lg">
              See all deals <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {deals.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="flex flex-col bg-white rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 group overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-slate-50 overflow-hidden">
                    {product.originalPrice && (
                      <span className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">{product.category}</p>
                    <h3 className="font-medium text-slate-900 text-sm line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors leading-snug">
                      {product.name}
                    </h3>
                    {product.condition && (
                      <span className="inline-block text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded mb-2">
                        {product.condition}
                      </span>
                    )}
                    <div className="flex items-baseline gap-2 mt-auto pt-2 border-t border-slate-50">
                      <span className="text-base font-bold text-slate-900">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Featured Products</h2>
          <Link to="/search" className="text-orange-500 text-sm font-medium hover:text-orange-600 flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                to={`/product/${product.id}`}
                className="flex flex-col bg-white rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 group overflow-hidden h-full"
              >
                <div className="relative aspect-square bg-slate-50 overflow-hidden">
                  {product.originalPrice && (
                    <span className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      SALE
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{product.category}</p>
                  <h3 className="font-medium text-slate-900 text-sm line-clamp-2 group-hover:text-orange-600 transition-colors flex-1 leading-snug">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-3 pt-3 border-t border-slate-50">
                    <span className="text-base font-bold text-slate-900">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="pt-8 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-5">Recently Viewed</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentlyViewed.map((product, idx) => (
              <motion.div
                key={`recent-${product.id}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07 }}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="flex gap-3 items-center bg-white rounded-xl p-3 border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-xs text-slate-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="font-bold text-sm text-slate-900 mt-1">${product.price.toFixed(2)}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
