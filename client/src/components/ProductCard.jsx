import { useWishlist } from '../context/WishlistContext';
import { Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
    const { wishlistItems, toggleWishlist } = useWishlist();
    const navigate = useNavigate();

    const isLoved = wishlistItems.some(item => item._id === product._id);

    return (
        <div
            onClick={() => navigate(`/product/${product._id}`)}
            className="flex flex-col items-center group cursor-pointer w-full h-full"
        >
            {/* Image Container - Styled exactly like the reference categories */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <img
                    src={product.images?.[0] || 'https://via.placeholder.com/300'}
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Wishlist Button - preserved functionality, modernized aesthetics */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleWishlist(product);
                    }}
                    className="absolute top-2.5 right-2.5 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow hover:bg-white transition-all z-10"
                >
                    <Heart className={`w-4 h-4 transition-colors ${isLoved ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
                </button>
            </div>

            {/* Product Details - Clean, centered text below image */}
            <div className="mt-3 text-center px-1 flex flex-col flex-grow w-full">
                <h3 className="text-sm md:text-[15px] font-[500] text-gray-800 line-clamp-2 leading-relaxed group-hover:text-blue-600 transition-colors">
                    {product.title}
                </h3>

                <div className="mt-auto pt-2 flex items-center justify-center gap-2">
                    <span className="text-base md:text-lg font-bold text-gray-900">
                        ₹{product.price?.toLocaleString('en-IN')}
                    </span>

                    {/* Simplified Rating */}
                    {product.ratingsAverage > 0 && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-[11px] font-bold text-yellow-700">
                            {product.ratingsAverage} <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
