// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import DashboardLayout from '../components/DashboardLayout';

// function Expense() {
//   const [expenses, setExpenses] = useState([]);
//   const [filter, setFilter] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortOption, setSortOption] = useState('date');

//   useEffect(() => {
//     const fetchExpenses = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           console.error('No token found. Please log in.');
//           return;
//         }

//         const config = {
//           headers: { Authorization: `Bearer ${token}` },
//         };

//         const response = await axios.get('/expenses', config);
//         setExpenses(response.data);
//       } catch (error) {
//         console.error('Error fetching expenses:', error);
//       }
//     };

//     fetchExpenses();
//   }, []);

//   const filteredExpenses = expenses
//     .filter((expense) => (filter ? expense.category === filter : true))
//     .filter((expense) =>
//       searchTerm
//         ? expense.description.toLowerCase().includes(searchTerm.toLowerCase())
//         : true
//     )
//     .sort((a, b) =>
//       sortOption === 'date'
//         ? new Date(b.date) - new Date(a.date)
//         : b.amount - a.amount
//     );

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-600 p-8 text-white font-sans">
//         <h1 className="text-5xl font-extrabold mb-8 tracking-tight underline decoration-blue-500">
//           Expense Management
//         </h1>

//         {/* Labels above colored boxes with same background */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
//           <div className="text-sm font-semibold text-white">Search</div>
//           <div className="text-sm font-semibold text-white">Category</div>
//           <div className="text-sm font-semibold text-white">Sort By</div>
//         </div>

//         {/* Colored Input Boxes */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           {/* Search Box */}
//            <input
//               type="text"
//               placeholder="Search expenses..."
//               className="w-full px-4 py-2 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
          

//           {/* Filter Box */}
//            <select
//               className="w-full px-4 py-2 text-black bg-violet-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//             >
//               <option value="">All Categories</option>
//               <option value="Food">Food</option>
//               <option value="Travel">Travel</option>
//               <option value="Entertainment">Entertainment</option>
//               <option value="Others">Others</option>
//             </select>
          

//           {/* Sort Box */}
         
//             <select
//               className="w-full px-4 py-2 bg-teal-400 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
//               value={sortOption}
//               onChange={(e) => setSortOption(e.target.value)}
//             >
//               <option value="date">Date</option>
//               <option value="amount">Amount</option>
//             </select>
          
//         </div>

//         {/* Expense List */}
//         <div className="bg-white text-gray-900 rounded-2xl shadow-xl p-6">
//           <h2 className="text-3xl font-bold mb-6 text-slate-800">Expense List</h2>
//           {filteredExpenses.length > 0 ? (
//             <ul className="space-y-4">
//               {filteredExpenses.map((expense, index) => (
//                 <li
//                   key={index}
//                   className="flex justify-between items-center border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
//                 >
//                   <div>
//                     <h3 className="text-xl font-semibold text-gray-800">
//                       {expense.description}
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       ₹{expense.amount} • {expense.category} • Paid by: {expense.paidBy}
//                     </p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Date: {new Date(expense.date).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <button
//                     className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
//                     onClick={() => alert('Delete functionality coming soon!')}
//                   >
//                     Delete
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-500 text-lg">No expenses found.</p>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

// export default Expense;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

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
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found. Please log in.');
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get('/expenses', config);
        setExpenses(response.data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setError('Failed to fetch expenses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const filteredExpenses = expenses
    .filter((expense) => (filter ? expense.category === filter : true))
    .filter((expense) =>
      searchTerm
        ? expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.paidBy.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sortOption === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortOption === 'amount') {
        return b.amount - a.amount;
      }
      return 0; // Fallback
    });

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white font-sans">
        {/* Header Section */}
        <h1 className="text-5xl font-extrabold mb-10 text-center tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          Your Expense Tracker
        </h1>

        {/* Filter and Sort Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          {/* Search Input */}
          <div className="flex flex-col">
            <label htmlFor="search" className="text-sm font-medium text-gray-300 mb-2">Search Expenses</label>
            <input
              id="search"
              type="text"
              placeholder="Search by description, category, or payer..."
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-400 border border-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-col">
            <label htmlFor="category-filter" className="text-sm font-medium text-gray-300 mb-2">Filter by Category</label>
            <select
              id="category-filter"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 border border-gray-600 appearance-none cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {/* Dynamically render categories if available, or keep static */}
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Utilities">Utilities</option>
              <option value="Rent">Rent</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex flex-col">
            <label htmlFor="sort-option" className="text-sm font-medium text-gray-300 mb-2">Sort By</label>
            <select
              id="sort-option"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 border border-gray-600 appearance-none cursor-pointer"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="date">Date (Newest First)</option>
              <option value="amount">Amount (Highest First)</option>
            </select>
          </div>
        </div>

        {/* Expense List Section */}
        <div className="bg-gray-800 text-gray-100 rounded-2xl shadow-xl p-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-8 text-blue-300">Overview of Your Expenses</h2>

          {loading && (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <p className="ml-4 text-xl text-gray-400">Loading expenses...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-800 text-white p-4 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredExpenses.length > 0 ? (
            <ul className="space-y-4">
              {filteredExpenses.map((expense, index) => (
                <li
                  key={expense._id || index} // Use _id if available, otherwise index (ensure unique keys)
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-700 rounded-xl p-5 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border border-gray-600"
                >
                  <div className="mb-3 sm:mb-0">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {expense.description}
                    </h3>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium text-yellow-300">Category:</span> {expense.category} • <span className="font-medium text-green-300">Paid by:</span> {expense.paidBy}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Date: {new Date(expense.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    <p className="text-2xl font-bold text-red-400 mr-4">
                      ₹{expense.amount.toFixed(2)}
                    </p>
                    <button
                      className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-700 text-white font-medium rounded-lg shadow-md hover:from-red-700 hover:to-rose-800 transition-all duration-300 transform hover:scale-105"
                      onClick={() => alert('Delete functionality coming soon! (Expense ID: ' + (expense._id || 'N/A') + ')')}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
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