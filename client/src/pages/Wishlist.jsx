import React, { useEffect, useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { HeartCrack } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wishlist() {
    const { wishlistItems, loading } = useWishlist();

    if (loading) {
        return <div className="flex justify-center my-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0]"></div></div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 py-8 bg-[#f1f3f6] min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 bg-white p-4 rounded shadow-sm">My Wishlist ({wishlistItems.length})</h1>

            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {wishlistItems.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center bg-white rounded shadow-sm p-12 text-gray-500 mt-10">
                    <HeartCrack className="w-16 h-16 text-gray-300 mb-4" />
                    <h2 className="text-xl font-medium text-gray-800">Empty Wishlist</h2>
                    <p className="mb-6 mt-2 text-center text-sm">You have no items in your wishlist. Start adding!</p>
                    <Link to="/" className="bg-[#2874f0] text-white px-6 py-2.5 rounded font-medium shadow hover:bg-blue-600 transition">
                        Explore Products
                    </Link>
                </div>
            )}
        </div>
    );
}
