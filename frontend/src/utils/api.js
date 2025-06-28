import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001', // matches your backend port
  withCredentials: true // keep it if you plan to use JWT or cookies
});

export default api;