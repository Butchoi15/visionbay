import { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, ShieldCheck, LogOut, LayoutDashboard, Settings, Bell } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/db';
import { BackgroundEffects } from './BackgroundEffects';
import { motion } from 'motion/react';

export function Layout({ children }: { children: ReactNode }) {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
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
  }, [user, location.pathname]); // Reload notifications on navigation


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

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 relative">
      <BackgroundEffects />

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div whileHover={{ rotate: 15 }} className="text-orange-500">
                <ShieldCheck size={28} strokeWidth={2.5} />
              </motion.div>
              <span className="font-bold text-xl tracking-tight">VisionBay</span>
            </Link>

            {/* Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const q = formData.get('q');
                if (q) {
                  navigate(`/search?q=${encodeURIComponent(q.toString())}`);
                }
              }}
              className="hidden md:flex flex-1 max-w-md mx-8 relative group"
            >
              <input
                type="text"
                name="q"
                placeholder="Search for security products..."
                className="w-full bg-slate-100/50 border border-slate-200 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all group-hover:bg-white"
              />
              <button type="submit" className="absolute right-1 top-1 bottom-1 bg-orange-500 text-white px-4 rounded-full hover:bg-orange-600 transition-colors flex items-center justify-center">
                <Search size={16} />
              </button>
            </form>

            {/* Icons */}
            <div className="flex items-center gap-6">
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={handleUserClick}
                  className="text-slate-600 hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <User size={20} />
                  {user && <span className="text-sm font-medium hidden sm:block">{user.name}</span>}
                </motion.button>

                {showDropdown && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-4 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 overflow-hidden z-50 flex flex-col"
                  >
                    {user.role === 'admin' ? (
                      <Link
                        to="/admin"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-500 transition-colors"
                      >
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-500 transition-colors"
                      >
                        <LayoutDashboard size={16} /> My Dashboard
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-500 transition-colors"
                    >
                      <Settings size={16} /> Profile Settings
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        logout();
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </motion.div>
                )}
              </div>
              {/* Notifications Dropdown */}
              {user && (
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative text-slate-600 hover:text-orange-500 transition-colors p-1"
                  >
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Bell size={20} />
                    </motion.div>
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white"
                      >
                        {unreadCount}
                      </motion.span>
                    )}
                  </button>

                  {/* Notifications Panel */}
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 max-h-[400px] overflow-y-auto"
                    >
                      <div className="px-4 pb-2 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h3 className="font-bold text-slate-900">Notifications</h3>
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
                              className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${!notif.read ? 'bg-orange-50/30' : ''}`}
                              onClick={() => {
                                if (!notif.read) handleMarkAsRead(notif.id);
                                setShowNotifications(false);
                                if (user.role === 'admin') {
                                  navigate('/admin');
                                } else {
                                  navigate('/dashboard');
                                }
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
                        <div className="px-4 py-6 text-center text-sm text-slate-500">
                          No new notifications
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              <Link to="/cart" className="relative text-slate-600 hover:text-orange-500 transition-colors">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <ShoppingCart size={20} />
                </motion.div>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
              <button className="md:hidden text-slate-600">
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Categories Nav */}
          <nav className="hidden md:flex items-center gap-6 py-3 text-sm font-medium text-slate-600 border-t border-slate-100">
            <Link to="/search" className="flex items-center gap-2 text-slate-900 hover:text-orange-500 transition-colors">
              <Menu size={16} />
              SHOP BY CATEGORY
            </Link>
            <Link to="/search?category=deals" className="text-orange-500 hover:text-orange-600 relative">
              Deals
              <span className="absolute -top-2 -right-2 bg-orange-100 text-orange-600 text-[8px] px-1 rounded-full">HOT</span>
            </Link>
            <Link to="/search?category=cctv" className="hover:text-orange-500 transition-colors">CCTV Systems</Link>
            <Link to="/search?category=cameras" className="hover:text-orange-500 transition-colors">IP Cameras</Link>
            <Link to="/search?category=recorders" className="hover:text-orange-500 transition-colors">NVR/DVR Recorders</Link>
            <Link to="/search?category=alarms" className="hover:text-orange-500 transition-colors">Smart Alarms</Link>
            <Link to="/search?category=accessories" className="hover:text-orange-500 transition-colors">Accessories</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white mb-4">
              <ShieldCheck size={24} className="text-orange-500" />
              <span className="font-bold text-lg">VisionBay</span>
            </div>
            <p className="text-sm text-slate-400">Your trusted partner in home and business security solutions.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/search" className="hover:text-orange-400 transition-colors">CCTV Cameras</Link></li>
              <li><Link to="/search" className="hover:text-orange-400 transition-colors">Video Recorders</Link></li>
              <li><Link to="/search" className="hover:text-orange-400 transition-colors">Smart Home Security</Link></li>
              <li><Link to="/search" className="hover:text-orange-400 transition-colors">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-orange-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/installation" className="hover:text-orange-400 transition-colors">Installation Guide</Link></li>
              <li><Link to="/returns" className="hover:text-orange-400 transition-colors">Returns & Warranty</Link></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Subscribe</h4>
            <p className="text-sm text-slate-400 mb-4">Get the latest security tips and exclusive offers.</p>
            <div className="flex">
              <input type="email" placeholder="Email address" className="bg-slate-800 border border-slate-700 rounded-l-md px-4 py-2 w-full focus:outline-none focus:border-orange-500" />
              <button className="bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600 transition-colors">Subscribe</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
