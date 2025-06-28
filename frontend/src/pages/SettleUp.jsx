import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const SettleUp = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  // Example data for now; replace with API call later
  const exampleTransactions = [
    { id: '1', payer: 'Alice', receiver: 'You', amount: 500 },
    { id: '2', payer: 'You', receiver: 'Bob', amount: 300 },
    { id: '3', payer: 'Charlie', receiver: 'You', amount: 200 },
    { id: '4', payer: 'You', receiver: 'David', amount: 400 },
  ];

  const toPay = exampleTransactions.filter((transaction) => transaction.payer === 'You');
  const toReceive = exampleTransactions.filter((transaction) => transaction.receiver === 'You');

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-600 p-8 text-gray-800">
        
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-white mb-6 text-center">Settle Up</h1>

        <hr className='border-gray-400 mb-4'></hr>

        {/* To Pay Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">You Need to Pay</h2>
          {toPay.length === 0 ? (
            <p className="text-gray-500 text-lg">You don't owe money to anyone.</p>
          ) : (
            <ul className="space-y-4">
              {toPay.map((transaction) => (
                <li
                  key={transaction.id}
                  className="bg-white rounded-lg shadow-md p-4 text-gray-800 border border-gray-300"
                >
                  <p className="text-lg">
                    <strong>To:</strong> {transaction.receiver}
                  </p>
                  <p className="text-lg">
                    <strong>Amount:</strong> ₹{transaction.amount}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
          <hr className='mb-4 border-gray-200'></hr>
        {/* To Receive Section */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">You Need to Receive</h2>
          {toReceive.length === 0 ? (
            <p className="text-gray-500 text-lg">No one owes you money.</p>
          ) : (
            <ul className="space-y-4">
              {toReceive.map((transaction) => (
                <li
                  key={transaction.id}
                  className="bg-white rounded-lg shadow-md p-4 text-gray-800 border border-gray-300"
                >
                  <p className="text-lg">
                    <strong>From:</strong> {transaction.payer}
                  </p>
                  <p className="text-lg">
                    <strong>Amount:</strong> ₹{transaction.amount}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettleUp;