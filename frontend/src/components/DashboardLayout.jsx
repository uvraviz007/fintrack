import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-600 via-gray-400 to-gray-500 p-8 text-white flex">
      {/* Left Sidebar */}
      <div className="w-1/5 bg-gray-800 rounded-lg shadow-lg p-6 text-white mr-8">
        <ul className="space-y-4">
          <li
            className="cursor-pointer text-3xl underline"
            onClick={() => navigate('/dashboard')}
          >
            HOME
          </li>
          <li
            className="cursor-pointer hover:underline"
            onClick={() => navigate('/creategroup')}
          >
            Groups
          </li>
          <li
            className="cursor-pointer hover:underline"
            onClick={() => navigate('/expense')}
          >
            Expenses
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default DashboardLayout;