import React, { useState, useEffect } from 'react';
import axios from '../utils/api';

function Expense() {
  const [expenses, setExpenses] = useState([]); // State for expenses
  const [filter, setFilter] = useState(''); // State for filtering expenses
  const [searchTerm, setSearchTerm] = useState(''); // State for searching expenses
  const [currency, setCurrency] = useState('USD'); // State for currency
  const [sortOption, setSortOption] = useState('date'); // State for sorting expenses

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

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
    alert(`Currency changed to ${e.target.value}`);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
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
    <div className="min-h-screen bg-gradient-to-r from-gray-600 via-gray-400 to-gray-500 p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Expenses</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search expenses..."
        className="text-black w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {/* Filters */}
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

      {/* Sorting */}
      <select
        className="text-black w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        value={sortOption}
        onChange={handleSortChange}
      >
        <option value="date">Sort by Date</option>
        <option value="amount">Sort by Amount</option>
      </select>

      {/* Currency Selector */}
      <select
        className="text-black w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        value={currency}
        onChange={handleCurrencyChange}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="INR">INR</option>
      </select>

      {/* Expense List */}
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
                  Amount: ${expense.amount} | Paid by: {expense.paidBy}
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
  );
}

export default Expense;