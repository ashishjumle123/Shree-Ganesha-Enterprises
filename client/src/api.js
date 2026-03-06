// Centralized API base URL — change VITE_API_URL in client/.env to switch environments
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default BASE_URL;
