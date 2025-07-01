import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Assuming your API client is configured
import DashboardLayout from '../components/DashboardLayout'; // Import DashboardLayout

// Import Feather Icons for a more modern look
import {
  FaUserCircle,   // Profile icon
  FaEdit,         // Edit icon
  FaSave,         // Save icon
  FaBan,          // Cancel icon
  FaSignOutAlt,   // Logout icon
  FaTimes,        // Close button (for going back to dashboard)
  FaUser,         // For Name field (display only)
  FaAt,           // For Username field (display only)
  FaEnvelope,     // For Email field (display only)
  FaMobileAlt,    // For Mobile field (display only)
  FaLock,         // For Password field
  FaKey,          // NEW: Icon for current password
  FaSyncAlt,      // For Re-enter Password field
  FaSpinner       // For loading state
} from 'react-icons/fa';

function Profile() {
  const [userDetails, setUserDetails] = useState({
    name: '',
    username: '',
    email: '',
    mobile: '',
  });

  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(''); // NEW: State for current password
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();

  // --- Fetch User Details on Component Mount (for display purposes) ---
  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication required. Please log in.' });
        navigate('/login');
        return;
      }

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await api.get('/user/profile', config);
        const fetchedUser = {
          name: response.data.user.name || '',
          username: response.data.user.username || '',
          email: response.data.user.email || '',
          mobile: response.data.user.mobile || '',
        };

        setUserDetails(fetchedUser);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error.response || error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setMessage({ type: 'error', text: 'Session expired. Please log in again.' });
          navigate('/login');
        } else {
          setMessage({ type: 'error', text: 'Failed to load profile. Please try again.' });
        }
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // --- Handlers ---
  const handlePasswordEditToggle = () => {
    setPasswordEditMode(!passwordEditMode);
    setCurrentPassword(''); // NEW: Clear current password field on toggle
    setNewPassword('');
    setConfirmNewPassword('');
    setMessage({ type: '', text: '' });
  };

  // NEW: Handler for current password input
  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const handleSaveNewPassword = async () => {
    setMessage({ type: '', text: '' });

    // Validate all three password fields
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setMessage({ type: 'error', text: 'All password fields are required.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setMessage({ type: 'error', text: 'New password and re-entered password do not match.' });
      return;
    }
    if (newPassword.length < 8) { // Example password strength validation
      setMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }
    if (currentPassword === newPassword) { // NEW: Prevent changing to the same password
      setMessage({ type: 'error', text: 'New password cannot be the same as the current password.' });
      return;
    }


    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication required.' });
        navigate('/login');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // --- CRITICAL CHANGE HERE ---
      // Send both currentPassword and newPassword to the backend
      await api.put('user/profile/password', {
        currentPassword: currentPassword, // Included current password
        newPassword: newPassword
      }, config);
      // --- END CRITICAL CHANGE ---

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword(''); // Clear all password fields after success
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordEditMode(false); // Exit password edit mode
    } catch (error) {
      console.error('Error updating password:', error.response || error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password. Please check your current password.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading && !userDetails.username) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white text-2xl">
        <FaSpinner className="animate-spin mr-4 text-blue-500 text-4xl" /> Loading profile...
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full text-gray-100 font-sans p-6 md:p-8 flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 text-gray-100 w-full max-w-2xl border border-gray-700 relative animate-fade-in-up">

          {/* Top Right Controls */}
          <div className="absolute top-6 right-6 flex space-x-3">
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition duration-300 flex items-center space-x-2 transform hover:scale-105"
              title="Logout"
            >
              <FaSignOutAlt className="text-xl" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2 bg-gray-600 text-white rounded-full shadow-lg hover:bg-gray-700 transition duration-300 flex items-center space-x-2 transform hover:scale-105"
              title="Go to Dashboard"
            >
              <FaTimes className="text-xl" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>

          <h1 className="text-5xl font-extrabold mb-10 text-center tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 pt-8">
            <FaUserCircle className="inline-block mr-4 text-6xl text-blue-400" />
            Your Profile
          </h1>

          {/* Messages */}
          {message.text && (
            <div
              className={`p-4 rounded-lg mb-6 text-center text-lg font-semibold animate-fade-in ${
                message.type === 'success' ? 'bg-green-700 border border-green-600' : 'bg-red-700 border border-red-600'
              }`}
            >
              {message.text}
            </div>
          )}

          {!passwordEditMode ? (
            // View Mode for Profile Details (non-editable)
            <div className="space-y-6 text-lg">
              <div className="flex items-center p-3 bg-gray-700 rounded-lg shadow-inner border border-gray-600">
                <FaAt className="mr-4 text-blue-400 text-2xl" />
                <p><strong>Username:</strong> <span className="font-semibold text-teal-300">{userDetails.username}</span></p>
              </div>
              <div className="flex items-center p-3 bg-gray-700 rounded-lg shadow-inner border border-gray-600">
                <FaUser className="mr-4 text-blue-400 text-2xl" />
                <p><strong>Name:</strong> <span className="font-semibold text-teal-300">{userDetails.name || 'N/A'}</span></p>
              </div>
              <div className="flex items-center p-3 bg-gray-700 rounded-lg shadow-inner border border-gray-600">
                <FaEnvelope className="mr-4 text-blue-400 text-2xl" />
                <p><strong>Email:</strong> <span className="font-semibold text-teal-300">{userDetails.email}</span></p>
              </div>
              <div className="flex items-center p-3 bg-gray-700 rounded-lg shadow-inner border border-gray-600">
                <FaMobileAlt className="mr-4 text-blue-400 text-2xl" />
                <p><strong>Mobile:</strong> <span className="font-semibold text-teal-300">{userDetails.mobile || 'N/A'}</span></p>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={handlePasswordEditToggle}
                  className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 flex items-center space-x-2 transform hover:scale-105"
                >
                  <FaLock className="text-xl" />
                  <span>Edit Password</span>
                </button>
              </div>
            </div>
          ) : ( // Password Edit Mode is active
            <div className="space-y-6">
              {/* NEW: Current Password Input */}
              <div className="relative">
                <label className="block text-lg font-semibold mb-2 text-blue-300">Current Password</label>
                <FaKey className="absolute left-3 top-[calc(50%+10px)] -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={handleCurrentPasswordChange}
                  className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
                  required
                />
              </div>

              {/* New Password Input */}
              <div className="relative">
                <label className="block text-lg font-semibold mb-2 text-blue-300">New Password</label>
                <FaLock className="absolute left-3 top-[calc(50%+10px)] -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
                  required
                />
              </div>

              {/* Re-enter New Password Input */}
              <div className="relative">
                <label className="block text-lg font-semibold mb-2 text-blue-300">Re-enter New Password</label>
                <FaSyncAlt className="absolute left-3 top-[calc(50%+10px)] -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={handleConfirmNewPasswordChange}
                  className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
                  required
                />
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={handleSaveNewPassword}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FaSave className="text-xl" />
                      <span>Save Password</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handlePasswordEditToggle}
                  disabled={loading}
                  className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition duration-300 flex items-center space-x-2 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaBan className="text-xl" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;