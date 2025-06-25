import React, { useState } from 'react';
import axios from '../utils/api';
import DashboardLayout from '../components/DashboardLayout';

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [usernames, setUsernames] = useState(['']);
  const [existingGroupId, setExistingGroupId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleAddMembersToGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/groups/${existingGroupId}/add-members`, {
        members: usernames,
      });
      setSuccessMessage('Members added successfully!');
      setError('');
    } catch (err) {
      setError('Failed to add members. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-r from-gray-700 via-gray-300 to-gray-400 p-8 text-gray-800 flex">
        {/* Create Group Section */}
        <div className="w-1/3 bg-white rounded-lg shadow-xl p-6 text-gray-800 mr-4 ml-20 border-2 border-blue-600">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Create Group</h2>
          <form onSubmit={handleCreateGroup} className="space-y-4">
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
        </div>

        {/* Add Members to Existing Group Section */}
        <div className="w-1/3 bg-white rounded-lg shadow-xl p-6 text-gray-800 ml-20 mr-20 border-2 border-green-600">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Add Members to Existing Group</h2>
          <form onSubmit={handleAddMembersToGroup} className="space-y-4">
            <input
              type="text"
              placeholder="Existing Group ID"
              value={existingGroupId}
              onChange={(e) => setExistingGroupId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <h3 className="text-lg font-semibold text-gray-700">Add Members (Usernames):</h3>
            {usernames.map((username, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Username ${index + 1}`}
                value={username}
                onChange={(e) => handleUsernameChange(index, e.target.value)}
                className="w-full px-4 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            ))}
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
            >
              Add Members
            </button>
          </form>
        </div>

        {/* Error and Success Messages */}
        <div className="absolute bottom-4 left-4">
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateGroup;