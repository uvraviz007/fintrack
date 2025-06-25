import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';

function Dashboard() {
  const [expenses, setExpenses] = useState([]); // State for expenses
  const [groups, setGroups] = useState([]); // State for groups
  const [showGroupsSection, setShowGroupsSection] = useState(false); // State to toggle Groups section
  const [showDashboardSection, setShowDashboardSection] = useState(true); // State to toggle Dashboard section
  const [currency, setCurrency] = useState('USD'); // State for currency
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
    setShowGroupsSection(false); // Hide Groups section
    setShowDashboardSection(true); // Show Dashboard section
  };

  const handleGroupsClick = () => {
    setShowDashboardSection(false); // Hide Dashboard section
    setShowGroupsSection(true); // Show Groups section
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
    alert(`Currency changed to ${e.target.value}`);
  };

  const generateMonthlyReport = () => {
    alert('Monthly report functionality coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-600 via-gray-400 to-gray-500 p-8 text-white flex">
      {/* Left Sidebar */}
      <div className="w-1/5 bg-gray-800 rounded-lg shadow-lg p-6 text-white mr-8">
        <ul className="space-y-4">
          <li
            className="cursor-pointer text-3xl underline"
            onClick={handleDashboardClick} // Show Dashboard section
          >
            HOME
          </li>
          <li
            className="cursor-pointer hover:underline"
            onClick={()=> navigate('/creategroup')} 
          >
            Groups
          </li>
          <li
            className="cursor-pointer hover:underline"
            onClick={() => navigate('/expense')}
          >
            Expenses
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {showDashboardSection && (
          <div>
            <h1 className="text-4xl font-bold mb-6 underline">Welcome to Dashboard</h1>
            <p className="text-lg mb-6">Let's add some transactions!</p>

            {/* Dashboard Controls */}
            <div className="grid grid-cols-3 gap-6">
              {/* Income */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800">
                <h3 className="text-lg font-semibold text-gray-700">Income</h3>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                  ₹0
                </button>
              </div>

              {/* Balance */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800">
                <h3 className="text-lg font-semibold text-gray-700">Balance</h3>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                  ₹2736
                </button>
              </div>

              {/* Expense */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800">
                <h3 className="text-lg font-semibold text-gray-700">Expense</h3>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                  ₹2736
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700">Category</h3>
              <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black">
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Date Filters */}
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Start Date</h3>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">End Date</h3>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                />
              </div>
            </div>

            {/* Add Button */}
            <div className="mt-6">
              <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
                Add Transaction
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;