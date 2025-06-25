import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';

function Dashboard() {
  const [expenses, setExpenses] = useState([]); // State for expenses
  const [groups, setGroups] = useState([]); // State for groups
  const [showGroupsSection, setShowGroupsSection] = useState(false); // State to toggle Groups section
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupsAndExpenses = async () => {
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

        // Fetch groups
        const groupResponse = await axios.get('/groups', config);
        setGroups(groupResponse.data);

        // Fetch expenses
        const expenseResponse = await axios.get('/expenses', config);
        setExpenses(expenseResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchGroupsAndExpenses();
  }, []);

  const handleDashboardClick = () => {
    setShowGroupsSection(false); // Reset to show the main dashboard view
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-600 via-gray-400 to-gray-500 p-8 text-white flex">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-800 rounded-lg shadow-lg p-6 text-white mr-8">
        <h2 className="text-2xl font-bold mb-4 underline">
        <li
            className="cursor-pointer hover:underline"
            onClick={handleDashboardClick} // Reset to main dashboard view
          >
            Dashboard
          </li>
        </h2>
        <ul className="space-y-4">
          
          <li
            className="cursor-pointer hover:underline"
            onClick={() => setShowGroupsSection(true)} // Show Groups section
          >
            Groups
          </li>
          <li className="cursor-pointer hover:underline" onClick={() => navigate('/expenses')}>
            Expenses
          </li>
          <li className="cursor-pointer hover:underline">
            Savings
          </li>
          <li className="cursor-pointer hover:underline">
            Due
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {showGroupsSection ? (
          <div className="mb-8">
            {/* Create New Group Section */}
            <h2 className="text-3xl font-bold mb-6 text-left drop-shadow-lg underline">
              Create New Group
            </h2>
            <button
              onClick={() => navigate('/createGroup')} // Navigate to createGroup page
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 font-semibold mb-6"
            >
              Create Group
            </button>

            {/* Horizontal Line */}
            <hr className="border-gray-300 my-6" />

            {/* Your Groups Section */}
            <h2 className="text-3xl font-bold mb-6 text-left drop-shadow-lg underline">
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
        ) : (
          <div className="text-center text-gray-300 text-lg">
            {/* Empty content when Dashboard is active */}
           
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;