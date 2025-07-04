import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

// Import Feather Icons for a more modern look
import {
  FaUser,        // For Name
  FaAt,           // For Username
  FaEnvelope,     // For Email
  FaMobileAlt,    // For Mobile Number
  FaLock,         // For Password
  FaArrowRight,   // For Signup button
  FaSpinner       // For loading state
} from 'react-icons/fa'; // Make sure react-icons is installed

function Signup() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState(''); // Corrected state variable name
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' }); // Consolidated error/success messages
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' }); // Clear previous messages
    setLoading(true);

    // Basic client-side validation
    if (!name || !username || !email || !mobile || !password) {
      setMessage({ type: 'error', text: 'All fields are required.' });
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      setLoading(false);
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setMessage({ type: 'error', text: 'Mobile number must be 10 digits.' });
      setLoading(false);
      return;
    }
    if (password.length < 6) { // Example: minimum password length
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/user/signup', {
        name,
        username,
        email,
        mobile,
        password
      });

      setMessage({ type: 'success', text: res.data.message || 'Signup successful! Redirecting to login...' });
      // You might want to show the success message for a moment before navigating
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Navigate after 2 seconds
      
    } catch (err) {
      console.error('Signup error:', err.response || err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 text-gray-100 w-full max-w-md border border-gray-700 animate-fade-in-up">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-wide">
          Join FinTrack
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {message.text && (
            <div
              className={`p-4 rounded-lg mb-4 text-center text-md font-medium animate-fade-in ${
                message.type === 'success' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Name Input */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
              required
            />
          </div>

          {/* Username Input */}
          <div className="relative">
            <FaAt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Corrected setState function
              className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
              required
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
              required
            />
          </div>

          {/* Mobile Number Input */}
          <div className="relative">
            <FaMobileAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              placeholder="Mobile Number (e.g., 9876543210)"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
              required
              pattern="[0-9]{10}" // HTML5 validation for 10 digits
              title="Please enter a 10-digit mobile number"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
              required
              minLength="6" // Example: HTML5 validation for min length
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 
              ${loading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50'
              }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Signing up...</span>
              </>
            ) : (
              <>
                <span>Signup</span>
                <FaArrowRight className="ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-400 hover:text-blue-500 font-semibold transition duration-300"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;