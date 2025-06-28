import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('date');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found. Please log in.');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get('/expenses', config);
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, []);

  const filteredExpenses = expenses
    .filter((expense) => (filter ? expense.category === filter : true))
    .filter((expense) =>
      searchTerm
        ? expense.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .sort((a, b) =>
      sortOption === 'date'
        ? new Date(b.date) - new Date(a.date)
        : b.amount - a.amount
    );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-600 p-8 text-white font-sans">
        <h1 className="text-5xl font-extrabold mb-8 tracking-tight underline decoration-blue-500">
          Expense Management
        </h1>

        {/* Labels above colored boxes with same background */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
          <div className="text-sm font-semibold text-white">Search</div>
          <div className="text-sm font-semibold text-white">Category</div>
          <div className="text-sm font-semibold text-white">Sort By</div>
        </div>

        {/* Colored Input Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Search Box */}
           <input
              type="text"
              placeholder="Search expenses..."
              className="w-full px-4 py-2 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          

          {/* Filter Box */}
           <select
              className="w-full px-4 py-2 text-black bg-violet-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Others">Others</option>
            </select>
          

          {/* Sort Box */}
         
            <select
              className="w-full px-4 py-2 bg-teal-400 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
          
        </div>

        {/* Expense List */}
        <div className="bg-white text-gray-900 rounded-2xl shadow-xl p-6">
          <h2 className="text-3xl font-bold mb-6 text-slate-800">Expense List</h2>
          {filteredExpenses.length > 0 ? (
            <ul className="space-y-4">
              {filteredExpenses.map((expense, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {expense.description}
                    </h3>
                    <p className="text-sm text-gray-600">
                      ₹{expense.amount} • {expense.category} • Paid by: {expense.paidBy}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Date: {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                    onClick={() => alert('Delete functionality coming soon!')}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-lg">No expenses found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Expense;
