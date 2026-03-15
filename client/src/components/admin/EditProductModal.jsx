import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import BASE_URL from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function EditProductModal({ isOpen, onClose, product, onUpdateSuccess }) {
    const { token } = useAuth();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [countInStock, setCountInStock] = useState('');

    useEffect(() => {
        if (product) {
            // Using title or name as fallback since the frontend schema typically uses title
            setName(product.title || product.name || '');
            setPrice(product.price || 0);
            setDescription(product.description || '');
            setCategory(product.category || '');
            setBrand(product.brand || '');
            setCountInStock(product.countInStock || 0);
        }
    }, [product, isOpen]);

    if (!isOpen) return null;

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Map name back to title or name based on backend requirements mapping.
            // Using title as seen in ProductDetails.jsx `product.title`
            const updatedData = {
                title: name,
                price,
                description,
                category,
                brand,
                countInStock
            };
            await axios.put(`${BASE_URL}/api/products/${product._id}`, updatedData, config);
            toast.success("Product updated!");
            onUpdateSuccess();
            onClose();
        } catch (error) {
            console.error("Error updating product", error);
            toast.error(error.response?.data?.message || "Failed to update product");
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative shadow-xl">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Product</h2>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name / Title</label>
                        <input type="text" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                        <input type="number" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <input type="text" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" value={brand} onChange={(e) => setBrand(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input type="text" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" value={category} onChange={(e) => setCategory(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Count In Stock</label>
                        <input type="number" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" value={countInStock} onChange={(e) => setCountInStock(Number(e.target.value))} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                        <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-[#2874f0] text-white rounded hover:bg-blue-600 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
