// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api';

// function Profile() {
//   const [userDetails, setUserDetails] = useState({
//     name: '',
//     username: '',
//     email: '',
//     mobile: '',
//   });

//   const [updatedDetails, setUpdatedDetails] = useState(userDetails);
//   const [editMode, setEditMode] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       try {
//         const config = {
//           headers: { Authorization: `Bearer ${token}` },
//         };

//         const response = await api.get('/user/profile', config);
//         console.log('Fetched user:', response.data.user);

//         setUserDetails(response.data.user);
//         setUpdatedDetails(response.data.user);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching user details:', error.response || error);
//         if (error.response?.status === 401) {
//           localStorage.removeItem('token');
//           navigate('/login');
//         }
//       }
//     };

//     fetchUserDetails();
//   }, [navigate]);

//   const handleEditToggle = () => setEditMode(!editMode);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUpdatedDetails({ ...updatedDetails, [name]: value });
//   };

//   const handleSaveChanges = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       const config = {
//         headers: { Authorization: `Bearer ${token}` },
//       };

//       await api.put('/user/profile', updatedDetails, config);
//       setUserDetails(updatedDetails);
//       setEditMode(false);
//       alert('Profile updated successfully!');
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       alert('Failed to update profile.');
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   if (loading || !userDetails) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-gray-100 text-xl">
//         Loading profile...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-gray-600 via-gray-400 to-gray-500 flex justify-center items-center relative">
//       <div className="bg-white rounded-lg shadow-lg p-8 text-gray-800 w-full max-w-2xl relative">

//         {/* Logout Button */}
//         <button
//           onClick={handleLogout}
//           className="absolute top-4 left-4 px-4 py-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition duration-300"
//         >
//           Logout
//         </button>

//         {/* Close Button */}
//         <button
//           onClick={() => navigate('/dashboard')}
//           className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300"
//         >
//           ✕
//         </button>

//         <h1 className="text-4xl font-bold mb-6 text-center text-blue-600 underline">Profile</h1>

//         {!editMode ? (
//           <div>
//             <div className="mb-4"><p className="text-lg"><strong>Username:</strong> {userDetails.username}</p></div>
//             <div className="mb-4"><p className="text-lg"><strong>Name:</strong> {userDetails.name}</p></div>
//             <div className="mb-4"><p className="text-lg"><strong>Email:</strong> {userDetails.email}</p></div>
//             <div className="mb-4"><p className="text-lg"><strong>Mobile:</strong> {userDetails.mobile}</p></div>
//             <div className="flex justify-end">
//               <button
//                 onClick={handleEditToggle}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
//               >
//                 Edit Profile
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="mb-4">
//               <label className="block text-lg font-semibold mb-2 text-blue-600">Username</label>
//               <input
//                 type="text"
//                 name="username"
//                 value={updatedDetails.username}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-lg font-semibold mb-2 text-blue-600">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={updatedDetails.name}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-lg font-semibold mb-2 text-blue-600">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={updatedDetails.email}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-lg font-semibold mb-2 text-blue-600">Mobile</label>
//               <input
//                 type="text"
//                 name="mobile"
//                 value={updatedDetails.mobile}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
//               />
//             </div>

//             <div className="flex justify-between">
//               <button
//                 onClick={handleSaveChanges}
//                 className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
//               >
//                 Save Changes
//               </button>
//               <button
//                 onClick={handleEditToggle}
//                 className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Profile;


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
  FaUser,         // For Name field
  FaAt,           // For Username field
  FaEnvelope,     // For Email field
  FaMobileAlt,    // For Mobile field
  FaSpinner       // For loading state
} from 'react-icons/fa'; // Make sure react-icons is installed

function Profile() {
  const [userDetails, setUserDetails] = useState({
    name: '',
    username: '',
    email: '',
    mobile: '',
  });

  const [updatedDetails, setUpdatedDetails] = useState({ // Initialize with empty strings
    name: '',
    username: '',
    email: '',
    mobile: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' }); // For success/error messages

  const navigate = useNavigate();

  // --- Fetch User Details on Component Mount ---
  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      setMessage({ type: '', text: '' }); // Clear any previous messages

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
        // Ensure all expected fields are present, even if empty from backend
        const fetchedUser = {
          name: response.data.user.name || '',
          username: response.data.user.username || '',
          email: response.data.user.email || '',
          mobile: response.data.user.mobile || '',
        };

        setUserDetails(fetchedUser);
        setUpdatedDetails(fetchedUser); // Set updatedDetails when data is first loaded
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
  const handleEditToggle = () => {
    setEditMode(!editMode);
    // When toggling out of edit mode (e.g., via Cancel), reset updatedDetails to original
    if (editMode) {
      setUpdatedDetails(userDetails);
    }
    setMessage({ type: '', text: '' }); // Clear messages on toggle
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({ ...updatedDetails, [name]: value });
  };

  const handleSaveChanges = async () => {
    setMessage({ type: '', text: '' }); // Clear previous messages

    // Basic client-side validation
    if (!updatedDetails.username || !updatedDetails.email || !updatedDetails.name) {
        setMessage({ type: 'error', text: 'Username, Name, and Email are required.' });
        return;
    }
    if (updatedDetails.email && !/\S+@\S+\.\S+/.test(updatedDetails.email)) {
        setMessage({ type: 'error', text: 'Please enter a valid email address.' });
        return;
    }
    // Add mobile number validation if required (e.g., for Indian numbers)
    if (updatedDetails.mobile && !/^\d{10}$/.test(updatedDetails.mobile)) {
        setMessage({ type: 'error', text: 'Mobile number must be 10 digits.' });
        return;
    }

    setLoading(true); // Indicate saving process
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

      await api.put('/user/profile', updatedDetails, config);
      setUserDetails(updatedDetails); // Update main userDetails with saved changes
      setEditMode(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error.response || error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setLoading(false); // End saving process
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading && !userDetails.username) { // Only show full loading screen if initial fetch is pending and no user data
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white text-2xl">
        <FaSpinner className="animate-spin mr-4 text-blue-500 text-4xl" /> Loading profile...
      </div>
    );
  }

  return (
    <DashboardLayout> {/* Wrap Profile content with DashboardLayout */}
      {/* The main content area of the profile page */}
      <div className="w-full text-gray-100 font-sans p-6 md:p-8 flex justify-center items-center min-h-[calc(100vh-64px)]"> {/* Centering in layout */}

        {/* Profile Card */}
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

          {!editMode ? (
            // View Mode
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

              <div className="flex justify-end mt-8">
                <button
                  onClick={handleEditToggle}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 flex items-center space-x-2 transform hover:scale-105"
                >
                  <FaEdit className="text-xl" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-6">
              {/* Username Input */}
              <div className="relative">
                <label className="block text-lg font-semibold mb-2 text-blue-300">Username</label>
                <FaAt className="absolute left-3 top-[calc(50%+10px)] -translate-y-1/2 text-gray-400" /> {/* Adjusted icon position */}
                <input
                  type="text"
                  name="username"
                  value={updatedDetails.username}
                  onChange={handleInputChange}
                  className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
                  required
                />
              </div>

              {/* Name Input */}
              <div className="relative">
                <label className="block text-lg font-semibold mb-2 text-blue-300">Name</label>
                <FaUser className="absolute left-3 top-[calc(50%+10px)] -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={updatedDetails.name}
                  onChange={handleInputChange}
                  className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <label className="block text-lg font-semibold mb-2 text-blue-300">Email</label>
                <FaEnvelope className="absolute left-3 top-[calc(50%+10px)] -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={updatedDetails.email}
                  onChange={handleInputChange}
                  className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
                  required
                />
              </div>

              {/* Mobile Input */}
              <div className="relative">
                <label className="block text-lg font-semibold mb-2 text-blue-300">Mobile</label>
                <FaMobileAlt className="absolute left-3 top-[calc(50%+10px)] -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="mobile"
                  value={updatedDetails.mobile}
                  onChange={handleInputChange}
                  className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
                />
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={handleSaveChanges}
                  disabled={loading} // Disable during save operation
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
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleEditToggle}
                  disabled={loading} // Disable during save operation
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