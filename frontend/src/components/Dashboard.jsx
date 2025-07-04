// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaUserCircle, FaPlusCircle } from 'react-icons/fa';

// function Dashboard() {
//   const [expenses, setExpenses] = useState([]);
//   const [groups, setGroups] = useState([]);
//   const [showDashboardSection, setShowDashboardSection] = useState(true);
//   const [showTransactionForm, setShowTransactionForm] = useState(false);
//   const [transactions, setTransactions] = useState([]);
//   const [transactionDetails, setTransactionDetails] = useState({
//     type: 'income',
//     currency: 'INR',
//     amount: '',
//     category: '',
//     description: '',
//     date: '',
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchGroupsAndExpenses = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           console.error('No token found. Please log in.');
//           return;
//         }

//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         const groupResponse = await axios.get('/groups', config);
//         setGroups(groupResponse.data);

//         const expenseResponse = await axios.get('/expenses', config);
//         setExpenses(expenseResponse.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchGroupsAndExpenses();
//   }, []);

//   const handleDashboardClick = () => {
//     setShowDashboardSection(true);
//   };

//   const handleAddTransactionClick = () => {
//     setShowTransactionForm(true);
//   };

//   const handleTransactionInputChange = (e) => {
//     const { name, value } = e.target;
//     setTransactionDetails({ ...transactionDetails, [name]: value });
//   };

//   const handleSubmitTransaction = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error('No token found. Please log in.');
//         return;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       await axios.post('/transactions', transactionDetails, config);
//       setTransactions([...transactions, transactionDetails]);
//       alert('Transaction added successfully!');
//       setShowTransactionForm(false);
//     } catch (error) {
//       console.error('Error adding transaction:', error);
//       alert('Failed to add transaction.');
//     }
//   };

//   return (
    
//     <div className="min-h-screen bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-600 p-8 text-white flex relative">
//       {/* Profile Button */}
//       <div className="absolute top-4 right-4 flex items-center space-x-2 cursor-pointer">
//         <FaUserCircle className="text-3xl text-white" />
//         <button
//           onClick={() => navigate('/profile')}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
//         >
//           Profile
//         </button>
//       </div>

//       {/* Left Sidebar */}
//       <div className="w-1/5 bg-gray-800 rounded-lg shadow-lg p-6 text-white mr-8">
//         <ul className="space-y-6">
//           <li
//             className="cursor-pointer text-3xl underline"
//             onClick={handleDashboardClick}
//           >
//             HOME
//           </li>
//           <li
//             className="cursor-pointer hover:underline"
//             onClick={() => navigate('/groups')}
//           >
//             Groups
//           </li>
//           <li
//             className="cursor-pointer hover:underline"
//             onClick={() => navigate('/expense')}
//           >
//             Expenses
//           </li>
//           <li
//             className="cursor-pointer hover:underline"
//             onClick={() => navigate('/reports')}
//           >
//             Reports
//           </li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1">
//         {showDashboardSection && (
//           <div>
//             <h1 className="text-4xl font-bold mb-6 underline text-center">Welcome to Dashboard</h1>
//             <p className="text-lg mb-6 text-center">Track your transactions and manage your finances!</p>

//             {/* Dashboard Controls */}
//             <div className="grid grid-cols-3 gap-6">
//               <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800 hover:shadow-xl transition duration-300">
//                 <h3 className="text-lg font-semibold text-gray-700">Income</h3>
//                 <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
//                   ₹0
//                 </button>
//               </div>
//               <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800 hover:shadow-xl transition duration-300">
//                 <h3 className="text-lg font-semibold text-gray-700">Balance</h3>
//                 <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
//                   ₹0
//                 </button>
//               </div>
//               <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800 hover:shadow-xl transition duration-300">
//                 <h3 className="text-lg font-semibold text-gray-700">Expense</h3>
//                 <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
//                   ₹0
//                 </button>
//               </div>
//             </div>

//             {/* Add Transaction Button */}
//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={handleAddTransactionClick}
//                 className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 flex items-center space-x-2"
//               >
//                 <FaPlusCircle className="text-xl" />
//                 <span>Add Transaction</span>
//               </button>
//             </div>

//             {/* Your Transactions Block */}
//             <div className="mt-8 bg-white rounded-lg shadow-lg p-6 text-gray-800">
//               <h2 className="text-2xl font-bold mb-4 text-blue-600">Your Transactions</h2>
//               {transactions.length === 0 ? (
//                 <p className="text-gray-500">No transactions added yet.</p>
//               ) : (
//                 <ul className="space-y-4 max-h-64 overflow-y-auto">
//                   {transactions.map((txn, index) => (
//                     <li key={index} className="border-b pb-2">
//                       <p><strong>Type:</strong> {txn.type}</p>
//                       <p><strong>Amount:</strong> {txn.currency} ₹{txn.amount}</p>
//                       <p><strong>Category:</strong> {txn.category}</p>
//                       <p><strong>Date:</strong> {txn.date}</p>
//                       <p><strong>Description:</strong> {txn.description || 'N/A'}</p>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Transaction Form */}
//       {showTransactionForm && (
//         <div className="absolute top-16 right-16 w-1/4 bg-white rounded-lg shadow-lg p-4 text-gray-800">
//           <h2 className="text-xl font-bold mb-4 text-blue-600">Add Transaction</h2>
//           <div className="mb-4">
//             <label className="block text-lg font-semibold mb-2">Transaction Type</label>
//             <select
//               name="type"
//               value={transactionDetails.type}
//               onChange={handleTransactionInputChange}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
//             >
//               <option value="income">Income</option>
//               <option value="expense">Expense</option>
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block text-lg font-semibold mb-2">Currency</label>
//             <select
//               name="currency"
//               value={transactionDetails.currency}
//               onChange={handleTransactionInputChange}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
//             >
//               <option value="INR">INR</option>
//               <option value="USD">USD</option>
//               <option value="EUR">EUR</option>
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block text-lg font-semibold mb-2">Amount</label>
//             <input
//               type="number"
//               name="amount"
//               value={transactionDetails.amount}
//               onChange={handleTransactionInputChange}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
//             />
//             </div>
//           <div className="mb-4">
//             <label className="block text-lg font-semibold mb-2">Category</label>
//             <input
//               type="text"
//               name="category"
//               value={transactionDetails.category}
//               onChange={handleTransactionInputChange}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-lg font-semibold mb-2">Date</label>
//             <input
//               type="date"
//               name="date"
//               value={transactionDetails.date}
//               onChange={handleTransactionInputChange}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
//             />
//             </div>
//           <div className="flex justify-between">
//             <button
//               onClick={handleSubmitTransaction}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
//             >
//               Submit
//             </button>
//             <button
//               onClick={() => setShowTransactionForm(false)}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaUserCircle, FaPlusCircle, FaHome, FaUsers, FaMoneyBillWave, FaChartBar,
  FaArrowCircleUp, FaArrowCircleDown, FaBalanceScale, FaTimes, FaSpinner,
  FaCalendarAlt, FaTag, FaInfoCircle
} from 'react-icons/fa';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState({
    type: 'income',
    currency: 'INR',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [submittingTransaction, setSubmittingTransaction] = useState(false);
  const [dashboardSummary, setDashboardSummary] = useState({
    income: 0,
    balance: 0,
    expense: 0
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingDashboard(true);
      setMessage({ type: '', text: '' });
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage({ type: 'error', text: 'Authentication required. Please log in.' });
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        try {
          await axios.get('/groups', config);
        } catch (groupError) {
          console.warn('Could not fetch groups:', groupError.message);
        }

        try {
          await axios.get('/expenses', config);
        } catch (expenseError) {
          console.warn('Could not fetch expenses:', expenseError.message);
        }

        const transactionsResponse = await axios.get('/transactions/user', config);
        setTransactions(transactionsResponse.data);

        let totalIncome = 0;
        let totalExpense = 0;
        transactionsResponse.data.forEach(txn => {
          if (txn.type === 'income') {
            totalIncome += parseFloat(txn.amount);
          } else if (txn.type === 'expense') {
            totalExpense += parseFloat(txn.amount);
          }
        });
        setDashboardSummary({
          income: totalIncome,
          expense: totalExpense,
          balance: totalIncome - totalExpense
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error.response?.data?.message || error.message);
        setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to load dashboard data. Please try again.' });
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoadingDashboard(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleAddTransactionClick = () => {
    setShowTransactionForm(true);
    setMessage({ type: '', text: '' });
    setTransactionDetails({
      type: 'income',
      currency: 'INR',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().slice(0, 10),
    });
  };

  const handleTransactionInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionDetails({ ...transactionDetails, [name]: value });
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    setSubmittingTransaction(true);
    setMessage({ type: '', text: '' });

    if (!transactionDetails.amount || !transactionDetails.category || !transactionDetails.date || parseFloat(transactionDetails.amount) <= 0) {
      setMessage({ type: 'error', text: 'Please fill all required fields with valid data (Amount > 0).' });
      setSubmittingTransaction(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication required. Please log in.' });
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const payload = {
        ...transactionDetails,
        amount: parseFloat(transactionDetails.amount)
      };

      const response = await axios.post('/transactions', payload, config);

      setTransactions((prev) => [response.data, ...prev]);

      setDashboardSummary(prevSummary => {
        const newAmount = parseFloat(response.data.amount);
        if (response.data.type === 'income') {
          return {
            ...prevSummary,
            income: prevSummary.income + newAmount,
            balance: prevSummary.balance + newAmount
          };
        } else {
          return {
            ...prevSummary,
            expense: prevSummary.expense + newAmount,
            balance: prevSummary.balance - newAmount
          };
        }
      });

      setMessage({ type: 'success', text: 'Transaction added successfully!' });
      setShowTransactionForm(false);
    } catch (error) {
      console.error('Error adding transaction:', error.response?.data?.message || error.message);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add transaction. Please try again.' });
    } finally {
      setSubmittingTransaction(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6 md:p-8 text-gray-100 flex relative">

      {/* Left Sidebar - Now includes the Profile Button at the bottom */}
      <div className="w-64 bg-gray-800 rounded-3xl shadow-2xl p-8 text-white mr-10 flex flex-col items-center justify-between border border-gray-700 h-[calc(100vh-64px)] sticky top-8">
        <div> {/* This div keeps the FinTrack title and nav items grouped at the top */}
          <h2 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-wide">
          FinTrack
          </h2>
          <ul className="space-y-6 text-xl font-medium">
            <li
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition duration-200 ${
                true ? 'bg-gray-700 text-blue-400 shadow-inner' : 'hover:bg-gray-700 hover:text-blue-300'
              }`}
              onClick={() => navigate('/dashboard')}
              title="Dashboard Home"
            >
              <FaHome className="text-2xl" />
              <span>Dashboard</span>
            </li>
            <li
              className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-blue-300 transition duration-200"
              onClick={() => navigate('/groups')}
              title="Manage Your Groups"
            >
              <FaUsers className="text-2xl" />
              <span>Groups</span>
            </li>
            <li
              className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-blue-300 transition duration-200"
              onClick={() => navigate('/expense')}
              title="View All Expenses"
            >
              <FaMoneyBillWave className="text-2xl" />
              <span>Expenses</span>
            </li>

            <li
              className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-blue-300 transition duration-200"
              onClick={() => navigate('/reports')}
              title="Generate Reports"
            >
              <FaChartBar className="text-2xl" />
              <span>Reports</span>
            </li>
          </ul>
        </div>
        {/* Profile Button - Moved to the bottom of the sidebar */}
        {/* No longer needs absolute positioning as it's part of the flex column */}
        <button
          onClick={() => navigate('/profile')}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full shadow-lg hover:from-blue-700 hover:to-cyan-700 transition duration-300 transform hover:scale-105 flex items-center space-x-2 font-semibold text-lg mt-10"
          title="Go to Profile"
        >
          <FaUserCircle className="text-2xl" />
          <span>Profile</span>
        </button>
      </div>

      {/* Main Content Area - Removed pt-20 as the button is no longer overlapping */}
      <div className="flex-1">
        {/* Main Dashboard Header */}
        <h1 className="text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-lime-500 tracking-wide animate-fade-in-down">
          Welcome to Your Dashboard!
        </h1>
        <p className="text-xl mb-10 text-center text-gray-300">
          Track your financial journey, manage groups, and simplify expenses.
        </p>

        {/* Message Display Area */}
        {message.text && (
          <div
            className={`p-4 rounded-lg mb-8 text-center text-lg font-semibold animate-fade-in ${
              message.type === 'success' ? 'bg-green-700 border border-green-600' : 'bg-red-700 border border-red-600'
            }`}
          >
            {message.text}
          </div>
        )}

        {loadingDashboard ? (
          <div className="flex flex-col justify-center items-center py-20 bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
            <FaSpinner className="animate-spin text-blue-500 text-6xl mb-4" />
            <p className="text-gray-400 text-2xl">Loading your financial overview...</p>
          </div>
        ) : (
          <>
            {/* Dashboard Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700 flex flex-col items-center justify-center transform hover:scale-[1.02] transition-all duration-300">
                <FaArrowCircleDown className="text-5xl text-green-400 mb-4" />
                <h3 className="text-2xl font-bold text-gray-200 mb-2">Total Income</h3>
                <p className="text-4xl font-extrabold text-green-500">
                  ₹{dashboardSummary.income.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700 flex flex-col items-center justify-center transform hover:scale-[1.02] transition-all duration-300">
                <FaBalanceScale className="text-5xl text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold text-gray-200 mb-2">Current Balance</h3>
                <p className={`text-4xl font-extrabold ${dashboardSummary.balance >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                  ₹{dashboardSummary.balance.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700 flex flex-col items-center justify-center transform hover:scale-[1.02] transition-all duration-300">
                <FaArrowCircleUp className="text-5xl text-red-400 mb-4" />
                <h3 className="text-2xl font-bold text-gray-200 mb-2">Total Expense</h3>
                <p className="text-4xl font-extrabold text-red-500">
                  ₹{dashboardSummary.expense.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex justify-end mb-10">
              <button
                onClick={handleAddTransactionClick}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full shadow-lg hover:from-green-600 hover:to-teal-700 transition duration-300 transform hover:scale-105 flex items-center space-x-3 font-semibold text-lg"
                title="Record a new income or expense"
              >
                <FaPlusCircle className="text-2xl" />
                <span>Add New Transaction</span>
              </button>
            </div>

            <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
              <h2 className="text-3xl font-bold mb-6 text-blue-400 flex items-center space-x-3">
                <FaMoneyBillWave className="text-3xl" />
                <span>Recent Transactions</span>
              </h2>
              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <FaTimes className="text-6xl mb-4 text-gray-600" />
                  <p className="text-xl">No transactions added yet. Click "Add New Transaction" to get started!</p>
                </div>
              ) : (
                <ul className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                  {transactions.map((txn, index) => (
                    <li
                      key={txn._id || index}
                      className="border border-gray-700 rounded-lg p-5 bg-gray-700 hover:shadow-lg transition duration-200 transform hover:-translate-y-0.5 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                    >
                      <div className="mb-2 sm:mb-0">
                        <p className={`text-xl font-semibold flex items-center ${txn.type === 'income' ? 'text-green-300' : 'text-red-300'}`}>
                          {txn.type === 'income' ? <FaArrowCircleDown className="mr-2 text-lg" /> : <FaArrowCircleUp className="mr-2 text-lg" />}
                          {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                        </p>
                        <p className="text-lg text-gray-300 mt-1 flex items-center">
                          <FaTag className="mr-2 text-sm" />
                          <span className="font-medium">{txn.category}</span>
                        </p>
                        <p className="text-sm text-gray-400 mt-1 flex items-center">
                          <FaCalendarAlt className="mr-2 text-sm" />
                          {new Date(txn.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                        {txn.description && (
                          <p className="text-sm text-gray-400 mt-1 flex items-center">
                            <FaInfoCircle className="mr-2 text-sm" />
                            {txn.description}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right mt-2 sm:mt-0">
                        <p className={`text-3xl font-bold ${txn.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                          {txn.currency} ₹{parseFloat(txn.amount).toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>

      {/* Transaction Form Modal/Overlay */}
      {showTransactionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
          <form
            onSubmit={handleSubmitTransaction}
            className="bg-gray-800 rounded-2xl shadow-2xl p-8 text-gray-100 w-full max-w-md border border-gray-700 transform scale-95 animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-blue-400">Add Transaction</h2>
              <button
                type="button"
                onClick={() => { setShowTransactionForm(false); setMessage({ type: '', text: '' }); }}
                className="text-gray-400 hover:text-red-500 transition text-2xl"
                title="Close form"
              >
                <FaTimes />
              </button>
            </div>

            {message.text && (
              <div
                className={`p-3 rounded-lg mb-4 text-center text-sm font-medium ${
                  message.type === 'success' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-5">
              <div className="relative">
                <label className="block text-lg font-semibold mb-2 text-gray-300">Transaction Type</label>
                <select
                  name="type"
                  value={transactionDetails.type}
                  onChange={handleTransactionInputChange}
                  className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                {transactionDetails.type === 'income' ? (
                  <FaArrowCircleDown className="absolute left-3 top-1/2 translate-y-2 text-green-400" />
                ) : (
                  <FaArrowCircleUp className="absolute left-3 top-1/2 translate-y-2 text-red-400" />
                )}
              </div>
              <div className="relative">
                <label className="block text-lg font-semibold mb-2 text-gray-300">Currency</label>
                <select
                  name="currency"
                  value={transactionDetails.currency}
                  onChange={handleTransactionInputChange}
                  className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <FaMoneyBillWave className="absolute left-3 top-1/2 translate-y-2 text-gray-400" />
              </div>
              <div className="relative">
                <label className="block text-lg font-semibold mb-2 text-gray-300">Amount</label>
                <input
                  type="number"
                  name="amount"
                  placeholder="e.g., 500.00"
                  value={transactionDetails.amount}
                  onChange={handleTransactionInputChange}
                  className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  min="0"
                  step="0.01"
                  required
                />
                <span className="absolute left-3 top-1/2 translate-y-2 text-gray-400">₹</span>
              </div>
              <div className="relative">
                <label className="block text-lg font-semibold mb-2 text-gray-300">Category</label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g., Food, Salary, Utilities"
                  value={transactionDetails.category}
                  onChange={handleTransactionInputChange}
                  className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  required
                />
                <FaTag className="absolute left-3 top-1/2 translate-y-2 text-gray-400" />
              </div>
              <div className="relative">
                <label className="block text-lg font-semibold mb-2 text-gray-300">Description (Optional)</label>
                <input
                  type="text"
                  name="description"
                  placeholder="e.g., Dinner with friends, Monthly rent"
                  value={transactionDetails.description}
                  onChange={handleTransactionInputChange}
                  className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <FaInfoCircle className="absolute left-3 top-1/2 translate-y-2 text-gray-400" />
              </div>
              <div className="relative">
                <label className="block text-lg font-semibold mb-2 text-gray-300">Date</label>
                <input
                  type="date"
                  name="date"
                  value={transactionDetails.date}
                  onChange={handleTransactionInputChange}
                  className="w-full px-4 pl-10 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <FaCalendarAlt className="absolute left-3 top-1/2 translate-y-2 text-gray-400" />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => { setShowTransactionForm(false); setMessage({ type: '', text: '' }); }}
                className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingTransaction}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submittingTransaction ? <FaSpinner className="animate-spin mr-2" /> : 'Submit Transaction'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Dashboard;



