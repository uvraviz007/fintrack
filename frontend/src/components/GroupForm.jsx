import React, { useState } from 'react';
import axios from '../utils/api';

function GroupForm() {
  const [name, setName] = useState('');
  const [members, setMembers] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const groupData = { name, members: members.split(',').map((email) => email.trim()) };
      await axios.post('/groups', groupData, config);
      alert('Group created successfully!');
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-3 rounded-lg shadow-lg w-72 mt-4 mx-auto border border-gray-300">
      <h2 className="text-lg font-bold text-center mb-3 text-gray-800">Create Group</h2>
      <input
        type="text"
        placeholder="Group Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-2 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Member Emails (comma-separated)"
        value={members}
        onChange={(e) => setMembers(e.target.value)}
        className="w-full px-2 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Create Group
      </button>
    </form>
  );
}

export default GroupForm;