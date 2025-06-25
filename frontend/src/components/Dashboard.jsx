import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';

function Dashboard() {
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
    <div className="min-h-screen bg-gradient-to-r from-emerald-500 via-purple-500 to-pink-500 p-8 text-white">
      <div className="flex justify-start mb-4">
        <button
          onClick={() => navigate('/createGroup')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 font-semibold"
        >
          Create Group
        </button>
      </div>
      <h2 className="underline text-3xl font-bold mb-6 text-left drop-shadow-lg">
        Your Groups
      </h2>
      <ul className="bg-white rounded-lg shadow-lg p-6 border border-gray-300 max-w-xl">
        {groups.length > 0 ? (
          groups.map((group) => (
            <li
              key={group._id}
              className="border-b py-4 text-gray-800 flex justify-between items-start"
            >
              <div>
                <strong className="text-lg">{group.name}</strong>
                <p className="text-sm text-gray-600">
                  Members: {group.members.map((member) => member.email).join(', ')}
                </p>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-left py-4">
            No groups found. Create one!
          </li>
        )}
      </ul>
    </div>
  );
}

export default Dashboard;