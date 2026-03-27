import React, { useState, useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Check, ChevronRight, ArrowRight, AlertCircle, Send, Clock, Unlock, Shield, Truck, RotateCcw, FileText } from 'lucide-react';
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

  const safeDescription = useMemo(() => {
    if (!product?.description) return '';
    return DOMPurify.sanitize(product.description, {
      ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'ul', 'ol', 'li', 'p', 'br', 'hr', 'span'],
      ALLOWED_ATTR: [],
    });
  }, [product?.description]);

  if (!product) {
    return (
      <div className="text-center py-24">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Product not found</h2>
        <Link to="/search" className="text-orange-500 hover:underline text-sm">Return to shop</Link>
      </div>
    );
  }

  const handleAskAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
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
    if (!user) { navigate('/login'); return; }
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
    <div className="pb-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-8">
        <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <ChevronRight size={13} />
        <Link to={`/search?category=${product.category.toLowerCase()}`} className="hover:text-orange-500 transition-colors">{product.category}</Link>
        <ChevronRight size={13} />
        <span className="text-slate-900 font-medium truncate max-w-[220px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100"
          >
            <img
              src={currentImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover mix-blend-multiply"
            />
          </motion.div>

          {product.additionalImages && product.additionalImages.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {[product.image, ...product.additionalImages].map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(imgUrl)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-slate-50 ${currentImage === imgUrl ? 'border-orange-500 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            {/* SKU + Condition */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                SKU: {product.sku}
              </span>
              {product.condition && (
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded border border-orange-100">
                  {product.condition}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-bold text-orange-500">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <div
              className="product-description text-slate-600 leading-relaxed mb-6 text-[15px]"
              dangerouslySetInnerHTML={{ __html: safeDescription }}
            />

            {product.specSheet && (
              <a
                href={product.specSheet}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all mb-6"
              >
                <FileText size={15} className="text-red-500" />
                Download Spec Sheet (PDF)
                <ArrowRight size={13} />
              </a>
            )}

            {!product.isUnlocked && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-6">
                <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-amber-800">
                  Please click <strong>"Ask for availability"</strong> before purchasing. We verify stock on all items.
                </p>
              </div>
            )}
          </motion.div>

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">Quantity</p>
            <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={existingOrder !== null}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 text-lg font-medium"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold text-slate-900 text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                disabled={existingOrder !== null}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 text-lg font-medium"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pb-6 border-b border-slate-100 mb-6">
            {user?.role === 'admin' && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded inline-block">Admin Action</span>
                <button
                  onClick={handleAdminUnlock}
                  disabled={isUnlocking}
                  className="w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200/50 disabled:opacity-60 text-sm"
                >
                  {isUnlocking ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Unlock size={16} /> Unlock & Go to Checkout</>}
                </button>
              </div>
            )}

            {inquirySubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 text-green-800 p-4 rounded-xl text-sm flex items-start gap-3 border border-green-100"
              >
                <Check className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                Thank you! We've received your inquiry and will get back to you shortly.
              </motion.div>
            )}

            {product.isUnlocked && existingOrder?.status !== 'Available' && (
              <button
                onClick={handleDirectPurchase}
                disabled={isUnlocking}
                className="w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-md shadow-orange-200/50 disabled:opacity-60 text-sm"
              >
                {isUnlocking ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><ShoppingCart size={16} /> Proceed to Checkout</>}
              </button>
            )}

            {!product.isUnlocked && !existingOrder && !showInquiryForm && (
              <button
                onClick={() => { if (!user) navigate('/login'); else setShowInquiryForm(true); }}
                className="w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 transition-all text-sm"
              >
                <Send size={15} /> Ask for Availability
              </button>
            )}

            {!product.isUnlocked && showInquiryForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleAskAvailability}
                className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3"
              >
                <h3 className="font-bold text-slate-900 text-sm">Check Availability</h3>
                <textarea
                  required
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Any specific questions about this item?"
                  className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowInquiryForm(false)} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors">Submit Inquiry</button>
                </div>
              </motion.form>
            )}

            {!product.isUnlocked && existingOrder && existingOrder.status === 'Inquiry' && !inquirySubmitted && (
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm flex items-center gap-3 border border-blue-100">
                <Clock className="text-blue-500" size={16} />
                Your availability request is pending admin approval.
              </div>
            )}

            <button
              disabled={!existingOrder || existingOrder.status !== 'Available'}
              onClick={() => navigate(`/checkout/${existingOrder?.id}`)}
              className={`w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm ${existingOrder?.status === 'Available' ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-200/50' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            >
              Proceed to Booking
              <ArrowRight size={16} />
            </button>

            {/* Payment methods */}
            <div className="flex items-center justify-center gap-2 pt-1">
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

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: 'Free Shipping', sub: 'Orders over $99' },
              { icon: Shield, label: '1-Year Warranty', sub: 'All products' },
              { icon: RotateCcw, label: 'Easy Returns', sub: '30-day policy' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center p-3 bg-slate-50 rounded-xl">
                <item.icon size={18} className="text-orange-500 mb-1.5" />
                <p className="text-[11px] font-semibold text-slate-900">{item.label}</p>
                <p className="text-[10px] text-slate-500">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 pt-10 border-t border-slate-100"
      >
        <h2 className="text-xl font-bold text-slate-900 mb-6">Product Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {product.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
              <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={11} className="text-orange-600" strokeWidth={3} />
              </div>
              <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
