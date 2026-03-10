import { useState, useEffect } from 'react';
import BASE_URL from '../../api';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';

export default function ManageCategories() {
    const { token } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        type: 'Other'
    });

    const [uploading, setUploading] = useState(false);

    const types = ['Electronics', 'Furniture', 'Home Appliances', 'Kitchen Appliances', 'Other'];

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/categories`);
            setCategories(data);
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('images', file);

        try {
            setUploading(true);
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            const { data: uploadedUrls } = await axios.post(`${BASE_URL}/api/upload`, uploadData, config);
            setFormData(prev => ({ ...prev, image: uploadedUrls[0] }));
            toast.success('Image uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
            e.target.value = null;
        }
    };

    const handleEdit = (cat) => {
        setEditingId(cat._id);
        setFormData({
            name: cat.name,
            image: cat.image,
            type: cat.type || 'Other'
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await axios.delete(`${BASE_URL}/api/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Delete failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.image) {
            return toast.error("Category image is required");
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (editingId) {
                await axios.put(`${BASE_URL}/api/categories/${editingId}`, formData, config);
                toast.success('Category updated!');
            } else {
                await axios.post(`${BASE_URL}/api/categories`, formData, config);
                toast.success('Category added successfully!');
            }

            resetForm();
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            name: '',
            image: '',
            type: 'Other'
        });
    };

    if (loading) return <div className="text-center py-10">Loading categories...</div>;

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Category Management</h2>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    className="flex items-center gap-2 bg-[#2874f0] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" /> {showForm ? 'Close Form' : 'Add New Category'}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Category' : 'Create New Category'}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Name */}
                        <div className="md:col-span-1">
                            <label className="block text-sm text-gray-700 mb-1 font-medium">Category Name</label>
                            <input
                                required
                                name="name"
                                placeholder="e.g. Smart TVs"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border rounded p-2 focus:ring-2 focus:ring-[#2874f0] outline-none"
                            />
                        </div>

                        {/* Type */}
                        <div className="md:col-span-1">
                            <label className="block text-sm text-gray-700 mb-1 font-medium">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full border rounded p-2 outline-none"
                            >
                                {types.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div className="md:col-span-2 mt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category Icon/Image</label>
                            <div className="flex items-center gap-4">
                                {formData.image ? (
                                    <div className="relative w-20 h-20 border rounded bg-white flex items-center justify-center p-1">
                                        <img src={formData.image} alt="Preview" className="max-w-full max-h-full object-contain" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, image: '' }))}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors">
                                        {uploading ? (
                                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Upload className="w-5 h-5 text-gray-400" />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            disabled={uploading}
                                        />
                                    </label>
                                )}
                                <div className="text-xs text-gray-500">
                                    <p className="font-medium text-gray-700">Recommended: Square image</p>
                                    <p>Select a clear image to represent this category.</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                            <button type="button" onClick={resetForm} className="px-5 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition">Cancel</button>
                            <button type="submit" disabled={uploading || !formData.name} className="px-5 py-2 text-white bg-[#2874f0] rounded hover:bg-blue-700 disabled:opacity-50 transition">
                                {editingId ? 'Update Category' : 'Save Category'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                        <tr>
                            <th className="px-5 py-4">Preview</th>
                            <th className="px-5 py-4">Category Name</th>
                            <th className="px-5 py-4">Type</th>
                            <th className="px-5 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((cat) => (
                            <tr key={cat._id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-5 py-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                    </div>
                                </td>
                                <td className="px-5 py-4 font-bold text-gray-800">
                                    {cat.name}
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cat.type === 'Electronics' ? 'bg-purple-100 text-purple-700' :
                                        cat.type === 'Furniture' ? 'bg-orange-100 text-orange-700' :
                                            cat.type === 'Home Appliances' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {cat.type}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr><td colSpan="4" className="px-5 py-10 text-center text-gray-400">No categories found. Add your first category!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
