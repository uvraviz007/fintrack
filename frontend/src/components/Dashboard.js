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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <GroupForm />
      <h2 className="text-2xl font-bold mt-8 mb-4">Your Groups</h2>
      <ul className="bg-white rounded-lg shadow-md p-4">
        {groups.length > 0 ? (
          groups.map((group) => (
            <li key={group._id} className="border-b py-2">
              <strong>{group.name}</strong> - Members: {group.members.map((member) => member.email).join(', ')}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No groups found. Create one!</li>
        )}
      </ul>
    </div>
  );
}

export default Dashboard;