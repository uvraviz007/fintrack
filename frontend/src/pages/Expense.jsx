import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { FaSearch, FaFilter, FaSortAlphaDown, FaExclamationCircle } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { format, parseISO, isValid } from 'date-fns'; // Added 'format' for display

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('date');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        let userID = null;

        if (!token) {
          console.error('No token found. Please log in.');
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }

        try {
          const decodedToken = jwtDecode(token);
          userID = decodedToken.id || decodedToken.userId || decodedToken.sub;
          if (!userID) {
            throw new Error("User ID not found in token payload.");
          }
          console.log("Extracted User ID from token:", userID);
        } catch (decodeError) {
          console.error('Error decoding token or User ID not found in token:', decodeError);
          setError('Could not get user information. Please log in again.');
          setLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get(`http://localhost:5001/expense/member/${userID}`, config);
        
        // --- ADDED DEBUGGING LOG HERE ---
        console.log("Raw API Response Data:", response.data);
        response.data.forEach((exp, index) => {
            console.log(`Expense ${index} date field:`, exp.date, `(Type: ${typeof exp.date})`);
            if (!exp.date) {
                console.warn(`WARNING: Expense ${index} has a missing/null/empty date field.`);
            }
        });
        // --- END DEBUGGING LOG ---

        setExpenses(response.data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        if (err.response && err.response.status === 401) {
            setError('Unauthorized. Please log in again.');
        } else {
            setError('Failed to fetch expenses. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  function expenseDateToMs(dateString) {
    if (!dateString) return 0;
    const parsed = parseISO(dateString);
    // --- ADDED DEBUGGING LOG HERE ---
    if (!isValid(parsed)) {
        console.error(`DEBUG: Invalid date during sorting for string: "${dateString}"`);
    }
    // --- END DEBUGGING LOG ---
    return isValid(parsed) ? parsed.getTime() : 0;
  }

  const filteredExpenses = expenses
    .filter((expense) => (filter ? expense.category === filter : true))
    .filter((expense) =>
      searchTerm
        ? expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (expense.paidBy && expense.paidBy.toLowerCase().includes(searchTerm.toLowerCase()))
        : true
    )
    .sort((a, b) => {
      const dateA = expenseDateToMs(a.date);
      const dateB = expenseDateToMs(b.date);
      if (sortOption === 'date') {
        return dateB - dateA;
      } else if (sortOption === 'amount') {
        return b.amount - a.amount;
      }
      return 0;
    });

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white font-sans">
        <h1 className="text-5xl font-extrabold mb-10 text-center tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          Your Expense Tracker
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <div className="flex flex-col relative">
            <label htmlFor="search" className="text-sm font-medium text-gray-300 mb-2">Search Expenses</label>
            <div className="relative">
              <input
                id="search"
                type="text"
                placeholder="Description, Category, Payer..."
                className="w-full px-4 pl-10 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-400 border border-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col relative">
            <label htmlFor="category-filter" className="text-sm font-medium text-gray-300 mb-2">Filter by Category</label>
            <div className="relative">
              <select
                id="category-filter"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 border border-gray-600 appearance-none cursor-pointer pl-10"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Others">Others</option>
              </select>
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col relative">
            <label htmlFor="sort-option" className="text-sm font-medium text-gray-300 mb-2">Sort By</label>
            <div className="relative">
              <select
                id="sort-option"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 border border-gray-600 appearance-none cursor-pointer pl-10"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="date">Date (Newest First)</option>
                <option value="amount">Amount (Highest First)</option>
              </select>
              <FaSortAlphaDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 text-gray-100 rounded-2xl shadow-xl p-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-8 text-blue-300">Overview of Your Expenses</h2>

          {loading && (
            <div className="flex justify-center items-center h-48 flex-col">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
              <p className="text-xl text-gray-400">Loading expenses...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-800 text-white p-4 rounded-lg text-center flex items-center justify-center gap-2">
              <FaExclamationCircle className="text-2xl" />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredExpenses.length > 0 ? (
            <ul className="space-y-4">
              {filteredExpenses.map((expense) => {
                const averageAmount = (expense.members && expense.members.length > 0)
                  ? (expense.amount / expense.members.length).toFixed(2)
                  : expense.amount.toFixed(2);

                const expenseDate = expense.date ? parseISO(expense.date) : null;
                const formattedDate = expenseDate && isValid(expenseDate)
                  ? format(expenseDate, 'MMM d,PPPP') // 'PPPP' gives "Jul 2, 2025"
                  : 'Invalid Date (Check Data)'; // More descriptive fallback

                // --- ADDED DEBUGGING LOG HERE ---
                if (formattedDate === 'Invalid Date (Check Data)') {
                    console.error(`DEBUG: Expense ID ${expense._id} has invalid date string: "${expense.date}"`);
                }
                // --- END DEBUGGING LOG ---

                return (
                  <li
                    key={expense._id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-700 rounded-xl p-5 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border border-gray-600"
                  >
                    <div className="mb-3 sm:mb-0">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {expense.description}
                      </h3>
                      <p className="text-sm text-gray-300">
                        <span className="font-medium text-yellow-300">Category:</span> {expense.category}
                      </p>
                      <p className="text-sm text-gray-300">
                        <span className="font-medium text-green-300">Paid by:</span> {expense.paidBy}
                      </p>
                      {expense.members && expense.members.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                            Members involved: {expense.members.length}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Date: {formattedDate}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                      <p className="text-2xl font-bold text-red-400 mr-4">
                        ₹{averageAmount} {expense.members && expense.members.length > 0 && `(per person)`}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : !loading && !error && (
            <div className="text-center py-10">
              <p className="text-gray-400 text-2xl mb-4">No expenses recorded yet.</p>
              <p className="text-gray-500">Start adding your expenses to see them here!</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Expense;