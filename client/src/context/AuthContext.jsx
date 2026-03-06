import { createContext, useState, useEffect, useContext } from 'react';
import BASE_URL from '../api';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            // Validate token against backend before trusting it
            fetch(`${BASE_URL}/api/auth/profile`, {
                headers: { 'Authorization': `Bearer ${storedToken}` }
            }).then(res => {
                if (res.ok) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                } else {
                    // Invalid/expired token — clear it so user is forced to log in fresh
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }).catch(() => {
                // Network error — still trust the stored token so the app is usable offline
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }).finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                email,
                password
            });

            const data = response.data;
            const userPayload = { _id: data._id, name: data.name, email: data.email, role: data.role };

            setUser(userPayload);
            setToken(data.token);

            localStorage.setItem('user', JSON.stringify(userPayload));
            localStorage.setItem('token', data.token);

            toast.success(`Welcome back, ${data.name}!`);
            return true;

        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            return false;
        }
    };

    // Step 1 of OTP Flow
    const sendOtp = async (email) => {
        try {
            await axios.post(`${BASE_URL}/api/auth/send-otp`, { email });
            toast.success('Verification code sent to your email!');
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send OTP. Please try again.');
            return false;
        }
    };

    // Step 2 of OTP Flow
    const verifyOtp = async (name, email, password, otp) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
                name, email, password, otp
            });

            const data = response.data;
            const userPayload = { _id: data._id, name: data.name, email: data.email, role: data.role };

            setUser(userPayload);
            setToken(data.token);

            localStorage.setItem('user', JSON.stringify(userPayload));
            localStorage.setItem('token', data.token);

            toast.success('Email verified successfully! Welcome to Shree Ganesha Enterprises.');
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid or expired OTP.');
            return false;
        }
    };

    // Kept for backward compatibility
    const register = async (name, email, password) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/register`, {
                name, email, password
            });

            const data = response.data;
            const userPayload = { _id: data._id, name: data.name, email: data.email, role: data.role };

            setUser(userPayload);
            setToken(data.token);

            localStorage.setItem('user', JSON.stringify(userPayload));
            localStorage.setItem('token', data.token);

            toast.success('Registration successful! Welcome to Shree Ganesha Enterprises.');
            return true;

        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const googleSignIn = async (googleToken) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/google`, {
                tokenId: googleToken
            });

            const data = response.data;
            const userPayload = { _id: data._id, name: data.name, email: data.email, role: data.role };

            setUser(userPayload);
            setToken(data.token);

            localStorage.setItem('user', JSON.stringify(userPayload));
            localStorage.setItem('token', data.token);

            toast.success(`Welcome back, ${data.name}!`);
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Google Sign-In failed');
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('guestCart'); // Clear guest cart on logout
        toast.success('Logged out successfully');
    };

    const updateUser = (userData) => {
        const newUser = { ...user, ...userData };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, sendOtp, verifyOtp, googleSignIn, logout, loading, updateUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
