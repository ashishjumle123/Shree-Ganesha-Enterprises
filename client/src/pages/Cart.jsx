import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
                <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" className="w-48 h-48 md:w-64 md:h-64 object-contain mb-6" />
                <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty!</h2>
                <p className="text-gray-500 mb-6 text-center text-sm">Add items to it now.</p>
                <button
                    className="bg-[#2874f0] text-white px-8 py-2 md:py-3 md:px-12 rounded shadow text-sm font-medium"
                    onClick={() => window.history.back()}
                >
                    Shop Now
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-32 md:pb-8">
            {/* Header */}
            <div className="bg-white shadow-sm p-4 sticky top-0 z-10 hidden md:block">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <h1 className="text-lg font-medium text-gray-800">My Cart ({cartItems.length})</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto md:mt-4 md:grid md:grid-cols-12 md:gap-4 p-2 md:p-0">

                {/* Cart Items */}
                <div className="md:col-span-8 bg-white shadow-sm rounded-sm overflow-hidden mb-4 md:mb-0">
                    <div className="p-4 border-b md:hidden"><h2 className="text-base font-medium">My Cart</h2></div>

                    <div className="divide-y divide-gray-200">
                        {cartItems.map((item) => (
                            <div key={item._id} className="p-4 flex flex-row gap-4">
                                {/* Image Section - small on left */}
                                <div className="w-24 h-24 flex-shrink-0">
                                    <img src={item.images[0] || 'https://via.placeholder.com/150'} alt={item.title} className="w-full h-full object-contain" />
                                </div>

                                {/* Details Section - right */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-sm md:text-base text-gray-900 line-clamp-2 leading-snug">{item.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1">Delivery in 2 days</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-sm text-gray-500 line-through">₹{(item.price * 1.25).toLocaleString('en-IN')}</span>
                                            <span className="text-base font-medium text-gray-900">₹{item.price.toLocaleString('en-IN')}</span>
                                            <span className="text-xs font-semibold text-green-600">20% Off</span>
                                        </div>
                                    </div>

                                    {/* Quantity & Actions */}
                                    <div className="flex items-center gap-4 mt-4">
                                        <div className="flex items-center gap-2 border rounded-sm">
                                            <button
                                                className="p-1 w-7 h-7 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full"
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3 h-3 text-gray-600 pointer-events-none" />
                                            </button>
                                            <span className="text-sm w-4 flex justify-center font-medium px-2 border-x">{item.quantity}</span>
                                            <button
                                                className="p-1 w-7 h-7 flex flex-row items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full"
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            >
                                                <Plus className="w-3 h-3 text-gray-600 pointer-events-none" />
                                            </button>
                                        </div>

                                        <button
                                            className="text-gray-500 hover:text-[#fb641b] text-sm ml-auto font-medium py-1 px-2 border md:border-none rounded md:rounded-none"
                                            onClick={() => removeFromCart(item._id)}
                                        >
                                            <span className="hidden md:inline">REMOVE</span>
                                            <Trash2 className="w-4 h-4 md:hidden" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Details (Desktop) */}
                <div className="hidden md:block md:col-span-4 h-fit bg-white shadow-sm rounded-sm p-4 sticky top-24">
                    <h2 className="text-gray-500 font-medium pb-4 border-b uppercase text-sm">Price Details</h2>
                    <div className="pt-4 space-y-4 text-sm">
                        <div className="flex justify-between">
                            <span>Price ({cartItems.length} items)</span>
                            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Charges</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <div className="border-t border-dashed pt-4 flex justify-between font-bold text-lg">
                            <span>Total Amount</span>
                            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    <button onClick={() => navigate('/checkout')} className="w-full bg-[#fb641b] text-white py-3 rounded-sm shadow mt-6 font-medium text-base hover:bg-[#e05615] transition-colors">
                        PLACE ORDER
                    </button>
                </div>
            </div>

            {/* Sticky Bottom Footer for Mobile exactly as requested */}
            <div className="md:hidden fixed bottom-14 left-0 w-full bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-[1050] border-t">
                <div className="flex items-center justify-between p-3 px-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Total Price</span>
                        <span className="text-lg font-bold text-gray-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <button onClick={() => navigate('/checkout')} className="bg-[#fb641b] rounded text-white font-medium py-2.5 px-8 flex items-center justify-center hover:bg-[#e05615] transition-colors shadow-sm">
                        Proceed
                    </button>
                </div>
            </div>

        </div>
    );
}
