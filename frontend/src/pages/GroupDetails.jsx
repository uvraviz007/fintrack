import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../api';

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [newMember, setNewMember] = useState('');
  const [removeMember, setRemoveMember] = useState('');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseData, setExpenseData] = useState({
    amount: '',
    description: '',
    category: '',
    paidBy: '',
    date: '',
    time: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

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

  const handleAddMember = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Login required.');
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // 1. Directly send username to backend
    const response = await api.put(
      `/group/${groupId}/add-member`,
      { username: newMember },
      config
    );

    alert(`Member "${newMember}" added successfully.`);
    setNewMember('');
    setError('');
    setSuccessMessage(response.data.message);
  } catch (err) {
    console.error('Error adding member:', err);
    setError(err.response?.data?.error || 'Failed to add member.');
  }
};



  const handleRemoveMember = () => {
    alert(`Member "${removeMember}" removed from group ${groupId}`);
    setRemoveMember('');
  };

  const handleSettleUp = () => {
    navigate(`/settleup/${groupId}`);
  };

  const handleAddExpense = () => {
    setShowExpenseForm(true);
  };

  const handleExpenseFormSubmit = (e) => {
    e.preventDefault();
    alert('Expense added successfully!');
    setShowExpenseForm(false);
    setExpenseData({
      amount: '',
      description: '',
      category: '',
      paidBy: '',
      date: '',
      time: '',
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-r from-gray-700 via-gray-300 to-gray-400 p-8 text-gray-800">
        <button
          onClick={() => navigate('/groups')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 mb-6 shadow-lg"
        >
          Back to Groups
        </button>
        <hr className="border-gray-400 mb-4" />

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

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
      </div>
    </DashboardLayout>
  );
};

export default GroupDetails;
