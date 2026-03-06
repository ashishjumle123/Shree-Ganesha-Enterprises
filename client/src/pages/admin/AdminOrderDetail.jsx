import { useState, useEffect } from 'react';
import BASE_URL from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    ArrowLeft, Package, Truck, CheckCircle, Box, XCircle,
    MapPin, CreditCard, RefreshCw, User, Phone, Mail, Hash, FileText
} from 'lucide-react';

const ALL_STATUSES = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const STATUS_COLORS = {
    Placed: 'bg-blue-100 text-blue-800',
    Confirmed: 'bg-indigo-100 text-indigo-800',
    Packed: 'bg-yellow-100 text-yellow-800',
    Shipped: 'bg-purple-100 text-purple-800',
    'Out for Delivery': 'bg-orange-100 text-orange-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
};

const TIMELINE_STEPS = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function AdminOrderDetail({ orderId, onBack }) {
    const { token } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setOrder(data);
                    setSelectedStatus(data.orderStatus);
                } else {
                    toast.error(data.message || 'Failed to load order');
                }
            } catch (err) {
                toast.error('Error loading order');
            } finally {
                setLoading(false);
            }
        };
        if (token && orderId) fetchOrder();
    }, [orderId, token]);

    const handleStatusUpdate = async () => {
        if (selectedStatus === order.orderStatus) return;
        setUpdating(true);
        try {
            const res = await fetch(`${BASE_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ orderStatus: selectedStatus })
            });
            const data = await res.json();
            if (res.ok) {
                setOrder(data);
                setSelectedStatus(data.orderStatus);
                toast.success(`Order status updated to ${selectedStatus}`);
            } else {
                toast.error(data.message || 'Update failed');
            }
        } catch (err) {
            toast.error('Error updating status');
        } finally {
            setUpdating(false);
        }
    };


    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2874f0] mb-3"></div>
            <p className="text-gray-500 text-sm">Loading order details...</p>
        </div>
    );

    if (!order) return (
        <div className="text-center py-16">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-gray-600">Order not found.</p>
            <button onClick={onBack} className="mt-4 text-[#2874f0] hover:underline">← Back to Orders</button>
        </div>
    );

    const currentStatusIndex = TIMELINE_STEPS.indexOf(order.orderStatus);
    const isCancelled = order.orderStatus === 'Cancelled';
    const customerName = order.userDetails?.name || order.user?.name || 'Unknown';

    return (
        <div className="space-y-6">
            {/* Back + Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <button onClick={onBack} className="flex items-center text-gray-500 hover:text-[#2874f0] text-sm mb-2 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Orders
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">
                        Order #{order.orderId || order._id?.slice(-8).toUpperCase()}
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                </div>
                <Link
                    to={`/invoice/${orderId}`}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow"
                >
                    <FileText className="w-4 h-4" /> View / Download Invoice
                </Link>
            </div>

            {/* Status Update Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Update Order Status</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                        Current: {order.orderStatus}
                    </span>
                    <select
                        value={selectedStatus}
                        onChange={e => setSelectedStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                    >
                        {ALL_STATUSES.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleStatusUpdate}
                        disabled={updating || selectedStatus === order.orderStatus}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} />
                        {updating ? 'Updating...' : 'Update Status'}
                    </button>
                    {order.trackingId && (
                        <span className="flex items-center gap-1 text-sm bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1.5 rounded-lg font-mono">
                            <Hash className="w-3 h-3" /> {order.trackingId}
                        </span>
                    )}
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                <h3 className="font-semibold text-gray-800 mb-5">Order Timeline</h3>
                {isCancelled ? (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg">
                        <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                        <div>
                            <p className="font-bold">Order Cancelled</p>
                            <p className="text-sm">This order has been cancelled.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between relative">
                        <div className="absolute left-0 top-5 w-full h-0.5 bg-gray-200"></div>
                        <div
                            className="absolute left-0 top-5 h-0.5 bg-green-500 transition-all duration-700"
                            style={{ width: `${currentStatusIndex >= 0 ? (currentStatusIndex / (TIMELINE_STEPS.length - 1)) * 100 : 0}%` }}
                        ></div>
                        {TIMELINE_STEPS.map((step, i) => {
                            const done = currentStatusIndex >= i;
                            const icons = [Box, CheckCircle, Package, Truck, Package, CheckCircle];
                            const Icon = icons[i];
                            return (
                                <div key={step} className="flex flex-col items-center z-10 w-1/6">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${done ? 'bg-green-500 border-green-200 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <p className={`text-xs mt-2 text-center font-medium ${done ? 'text-gray-800' : 'text-gray-400'}`}>{step}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Customer + Payment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <User className="w-4 h-4 text-[#2874f0]" /> Customer Details
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span className="font-semibold">{customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>{order.userDetails?.email || order.user?.email || '—'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>{order.userDetails?.phone || order.shippingAddress?.phone || '—'}</span>
                        </div>
                    </div>
                    <h3 className="font-semibold text-gray-800 mt-5 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#2874f0]" /> Shipping Address
                    </h3>
                    <div className="text-sm text-gray-700 space-y-1">
                        <p>{order.shippingAddress?.address}</p>
                        <p>{order.shippingAddress?.city} - {order.shippingAddress?.pincode}</p>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#2874f0]" /> Payment Details
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Method</span>
                            <span className="font-semibold text-gray-800">{order.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : order.paymentStatus === 'Failed' ? 'text-red-600' : 'text-orange-500'}`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                        {order.paymentResult?.id && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Transaction ID</span>
                                <span className="font-mono text-xs text-gray-700">{order.paymentResult.id}</span>
                            </div>
                        )}
                        <hr className="border-gray-100" />
                        <div className="flex justify-between">
                            <span className="text-gray-500">Subtotal</span>
                            <span>₹{order.itemsPrice?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Shipping</span>
                            <span>₹{order.shippingPrice?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold">
                            <span className="text-gray-800">Grand Total</span>
                            <span className="text-[#2874f0]">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                <h3 className="font-semibold text-gray-800 mb-4">
                    Products ({order.orderItems?.length || 0} item{order.orderItems?.length !== 1 ? 's' : ''})
                </h3>
                <div className="space-y-3">
                    {(order.orderItems || []).map((item, i) => (
                        <div key={i} className="flex items-center gap-4 border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                            <img
                                src={item.image || 'https://via.placeholder.com/80'}
                                alt={item.name}
                                className="w-16 h-16 object-contain rounded border border-gray-100 bg-white p-1 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="font-bold text-gray-800">₹{item.price?.toLocaleString('en-IN')}</p>
                                <p className="text-xs text-gray-500">× {item.quantity} = ₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
