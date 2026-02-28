import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db, Order, Product } from '../lib/db';
import { Package, Truck, ArrowLeft, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

export function OrderStatus() {
    const { orderId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [order, setOrder] = useState<(Order & { product?: Product }) | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        async function fetchOrder() {
            if (orderId) {
                try {
                    const allOrders = await db.getOrders();
                    const foundOrder = allOrders.find(o => o.id === orderId && o.userId === user.id);

                    if (foundOrder) {
                        const allProducts = await db.getProducts();
                        const product = allProducts.find(p => p.id === foundOrder.productId);
                        setOrder({ ...foundOrder, product });
                    }
                } catch (e) {
                    console.error("Failed to fetch order:", e);
                }
            }
        }
        fetchOrder();
    }, [orderId, user, navigate]);

    if (!order) {
        return (
            <div className="max-w-3xl mx-auto py-16 text-center">
                <h2 className="text-2xl font-bold text-slate-900">Order Not Found</h2>
                <p className="text-slate-500 mt-2">We couldn't find the order you're looking for.</p>
                <Link to="/dashboard" className="text-orange-500 font-medium hover:underline mt-4 inline-block">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-16">
            <div className="flex items-center gap-4">
                <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Order Status</h1>
                    <p className="text-slate-600 mt-1">Order #{order.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
                    >
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Package className="text-orange-500" /> Order Details
                        </h2>

                        <Link to={`/product/${order.productId}`} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                                {order.product && (
                                    <img src={order.product.image} alt={order.product.name} className="w-full h-full object-cover mix-blend-multiply" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-lg hover:text-orange-500 transition-colors">{order.product?.name || 'Unknown Product'}</h3>
                                {order.product?.condition && (
                                    <div className="mt-1 mb-2">
                                        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                                            {order.product.condition}
                                        </span>
                                    </div>
                                )}
                                <div className="text-slate-500 text-sm">
                                    <p>Quantity: {order.quantity}</p>
                                    <p>Date Ordered: {new Date(order.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right sm:text-left mt-4 sm:mt-0">
                                <div className="font-bold text-xl text-slate-900">${order.totalAmount.toFixed(2)}</div>
                            </div>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
                    >
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Truck className="text-blue-500" /> Shipping Information
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Tracking Number</span>
                                <div className="font-mono text-lg font-medium text-slate-900">
                                    {order.trackingNumber ? order.trackingNumber : <span className="text-orange-500 italic">Pending</span>}
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Shipping Carrier</span>
                                <div className="text-lg font-medium text-slate-900">
                                    Standard Shipping
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-start gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                            <MapPin className="text-orange-500 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm mb-1">Shipping Address</h4>
                                {order.shippingDetails ? (
                                    <div className="text-sm text-slate-700 leading-relaxed">
                                        <span className="font-medium text-slate-900 block">{order.shippingDetails.fullName}</span>
                                        <span className="font-medium text-slate-900 block mb-1">{order.shippingDetails.email || user.email}</span>
                                        {order.shippingDetails.mobileNumber && <span className="block text-xs mb-1">{order.shippingDetails.mobileNumber}</span>}
                                        <span className="block">{order.shippingDetails.streetAddress}</span>
                                        <span className="block">
                                            {order.shippingDetails.city}, {order.shippingDetails.state} {order.shippingDetails.zipCode}
                                        </span>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-700">
                                        {user.address || 'Address details were not recorded for this older order.'}
                                        <br />{user.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />

                        <h2 className="text-xl font-bold mb-6 relative z-10">Order Summary</h2>

                        <div className="space-y-4 text-sm relative z-10">
                            <div className="flex justify-between items-center text-slate-300">
                                <span>Subtotal</span>
                                <span className="text-white">${order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-300">
                                <span>Shipping</span>
                                <span className="text-white">Free</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-300">
                                <span>Tax</span>
                                <span className="text-white">$0.00</span>
                            </div>

                            <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center">
                                <span className="font-bold text-lg">Total</span>
                                <span className="font-bold text-xl text-orange-400">${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
