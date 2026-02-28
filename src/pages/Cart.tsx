import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function Cart() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6"
        >
          <ShoppingCart size={48} className="text-slate-300" />
        </motion.div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 max-w-md">Looks like you haven't added any security products to your cart yet.</p>
        <Link 
          to="/search" 
          className="bg-orange-500 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-600 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">My Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                key={`${item.id}-${item.selectedColor}-${item.selectedStorage}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:shadow-xl hover:border-orange-200 transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle hover glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

                <Link to={`/product/${item.id}`} className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                </Link>

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex justify-between items-start gap-4">
                    <Link to={`/product/${item.id}`} className="font-medium text-lg text-slate-900 hover:text-orange-500 transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2 -mr-2"
                      aria-label="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="text-sm text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                    {item.condition && <span>Condition: <span className="font-medium text-orange-600">{item.condition}</span></span>}
                    {item.selectedColor && <span>Color: <span className="font-medium text-slate-700">{item.selectedColor}</span></span>}
                    {item.selectedStorage && <span>Storage: <span className="font-medium text-slate-700">{item.selectedStorage}</span></span>}
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center border border-slate-200 rounded-full bg-slate-50">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-orange-500 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium text-slate-900 text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-orange-500 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-xl font-bold text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-24"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-medium text-slate-900">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax</span>
                <span className="font-medium text-slate-900">${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-3xl font-bold text-orange-500">${(cartTotal * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-orange-500 text-white py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 group"
            >
              Proceed to Checkout
              <motion.span
                className="inline-block"
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <ArrowRight size={20} />
              </motion.span>
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
              <ShieldCheck size={16} className="text-green-500" />
              <span>Secure Checkout Guaranteed</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


