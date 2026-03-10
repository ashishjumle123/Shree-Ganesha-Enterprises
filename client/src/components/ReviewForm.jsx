import { useState } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';
import BASE_URL from '../api';
import toast from 'react-hot-toast';

export default function ReviewForm({ productId, token, onReviewAdded }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.post(`${BASE_URL}/api/reviews/${productId}`, { rating, comment }, config);
            toast.success('Review submitted successfully!');
            setRating(0);
            setComment('');
            if (onReviewAdded) onReviewAdded(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-10 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">Write a Review</h3>

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-3">Rate this product</label>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`w-10 h-10 cursor-pointer transition-all duration-200 transform hover:scale-110 ${star <= (hoverRating || rating)
                                ? 'fill-amber-500 text-amber-500 drop-shadow-sm'
                                : 'text-gray-200 fill-gray-50'
                                }`}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 font-medium">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                    {rating === 0 && "Select a star to rate"}
                </p>
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Review Description</label>
                <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors resize-none"
                    placeholder="What did you like or dislike? How did you use the product?"
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-[#2874f0] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-sm focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                    </>
                ) : 'Submit Review'}
            </button>
        </form>
    );
}
