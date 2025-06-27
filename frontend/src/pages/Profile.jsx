import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api';

function Profile() {
  const [userDetails, setUserDetails] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState(userDetails);
  const [usernameAvailable, setUsernameAvailable] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found. Please log in.');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get('/user/profile', config);
        setUserDetails(response.data);
        setUpdatedDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({ ...updatedDetails, [name]: value });

    if (name === 'username') {
      checkUsernameAvailability(value);
    }
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.get(`/user/check-username?username=${username}`, config);

      if (username === userDetails.username) {
        setUsernameAvailable(true);
      } else {
        setUsernameAvailable(response.data.available);
      }
    } catch (error) {
      console.error('Error checking username availability:', error);
      setUsernameAvailable(true);
    }
  };

  const handleSaveChanges = async () => {
    if (!usernameAvailable) {
      alert('Username is not available. Please choose a different username.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. Please log in.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put('/user/profile', updatedDetails, config);
      setUserDetails(updatedDetails);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-600 via-gray-400 to-gray-500 flex justify-center items-center relative">
      <div className="bg-white rounded-lg shadow-lg p-8 text-gray-800 w-full max-w-2xl relative">

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute top-4 left-4 px-4 py-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition duration-300"
        >
          Logout
        </button>

        {/* Cross Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300"
        >
          ✕
        </button>

        <h1 className="text-4xl font-bold mb-6 text-center text-blue-600 underline">Profile</h1>

        {!editMode ? (
          <div>
            <div className="mb-4"><p className="text-lg"><strong>Username:</strong> {userDetails.username}</p></div>
            <div className="mb-4"><p className="text-lg"><strong>Name:</strong> {userDetails.name}</p></div>
            <div className="mb-4"><p className="text-lg"><strong>Email:</strong> {userDetails.email}</p></div>
            <div className="mb-4"><p className="text-lg"><strong>Phone:</strong> {userDetails.phone}</p></div>
            <div className="flex justify-end">
              <button
                onClick={handleEditToggle}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2 text-blue-600">Username</label>
              <input
                type="text"
                name="username"
                value={updatedDetails.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  usernameAvailable ? 'focus:ring-blue-600' : 'focus:ring-red-600'
                } text-black`}
              />
              {!usernameAvailable && (
                <p className="text-red-600 text-sm mt-1">Username is not available.</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2 text-blue-600">Name</label>
              <input
                type="text"
                name="name"
                value={updatedDetails.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2 text-blue-600">Email</label>
              <input
                type="email"
                name="email"
                value={updatedDetails.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2 text-blue-600">Phone</label>
              <input
                type="text"
                name="phone"
                value={updatedDetails.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleSaveChanges}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
              >
                Save Changes
              </button>
              <button
                onClick={handleEditToggle}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
