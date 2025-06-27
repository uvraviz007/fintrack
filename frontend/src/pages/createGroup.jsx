import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
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

  const handleUsernameChange = (index, value) => {
    const updatedUsernames = [...usernames];
    updatedUsernames[index] = value;
    setUsernames(updatedUsernames);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/groups/create', {
        name: groupName,
        members: usernames,
      });
      setSuccessMessage('Group created successfully!');
      setError('');
    } catch (err) {
      setError('Failed to create group. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-r from-gray-700 via-gray-300 to-gray-400 p-8 text-gray-800 flex justify-center items-center relative">
        {/* Back to Groups Button */}
        <button
          onClick={() => navigate('/groups')}
          className="absolute top-6 left-8 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
        >
          Back to Groups
        </button>

        {/* Create Group Section */}
        <div className="w-1/2 bg-white rounded-lg shadow-xl p-8 text-gray-800 border-2 border-blue-600">
          <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">Create Group</h2>
          <form onSubmit={handleCreateGroup} className="space-y-6">
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <h3 className="text-lg font-semibold text-gray-700">Add Members (Usernames):</h3>
            {usernames.map((username, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Username ${index + 1}`}
                value={username}
                onChange={(e) => handleUsernameChange(index, e.target.value)}
                className="w-full px-4 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
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
          {/* Error and Success Messages */}
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