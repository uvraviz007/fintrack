import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DashboardLayout from '../components/DashboardLayout';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await api.get('/group/user', config);
        setGroups(response.data.groups);
      } catch (err) {
        console.error('Error fetching groups:', err);
        setError('Failed to fetch groups.');
      }
    };

    fetchUserGroups();
  }, []);

  const handleGroupClick = (groupId) => {
    navigate(`/groupdetails/${groupId}`);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-600 p-8 text-gray-800">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Create a New Group!</h1>
          <button
            onClick={() => navigate('/creategroup')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
          >
            Create Group
          </button>
        </div>

        <hr className="border-gray-400 mb-12" />

        <div>
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Your Groups</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {groups.length === 0 ? (
            <p className="text-gray-500 text-center">You are not part of any groups yet.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <li
                  key={group._id}
                  className="bg-white rounded-lg shadow-lg p-6 text-gray-800 hover:shadow-xl transition duration-300 cursor-pointer"
                  onClick={() => handleGroupClick(group._id)}
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">{group.name}</h3>
                  {/* <p className="text-gray-600"><strong>Group ID:</strong> {group._id}</p>
                  <p className="text-gray-600"><strong>Created By:</strong> {group.createdBy.username}</p> */}
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
