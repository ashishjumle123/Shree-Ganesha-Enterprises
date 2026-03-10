import { useState, useEffect } from 'react';
import { Star, ShieldCheck, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import BASE_URL from '../api';
import toast from 'react-hot-toast';

export default function ReviewList({ productId, user, token, refreshTrigger }) {
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [sort, setSort] = useState('recent');
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${BASE_URL}/api/reviews/${productId}?page=${page}&sort=${sort}`);
            setReviews(data.reviews);
            setPages(data.pages);
            setTotal(data.totalReviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId, page, sort, refreshTrigger]);

    const deleteHandler = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`${BASE_URL}/api/reviews/${reviewId}`, config);
            toast.success('Review deleted');
            fetchReviews();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete review');
        }
    };

    if (loading && reviews.length === 0) {
        return <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>)}
        </div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h3 className="text-lg font-bold text-gray-900">{total} Reviews</h3>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <select
                        value={sort}
                        onChange={(e) => { setSort(e.target.value); setPage(1); }}
                        className="text-sm border rounded px-2 py-1 outline-none"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="highest">Highest Rating</option>
                        <option value="lowest">Lowest Rating</option>
                    </select>
                </div>
            </div>

            {reviews.length > 0 ? (
                <>
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex flex-col">
                                        <h4 className="font-semibold text-gray-900 text-base">{review.user?.name || review.name}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-200 fill-gray-50'}`}
                                                    />
                                                ))}
                                            </div>
                                            {review.verifiedPurchase && (
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                                                    <ShieldCheck className="w-3 h-3" />
                                                    VERIFIED PURCHASE
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-400 text-xs font-medium">
                                            {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        {user && (user._id === review.user?._id || user._id === review.user || user.role === 'admin') && (
                                            <button
                                                onClick={() => deleteHandler(review._id)}
                                                className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                                                title="Delete review"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-800 text-sm leading-relaxed mt-2">{review.comment}</p>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pages > 1 && (
                        <div className="flex items-center justify-center gap-4 pt-6">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="p-2 rounded-full border hover:bg-gray-50 disabled:opacity-30 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm font-medium text-gray-600">Page {page} of {pages}</span>
                            <button
                                disabled={page === pages}
                                onClick={() => setPage(p => p + 1)}
                                className="p-2 rounded-full border hover:bg-gray-50 disabled:opacity-30 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-gray-50 py-12 px-4 rounded-xl text-center border border-gray-100 border-dashed">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-500">Be the first to share your thoughts about this product.</p>
                </div>
            )}
        </div>
    );
}
