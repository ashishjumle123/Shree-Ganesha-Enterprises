import { useState, useEffect } from 'react';
import BASE_URL from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, Filter, Eye, XCircle, FileText } from 'lucide-react';

export default function ManageOrders({ onViewOrder }) {
    const { user, token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [paymentFilter, setPaymentFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('All Time');

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setOrders(data);
            } else {
                console.error('Fetch orders error:', data);
                toast.error(data.message || 'Failed to load orders');
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && token) {
            fetchOrders();
        }
    }, [user, token]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${BASE_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ orderStatus: newStatus })
            });

            if (res.ok) {
                toast.success(`Order status updated to ${newStatus}`);
                setOrders(orders.map(order =>
                    order._id === orderId ? { ...order, orderStatus: newStatus } : order
                ));
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Error updating status");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Placed':
            case 'Confirmed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Packed':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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

    const filteredOrders = orders.filter(order => {
        const matchesSearch = !searchTerm ||
            (order.orderId && order.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order._id && order._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.userDetails && order.userDetails.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.user && order.user.name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
        const matchesPayment = paymentFilter === 'All' || order.paymentMethod === paymentFilter;

        let matchesDate = true;
        if (dateFilter !== 'All Time') {
            const orderDate = new Date(order.createdAt);
            const now = new Date();
            const daysDiff = (now - orderDate) / (1000 * 60 * 60 * 24);

            if (dateFilter === 'Last 7 Days') {
                matchesDate = daysDiff <= 7;
            } else if (dateFilter === 'Last 30 Days') {
                matchesDate = daysDiff <= 30;
            }
        }

        return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });

    const allStatuses = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2874f0]"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 xl:flex justify-between items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 xl:mb-0">All Orders</h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <input
                            type="text"
                            placeholder="Search by ID or Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] text-sm"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                    {/* Status Filter */}
                    <div className="relative flex-shrink-0">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] text-sm appearance-none"
                        >
                            <option value="All">All Statuses</option>
                            {allStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                    {/* Payment Filter */}
                    <div className="relative flex-shrink-0">
                        <select
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value)}
                            className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] text-sm appearance-none"
                        >
                            <option value="All">All Payments</option>
                            <option value="Razorpay">Razorpay</option>
                            <option value="COD">Cash on Delivery</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                    {/* Date Filter */}
                    <div className="relative flex-shrink-0">
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] text-sm appearance-none"
                        >
                            <option value="All Time">All Time</option>
                            <option value="Last 7 Days">Last 7 Days</option>
                            <option value="Last 30 Days">Last 30 Days</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 border-y border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Info</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions & Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                                    <div className="flex justify-center items-center py-4 bg-gray-50 rounded-lg max-w-sm mx-auto">
                                        No matching orders found.
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-blue-600 font-bold font-mono hover:underline cursor-pointer">
                                            {order.orderId || `...${order._id.substring(order._id.length - 6)}`}
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{order.userDetails?.name || order.user?.name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500 bg-gray-100 rounded px-1.5 py-0.5 inline-block">{order.orderItems?.length || 0} items</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-bold">
                                            ₹{order.totalPrice?.toLocaleString('en-IN') || 0}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-800">{order.paymentMethod}</div>
                                        <div className={`text-xs font-bold uppercase ${order.paymentStatus === 'Paid' ? 'text-green-600' : (order.paymentStatus === 'Failed' ? 'text-red-600' : 'text-orange-500')}`}>
                                            {order.paymentStatus}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <select
                                                    value={order.orderStatus}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className={`text-xs font-bold uppercase rounded p-1.5 focus:outline-none focus:ring-2 focus:ring-[#2874f0] cursor-pointer appearance-none ${getStatusStyle(order.orderStatus)}`}
                                                >
                                                    {allStatuses.map(status => (
                                                        <option key={status} value={status}>{status}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex items-center space-x-3 pt-1 border-t border-gray-100">
                                                <button
                                                    onClick={() => onViewOrder && onViewOrder(order._id)}
                                                    className="text-[#2874f0] hover:text-blue-700 flex items-center text-xs font-medium"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" /> View
                                                </button>
                                                <Link
                                                    to={`/invoice/${order._id}`}
                                                    className="text-orange-600 hover:text-orange-800 flex items-center text-xs font-medium"
                                                >
                                                    <FileText className="w-4 h-4 mr-1" /> Invoice
                                                </Link>
                                                {order.orderStatus !== 'Cancelled' && (
                                                    <button onClick={() => handleStatusChange(order._id, 'Cancelled')} className="text-red-500 hover:text-red-700 flex items-center text-xs font-medium">
                                                        <XCircle className="w-4 h-4 mr-1" /> Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
