import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DashboardLayout from '../components/DashboardLayout';

// Import Feather Icons
import {
  FaPlus,        // For Add More Members
  FaTimes,        // For Remove Username Field
  FaUsers,        // For Group Name / General group icon
  FaUserPlus,     // For individual member input
  FaSpinner       // For loading/submitting state
} from 'react-icons/fa';

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  // Initialize with one empty string to always show at least one input field
  const [usernames, setUsernames] = useState(['']);
  const [message, setMessage] = useState({ type: '', text: '' }); // { type: 'success' | 'error', text: '...' }
  const [submitting, setSubmitting] = useState(false); // State for loading/submitting
  const navigate = useNavigate();

  const handleAddUsernameField = () => {
    // Only add a new field if the last one isn't empty (optional, but good for cleanliness)
    if (usernames[usernames.length - 1].trim() !== '') {
      setUsernames([...usernames, '']);
    } else {
      setMessage({ type: 'error', text: 'Please fill the current member field before adding a new one.' });
    }
  };

  const handleRemoveUsernameField = (index) => {
    if (usernames.length === 1) {
      setMessage({ type: 'error', text: 'At least one member field is required (the group creator is implicitly a member).' });
      return;
    }
    const updated = [...usernames];
    updated.splice(index, 1);
    setUsernames(updated);
    setMessage({ type: '', text: '' }); // Clear any previous error messages
  };

  const handleUsernameChange = (index, value) => {
    const updated = [...usernames];
    updated[index] = value;
    setUsernames(updated);
    setMessage({ type: '', text: '' }); // Clear messages on input change
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' }); // Clear previous messages
    setSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage({ type: 'error', text: 'Authentication required. Please log in.' });
      setSubmitting(false);
      navigate('/login'); // Redirect to login if no token
      return;
    }

    const nonEmptyUsernames = usernames.filter((u) => u.trim() !== '');

    // The group creator is implicitly a member, so require at least one additional member, or if the user
    // wants to create a group with just themselves, the username field should not be empty.
    if (nonEmptyUsernames.length === 0) {
      setMessage({ type: 'error', text: 'Please enter at least one member username.' });
      setSubmitting(false);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.post(
        '/group/create',
        {
          name: groupName,
          members: nonEmptyUsernames, // These are usernames, backend should convert to user IDs
        },
        config
      );

      setMessage({ type: 'success', text: response.data.message || 'Group created successfully!' });
      setGroupName('');
      setUsernames(['']); // Reset to one empty field
      // Optionally navigate to the new group's details page
      // navigate(`/group/${response.data.group._id}`);
    } catch (err) {
      console.error('Error creating group:', err.response || err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create group. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      {/* The outer div's background and flex properties are handled by DashboardLayout.
          This component should only render its main content. */}
      <div className="w-full text-gray-100 font-sans p-6 md:p-8 flex justify-center items-center min-h-[calc(100vh-64px)]"> {/* Added min-h for centering effect */}

        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 text-gray-100 w-full max-w-md border border-gray-700 animate-fade-in-up">
          <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-center flex items-center justify-center space-x-3">
            <FaUsers className="text-3xl" />
            <span>Create New Group</span>
          </h2>

          <form onSubmit={handleCreateGroup} className="space-y-6">
            {/* Group Name Input */}
            <div className="relative">
              <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
                required
              />
            </div>

            <h3 className="text-xl font-semibold text-blue-300 border-b border-gray-700 pb-3 mt-8 flex items-center space-x-2">
              <FaUserPlus className="text-2xl" />
              <span>Add Members (Usernames)</span>
            </h3>

            {/* Dynamic Username Fields */}
            {usernames.map((username, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="relative flex-grow">
                  <FaUserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Member Username ${index + 1}`}
                    value={username}
                    onChange={(e) => handleUsernameChange(index, e.target.value)}
                    className="flex-grow w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
                    required // Make sure all dynamically added fields are required
                  />
                </div>
                {usernames.length > 1 && ( // Only show remove button if more than one field
                  <button
                    type="button"
                    onClick={() => handleRemoveUsernameField(index)}
                    className="p-3 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="Remove this member"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}

            {/* Add More Members Button */}
            <button
              type="button"
              onClick={handleAddUsernameField}
              className="w-full py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition duration-300 transform hover:scale-[1.01] flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FaPlus className="text-xl" />
              <span>Add More Members</span>
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Creating Group...</span>
                </>
              ) : (
                <span>Create Group</span>
              )}
            </button>
          </form>

          {/* Messages */}
          <div className="mt-6">
            {message.text && (
              <p
                className={`p-3 rounded-lg text-center font-semibold animate-fade-in ${
                  message.type === 'success' ? 'bg-green-700 border border-green-600' : 'bg-red-700 border border-red-600'
                }`}
              >
                {message.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateGroup;