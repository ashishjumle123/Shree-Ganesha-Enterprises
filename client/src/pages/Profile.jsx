import { useState, useEffect } from 'react';
import BASE_URL from '../api';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, MapPin, Save, Lock, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Profile() {
    const { user, token, logout, updateUser } = useAuth();
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    // Profile Edit State
    const [profileForm, setProfileForm] = useState({
        name: ''
    });

    // Password Change State
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Default form states for UI simulation
    const [addressForm, setAddressForm] = useState({
        street: '',
        city: '',
        pincode: '',
        phone: ''
    });

    useEffect(() => {
        if (user) {
            setProfileForm({ name: user.name });
        }
    }, [user]);

    const handleProfileChange = (e) => {
        setProfileForm({
            ...profileForm,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
    };

    const handleAddressChange = (e) => {
        setAddressForm({
            ...addressForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!profileForm.name.trim()) {
            return toast.error("Name cannot be empty");
        }

        setLoadingProfile(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.patch(`${BASE_URL}/api/users/profile`, { name: profileForm.name }, config);
            updateUser({ name: data.name });
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating profile");
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmPassword } = passwordForm;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return toast.error("Please fill all password fields");
        }
        if (newPassword.length < 6) {
            return toast.error("New password must be at least 6 characters");
        }
        if (newPassword !== confirmPassword) {
            return toast.error("New passwords do not match");
        }

        setLoadingPassword(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.patch(`${BASE_URL}/api/users/change-password`, {
                currentPassword,
                newPassword
            }, config);

            toast.success("Password changed successfully!");
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error changing password");
        } finally {
            setLoadingPassword(false);
        }
    };

    const handleSaveAddress = (e) => {
        e.preventDefault();
        if (!addressForm.street || !addressForm.city || !addressForm.pincode || !addressForm.phone) {
            toast.error("Please fill all address details correctly.");
            return;
        }
        setTimeout(() => toast.success("Address saved successfully!"), 300);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 py-8 bg-[#f1f3f6] min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 bg-white p-4 rounded shadow-sm">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Account Info Card & Logout */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-white rounded p-6 shadow-sm flex flex-col items-center border border-gray-100">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 overflow-hidden border">
                            <User className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">{user?.name || "Customer Name"}</h2>
                        <p className="text-gray-500 mb-6 flex items-center gap-1.5 font-medium text-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                            {user?.email || "customer@example.com"}
                        </p>

                        <div className="w-full border-t border-gray-100 pt-4">
                            <button
                                onClick={logout}
                                className="w-full flex items-center justify-center gap-2 text-red-500 font-semibold py-2 hover:bg-red-50 rounded transition"
                            >
                                <LogOut className="w-5 h-5" /> Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Profile & Password Form & Addresses */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Personal Information */}
                    <div className="bg-white rounded p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                            <Edit3 className="text-[#2874f0] w-6 h-6" />
                            <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                        </div>

                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileForm.name}
                                        onChange={handleProfileChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-[#2874f0] focus:border-[#2874f0] outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded outline-none cursor-not-allowed text-sm"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={loadingProfile}
                                    className="bg-[#2874f0] text-white font-bold py-2 px-6 rounded shadow hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loadingProfile ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : 'Save Profile'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white rounded p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                            <Lock className="text-[#2874f0] w-6 h-6" />
                            <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
                        </div>

                        <form onSubmit={handleSavePassword} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-[#2874f0] focus:border-[#2874f0] outline-none"
                                        required
                                        minLength="6"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-[#2874f0] focus:border-[#2874f0] outline-none"
                                        required
                                        minLength="6"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-[#2874f0] focus:border-[#2874f0] outline-none"
                                        required
                                        minLength="6"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={loadingPassword}
                                    className="bg-[#2874f0] text-white font-bold py-2 px-6 rounded shadow hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loadingPassword ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Manage Addresses */}
                    <div className="bg-white rounded p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                            <MapPin className="text-[#2874f0] w-6 h-6" />
                            <h2 className="text-xl font-bold text-gray-800">Manage Addresses</h2>
                        </div>

                        <form onSubmit={handleSaveAddress} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <textarea
                                        name="street"
                                        value={addressForm.street}
                                        onChange={handleAddressChange}
                                        placeholder="123 Main St, Apartment 4B"
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-[#2874f0] focus:border-[#2874f0] outline-none"
                                        rows="2"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City/District</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={addressForm.city}
                                        onChange={handleAddressChange}
                                        placeholder="Mumbai"
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-[#2874f0] focus:border-[#2874f0] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={addressForm.pincode}
                                        onChange={handleAddressChange}
                                        placeholder="400001"
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-[#2874f0] focus:border-[#2874f0] outline-none"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={addressForm.phone}
                                        onChange={handleAddressChange}
                                        placeholder="+91 9876543210"
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-[#2874f0] focus:border-[#2874f0] outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-50 flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white font-bold py-2.5 px-6 rounded shadow hover:bg-green-700 transition flex items-center gap-2"
                                >
                                    <Save className="w-5 h-5" /> Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
