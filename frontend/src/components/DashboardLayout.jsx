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
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaHome, FaUsers, FaMoneyBillWave, FaChartBar } from 'react-icons/fa';

function DashboardLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6 md:p-8 text-gray-100 flex relative">
      
      {/* Left Sidebar - Replicated from Dashboard.jsx */}
      <div className="w-64 bg-gray-800 rounded-3xl shadow-2xl p-8 text-white mr-10 flex flex-col items-center justify-between border border-gray-700 h-[calc(100vh-64px)] sticky top-8">
        <div>
          <h2 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-wide">
            FinTrack
          </h2>
          <ul className="space-y-6 text-xl font-medium">
            <li
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition duration-200 ${
                window.location.pathname === '/dashboard' ? 'bg-gray-700 text-blue-400 shadow-inner' : 'hover:bg-gray-700 hover:text-blue-300'
              }`}
              onClick={() => navigate('/dashboard')}
              title="Dashboard Home"
            >
              <FaHome className="text-2xl" />
              <span>Dashboard</span>
            </li>
            <li
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-blue-300 transition duration-200 ${
                window.location.pathname === '/groups' ? 'bg-gray-700 text-blue-400 shadow-inner' : 'hover:bg-gray-700 hover:text-blue-300'
              }`}
              onClick={() => navigate('/groups')}
              title="Manage Your Groups"
            >
              <FaUsers className="text-2xl" />
              <span>Groups</span>
            </li>
            <li
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-blue-300 transition duration-200 ${
                window.location.pathname === '/expenses' ? 'bg-gray-700 text-blue-400 shadow-inner' : 'hover:bg-gray-700 hover:text-blue-300'
              }`}
              onClick={() => navigate('/expense')}
              title="View All Expenses"
            >
              <FaMoneyBillWave className="text-2xl" />
              <span>Expenses</span>
            </li>
            <li
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-blue-300 transition duration-200 ${
                window.location.pathname === '/reports' ? 'bg-gray-700 text-blue-400 shadow-inner' : 'hover:bg-gray-700 hover:text-blue-300'
              }`}
              onClick={() => navigate('/reports')}
              title="Generate Reports"
            >
              <FaChartBar className="text-2xl" />
              <span>Reports</span>
            </li>
            
          </ul>
        </div>
        <button
                  onClick={() => navigate('/profile')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full shadow-lg hover:from-blue-700 hover:to-cyan-700 transition duration-300 transform hover:scale-105 flex items-center space-x-2 font-semibold text-lg mt-10"
                  title="Go to Profile"
                >
                  <FaUserCircle className="text-2xl" />
                  <span>Profile</span>
                </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default DashboardLayout;