import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../api'; // Still include api, though not used for example data here

// Import Feather Icons for a more modern and intuitive look
import {
  FaExchangeAlt,   // General icon for settlement
  FaArrowCircleUp, // For "You Need to Pay" (more emphatic than FaArrowUp)
  FaArrowCircleDown, // For "You Need to Receive" (more emphatic than FaArrowDown)
  FaSpinner,       // For loading state
  FaMoneyBillWave, // A currency/money icon
  FaHourglassHalf, // For no pending transactions
  FaUserCircle     // For member display
} from 'react-icons/fa';

const SettleUp = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [toPay, setToPay] = useState([]);
  const [toReceive, setToReceive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchSettlementData = async () => {
      setLoading(true);
      setMessage({ type: '', text: '' });
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage({ type: 'error', text: 'Authentication required. Please log in.' });
          navigate('/login');
          return;
        }
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await api.get(`/group/${groupId}/settle`, config);
        setToPay(response.data.toPay || []);
        setToReceive(response.data.toReceive || []);
      } catch (err) {
        console.error('Error fetching settlement data:', err.response || err);
        setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to fetch settlement data. Please try again.' });
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSettlementData();
  }, [groupId, navigate]);

  return (
    <DashboardLayout>
      {/* Main container for content, handles padding and centering within the DashboardLayout */}
      <div className="w-full text-gray-100 font-sans p-6 md:p-8 flex flex-col items-center">
        
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-wide flex items-center justify-center space-x-4">
          <FaExchangeAlt className="text-5xl text-blue-400" />
          <span>Settle Up</span>
        </h1>

        {/* Messages (Success/Error) */}
        {message.text && (
          <div
            className={`p-4 rounded-lg mb-6 text-center text-lg font-semibold animate-fade-in w-full max-w-2xl ${
              message.type === 'success' ? 'bg-green-700 border border-green-600' : 'bg-red-700 border border-red-600'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-16 bg-gray-800 rounded-xl shadow-lg w-full max-w-xl">
            <FaSpinner className="animate-spin text-blue-500 text-5xl mb-4" />
            <p className="ml-4 text-gray-400 text-xl">Calculating settlements...</p>
          </div>
        ) : (
          <div className="w-full max-w-4xl space-y-8"> {/* Container for settlement sections */}
            
            {/* You Need to Pay Section */}
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 animate-fade-in-up">
              <h2 className="text-3xl font-bold mb-6 text-red-400 flex items-center space-x-3">
                <FaArrowCircleUp className="text-3xl" />
                <span>You Need to Pay</span>
              </h2>
              {toPay.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                  <FaHourglassHalf className="text-6xl mb-4 text-gray-600" />
                  <p className="text-xl text-center">Great! You don't owe money to anyone in this group.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {toPay.map((transaction) => (
                    <li
                      key={transaction._id || transaction.id} // Use _id from API, fallback to id
                      className="bg-gray-700 rounded-xl shadow-md p-5 border border-gray-600 flex flex-col sm:flex-row justify-between items-start sm:items-center transform hover:scale-[1.01] transition-all duration-200"
                    >
                      <div className="flex-grow mb-2 sm:mb-0">
                        <p className="text-lg text-gray-300 flex items-center">
                          <FaUserCircle className="mr-2 text-yellow-300 text-xl" />
                          <strong className="text-white">To:</strong>{' '}
                          <span className="font-semibold text-yellow-300 ml-1">
                            {/* Access username from nested object or fallback to string */}
                            {transaction.receiver?.username || transaction.receiver || 'Unknown'}
                          </span>
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xl font-bold text-red-400">
                          ₹{parseFloat(transaction.amount).toFixed(2)}
                        </p>
                      </div>
                      {/* Optional: Add a "Mark as Paid" button if your API supports it */}
                      {/* <button className="ml-4 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300">
                          Mark Paid
                      </button> */}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* You Need to Receive Section */}
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 animate-fade-in-up">
              <h2 className="text-3xl font-bold mb-6 text-green-400 flex items-center space-x-3">
                <FaArrowCircleDown className="text-3xl" />
                <span>You Need to Receive</span>
              </h2>
              {toReceive.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                  <FaHourglassHalf className="text-6xl mb-4 text-gray-600" />
                  <p className="text-xl text-center">Awesome! No one owes you money in this group.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {toReceive.map((transaction) => (
                    <li
                      key={transaction._id || transaction.id} // Use _id from API, fallback to id
                      className="bg-gray-700 rounded-xl shadow-md p-5 border border-gray-600 flex flex-col sm:flex-row justify-between items-start sm:items-center transform hover:scale-[1.01] transition-all duration-200"
                    >
                      <div className="flex-grow mb-2 sm:mb-0">
                        <p className="text-lg text-gray-300 flex items-center">
                          <FaUserCircle className="mr-2 text-green-300 text-xl" />
                          <strong className="text-white">From:</strong>{' '}
                          <span className="font-semibold text-yellow-300 ml-1">
                            {/* Access username from nested object or fallback to string */}
                            {transaction.payer?.username || transaction.payer || 'Unknown'}
                          </span>
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xl font-bold text-green-400">
                          ₹{parseFloat(transaction.amount).toFixed(2)}
                        </p>
                      </div>
                      {/* Optional: Add a "Remind" or "Mark Received" button */}
                      {/* <button className="ml-4 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300">
                          Remind
                      </button> */}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SettleUp;