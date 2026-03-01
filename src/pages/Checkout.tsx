import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MapPin, CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import { db, Order, Product } from '../lib/db';
import { useAuth } from '../context/AuthContext';

export function Checkout() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function loadOrder() {
      try {
        const orders = await db.getOrders();
        const foundOrder = orders.find(o => o.id === orderId && o.userId === user.id);
        if (foundOrder) {
          setOrder(foundOrder);
          const products = await db.getProducts();
          const foundProduct = products.find(p => p.id === foundOrder.productId);
          if (foundProduct) setProduct(foundProduct);
        } else {
          navigate('/');
        }
      } catch (e) {
        console.error("Failed to load checkout details:", e);
      }
    }
    loadOrder();

  }, [orderId, user, navigate]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!order) return;

    const enteredAmount = parseFloat(paymentAmount);
    if (isNaN(enteredAmount) || enteredAmount !== order.totalAmount) {
      setPaymentError(`Amount must match the total price: $${order.totalAmount.toFixed(2)}`);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const shippingDetails = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      mobileNumber: formData.get('mobileNumber') as string,
      streetAddress: formData.get('streetAddress') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zipCode: formData.get('zipCode') as string,
    };

    setIsSubmitting(true);
    setPaymentError('');

    // Simulate API call
    setTimeout(async () => {
      // Update order status and attach shipping details
      const updatedOrder = { ...order, status: 'Pending' as const, shippingDetails };
      await db.updateOrder(updatedOrder);

      // Notify Admins
      try {
        const allUsers = await db.getUsers();
        const admins = allUsers.filter(u => u.role === 'admin');
        for (const admin of admins) {
          await db.addNotification({
            id: `notif-${Date.now()}-${admin.id}`,
            userId: admin.id,
            orderId: updatedOrder.id,
            message: `New Order Pending: ${updatedOrder.id} from ${shippingDetails.fullName}`,
            date: new Date().toISOString(),
            read: false
          });
        }
      } catch (e) {
        console.error("Failed to send admin notification", e);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (!order || !product) return null;

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle size={48} className="text-green-500" />
        </motion.div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Booking Confirmed!</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg">
          Thank you for your purchase! Please check your email shortly. We’ll send your quotation and payment link so you can complete your order.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 max-w-md w-full text-left">
          <p className="text-sm text-slate-500 mb-1">Order ID</p>
          <p className="font-mono font-bold text-slate-900 mb-4">{order.id}</p>

          <div className="flex gap-4 items-center mb-4">
            <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-white" />
            <div>
              <p className="font-medium text-slate-900 line-clamp-1">{product.name}</p>
              <p className="text-sm text-slate-500">Qty: {order.quantity}</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <span className="text-slate-600">Status</span>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">Pending</span>
          </div>
        </div>
        <Link
          to="/dashboard"
          className="bg-orange-500 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-600 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
        >
          View My Orders
        </Link>
      </div >
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="text-orange-500" /> Shipping Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input required name="fullName" type="text" defaultValue={user?.name} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <input required name="email" type="email" defaultValue={user?.email} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Mobile Number</label>
                  <input required name="mobileNumber" type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Street Address</label>
                  <input required name="streetAddress" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" placeholder="123 Security Blvd" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">City</label>
                  <input required name="city" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" placeholder="City" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">State / Province</label>
                  <input required name="state" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" placeholder="State" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Zip / Postal Code</label>
                  <input required name="zipCode" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all" placeholder="Zip Code" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CreditCard className="text-orange-500" /> Payment
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Payment Amount ($)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-lg font-bold"
                    placeholder={order.totalAmount.toFixed(2)}
                  />
                  {paymentError && <p className="text-red-500 text-sm mt-1">{paymentError}</p>}
                </div>
              </div>
            </motion.div>

            <div className="flex justify-end gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-500 text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Confirm Payment'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-50 rounded-3xl p-8 border border-slate-100 sticky top-24"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-900 line-clamp-2">{product.name}</h4>
                  <div className="text-xs text-slate-500 mt-1">Qty: {order.quantity}</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">${(product.price * order.quantity).toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-medium text-slate-500 text-sm">being calculated</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-3xl font-bold text-orange-500">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
