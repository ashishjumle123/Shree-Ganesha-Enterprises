// API base URL strategy:
// 1. If VITE_API_URL is set in environment (Vercel/Render) and is NOT localhost on production, use it.
// 2. If we are on localhost, use the local backend.
// 3. Fallback to production Render URL if on a production domain.

const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const envApiUrl = import.meta.env.VITE_API_URL;

const BASE_URL = (isProduction && (!envApiUrl || envApiUrl.includes('localhost')))
    ? 'https://shree-ganesha.onrender.com' // Your primary production backend
    : (envApiUrl || '');

export default BASE_URL;
