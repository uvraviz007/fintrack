// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// function DashboardLayout({ children }) {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-gray-600 via-gray-400 to-gray-500 p-8 text-white flex">
//       {/* Left Sidebar */}
//       <div className="w-1/5 bg-gray-800 rounded-lg shadow-lg p-6 text-white mr-8">
//         <ul className="space-y-4">
//           <li
//             className="cursor-pointer text-3xl underline"
//             onClick={() => navigate('/dashboard')}
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
//       <div className="flex-1">{children}</div>
//     </div>
//   );
// }

// export default DashboardLayout;

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation for active link styling
import { FaHome, FaUsers, FaMoneyBillWave, FaChartPie } from 'react-icons/fa'; // Import relevant icons

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current path

  // Helper function to determine if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white flex font-sans antialiased">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 rounded-2xl shadow-2xl p-6 text-white mr-8 flex flex-col border border-gray-700">
        {/* Logo/App Title */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 tracking-wide">
            FinTrack
          </h2>
        </div>

        {/* Navigation Links */}
        <ul className="space-y-4 text-lg font-medium flex-grow">
          <li
            className={`cursor-pointer flex items-center space-x-3 p-3 rounded-lg transition duration-200 ease-in-out
              ${isActive('/dashboard') ? 'bg-gray-700 text-teal-300 shadow-md font-bold' : 'text-gray-300 hover:bg-gray-700 hover:text-blue-300'}`}
            onClick={() => navigate('/dashboard')}
          >
            <FaHome className="text-xl" />
            <span>Dashboard</span>
          </li>
          <li
            className={`cursor-pointer flex items-center space-x-3 p-3 rounded-lg transition duration-200 ease-in-out
              ${isActive('/groups') ? 'bg-gray-700 text-teal-300 shadow-md font-bold' : 'text-gray-300 hover:bg-gray-700 hover:text-blue-300'}`}
            onClick={() => navigate('/groups')}
          >
            <FaUsers className="text-xl" />
            <span>Groups</span>
          </li>
          <li
            className={`cursor-pointer flex items-center space-x-3 p-3 rounded-lg transition duration-200 ease-in-out
              ${isActive('/expense') ? 'bg-gray-700 text-teal-300 shadow-md font-bold' : 'text-gray-300 hover:bg-gray-700 hover:text-blue-300'}`}
            onClick={() => navigate('/expense')}
          >
            <FaMoneyBillWave className="text-xl" />
            <span>Expenses</span>
          </li>
          <li
            className={`cursor-pointer flex items-center space-x-3 p-3 rounded-lg transition duration-200 ease-in-out
              ${isActive('/reports') ? 'bg-gray-700 text-teal-300 shadow-md font-bold' : 'text-gray-300 hover:bg-gray-700 hover:text-blue-300'}`}
            onClick={() => navigate('/reports')}
          >
            <FaChartPie className="text-xl" />
            <span>Reports</span>
          </li>
        </ul>

        {/* You can add a footer or version info here if needed */}
        <div className="mt-auto pt-6 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} FinTrack. All rights reserved.
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 rounded-2xl bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-lg p-8 shadow-inner border border-gray-700 overflow-auto">
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;