import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, Order, Product } from '../lib/db';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, ArrowRight, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

export function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<(Order & { product?: Product })[]>([]);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  const [editFormDetails, setEditFormDetails] = useState({
    fullName: '',
    email: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const loadOrders = async () => {
    if (!user) return;

    const allOrders = await db.getOrders();
    const userOrders = allOrders.filter(o => o.userId === user.id);
    const products = await db.getProducts();

    const ordersWithProducts = userOrders.map(order => ({
      ...order,
      product: products.find(p => p.id === order.productId)
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setOrders(ordersWithProducts);
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [user, navigate]);

  const startEditing = (order: Order) => {
    // Populate form with existing shipping details or fallbacks
    setEditFormDetails({
      fullName: order.shippingDetails?.fullName || user?.name || '',
      email: order.shippingDetails?.email || user?.email || '',
      streetAddress: order.shippingDetails?.streetAddress || '',
      city: order.shippingDetails?.city || '',
      state: order.shippingDetails?.state || '',
      zipCode: order.shippingDetails?.zipCode || ''
    });
    setEditingOrderId(order.id);
  };

  const handleSaveDetails = async (e: React.FormEvent, order: Order) => {
    e.preventDefault();

    // Merge new details keeping mobileNumber if it exists
    const updatedDetails = {
      ...order.shippingDetails,
      ...editFormDetails,
      mobileNumber: order.shippingDetails?.mobileNumber || ''
    };

    const updatedOrder = { ...order, shippingDetails: updatedDetails };
    await db.updateOrder(updatedOrder);
    setEditingOrderId(null);
    await loadOrders();
    alert('Shipping details updated successfully!');
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, {user.name}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Package className="text-orange-500" /> My Orders & Inquiries
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No orders yet</h3>
            <p className="text-slate-500 mb-6">You haven't placed any orders or inquiries.</p>
            <Link to="/search" className="bg-orange-500 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={order.id}
                className="border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                  {order.product && (
                    <img src={order.product.image} alt={order.product.name} className="w-full h-full object-cover mix-blend-multiply" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {order.id}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 line-clamp-1">{order.product?.name || 'Unknown Product'}</h3>
                  {order.product?.condition && (
                    <div className="mt-1">
                      <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                        {order.product.condition}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-slate-500 mt-1">
                    Qty: {order.quantity} • Total: ${order.totalAmount.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${order.status === 'Inquiry' ? 'bg-blue-50 text-blue-700' :
                    order.status === 'Available' ? 'bg-green-50 text-green-700' :
                      order.status === 'Pending' ? 'bg-orange-50 text-orange-700' :
                        'bg-slate-100 text-slate-700'
                    }`}>
                    {order.status === 'Inquiry' && <Clock size={12} />}
                    {order.status === 'Available' && <CheckCircle size={12} />}
                    {order.status === 'Pending' && <Clock size={12} />}
                    {order.status === 'Completed' && <CheckCircle size={12} />}
                    {order.status}
                  </div>

                  {order.status === 'Available' && (
                    <Link
                      to={`/checkout/${order.id}`}
                      className="w-full md:w-auto text-center bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                    >
                      Proceed to Payment <ArrowRight size={16} />
                    </Link>
                  )}
                  {order.status === 'Pending' && (
                    <button
                      onClick={() => editingOrderId === order.id ? setEditingOrderId(null) : startEditing(order)}
                      className="w-full md:w-auto text-center bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                      {editingOrderId === order.id ? 'Cancel Editing' : 'Edit Details'}
                    </button>
                  )}
                  {order.status === 'Completed' && (
                    <Link
                      to={`/order/${order.id}`}
                      className="w-full md:w-auto text-center bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      View Order Details <ArrowRight size={16} />
                    </Link>
                  )}
                </div>

                {/* Edit Form Expansion */}
                {editingOrderId === order.id && order.status === 'Pending' && (
                  <div className="w-full mt-4 pt-4 border-t border-slate-100">
                    <form onSubmit={(e) => handleSaveDetails(e, order)} className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-100 grid gap-4 grid-cols-1 md:grid-cols-2">
                      <h4 className="font-bold text-slate-900 text-sm md:col-span-2 mb-2">Update Shipping Details</h4>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Full Name</label>
                        <input
                          required
                          type="text"
                          value={editFormDetails.fullName}
                          onChange={(e) => setEditFormDetails({ ...editFormDetails, fullName: e.target.value })}
                          className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Email Address</label>
                        <input
                          required
                          type="email"
                          value={editFormDetails.email}
                          onChange={(e) => setEditFormDetails({ ...editFormDetails, email: e.target.value })}
                          className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-semibold text-slate-700">Street Address</label>
                        <input
                          required
                          type="text"
                          value={editFormDetails.streetAddress}
                          onChange={(e) => setEditFormDetails({ ...editFormDetails, streetAddress: e.target.value })}
                          className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">City</label>
                        <input
                          required
                          type="text"
                          value={editFormDetails.city}
                          onChange={(e) => setEditFormDetails({ ...editFormDetails, city: e.target.value })}
                          className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">State / Province</label>
                        <input
                          required
                          type="text"
                          value={editFormDetails.state}
                          onChange={(e) => setEditFormDetails({ ...editFormDetails, state: e.target.value })}
                          className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Zip / Postal Code</label>
                        <input
                          required
                          type="text"
                          value={editFormDetails.zipCode}
                          onChange={(e) => setEditFormDetails({ ...editFormDetails, zipCode: e.target.value })}
                          className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="md:col-span-2 flex justify-end mt-2">
                        <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
