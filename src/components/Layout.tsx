import { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, LogOut, LayoutDashboard, Settings, Bell, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/db';
import { BackgroundEffects } from './BackgroundEffects';
import { motion, AnimatePresence } from 'motion/react';

export function Layout({ children }: { children: ReactNode }) {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    async function loadNotifications() {
      await db.init();
      if (user) {
        try {
          const fetchedNotifications = await db.getNotifications(user.id);
          setNotifications(fetchedNotifications);
        } catch (e) {
          console.error("Failed to load notifications:", e);
        }
      }
    }
    loadNotifications();
  }, [user, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await db.markNotificationRead(id);
      if (user) {
        const updated = await db.getNotifications(user.id);
        setNotifications(updated);
      }
    } catch (e) {
      console.error("Failed to update notification:", e);
    }
  };

  const handleUserClick = () => {
    if (user) {
      setShowDropdown(!showDropdown);
    } else {
      navigate('/login');
    }
  };

  const categories = [
    { label: 'Deals', link: '/search?category=deals', hot: true },
    { label: 'CCTV Systems', link: '/search?category=cctv' },
    { label: 'IP Cameras', link: '/search?category=cameras' },
    { label: 'NVR/DVR Recorders', link: '/search?category=recorders' },
    { label: 'Smart Alarms', link: '/search?category=alarms' },
    { label: 'Accessories', link: '/search?category=accessories' },
  ];

  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <BackgroundEffects />

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[70px] gap-6">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="/images/logo/VisionbaylogoNB.png"
                alt="VisionBay"
                className="h-14 w-auto object-contain"
              />
            </Link>

            {/* Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const q = formData.get('q');
                if (q) navigate(`/search?q=${encodeURIComponent(q.toString())}`);
              }}
              className="hidden md:flex flex-1 max-w-xl relative"
            >
              <input
                type="text"
                name="q"
                placeholder="Search for cameras, recorders, alarms..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 bg-orange-500 text-white px-4 rounded-r-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-1.5 text-sm font-medium"
              >
                <Search size={15} />
                <span className="hidden lg:inline">Search</span>
              </button>
            </form>

            {/* Nav Icons */}
            <div className="flex items-center gap-1">

              {/* User */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleUserClick}
                  className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-slate-600 hover:text-orange-500 hover:bg-slate-50 transition-all group"
                >
                  <User size={18} />
                  <span className="text-[10px] font-medium hidden sm:block">
                    {user ? user.name.split(' ')[0] : 'Sign In'}
                  </span>
                </button>

                <AnimatePresence>
                  {showDropdown && user && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                      </div>

                      {user.role === 'admin' ? (
                        <Link
                          to="/admin"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-500 transition-colors"
                        >
                          <LayoutDashboard size={15} /> Admin Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-500 transition-colors"
                        >
                          <LayoutDashboard size={15} /> My Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-500 transition-colors"
                      >
                        <Settings size={15} /> Profile Settings
                      </Link>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => { setShowDropdown(false); logout(); }}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                        >
                          <LogOut size={15} /> Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications */}
              {user && (
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-slate-600 hover:text-orange-500 hover:bg-slate-50 transition-all relative"
                  >
                    <Bell size={18} />
                    <span className="text-[10px] font-medium hidden sm:block">Alerts</span>
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 max-h-[400px] overflow-y-auto"
                      >
                        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
                          <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                              {unreadCount} New
                            </span>
                          )}
                        </div>
                        {notifications.length > 0 ? (
                          <div className="divide-y divide-slate-50">
                            {notifications.map((notif) => (
                              <div
                                key={notif.id}
                                className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${!notif.read ? 'bg-orange-50/40' : ''}`}
                                onClick={() => {
                                  if (!notif.read) handleMarkAsRead(notif.id);
                                  setShowNotifications(false);
                                  navigate(user.role === 'admin' ? '/admin' : '/dashboard');
                                }}
                              >
                                <p className={`text-sm ${!notif.read ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                                  {notif.message}
                                </p>
                                <span className="text-xs text-slate-400 mt-1 block">
                                  {new Date(notif.date).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-8 text-center text-sm text-slate-500">
                            No new notifications
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-slate-600 hover:text-orange-500 hover:bg-slate-50 transition-all relative"
              >
                <ShoppingCart size={18} />
                <span className="text-[10px] font-medium hidden sm:block">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1 bg-orange-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center p-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Category Nav - desktop */}
          <nav className="hidden md:flex items-center gap-1 py-2 border-t border-slate-100 overflow-x-auto hide-scrollbar">
            <Link
              to="/search"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-800 hover:text-orange-500 transition-colors whitespace-nowrap rounded-md hover:bg-slate-50"
            >
              <Menu size={14} />
              All Categories
            </Link>
            <span className="text-slate-200 mx-1">|</span>
            {categories.map((cat) => (
              <Link
                key={cat.label}
                to={cat.link}
                className={`relative px-3 py-1.5 text-sm transition-colors whitespace-nowrap rounded-md hover:bg-slate-50 ${
                  cat.hot ? 'text-orange-500 font-semibold hover:text-orange-600' : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                {cat.label}
                {cat.hot && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] font-bold px-1 rounded-sm leading-3 py-0.5">HOT</span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const q = formData.get('q');
                    if (q) {
                      navigate(`/search?q=${encodeURIComponent(q.toString())}`);
                      setMobileMenuOpen(false);
                    }
                  }}
                  className="flex mb-4"
                >
                  <input
                    type="text"
                    name="q"
                    placeholder="Search products..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-l-lg py-2.5 px-4 text-sm focus:outline-none focus:border-orange-500"
                  />
                  <button type="submit" className="bg-orange-500 text-white px-4 rounded-r-lg">
                    <Search size={16} />
                  </button>
                </form>
                {categories.map((cat) => (
                  <Link
                    key={cat.label}
                    to={cat.link}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${cat.hot ? 'text-orange-500' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Trust Badges */}
      <div className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
                title: 'Free Shipping',
                desc: 'On all orders over $99'
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                ),
                title: 'Secure Payment',
                desc: 'PayPal, Visa & Mastercard'
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                  </svg>
                ),
                title: '1-Year Warranty',
                desc: 'On all products sold'
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                ),
                title: 'Expert Support',
                desc: 'Mon–Sat, 9am–6pm'
              },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-4">
                <div className="text-orange-500 flex-shrink-0">{item.icon}</div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Strip */}
      <div className="bg-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-white text-lg">Subscribe & Save 10%</h3>
              <p className="text-orange-100 text-sm mt-1">Get the latest deals, security tips and exclusive offers.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 md:w-72 bg-white/20 border border-white/30 text-white placeholder-orange-200 rounded-l-lg px-4 py-2.5 text-sm focus:outline-none focus:bg-white/30 transition-colors"
              />
              <button className="bg-slate-900 text-white px-6 py-2.5 rounded-r-lg text-sm font-semibold hover:bg-slate-800 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

            {/* Brand */}
            <div>
              <img
                src="/images/logo/VisionbaylogoNB.png"
                alt="VisionBay"
                className="h-14 w-auto object-contain mb-4 brightness-0 invert"
              />
              <p className="text-sm leading-relaxed">
                Your trusted partner for home and business security solutions. Quality products, expert support.
              </p>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Products</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: 'CCTV Systems', link: '/search?category=cctv' },
                  { label: 'IP Cameras', link: '/search?category=cameras' },
                  { label: 'NVR/DVR Recorders', link: '/search?category=recorders' },
                  { label: 'Smart Alarms', link: '/search?category=alarms' },
                  { label: 'Accessories', link: '/search?category=accessories' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link to={item.link} className="hover:text-orange-400 transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: 'Contact Us', link: '/contact' },
                  { label: 'Installation Guide', link: '/installation' },
                  { label: 'Returns & Warranty', link: '/returns' },
                  { label: 'Track My Order', link: '/order-status' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link to={item.link} className="hover:text-orange-400 transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">My Account</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: 'Sign In / Register', link: '/login' },
                  { label: 'My Dashboard', link: '/dashboard' },
                  { label: 'Profile Settings', link: '/profile' },
                  { label: 'Shopping Cart', link: '/cart' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link to={item.link} className="hover:text-orange-400 transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} VisionBay. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <span className="text-slate-500">We accept:</span>
              <div className="flex items-center gap-2">
                {/* Visa */}
                <div className="h-7 px-2.5 bg-[#1A1F71] rounded flex items-center justify-center">
                  <span className="text-white font-black italic text-sm tracking-tight leading-none" style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}>VISA</span>
                </div>
                {/* Mastercard */}
                <div className="h-7 px-2 bg-[#1A1A1A] rounded flex items-center justify-center">
                  <div className="relative flex items-center">
                    <div className="w-5 h-5 rounded-full bg-[#EB001B]" />
                    <div className="w-5 h-5 rounded-full bg-[#F79E1B] -ml-2.5" />
                  </div>
                </div>
                {/* PayPal */}
                <div className="h-7 px-2.5 bg-[#003087] rounded flex items-center justify-center">
                  <span className="font-bold italic text-sm leading-none" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <span className="text-[#009CDE]">Pay</span><span className="text-white">Pal</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
