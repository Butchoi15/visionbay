import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, Order, Product, User } from '../lib/db';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Package, DollarSign, ShoppingBag, CheckCircle, Clock, Edit, Trash2, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<(Order & { user?: User, product?: Product })[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products'>('overview');
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    const allUsers = await db.getUsers();
    const allOrders = await db.getOrders();
    const allProducts = await db.getProducts();

    setUsers(allUsers.filter(u => u.role === 'user'));
    setProducts(allProducts);

    const enrichedOrders = allOrders.map(order => ({
      ...order,
      user: allUsers.find(u => u.id === order.userId),
      product: allProducts.find(p => p.id === order.productId)
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setOrders(enrichedOrders);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const allOrders = await db.getOrders();
    const order = allOrders.find(o => o.id === orderId);
    if (order) {
      await db.updateOrder({ ...order, status: newStatus });

      const allProducts = await db.getProducts();
      const product = allProducts.find(p => p.id === order.productId);

      await db.addNotification({
        id: crypto.randomUUID(),
        userId: order.userId,
        orderId: order.id,
        message: `Your order for ${product?.name || 'an item'} has been marked as ${newStatus}.`,
        date: new Date().toISOString(),
        read: false
      });

      await loadData();
    }
  };

  const handleUpdateTracking = async (orderId: string) => {
    const allOrders = await db.getOrders();
    const order = allOrders.find(o => o.id === orderId);
    if (order) {
      const trackingNumber = trackingInputs[orderId] || '';
      await db.updateOrder({ ...order, trackingNumber });

      const allProducts = await db.getProducts();
      const product = allProducts.find(p => p.id === order.productId);

      await db.addNotification({
        id: crypto.randomUUID(),
        userId: order.userId,
        orderId: order.id,
        message: `A tracking number (${trackingNumber}) has been added to your order for ${product?.name || 'an item'}.`,
        date: new Date().toISOString(),
        read: false
      });

      await loadData();
      alert('Tracking number updated successfully!');
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await db.deleteProduct(productId);
      await loadData();
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to delete this order/inquiry? This cannot be undone.')) {
      await db.deleteOrder(orderId);
      await loadData();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? All their data will be removed. This cannot be undone.')) {
      await db.deleteUser(userId);
      await loadData();
    }
  };

  if (!user || user.role !== 'admin') return null;

  const totalSales = orders.filter(o => o.status !== 'Inquiry' && o.status !== 'Available').reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage users, orders, and products</p>
        </div>
        <button
          onClick={logout}
          className="text-slate-600 hover:text-red-500 font-medium transition-colors border border-slate-200 hover:border-red-200 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Orders & Inquiries
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'products' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Products
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">{users.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Orders</p>
                <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Sales</p>
                <p className="text-2xl font-bold text-slate-900">${totalSales.toFixed(2)}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                <Package size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Products</p>
                <p className="text-2xl font-bold text-slate-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Orders per User</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-sm">
                    <th className="pb-3 font-medium">User Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Total Orders</th>
                    <th className="pb-3 font-medium">Total Spent</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const userOrders = orders.filter(o => o.userId === u.id);
                    const spent = userOrders.filter(o => o.status !== 'Inquiry' && o.status !== 'Available').reduce((sum, o) => sum + o.totalAmount, 0);
                    return (
                      <tr key={u.id} className="border-b border-slate-50 last:border-0">
                        <td className="py-4 font-medium text-slate-900">{u.name}</td>
                        <td className="py-4 text-slate-500">{u.email}</td>
                        <td className="py-4 font-bold text-slate-900">{userOrders.length}</td>
                        <td className="py-4 text-slate-900">${spent.toFixed(2)}</td>
                        <td className="py-4">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">All Orders & Inquiries</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-slate-200 rounded-2xl p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {order.id}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(order.date).toLocaleString()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${order.status === 'Inquiry' ? 'bg-blue-50 text-blue-700' :
                      order.status === 'Available' ? 'bg-green-50 text-green-700' :
                        order.status === 'Pending' ? 'bg-orange-50 text-orange-700' :
                          'bg-slate-100 text-slate-700'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900">{order.product?.name || 'Unknown Product'}</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    User: <span className="font-medium">{order.user?.name}</span> ({order.user?.email})
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Qty: {order.quantity} • Total: ${order.totalAmount.toFixed(2)}
                  </p>
                  {order.inquiryMessage && (
                    <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm italic text-slate-600">
                      "{order.inquiryMessage}"
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto mt-4 lg:mt-0">
                    {order.status === 'Inquiry' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Available')}
                        className="flex-1 sm:flex-none bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} /> Approve Availability
                      </button>
                    )}
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Completed')}
                        className="flex-1 sm:flex-none bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} /> Mark Completed
                      </button>
                    )}

                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="flex-1 sm:flex-none bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
                    >
                      {expandedOrders[order.id] ? 'Hide Details' : 'View Details'}
                    </button>

                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="flex-1 sm:flex-none bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      title="Delete Order"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>

                {expandedOrders[order.id] && (
                  <div className="w-full mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-900 text-sm mb-3">Shipping Details</h4>
                      {order.shippingDetails ? (
                        <div className="space-y-1 text-sm text-slate-600">
                          <p><span className="font-medium text-slate-900">Name:</span> {order.shippingDetails.fullName}</p>
                          <p><span className="font-medium text-slate-900">Email:</span> {order.shippingDetails.email || order.user?.email}</p>
                          <p><span className="font-medium text-slate-900">Phone:</span> {order.shippingDetails.mobileNumber}</p>
                          <p><span className="font-medium text-slate-900">Address:</span> {order.shippingDetails.streetAddress}</p>
                          <p><span className="font-medium text-slate-900">City:</span> {order.shippingDetails.city}</p>
                          <p><span className="font-medium text-slate-900">State:</span> {order.shippingDetails.state}</p>
                          <p><span className="font-medium text-slate-900">Zip:</span> {order.shippingDetails.zipCode}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 italic">No shipping details provided.</p>
                      )}
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-900 text-sm mb-3">Order Fulfillment</h4>
                      {(order.status === 'Pending' || order.status === 'Completed') ? (
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tracking Number</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Enter tracking #"
                              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                              value={trackingInputs[order.id] !== undefined ? trackingInputs[order.id] : (order.trackingNumber || '')}
                              onChange={(e) => setTrackingInputs({ ...trackingInputs, [order.id]: e.target.value })}
                            />
                            <button
                              onClick={() => handleUpdateTracking(order.id)}
                              className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors whitespace-nowrap"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 italic">Tracking unavailable for this status.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Product Management</h2>
            <Link to="/admin/products/new" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors flex items-center gap-2">
              <Plus size={16} /> Add Product
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-sm">
                  <th className="pb-3 font-medium">Image</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">SKU</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Condition</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-4">
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                    </td>
                    <td className="py-4 font-medium text-slate-900 max-w-[200px] truncate">
                      <Link to={`/product/${p.id}`} target="_blank" className="hover:text-orange-500 hover:underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="py-4 text-slate-500 font-mono text-xs">{p.sku}</td>
                    <td className="py-4 text-slate-500">{p.category}</td>
                    <td className="py-4 text-slate-500">{p.condition || 'New'}</td>
                    <td className="py-4 font-bold text-slate-900">${p.price.toFixed(2)}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/products/${p.id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
