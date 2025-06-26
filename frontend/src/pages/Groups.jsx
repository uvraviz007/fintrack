import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import DashboardLayout from '../components/DashboardLayout';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
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

        const response = await axios.get('/groups', config);
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-r from-gray-700 via-gray-300 to-gray-400 p-8 text-gray-800">
        {/* Create New Group Section */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-600 mb-6">Create a New Group!</h1>
          <button
            onClick={() => navigate('/creategroup')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
          >
            Create Group
          </button>
        </div>

        {/* Horizontal Line */}
        <hr className="border-gray-400 mb-12" />

        {/* Your Groups Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-600 mb-6 text-center ">Your Groups</h2>
          {groups.length === 0 ? (
            <p className="text-gray-500 text-center">You are not part of any groups yet.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group, index) => (
                <li
                  key={index}
                  className="bg-white rounded-lg shadow-lg p-6 text-gray-800 hover:shadow-xl transition duration-300"
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">{group.name}</h3>
                  <p className="text-gray-600 mb-1"><strong>Group ID:</strong> {group.id}</p>
                  <p className="text-gray-600 mb-1"><strong>Members:</strong> {group.members.join(', ')}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Groups;