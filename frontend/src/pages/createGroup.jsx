import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DashboardLayout from '../components/DashboardLayout';

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [usernames, setUsernames] = useState(['']);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleAddUsernameField = () => {
    setUsernames([...usernames, '']);
  };

  const handleRemoveUsernameField = (index) => {
    if (usernames.length === 1) return; // Prevent removing the last field
    const updated = [...usernames];
    updated.splice(index, 1);
    setUsernames(updated);
  };

  const handleUsernameChange = (index, value) => {
    const updated = [...usernames];
    updated[index] = value;
    setUsernames(updated);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a group.');
      return;
    }

    const nonEmptyUsernames = usernames.filter((u) => u.trim() !== '');
    if (nonEmptyUsernames.length === 0) {
      setError('Please enter at least one member username.');
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
          members: nonEmptyUsernames,
        },
        config
      );

      setSuccessMessage('Group created successfully!');
      setError('');
      setGroupName('');
      setUsernames(['']);
    } catch (err) {
      console.error('Error creating group:', err.response || err);
      setError(err.response?.data?.error || 'Failed to create group. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-r from-gray-700 via-gray-300 to-gray-400 p-8 text-gray-800 flex justify-center items-center relative">
        <button
          onClick={() => navigate('/groups')}
          className="absolute top-6 left-8 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
        >
          Back to Groups
        </button>

        <div className="w-1/2 bg-white rounded-lg shadow-xl p-8 text-gray-800 border-2 border-blue-600">
          <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">Create Group</h2>

          <form onSubmit={handleCreateGroup} className="space-y-6">
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />

            <h3 className="text-lg font-semibold text-gray-700">Add Members (Usernames):</h3>

            {usernames.map((username, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Username ${index + 1}`}
                  value={username}
                  onChange={(e) => handleUsernameChange(index, e.target.value)}
                  className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                {usernames.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveUsernameField(index)}
                    className="text-red-600 hover:text-red-800 text-xl font-bold"
                    title="Remove this member"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddUsernameField}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition duration-300"
            >
              Add More Members
            </button>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Create Group
            </button>
          </form>

          <div className="mt-4">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateGroup;
