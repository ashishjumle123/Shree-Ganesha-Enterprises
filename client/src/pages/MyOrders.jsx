import { useState, useEffect } from 'react';
import BASE_URL from '../api';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle, Truck, Box, XCircle, MapPin, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function MyOrders() {
    const { user, token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/orders/myorders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setOrders(data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyOrders();
        }
    }, [user, token]);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            const res = await fetch(`${BASE_URL}/api/orders/${orderId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: 'Cancelled', paymentStatus: o.paymentStatus === 'Paid' ? 'Refunded' : o.paymentStatus } : o));
                alert("Order cancelled successfully");
            } else {
                alert(data.message || "Failed to cancel order");
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            alert("Error cancelling order");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Placed':
            case 'Confirmed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Shipped':
            case 'Out for Delivery':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Placed':
            case 'Confirmed':
                return <Box className="w-4 h-4 mr-1" />;
            case 'Shipped':
            case 'Out for Delivery':
                return <Truck className="w-4 h-4 mr-1" />;
            case 'Delivered':
                return <CheckCircle className="w-4 h-4 mr-1" />;
            case 'Cancelled':
                return <XCircle className="w-4 h-4 mr-1" />;
            default:
                return <Clock className="w-4 h-4 mr-1" />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center flex-col items-center h-screen bg-gray-50">
                <Package className="w-12 h-12 text-[#2874f0] animate-bounce mb-4" />
                <div className="animate-pulse font-medium text-gray-500">Loading your orders...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Package className="w-6 h-6 text-[#2874f0]" /> My Orders
                </h1>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No orders found</h2>
                        <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                        <Link to="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#2874f0] hover:bg-[#1a5ab9] shadow-sm transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow transition-shadow">
                                <div className="bg-gray-50 px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center border-b border-gray-200 text-sm">
                                    <div>
                                        <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Order Placed</p>
                                        <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Total</p>
                                        <p className="font-medium text-gray-900">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="hidden md:block">
                                        <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Ship To</p>
                                        <p className="font-medium text-gray-900 truncate" title={order.userDetails?.name || order.user?.name}>{order.userDetails?.name || order.user?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Order # {order.orderId || order._id.substring(order._id.length - 8)}</p>
                                        <div className="flex flex-col items-end gap-1">
                                            <Link to={`/order/${order._id}`} className="text-[#2874f0] text-sm font-semibold hover:underline">
                                                View Order Details
                                            </Link>
                                            <Link to={`/invoice/${order._id}`} className="text-orange-600 text-xs font-medium hover:underline flex items-center gap-1">
                                                <FileText className="w-3 h-3" /> View Invoice
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
                                        <div className="flex items-center mb-4 md:mb-0">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyle(order.orderStatus)}`}>
                                                {getStatusIcon(order.orderStatus)}
                                                {order.orderStatus}
                                            </span>
                                            {order.orderStatus === 'Placed' && (
                                                <span className="ml-3 text-sm text-gray-600">Your order is confirmed and is being processed</span>
                                            )}
                                        </div>
                                        {['Placed', 'Confirmed', 'Packed'].includes(order.orderStatus) && (
                                            <button
                                                onClick={() => handleCancelOrder(order._id)}
                                                className="text-sm text-red-600 font-medium hover:text-red-800 border border-red-200 hover:bg-red-50 px-3 py-1 rounded-md transition flex items-center gap-1"
                                            >
                                                <XCircle className="w-4 h-4" /> Cancel Order
                                            </button>
                                        )}
                                    </div>

                                    {order.orderItems && order.orderItems.length > 0 && (
                                        <div className="flex items-start md:items-center space-x-4 border border-gray-100 rounded-lg p-4 bg-white">
                                            <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                                                {order.orderItems[0].image ? (
                                                    <img src={order.orderItems[0].image} alt={order.orderItems[0].name} className="w-full h-full object-contain mix-blend-multiply p-2" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <h4 className="text-base md:text-lg font-medium text-gray-900 truncate mb-1" title={order.orderItems[0].name}>{order.orderItems[0].name}</h4>
                                                <p className="text-sm text-gray-500 font-medium">Qty: {order.orderItems[0].quantity} | ₹{order.orderItems[0].price.toLocaleString('en-IN')}</p>
                                                {order.orderItems.length > 1 && (
                                                    <p className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md inline-block w-max mt-2 font-medium">
                                                        + {order.orderItems.length - 1} more item(s) in this order
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
