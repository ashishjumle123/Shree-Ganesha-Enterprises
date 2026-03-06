import { useState, useEffect } from 'react';
import BASE_URL from '../api';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Box, CheckCircle, CreditCard, MapPin, Package, Truck, XCircle, Download, FileText } from 'lucide-react';
import axios from 'axios';

export default function OrderDetails() {
    const { orderId } = useParams();
    const { token } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`${BASE_URL}/api/orders/${orderId}`, config);
                setOrder(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Fetch order details error", err);
                setError("Could not load order details.");
                setLoading(false);
            }
        };

        if (token) {
            fetchOrderDetails();
        }
    }, [orderId, token]);

    const handleCancelOrder = async () => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.put(`${BASE_URL}/api/orders/${order._id}/cancel`, {}, config);
            setOrder({ ...order, orderStatus: 'Cancelled', paymentStatus: order.paymentStatus === 'Paid' ? 'Refunded' : order.paymentStatus });
            alert("Order cancelled successfully");
        } catch (err) {
            console.error("Cancel order error", err);
            alert(err.response?.data?.message || "Failed to cancel order");
        }
    };

    const getStatusIndex = (status) => {
        const statuses = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
        return statuses.indexOf(status);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
                <Package className="w-12 h-12 text-[#2874f0] animate-bounce mb-4" />
                <div className="animate-pulse font-medium text-gray-500">Loading order details...</div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
                <p className="text-gray-600 mb-6">{error || "We couldn't find the requested order."}</p>
                <Link to="/my-orders" className="text-[#2874f0] hover:underline font-medium">Back to My Orders</Link>
            </div>
        );
    }

    const currentStatusIndex = getStatusIndex(order.orderStatus);
    const isCancelled = order.orderStatus === 'Cancelled';
    const steps = [
        { title: 'Order Placed', icon: Box, active: true, completed: currentStatusIndex >= 0 },
        { title: 'Confirmed', icon: CheckCircle, active: currentStatusIndex >= 1, completed: currentStatusIndex >= 1 },
        { title: 'Packed', icon: Package, active: currentStatusIndex >= 2, completed: currentStatusIndex >= 2 },
        { title: 'Shipped', icon: Truck, active: currentStatusIndex >= 3, completed: currentStatusIndex >= 3 },
        { title: 'Out for Delivery', icon: Package, active: currentStatusIndex >= 4, completed: currentStatusIndex >= 4 },
        { title: 'Delivered', icon: CheckCircle, active: currentStatusIndex >= 5, completed: currentStatusIndex === 5 }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center text-sm">
                    <Link to="/my-orders" className="text-gray-500 hover:text-[#2874f0] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to My Orders
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header Info */}
                    <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 border-b border-gray-200">
                        <div>
                            <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Order #{order.orderId || order._id.substring(order._id.length - 8)}</p>
                            <p className="font-medium text-gray-900">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}</p>
                            {order.trackingId && (
                                <p className="text-sm mt-3 font-medium text-gray-800 bg-gray-200/60 py-1.5 px-3 inline-block rounded-md border border-gray-300">
                                    Tracking ID: <span className="text-[#2874f0] tracking-wide ml-1">{order.trackingId}</span>
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                            <div className="text-left sm:text-right">
                                <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Total Amount</p>
                                <p className="font-bold text-gray-900 text-lg">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="flex gap-2">
                                {['Placed', 'Confirmed', 'Packed'].includes(order.orderStatus) && (
                                    <button
                                        onClick={handleCancelOrder}
                                        className="flex items-center justify-center text-sm font-medium bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 transition shadow-sm"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" /> Cancel Order
                                    </button>
                                )}
                                <Link
                                    to={`/invoice/${order._id}`}
                                    className="flex items-center justify-center text-sm font-medium bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition shadow-sm"
                                >
                                    <FileText className="w-4 h-4 mr-2" /> View Invoice
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="p-6 md:p-8 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 font-headings">Order Tracking</h3>
                        {isCancelled ? (
                            <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-center border border-red-100">
                                <XCircle className="w-6 h-6 mr-3 text-red-500" />
                                <div>
                                    <h4 className="font-bold">Order Cancelled</h4>
                                    <p className="text-sm mt-1">This order has been cancelled and will not be processed further.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Desktop Timeline */}
                                <div className="hidden sm:block absolute left-0 top-6 w-full h-1 bg-gray-200 -z-10 rounded"></div>
                                <div className="hidden sm:block absolute left-0 top-6 h-1 bg-green-500 -z-10 transition-all duration-500 rounded" style={{ width: `${currentStatusIndex >= 0 ? (currentStatusIndex / (steps.length - 1)) * 100 : 0}%` }}></div>

                                <div className="flex flex-col sm:flex-row justify-between relative space-y-8 sm:space-y-0">
                                    {steps.map((step, index) => {
                                        const Icon = step.icon;
                                        return (
                                            <div key={index} className="flex sm:flex-col items-center sm:w-1/5 z-10">
                                                {/* Mobile timeline line */}
                                                {index !== steps.length - 1 && (
                                                    <div className="sm:hidden absolute left-6 top-10 bottom-[-2rem] w-0.5 bg-gray-200 -z-10">
                                                        <div className={`w-full bg-green-500 transition-all ${step.completed ? 'h-full' : 'h-0'}`}></div>
                                                    </div>
                                                )}

                                                <div className={`w-12 h-12 flex items-center justify-center rounded-full border-4 shadow-sm transition-colors ${step.completed ? 'bg-green-500 border-green-100 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="ml-4 sm:ml-0 sm:mt-3 text-left sm:text-center">
                                                    <p className={`font-semibold text-sm ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>{step.title}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x border-b border-gray-100">
                        {/* Address */}
                        <div className="p-6">
                            <h3 className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-4 flex items-center">
                                <MapPin className="w-4 h-4 mr-2" /> Shipping Address
                            </h3>
                            <div className="text-gray-800">
                                <p className="font-semibold text-base text-gray-900">{order.userDetails?.name || order.user?.name}</p>
                                <p className="mt-1">{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
                                <p className="mt-2 text-sm"><span className="text-gray-500">Phone:</span> <span className="font-medium">{order.userDetails?.phone || order.shippingAddress.phone}</span></p>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="p-6">
                            <h3 className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-4 flex items-center">
                                <CreditCard className="w-4 h-4 mr-2" /> Payment Info
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Method</span>
                                    <span className="font-semibold text-gray-900">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Payment Status</span>
                                    <span className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-green-600' : (order.paymentStatus === 'Failed' ? 'text-red-600' : 'text-orange-600')}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Items Total</span>
                                    <span className="text-gray-900">₹{order.itemsPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Shipping Fee</span>
                                    <span className="text-gray-900">₹{order.shippingPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                                    <span className="text-gray-900 font-bold">Total Amount</span>
                                    <span className="text-[#2874f0] font-bold text-lg">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 font-headings border-b pb-2">Items in this order</h3>
                        <div className="space-y-4">
                            {order.orderItems.map((item, index) => (
                                <Link to={`/product/${item.product}`} key={index} className="flex items-center space-x-4 border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                                    <div className="w-20 h-20 flex-shrink-0 bg-white border border-gray-200 rounded overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-medium text-gray-900 hover:text-[#2874f0] truncate">{item.name}</h4>
                                        <p className="text-sm text-gray-500 mt-1">Seller: Shree-Ganesha Enterprises</p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="font-bold text-gray-900">₹{item.price.toLocaleString('en-IN')}</span>
                                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Qty: {item.quantity}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
