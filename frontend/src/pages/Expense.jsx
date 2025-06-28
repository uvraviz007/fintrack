import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('date');
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
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

        const response = await axios.get('/expenses', config);
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleGenerateMonthlyExpenses = () => {
    const monthlyTotals = expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleString('default', { month: 'long' });
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {});

    const formattedMonthlyExpenses = Object.entries(monthlyTotals).map(([month, total]) => ({
      month,
      total,
    }));

    setMonthlyExpenses(formattedMonthlyExpenses);
  };

  const filteredExpenses = expenses
    .filter((expense) =>
      filter ? expense.category === filter : true
    )
    .filter((expense) =>
      searchTerm ? expense.description.toLowerCase().includes(searchTerm.toLowerCase()) : true
    )
    .sort((a, b) => {
      if (sortOption === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortOption === 'amount') {
        return b.amount - a.amount;
      }
      return 0;
    });

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-r from-gray-600 via-gray-400 to-gray-500 p-8 text-white">
        <h1 className="text-4xl font-bold mb-6 underline ">Expense Management</h1>
        <hr className='line mb-4'></hr>

        {/* Search Bar and Generate Monthly Expenses */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-4">
          <div className="w-1/2 pr-4 border-r border-gray-300">
            <h2 className="text-2xl font-bold mb-4">Search Expenses</h2>
            <input
              type="text"
              placeholder="Search expenses..."
              className="text-black w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="w-1/2 pl-4">
            <h2 className="text-2xl font-bold mb-4">Generate Monthly Expenses</h2>
            <button
              onClick={handleGenerateMonthlyExpenses}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Generate Monthly Expenses
            </button>
          </div>
        </div>

        {/* Filters and Sort Expenses */}
        <div className="flex justify-between items-start mb-6 border-b border-gray-300 pb-4">
          <div className="w-1/2 pr-4 border-r border-gray-300">
            <h2 className="text-2xl font-bold mb-4">Filter by Category</h2>
            <select
              className="w-full text-black px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Others">Others</option>
            </select>
            <ul className="bg-white rounded-lg shadow-lg p-6 border border-gray-300 text-gray-800">
              {filteredExpenses.map((expense, index) => (
                <li key={index} className="border-b py-4">
                  <strong>{expense.description}</strong> - ₹{expense.amount} ({expense.category})
                </li>
              ))}
            </ul>
          </div>
          <div className="w-1/2 pl-4">
            <h2 className="text-2xl font-bold mb-4">Sort Expenses</h2>
            <select
              className="text-black w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
            <ul className="bg-white rounded-lg shadow-lg p-6 border border-gray-300 text-gray-800">
              {filteredExpenses.map((expense, index) => (
                <li key={index} className="border-b py-4">
                  <strong>{expense.description}</strong> - ₹{expense.amount} ({expense.category})
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Expense List */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Expense List</h2>
          <ul className="bg-white rounded-lg shadow-lg p-6 border border-gray-300">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense, index) => (
                <li
                  key={index}
                  className="border-b py-4 text-gray-800 flex justify-between items-start"
                >
                  <div>
                    <strong className="text-lg">{expense.description}</strong>
                    <p className="text-sm text-gray-600">
                      Amount: ₹{expense.amount} | Paid by: {expense.paidBy}
                    </p>
                    <p className="text-sm text-gray-600">Category: {expense.category}</p>
                  </div>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                    onClick={() => alert('Delete functionality coming soon!')}
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-left py-4">No expenses found.</p>
            )}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Expense;