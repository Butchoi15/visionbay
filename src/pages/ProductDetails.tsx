import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Check, ChevronRight, ArrowRight, AlertCircle, CreditCard, Send, Clock, Unlock } from 'lucide-react';
import { db, Product, Order } from '../lib/db';
import { useAuth } from '../context/AuthContext';

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [existingOrder, setExistingOrder] = useState<Order | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const products = await db.getProducts();
        const found = products.find(p => p.id === id);
        if (found) {
          setProduct(found);
          setCurrentImage(found.image);

          // Save to recently viewed
          const viewedIds: string[] = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
          const filteredIds = viewedIds.filter(vId => vId !== found.id);
          const newViewed = [found.id, ...filteredIds].slice(0, 4);
          localStorage.setItem('recentlyViewed', JSON.stringify(newViewed));
        }

        if (user && found) {
          const orders = await db.getOrders();
          const order = orders.find(o => o.userId === user.id && o.productId === found.id && (o.status === 'Inquiry' || o.status === 'Available'));
          if (order) setExistingOrder(order);
        }
      } catch (e) {
        console.error("Failed to fetch product data:", e);
      }
    }
    fetchData();
  }, [id, user]);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Product not found</h2>
        <Link to="/search" className="text-orange-500 hover:underline">Return to shop</Link>
      </div>
    );
  }

  const handleAskAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userId: user.id,
      productId: product.id,
      quantity,
      totalAmount: product.price * quantity,
      status: 'Inquiry',
      date: new Date().toISOString(),
      inquiryMessage
    };

    await db.saveOrder(newOrder);

    // Notify Admins
    try {
      const allUsers = await db.getUsers();
      const admins = allUsers.filter(u => u.role === 'admin');
      for (const admin of admins) {
        await db.addNotification({
          id: `notif-${Date.now()}-${admin.id}`,
          userId: admin.id,
          orderId: newOrder.id,
          message: `New Inquiry from ${user.name} for ${product.name}`,
          date: new Date().toISOString(),
          read: false
        });
      }
    } catch (e) {
      console.error("Failed to notify admins", e);
    }

    setExistingOrder(newOrder);
    setInquirySubmitted(true);
    setShowInquiryForm(false);
  };

  const handleAdminUnlock = async () => {
    if (!user || !product) return;
    setIsUnlocking(true);
    try {
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        userId: user.id,
        productId: product.id,
        quantity,
        totalAmount: product.price * quantity,
        status: 'Available',
        date: new Date().toISOString(),
        inquiryMessage: '[Admin direct unlock]'
      };
      await db.saveOrder(newOrder);
      navigate(`/checkout/${newOrder.id}`);
    } catch (e) {
      console.error('Admin unlock failed:', e);
      setIsUnlocking(false);
    }
  };

  const handleDirectPurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!product) return;
    setIsUnlocking(true);
    try {
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        userId: user.id,
        productId: product.id,
        quantity,
        totalAmount: product.price * quantity,
        status: 'Available',
        date: new Date().toISOString(),
        inquiryMessage: '[Direct Purchase]'
      };
      await db.saveOrder(newOrder);
      navigate(`/checkout/${newOrder.id}`);
    } catch (e) {
      console.error('Direct purchase failed:', e);
      setIsUnlocking(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to={`/search?category=${product.category.toLowerCase()}`} className="hover:text-orange-500 transition-colors">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 relative group"
          >
            <img
              src={currentImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          {/* Interactive Image Gallery */}
          {product.additionalImages && product.additionalImages.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 hide-scrollbar">
              {[product.image, ...product.additionalImages].map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(imgUrl)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${currentImage === imgUrl ? 'border-orange-500 shadow-md scale-105' : 'border-slate-100 hover:border-slate-300'
                    } bg-slate-50`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  SKU: {product.sku}
                </span>
                {product.condition && (
                  <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                    Condition: {product.condition}
                  </span>
                )}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-bold text-orange-500">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              {product.description}
            </p>

            {!product.isUnlocked && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3 mb-8">
                <AlertCircle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-orange-800 font-medium">
                  Please note: Customers must click the "Ask for availability" button before purchasing this item. We carefully verify stock for all items.
                </p>
              </div>
            )}
          </motion.div>

          <div className="space-y-6 mb-8 flex-1">
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-3 uppercase tracking-wider">Quantity</h3>
              <div className="flex items-center border border-slate-200 rounded-full bg-white w-max">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={existingOrder !== null}
                  className="w-12 h-12 flex items-center justify-center text-slate-600 hover:text-orange-500 transition-colors disabled:opacity-50"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={existingOrder !== null}
                  className="w-12 h-12 flex items-center justify-center text-slate-600 hover:text-orange-500 transition-colors disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100">
            {user?.role === 'admin' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">Admin Action</span>
                </div>
                <button
                  onClick={handleAdminUnlock}
                  disabled={isUnlocking}
                  className="w-full h-14 rounded-full font-bold flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isUnlocking ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Unlock size={20} />
                      Unlock &amp; Go to Checkout
                    </>
                  )}
                </button>
              </div>
            )}
            {inquirySubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 text-green-800 p-4 rounded-xl text-sm font-medium flex items-start gap-3"
              >
                <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                Thank you for reaching out! We've received your inquiry and are currently checking the availability of the item. We'll get back to you shortly.
              </motion.div>
            )}

            {product.isUnlocked && existingOrder?.status !== 'Available' && (
              <button
                onClick={handleDirectPurchase}
                disabled={isUnlocking}
                className="w-full h-14 rounded-full font-bold flex items-center justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isUnlocking ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Proceed to checkout
                  </>
                )}
              </button>
            )}

            {!product.isUnlocked && !existingOrder && !showInquiryForm && (
              <button
                onClick={() => {
                  if (!user) navigate('/login');
                  else setShowInquiryForm(true);
                }}
                className="w-full h-14 rounded-full font-bold flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg"
              >
                <Send size={20} />
                Ask for availability
              </button>
            )}

            {!product.isUnlocked && showInquiryForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleAskAvailability}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4"
              >
                <h3 className="font-bold text-slate-900">Check Availability</h3>
                <textarea
                  required
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Any specific questions about this item?"
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowInquiryForm(false)} className="flex-1 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">Submit Inquiry</button>
                </div>
              </motion.form>
            )}

            {!product.isUnlocked && existingOrder && existingOrder.status === 'Inquiry' && !inquirySubmitted && (
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-medium flex items-center gap-3">
                <Clock className="text-blue-600" size={20} />
                Your availability request is pending admin approval.
              </div>
            )}

            <button
              disabled={!existingOrder || existingOrder.status !== 'Available'}
              onClick={() => navigate(`/checkout/${existingOrder?.id}`)}
              className={`w-full h-14 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300 ${existingOrder?.status === 'Available'
                ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
            >
              Proceed to booking
              <ArrowRight size={20} />
            </button>

            <div className="flex items-center justify-center gap-4 pt-4 text-slate-400">
              <div className="flex items-center gap-1 text-xs font-medium"><CreditCard size={16} /> PAYPAL</div>
              <div className="flex items-center gap-1 text-xs font-medium"><CreditCard size={16} /> MASTERCARD</div>
              <div className="flex items-center gap-1 text-xs font-medium"><CreditCard size={16} /> VISA</div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 pt-12 border-t border-slate-200"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Product Features</h2>
        <ul className="space-y-4">
          {product.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-700">
              <div className="mt-1 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-orange-600" />
              </div>
              <span className="text-lg">{feature}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}


