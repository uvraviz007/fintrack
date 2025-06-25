import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import Expense from '../pages/Expense';

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
         {/* <h2 className="text-2xl font-bold mb-4 underline">Dashboard</h2>  */}
        <ul className="space-y-4">
          <li
            className="cursor-pointer text-3xl underline"
            onClick={handleDashboardClick} // Show Dashboard section
          >
            HOME
          </li>
          <li
            className="cursor-pointer hover:underline "
            onClick={handleGroupsClick} // Show Groups section
          >
            Groups
          </li>
          <li className="cursor-pointer hover:underline" onClick={() => 
            navigate('/expense')
          }>
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
  {showDashboardSection && (
    <div className="flex flex-col justify-end h-full">
      {/* Bottom Section: Left to Right Alignment */}
      <div className="flex justify-between items-start space-x-4">
        {/* Expense History Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-300 flex-1">
          <h2 className="text-2xl font-bold mb-4 text-black">Expense History</h2>
          <hr className="border-t border-gray-400 mb-4" />
          {expenses.length > 0 ? (
            <ul>
              {expenses.map((expense, index) => (
                <li
                  key={index}
                  className="border-b py-4 text-gray-800 flex justify-between items-start"
                >
                  <div>
                    <strong className="text-lg">{expense.description}</strong>
                    <p className="text-sm text-gray-600">
                      Amount: ${expense.amount} | Paid by: {expense.paidBy}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-left py-4">No expense history available.</p>
          )}
        </div>

        {/* Currency Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-300 flex-1">
          <h2 className="text-2xl font-bold mb-4 text-black">Currency Support</h2>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4 text-black"
            value={currency}
            onChange={handleCurrencyChange}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="INR">INR</option>
          </select>
        </div>

        {/* Monthly Report Button */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-300 flex-1">
          <h2 className="text-2xl font-bold mb-4 text-black">Monthly Expense Report</h2>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 font-semibold"
            onClick={generateMonthlyReport}
          >
            Generate Monthly Report
          </button>
        </div>
      </div>
    </div>
  )}

  {showGroupsSection && (
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
  )}
</div>
    </div>
  );
}

export default Dashboard;