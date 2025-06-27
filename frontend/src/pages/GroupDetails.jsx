import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [newMember, setNewMember] = useState('');
  const [removeMember, setRemoveMember] = useState('');

  // Example data for now; replace with API call later
  const exampleExpenses = [
    {
      id: '1',
      groupId: '1',
      description: 'Dinner at Restaurant',
      amount: 1200,
      category: 'Food',
      date: '2025-06-27',
      time: '19:30',
      paidBy: ['Alice', 'Bob'],
    },
    {
      id: '2',
      groupId: '1',
      description: 'Movie Tickets',
      amount: 600,
      category: 'Entertainment',
      date: '2025-06-26',
      time: '21:00',
      paidBy: ['Charlie'],
    },
  ];

  const groupExpenses = exampleExpenses.filter((expense) => expense.groupId === groupId);

  const handleAddMember = () => {
    alert(`Member "${newMember}" added to group ${groupId}`);
    setNewMember('');
  };

  const handleRemoveMember = () => {
    alert(`Member "${removeMember}" removed from group ${groupId}`);
    setRemoveMember('');
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-r from-gray-700 via-gray-300 to-gray-400 p-8 text-gray-800">
        {/* Back Button */}
        <button
          onClick={() => navigate('/groups')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 mb-6 shadow-lg"
        >
          Back to Groups
        </button>

        {/* Add and Remove Members Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Add Member"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
            />
            <button
              onClick={handleAddMember}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
            >
              Add Member
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Remove Member"
              value={removeMember}
              onChange={(e) => setRemoveMember(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-black"
            />
            <button
              onClick={handleRemoveMember}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
            >
              Remove Member
            </button>
          </div>
        </div>
        <hr className="border-gray-500 mb-6" />
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-gray-700 mb-6 text-center">Group Details</h1>

        {/* Expenses Section */}
        {groupExpenses.length === 0 ? (
          <p className="text-gray-500 text-lg text-center">No expenses found for this group.</p>
        ) : (
          <ul className="space-y-6">
            {groupExpenses.map((expense) => (
              <li
                key={expense.id}
                className="bg-white rounded-lg shadow-lg p-6 text-gray-800 hover:shadow-xl transition duration-300 border border-gray-300"
              >
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">{expense.description}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <p className="text-gray-600"><strong>Amount:</strong> ₹{expense.amount}</p>
                  <p className="text-gray-600"><strong>Category:</strong> {expense.category}</p>
                  <p className="text-gray-600"><strong>Date:</strong> {expense.date}</p>
                  <p className="text-gray-600"><strong>Time:</strong> {expense.time}</p>
                  <p className="text-gray-600 col-span-2"><strong>Paid By:</strong> {expense.paidBy.join(', ')}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GroupDetails;