import { useState, useEffect } from 'react';
import BASE_URL from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, Zap, Tag, ShieldCheck, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import EditProductModal from '../components/admin/EditProductModal';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user, token } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    const [recommendations, setRecommendations] = useState([]);
    const [recLoading, setRecLoading] = useState(true);

    const [canReview, setCanReview] = useState(false);
    const [canReviewMessage, setCanReviewMessage] = useState('');
    const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [productRefreshTrigger, setProductRefreshTrigger] = useState(0);

    // Scroll automatically to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${BASE_URL}/api/products/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setProduct(data);
                    // Reset gallery to index 0 on load
                    setActiveImage(0);
                    fetchRecommendations(id);
                } else {
                    toast.error(data.message || 'Product not found');
                    navigate('/');
                }
            } catch (error) {
                console.error("Error fetching product details", error);
                toast.error("Error loading product");
            } finally {
                setLoading(false);
            }
        };

        const fetchRecommendations = async (productId) => {
            try {
                const recRes = await fetch(`${BASE_URL}/api/products/recommendations/${productId}`);
                const recData = await recRes.json();
                if (recRes.ok) {
                    setRecommendations(recData);
                }
            } catch (err) {
                console.error("Failed to load recommendations", err);
            } finally {
                setRecLoading(false);
            }
        };

        const checkReviewEligibility = async () => {
            if (!user || !token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${BASE_URL}/api/reviews/check/${id}`, config);
                setCanReview(data.canReview);
                setCanReviewMessage(data.message);
            } catch (error) {
                console.error("Error checking review eligibility", error);
            }
        };

        fetchProduct();
        checkReviewEligibility();
    }, [id, navigate, user, token, reviewRefreshTrigger, productRefreshTrigger]);

    const handleAddToCart = () => {
        if (!user) {
            toast.error('Please login to add items to your cart');
            navigate('/login?redirect=/cart');
            return;
        }

        if (product) {
            addToCart(product);
            toast.success('Item added to cart!');
        }
    };

    const handleBuyNow = () => {
        // Feature is currently locked as per request
        toast('Buy Now is currently unavailable. Please use Add to Cart.', { icon: '🔒' });
        return;
        /*
        if (!user) {
            navigate('/login');
            return;
        }
        if (product) {
            // Store the Buy Now product in sessionStorage (survives navigation, not persisted like localStorage)
            sessionStorage.setItem('buyNowProduct', JSON.stringify({ ...product, quantity: 1 }));
            navigate('/checkout?buyNow=true');
        }
        */
    };

    const handleDeleteProduct = async () => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`${BASE_URL}/api/products/${product._id}`, config);
            toast.success("Product deleted successfully");
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete product");
        }
    };

    const handleEditProduct = () => {
        setIsEditModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center pb-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!product) return null;

    const originalPrice = Math.floor(product.price * 1.25);
    const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

    return (
        <div className="min-h-screen bg-gray-50 md:bg-gray-100 py-0 md:py-6 px-0 md:px-4 lg:px-8 mb-16 md:mb-0 overflow-x-hidden">
            <div className="max-w-6xl mx-auto bg-white shadow-sm md:shadow rounded-none md:rounded-lg flex flex-col md:flex-row md:items-start mb-6">

                {/* Left side - Sticky Image Gallery (desktop only) */}
                <div className="w-full md:w-[40%] lg:w-[45%] flex flex-col border-r border-gray-100 p-4 shrink-0 md:sticky md:top-[80px] md:self-start">

                    {/* Main Image Viewport */}
                    <div className="relative group bg-white h-[350px] md:h-[450px] flex items-center justify-center border border-gray-100 rounded-lg overflow-hidden mb-4 shrink-0 overflow-hidden cursor-crosshair">
                        <img
                            src={product.images && product.images[activeImage] ? product.images[activeImage] : 'https://via.placeholder.com/400'}
                            alt={`${product.title} - View ${activeImage + 1}`}
                            loading="lazy"
                            className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 transform group-hover:scale-125"
                        />
                        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur rounded-full p-2 shadow z-10 text-gray-400 hover:text-red-500 cursor-pointer transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                    </div>

                    {/* Thumbnail Strip Gallery */}
                    {product.images && product.images.length > 0 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 mb-4 scrollbar-hide shrink-0 snap-x justify-start md:justify-center">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`relative w-16 h-16 md:w-20 md:h-20 shrink-0 border-2 rounded-lg p-1 overflow-hidden transition-all snap-start shadow-sm
                                        ${activeImage === index ? 'border-blue-600 ring-1 ring-blue-600 ring-offset-1' : 'border-gray-200 hover:border-blue-400 opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img} alt={`Thumbnail ${index + 1}`} loading="lazy" className="w-full h-full object-contain mix-blend-multiply" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Desktop Action Buttons */}
                    <div className="hidden md:flex gap-4 mt-auto pt-2 shrink-0">
                        {user?.role === 'admin' ? (
                            <>
                                <button
                                    onClick={handleEditProduct}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded shadow text-lg flex items-center justify-center gap-2 transition transform active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg> EDIT PRODUCT
                                </button>
                                <button
                                    onClick={handleDeleteProduct}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded shadow text-lg flex items-center justify-center gap-2 transition transform active:scale-95"
                                >
                                    <Trash2 className="w-5 h-5" /> DELETE PRODUCT
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded shadow text-lg flex items-center justify-center gap-2 transition transform active:scale-95"
                                >
                                    <ShoppingCart className="w-5 h-5" /> {user ? 'ADD TO CART' : 'LOGIN TO BUY'}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={true}
                                    className="flex-1 bg-gray-400 cursor-not-allowed text-white font-bold py-3 px-4 rounded shadow text-lg flex items-center justify-center gap-2 transition"
                                >
                                    <ShieldCheck className="w-5 h-5" /> BUY NOW (LOCKED)
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Right side - Product Details (scrolls normally) */}
                <div className="w-full md:w-[60%] lg:w-[55%] p-5 md:p-8 md:min-h-[600px]">
                    {/* Title & Ratings */}
                    <div className="mb-4">
                        <h1 className="text-xl md:text-2xl font-medium text-gray-900 leading-tight mb-2">
                            {product.title}
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
                                {product.ratingsAverage > 0 ? product.ratingsAverage : 'No Rating'} {product.ratingsAverage > 0 && <Star className="w-3 h-3 fill-white" />}
                            </span>
                            <span className="text-sm text-gray-500 font-medium">{product.ratingsCount || 0} Ratings & Reviews</span>
                            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" className="h-5 ml-auto md:ml-4" alt="Assured" />
                        </div>
                    </div>

                    {/* Price Section */}
                    <div className="mb-6">
                        <div className="text-green-600 text-sm font-semibold mb-1">Special price</div>
                        <div className="flex items-end gap-3 mb-1">
                            <span className="text-3xl font-bold text-gray-900 tracking-tight">₹{product.price.toLocaleString('en-IN')}</span>
                            <span className="text-base text-gray-500 line-through mb-1">₹{originalPrice.toLocaleString('en-IN')}</span>
                            <span className="text-base font-bold text-green-600 mb-1">{discountPercent}% off</span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">+ ₹{product.deliveryFee} Secured Delivery fee</p>
                    </div>

                    {/* Offers */}
                    <div className="mb-6">
                        <h3 className="text-base font-semibold mb-3">Available offers</h3>
                        <ul className="space-y-3">
                            <li className="flex gap-2 text-sm">
                                <Tag className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <div><span className="font-semibold">Bank Offer:</span> 5% Unlimited Cashback on Flipkart Axis Bank Credit Card <a href="#" className="text-blue-600 font-medium text-xs ml-1">T&C</a></div>
                            </li>
                            <li className="flex gap-2 text-sm">
                                <Tag className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <div><span className="font-semibold">Partner Offer:</span> Sign up for Flipkart Pay Later and get Flipkart Gift Card worth up to ₹500* <a href="#" className="text-blue-600 font-medium text-xs ml-1">Know More</a></div>
                            </li>
                        </ul>
                    </div>

                    {/* Services/Highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 mb-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">
                                {product.warranty && product.warranty !== 'No Warranty'
                                    ? product.warranty
                                    : 'No Warranty'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">
                                {product.replacementPolicy && product.replacementPolicy !== 'No Replacement'
                                    ? product.replacementPolicy
                                    : 'No Replacement'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                            <span className="text-sm font-medium text-green-600">Secure Payment</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <div className="flex gap-[60px] text-sm text-gray-800">
                            <span className="text-gray-500 font-medium min-w-[80px]">Description</span>
                            <p className="leading-relaxed">{product.description}</p>
                        </div>
                    </div>

                    {/* Specifications */}
                    {product.specifications && product.specifications.length > 0 && (
                        <div className="mb-6">
                            <div className="text-lg font-medium mb-4 pb-2 border-b">Specifications</div>
                            <div className="space-y-0 text-sm border rounded">
                                {product.specifications.map((spec, i) => (
                                    <div key={i} className={`flex border-b last:border-0 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                        {/* Support both old 'key' and new 'title' field names */}
                                        <div className="w-[35%] py-3 px-4 text-gray-500 font-medium">{spec.title || spec.key}</div>
                                        <div className="w-[65%] py-3 px-4 font-medium text-gray-900 border-l">{spec.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reviews & Ratings Section */}
                    <div className="mb-6 border-t pt-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">Ratings & Reviews</h2>
                            {product.ratingsCount > 0 && (
                                <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                                    <div className="flex items-center justify-center p-3 bg-white rounded-full shadow-sm">
                                        <span className="text-2xl font-bold text-gray-900 leading-none">{product.ratingsAverage || 0}</span>
                                        <Star className="w-5 h-5 ml-1 text-amber-500 fill-amber-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-800">{product.ratingsCount} Ratings &</span>
                                        <span className="text-sm font-medium text-gray-500">{product.ratingsCount} Reviews</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Review Form (Conditional) */}
                        {user ? (
                            canReview ? (
                                <ReviewForm
                                    productId={id}
                                    token={token}
                                    onReviewAdded={() => setReviewRefreshTrigger(prev => prev + 1)}
                                />
                            ) : (
                                <div className="mb-10 p-6 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-4">
                                    <div className="bg-white p-2 rounded-full shadow-sm text-orange-500">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <p className="text-orange-800 font-medium">{canReviewMessage || 'Verified buyers can write reviews here.'}</p>
                                </div>
                            )
                        ) : (
                            <div className="mb-10 p-6 bg-blue-50 border border-blue-100 rounded-xl text-center flex flex-col items-center justify-center">
                                <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                    <Star className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Have you used this product?</h3>
                                <p className="text-gray-600 mb-4">Rate it and help others make a better choice.</p>
                                <button onClick={() => navigate('/login')} className="bg-white border border-gray-300 text-gray-800 font-bold py-2 px-6 rounded shadow-sm hover:bg-gray-50 transition">
                                    Login to Rate
                                </button>
                            </div>
                        )}

                        {/* Review List */}
                        <ReviewList
                            productId={id}
                            user={user}
                            token={token}
                            refreshTrigger={reviewRefreshTrigger}
                        />
                    </div>

                </div>
            </div>

            {/* PRODUCT RECOMMENDATIONS */}
            {!recLoading && recommendations.length > 0 && (
                <div className="max-w-6xl mx-auto bg-white shadow-sm md:shadow rounded-none md:rounded-lg overflow-hidden p-6">
                    <div className="border-b pb-4 mb-6 flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-900">Similar Products</h2>
                        <button onClick={() => navigate(`/?category=${product.category}`)} className="text-[#2874f0] font-semibold text-sm hover:underline">
                            VIEW ALL
                        </button>
                    </div>

                    {/* Horizontal scrollable flex container for recommendations */}
                    <div className="flex overflow-x-auto gap-4 scrollbar-hide snap-x pb-4">
                        {recommendations.map(rec => (
                            <div
                                key={rec._id}
                                onClick={() => navigate(`/product/${rec._id}`)}
                                className="w-[200px] shrink-0 border border-gray-100 rounded-lg p-3 hover:shadow-lg transition-all cursor-pointer snap-start bg-white flex flex-col group"
                            >
                                <div className="h-[180px] w-full p-2 flex items-center justify-center mb-3">
                                    <img
                                        src={rec.images?.[0] || 'https://via.placeholder.com/200'}
                                        alt={rec.title}
                                        loading="lazy"
                                        className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px] mb-1 group-hover:text-[#2874f0] transition-colors">{rec.title}</h3>

                                <div className="flex items-center gap-2 mb-1 mt-auto">
                                    <span className="bg-green-600 text-white flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                        {rec.ratingsAverage > 0 ? rec.ratingsAverage : 'No Rating'} <Star className="w-2.5 h-2.5 fill-white" />
                                    </span>
                                    <span className="text-gray-500 text-xs">({rec.ratingsCount || 0})</span>
                                </div>

                                <div className="flex items-end gap-2 mt-1">
                                    <span className="font-bold text-gray-900">₹{rec.price.toLocaleString('en-IN')}</span>
                                    <span className="text-xs text-gray-500 line-through mb-[2px]">₹{Math.floor(rec.price * 1.25).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Mobile Fixed Action Buttons */}
            <div className="fixed bottom-[60px] left-0 right-0 md:hidden flex bg-white border-t border-gray-200 z-50">
                {user?.role === 'admin' ? (
                    <>
                        <button
                            onClick={handleEditProduct}
                            className="flex-1 bg-white text-gray-800 font-bold py-3.5 px-2 flex items-center justify-center gap-1 border-r border-gray-200"
                        >
                            EDIT PRODUCT
                        </button>
                        <button
                            onClick={handleDeleteProduct}
                            className="flex-1 bg-red-500 text-white font-bold py-3.5 px-2 flex items-center justify-center gap-1"
                        >
                            <Trash2 className="w-5 h-5" /> DELETE
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-white text-gray-800 font-bold py-3.5 px-2 flex items-center justify-center gap-1 border-r border-gray-200"
                        >
                            {user ? 'ADD TO CART' : 'LOGIN TO BUY'}
                        </button>
                        <button
                            onClick={handleBuyNow}
                            disabled={true}
                            className="flex-1 bg-gray-400 text-white font-bold py-3.5 px-2 flex items-center justify-center gap-1 cursor-not-allowed"
                        >
                            <ShieldCheck className="w-5 h-5" /> BUY NOW (LOCKED)
                        </button>
                    </>
                )}
            </div>

            <EditProductModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                product={product} 
                onUpdateSuccess={() => setProductRefreshTrigger(prev => prev + 1)} 
            />
        </div>
    );
}
