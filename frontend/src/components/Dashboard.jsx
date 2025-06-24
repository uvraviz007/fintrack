import React, { useState, useEffect } from 'react';
import axios from '../utils/api';
import GroupForm from './GroupForm';

function Dashboard() {
  const [groups, setGroups] = useState([]);

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
      <h1 className="text-4xl font-extrabold mb-6 text-center drop-shadow-lg absolute left underline">
        Dashboard
      </h1>
      <div className="flex justify-center items-center mb-12">
        
          <GroupForm />
        
      </div>
      <h2 className="text-3xl font-bold mb-6 text-center drop-shadow-lg">
        Your Groups
      </h2>
      <ul className="bg-white rounded-lg shadow-lg p-6 border border-gray-300 max-w-3xl mx-auto">
        {groups.length > 0 ? (
          groups.map((group) => (
            <li
              key={group._id}
              className="border-b py-4 text-gray-800 flex justify-between items-center"
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
          <li className="text-gray-500 text-center py-4">
            No groups found. Create one!
          </li>
        )}
      </ul>
    </div>
  );
}

export default Dashboard;