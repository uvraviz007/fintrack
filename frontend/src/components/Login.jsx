// import React, { useState } from 'react';
// import api from '../api';
// import { useNavigate } from 'react-router-dom';

// function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await api.post('/user/login', {
//         username,
//         password
//       });

//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         //alert('Login successful!');
//         navigate('/dashboard');
//       } else {
//         setError('Invalid credentials');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-600">
//       <div className="border-2 border-gray-700 rounded-lg shadow-xl bg-white">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white p-8 rounded-lg shadow-lg w-96 border border-gray-300"
//         >
//           <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>

//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           {error && <p className="text-red-500 mb-4">{error}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 rounded-lg text-white ${
//               loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
//             }`}
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;


import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

// Import Feather Icons
import {
  FaUser,       // For Username input
  FaLock,       // For Password input
  FaSignInAlt,  // For Login button
  FaSpinner,    // For loading state
  FaMoneyBillWave // A general icon for the app/login title
} from 'react-icons/fa';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' }); // Consolidated message state
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' }); // Clear previous messages
    setLoading(true);

    // Basic client-side validation
    if (!username || !password) {
      setMessage({ type: 'error', text: 'Please enter both username and password.' });
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/user/login', {
        username,
        password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setMessage({ type: 'success', text: 'Login successful! Redirecting to dashboard...' });
        // Give a brief moment for the user to see the success message
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        // This case might be handled by the catch block if API returns error status
        setMessage({ type: 'error', text: 'Invalid credentials. Please try again.' });
      }
    } catch (err) {
      console.error('Login error:', err.response || err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 text-gray-100 w-full max-w-md border border-gray-700 animate-fade-in-up">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-wide flex items-center justify-center space-x-3">
          <FaMoneyBillWave className="text-5xl" />
          <span>FinTrack Login</span>
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

          {/* Username Input */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
              required
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
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white shadow-lg transition-all duration-300 flex items-center justify-center space-x-2
              ${loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50'
              }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <FaSignInAlt className="ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-purple-400 hover:text-purple-500 font-semibold transition duration-300"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;