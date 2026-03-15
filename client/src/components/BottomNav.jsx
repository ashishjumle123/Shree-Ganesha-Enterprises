import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, ShoppingCart, User, Shield, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
    const { totalItems } = useCart();
    const { user, logout } = useAuth();
    const location = useLocation();

    const getStyle = (path) => {
        return location.pathname === path ? 'text-[#2874f0]' : 'text-gray-500 hover:text-[#2874f0]';
    };

    return (
        <nav className="md:hidden fixed bottom-0 left-0 w-full h-[60px] bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-50 flex justify-around items-center border-t">
            <Link to="/" className={`flex flex-col items-center w-1/5 ${getStyle('/')}`}>
                <Home className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium leading-none">Home</span>
            </Link>

            {user?.role === 'admin' ? (
                <Link to="/admin" className={`flex flex-col items-center w-1/5 ${getStyle('/admin')}`}>
                    <Shield className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium leading-none">Admin</span>
                </Link>
            ) : (
                <Link to="/my-orders" className={`flex flex-col items-center w-1/5 ${getStyle('/my-orders')}`}>
                    <Package className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium leading-none">Orders</span>
                </Link>
            )}

            <Link to="/wishlist" className={`flex flex-col items-center w-1/5 ${getStyle('/wishlist')}`}>
                <Heart className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium leading-none">Wishlist</span>
            </Link>

            <Link to="/cart" className={`flex flex-col items-center w-1/5 ${getStyle('/cart')} relative`}>
                <div className="relative">
                    <ShoppingCart className="w-6 h-6 mb-1" />
                    {totalItems > 0 && (
                        <span className="absolute -top-1 -right-2 bg-[#ff6161] text-[10px] w-4 h-4 flex items-center justify-center rounded-full text-white font-bold border border-white">
                            {totalItems}
                        </span>
                    )}
                </div>
                <span className="text-[10px] font-medium leading-none">Cart</span>
            </Link>

            {user ? (
                <Link to="/profile" className={`flex flex-col items-center w-1/5 ${getStyle('/profile')}`}>
                    <User className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium leading-none">Profile</span>
                </Link>
            ) : (
                <Link to="/login" className={`flex flex-col items-center w-1/5 ${getStyle('/login')}`}>
                    <User className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium leading-none">Profile</span>
                </Link>
            )}
        </nav>
    );
}
