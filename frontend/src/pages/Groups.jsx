import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DashboardLayout from '../components/DashboardLayout';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found. Please log in.');
          setError('Authentication required. Please log in to view your groups.');
          setLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await api.get('/group/user', config);
        setGroups(response.data.groups);
      } catch (err) {
        console.error('Error fetching groups:', err);
        setError('Failed to load your groups. Please try again.');
      } finally {
        setLoading(false); // Set loading to false after fetch completes (success or error)
      }
    };

    fetchUserGroups();
  }, []);

  const handleGroupClick = (groupId) => {
    navigate(`/groupdetails/${groupId}`);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white font-sans">
        {/* Header and Create Group Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold mb-6 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Manage Your Groups
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Create new groups to split bills effortlessly or view and manage your existing ones.
          </p>
          <button
            onClick={() => navigate('/creategroup')}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Create a New Group
          </button>
        </div>

        {/* Separator */}
        <hr className="border-gray-700 my-12" />

        {/* Your Groups List Section */}
        <div>
          <h2 className="text-4xl font-bold text-center text-purple-300 mb-10">
            Your Existing Groups
          </h2>
          {loading && (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
              <p className="ml-4 text-xl text-gray-400">Loading your groups...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-800 text-white p-6 rounded-lg text-center shadow-md border border-red-700 max-w-md mx-auto">
              <p className="font-semibold text-lg mb-2">Oops! Something went wrong.</p>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && groups.length === 0 ? (
            <div className="text-center py-10 bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700 max-w-lg mx-auto">
              <p className="text-gray-400 text-2xl mb-4">No groups found.</p>
              <p className="text-gray-500 text-lg">
                Looks like you haven't joined or created any groups yet. Start by creating a new one!
              </p>
            </div>
          ) : (
            !loading && !error && (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groups.map((group) => (
                  <li
                    key={group._id}
                    className="bg-gray-800 rounded-xl shadow-2xl p-7 text-white border border-gray-700
                               hover:shadow-3xl hover:border-blue-500 transition-all duration-300 cursor-pointer
                               transform hover:scale-105 flex flex-col justify-between"
                    onClick={() => handleGroupClick(group._id)}
                  >
                    <div>
                      <h3 className="text-3xl font-bold text-blue-400 mb-3 leading-tight">
                        {group.name}
                      </h3>
                      {group.description && ( // Display description if available
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {group.description}
                        </p>
                      )}
                      <div className="text-gray-500 text-xs mt-2">
                         {/* You can add more group details here if your API provides them */}
                        {/* <p>Members: {group.members ? group.members.length : 'N/A'}</p> */}
                        {/* <p>Created On: {new Date(group.createdAt).toLocaleDateString()}</p> */}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700 text-right">
                       <span className="text-sm font-semibold text-gray-400 hover:text-blue-300 transition duration-200">
                         View Group Details &rarr;
                       </span>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Groups;