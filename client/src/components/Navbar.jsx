import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingCart, User, Layers, ChevronDown, Heart, Package, LogOut, Settings, Menu, X, Phone, Home as HomeIcon } from 'lucide-react';
import ganeshaLogo from '../assets/ganesha-logo.png';

export default function Navbar() {
    const { totalItems } = useCart();
    const { user, logout } = useAuth();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [keyword, setKeyword] = useState(searchParams.get('search') || '');

    // Mobile search and menu toggles
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const firstName = user?.name ? user.name.split(' ')[0] : '';

    // Lordicon ref — safely mount web component after CDN loads
    const lordIconRef = useRef(null);
    useEffect(() => {
        const container = lordIconRef.current;
        if (!container || container.querySelector('lord-icon')) return;

        const mountIcon = () => {
            const icon = document.createElement('lord-icon');
            icon.setAttribute('src', 'https://cdn.lordicon.com/lewtedlh.json');
            icon.setAttribute('trigger', 'hover');
            icon.setAttribute('stroke', 'light');
            icon.setAttribute('state', 'hover-pinch');
            icon.setAttribute('colors', 'primary:#ffffff,secondary:#c7d9ff');
            icon.style.width = '38px';
            icon.style.height = '38px';
            icon.style.display = 'block';
            container.appendChild(icon);
        };

        // Wait for lordicon custom element to be registered by the CDN
        if (customElements.get('lord-icon')) {
            mountIcon();
        } else {
            customElements.whenDefined('lord-icon').then(mountIcon);
        }
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/?search=${encodeURIComponent(keyword)}`);
            setIsMobileSearchOpen(false);
        } else {
            navigate('/');
        }
    };

    return (
        <nav className="bg-[#2874f0] text-white p-3 shadow-md sticky top-0 z-50">
            {/* Desktop & Mobile Main Row */}
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

                {/* Mobile Menu Button & Brand */}
                <div className="flex items-center gap-3">
                    <button className="md:hidden p-1" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu className="w-6 h-6 text-white" />
                    </button>

                    <Link to="/" className="flex items-center gap-1.5 text-xl font-bold italic tracking-wide text-white">
                        {/* Animated Lordicon shop icon - safely mounted via useEffect */}
                        <span ref={lordIconRef} className="shrink-0 flex items-center" />
                        <span className="hidden md:inline">Shree Ganesha Enterprises</span>
                        <span className="md:hidden">SGE</span>
                    </Link>
                </div>

                {/* Desktop Search Bar */}
                <div className="hidden md:block flex-1 max-w-2xl relative">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Search for products, brands and more"
                            className="w-full py-2 px-4 pr-10 rounded-sm bg-white text-sm text-gray-900 border-none focus:outline-none focus:shadow-md"
                        />
                        <button type="submit" className="absolute right-3 top-2">
                            <Search className="w-5 h-5 text-[#2874f0]" />
                        </button>
                    </form>
                </div>

                {/* Mobile Search & Cart Icons right side */}
                <div className="flex md:hidden items-center gap-4">
                    <button onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}>
                        <Search className="w-6 h-6 text-white" />
                    </button>
                    <Link to="/cart" className="relative">
                        <ShoppingCart className="w-6 h-6 text-white" />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#ff6161] text-[10px] w-4 h-4 flex items-center justify-center rounded-full text-white font-bold">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium">

                    {/* <Link to="/category/tv" className="flex items-center gap-1 hover:text-gray-200 transition-colors">
                        <Layers className="w-4 h-4" /> Categories
                    </Link> */}

                    {user ? (
                        <div className="relative group cursor-pointer inline-block">
                            <div className="flex items-center gap-2 hover:text-gray-200 transition-colors py-2">
                                <span className="text-base">{firstName}</span>
                                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                            </div>

                            {/* Dropdown Menu */}
                            <div className="absolute top-full mt-0 right-1/2 translate-x-1/2 w-[240px] bg-white border border-gray-200 rounded-sm shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-gray-800">
                                {/* Upward triangle arrow */}
                                <div className="hidden md:block absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-white"></div>

                                <div className="flex flex-col w-full text-sm font-normal">
                                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 hover:text-[#2874f0] transition-colors">
                                        <User className="w-4 h-4 text-[#2874f0]" />
                                        <span>My Profile</span>
                                    </Link>
                                    <Link to="/my-orders" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 hover:text-[#2874f0] transition-colors border-t border-gray-100">
                                        <Package className="w-4 h-4 text-[#2874f0]" />
                                        <span>Orders</span>
                                    </Link>
                                    <Link to="/wishlist" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 hover:text-[#2874f0] transition-colors border-t border-gray-100">
                                        <Heart className="w-4 h-4 text-[#2874f0]" />
                                        <span>Wishlist</span>
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 hover:text-[#2874f0] transition-colors border-t border-gray-100">
                                            <Settings className="w-4 h-4 text-[#2874f0]" />
                                            <span>Admin Panel</span>
                                        </Link>
                                    )}
                                    <button onClick={logout} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 hover:text-red-500 transition-colors border-t border-gray-100 w-full text-left">
                                        <LogOut className="w-4 h-4 text-red-500" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-white text-[#2874f0] px-8 py-1.5 rounded-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                            Login
                        </Link>
                    )}

                    <Link to="/contact" className="hover:text-gray-200 transition-colors">
                        Contact Us
                    </Link>

                    <Link to="/cart" className="flex items-center gap-2 hover:text-gray-200 transition-colors relative">
                        <ShoppingCart className="w-5 h-5" />
                        <span>Cart</span>
                        {totalItems > 0 && (
                            <span className="absolute -top-2 left-3 bg-[#ff6161] text-xs w-4 h-4 flex items-center justify-center rounded-full text-white font-bold border border-[#2874f0]">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Mobile Expandable Search Bar */}
            {isMobileSearchOpen && (
                <div className="md:hidden mt-3 max-w-2xl relative animate-fadeIn">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Search for products, brands and more"
                            className="w-full py-2 px-4 pr-10 rounded-sm bg-white text-sm text-gray-900 border-none focus:outline-none shadow-sm"
                            autoFocus
                        />
                        <button type="submit" className="absolute right-3 top-2">
                            <Search className="w-5 h-5 text-[#2874f0]" />
                        </button>
                    </form>
                </div>
            )}

            {/* Mobile Menu Drawer Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <div
                        className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white text-gray-900 shadow-xl flex flex-col transform transition-transform duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Drawer Header */}
                        <div className="bg-[#2874f0] p-4 text-white flex justify-between items-center">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white text-[#2874f0] rounded-full flex items-center justify-center font-bold text-lg">
                                        {firstName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{user.name}</p>
                                        <p className="text-xs text-blue-100">{user.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <User className="w-8 h-8" />
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="font-semibold text-lg hover:underline">
                                        Login & Signup
                                    </Link>
                                </div>
                            )}
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-1">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Drawer Links */}
                        <div className="flex-1 overflow-y-auto py-2">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50">
                                <HomeIcon className="w-5 h-5 text-gray-500" />
                                <span>Home</span>
                            </Link>
                            <Link to="/category/tv" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50">
                                <Layers className="w-5 h-5 text-gray-500" />
                                <span>Categories</span>
                            </Link>

                            <hr className="my-2 border-gray-100" />

                            {user && (
                                <>
                                    <Link to="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50">
                                        <Package className="w-5 h-5 text-gray-500" />
                                        <span>Orders</span>
                                    </Link>
                                    <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50">
                                        <Heart className="w-5 h-5 text-gray-500" />
                                        <span>Wishlist</span>
                                    </Link>
                                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50">
                                        <User className="w-5 h-5 text-gray-500" />
                                        <span>Profile</span>
                                    </Link>

                                    <hr className="my-2 border-gray-100" />
                                </>
                            )}

                            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50">
                                <Phone className="w-5 h-5 text-gray-500" />
                                <span>Contact Us</span>
                            </Link>

                            {user && (
                                <>
                                    <hr className="my-2 border-gray-100" />
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-red-50 text-red-600"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
