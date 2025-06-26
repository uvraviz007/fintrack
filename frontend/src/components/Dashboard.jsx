import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import { FaUserCircle, FaPlusCircle } from 'react-icons/fa';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showDashboardSection, setShowDashboardSection] = useState(true);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState({
    type: 'income',
    currency: 'INR',
    amount: '',
    category: '',
    description: '',
    date: '',
  });

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

        const groupResponse = await axios.get('/groups', config);
        setGroups(groupResponse.data);

        const expenseResponse = await axios.get('/expenses', config);
        setExpenses(expenseResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchGroupsAndExpenses();
  }, []);

  const handleDashboardClick = () => {
    setShowDashboardSection(true);
  };

  const handleAddTransactionClick = () => {
    setShowTransactionForm(true);
  };

  const handleTransactionInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionDetails({ ...transactionDetails, [name]: value });
  };

  const handleSubmitTransaction = async () => {
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

      await axios.post('/transactions', transactionDetails, config);
      setTransactions([...transactions, transactionDetails]);
      alert('Transaction added successfully!');
      setShowTransactionForm(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-600 via-gray-400 to-gray-500 p-8 text-white flex relative">
      {/* Profile Button */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 cursor-pointer">
        <FaUserCircle className="text-3xl text-white" />
        <button
          onClick={() => navigate('/profile')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Profile
        </button>
      </div>

      {/* Left Sidebar */}
      <div className="w-1/5 bg-gray-800 rounded-lg shadow-lg p-6 text-white mr-8">
        <ul className="space-y-6">
          <li
            className="cursor-pointer text-3xl underline"
            onClick={handleDashboardClick}
          >
            HOME
          </li>
          <li
            className="cursor-pointer hover:underline"
            onClick={() => navigate('/groups')}
          >
            Groups
          </li>
          <li
            className="cursor-pointer hover:underline"
            onClick={() => navigate('/expense')}
          >
            Expenses
          </li>
          <li
            className="cursor-pointer hover:underline"
            onClick={() => navigate('/reports')}
          >
            Reports
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {showDashboardSection && (
          <div>
            <h1 className="text-4xl font-bold mb-6 underline text-center">Welcome to Dashboard</h1>
            <p className="text-lg mb-6 text-center">Track your transactions and manage your finances!</p>

            {/* Dashboard Controls */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800 hover:shadow-xl transition duration-300">
                <h3 className="text-lg font-semibold text-gray-700">Income</h3>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                  ₹0
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800 hover:shadow-xl transition duration-300">
                <h3 className="text-lg font-semibold text-gray-700">Balance</h3>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                  ₹0
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800 hover:shadow-xl transition duration-300">
                <h3 className="text-lg font-semibold text-gray-700">Expense</h3>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                  ₹0
                </button>
              </div>
            </div>

            {/* Add Transaction Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleAddTransactionClick}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 flex items-center space-x-2"
              >
                <FaPlusCircle className="text-xl" />
                <span>Add Transaction</span>
              </button>
            </div>

            {/* Your Transactions Block */}
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6 text-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-blue-600">Your Transactions</h2>
              {transactions.length === 0 ? (
                <p className="text-gray-500">No transactions added yet.</p>
              ) : (
                <ul className="space-y-4 max-h-64 overflow-y-auto">
                  {transactions.map((txn, index) => (
                    <li key={index} className="border-b pb-2">
                      <p><strong>Type:</strong> {txn.type}</p>
                      <p><strong>Amount:</strong> {txn.currency} ₹{txn.amount}</p>
                      <p><strong>Category:</strong> {txn.category}</p>
                      <p><strong>Date:</strong> {txn.date}</p>
                      <p><strong>Description:</strong> {txn.description || 'N/A'}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Transaction Form */}
      {showTransactionForm && (
        <div className="absolute top-16 right-16 w-1/4 bg-white rounded-lg shadow-lg p-4 text-gray-800">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Add Transaction</h2>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Transaction Type</label>
            <select
              name="type"
              value={transactionDetails.type}
              onChange={handleTransactionInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Currency</label>
            <select
              name="currency"
              value={transactionDetails.currency}
              onChange={handleTransactionInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              value={transactionDetails.amount}
              onChange={handleTransactionInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
            />
            </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={transactionDetails.category}
              onChange={handleTransactionInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={transactionDetails.date}
              onChange={handleTransactionInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
            />
            </div>
          <div className="flex justify-between">
            <button
              onClick={handleSubmitTransaction}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
            >
              Submit
            </button>
            <button
              onClick={() => setShowTransactionForm(false)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;