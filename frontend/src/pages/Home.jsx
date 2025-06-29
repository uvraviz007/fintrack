// import React from 'react';
// import { Link } from 'react-router-dom';

// function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-600 flex flex-col items-center justify-center text-white">
//       <div className="text-center">
//         <h1 className="text-6xl font-extrabold mb-6 drop-shadow-lg">
//           Welcome to <span className="text-yellow-300">Bill Splitter</span>
//         </h1>
//         <p className="text-xl mb-10 max-w-lg mx-auto">
//           Simplify expense management with friends and family. Track, split, and settle bills effortlessly!
//         </p>
//       </div>
//       <div className="flex flex-col items-center space-y-6">
//         <Link
//           to="/login"
//           className="px-8 py-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition duration-300 text-lg font-semibold"
//         >
//           Login
//         </Link>
//         <p className="text-base">
//           Don't have an account?{' '}
//           <Link
//             to="/signup"
//             className="text-yellow-300 font-bold hover:underline"
//           >
//             Signup here
//           </Link>
//         </p>
//       </div>
//       <footer className="w-full text-center py-6 bg-black text-gray-400 absolute bottom-0">
//         <p className="text-sm">© 2025 All rights reserved | Project by Ravi & Prahlad</p>
//       </footer>
//     </div>
//   );
// }

// export default Home;


import React from 'react';
import { Link } from 'react-router-dom';
import { FaMoneyBillWave, FaUsers, FaCheckCircle } from 'react-icons/fa';

function Home() {
  return (
    // Main container to ensure full viewport height and no overflow
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-indigo-900 via-gray-900 to-black text-white px-4 md:px-8 py-4 overflow-hidden">
      {/* Main Content Area - flex-grow ensures it takes available space */}
      <div className="flex-grow flex flex-col items-center justify-center text-center max-w-4xl mx-auto z-10 relative">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 animate-fade-in-up">
          Welcome to <span className="block mt-2 md:inline">BillSplitter</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto leading-tight opacity-0 animate-fade-in delay-200">
          <span className="font-semibold text-gray-300">Simplify expenses</span> with friends and family. Track, split, and settle bills effortlessly.
        </p>

        {/* Feature Highlights - more compact layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 opacity-0 animate-fade-in delay-400 px-2"> {/* Reduced gap, mb, and added px */}
          <div className="flex flex-col items-center p-3 bg-gray-800 bg-opacity-70 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
            <FaMoneyBillWave className="text-4xl text-green-400 mb-2" /> {/* Smaller icon */}
            <h3 className="text-base font-bold mb-1">Effortless Tracking</h3> {/* Smaller text */}
            <p className="text-gray-300 text-center text-sm">Clear record of who paid what.</p> {/* Smaller text */}
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-800 bg-opacity-70 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 delay-100 backdrop-blur-sm">
            <FaUsers className="text-4xl text-blue-400 mb-2" />
            <h3 className="text-base font-bold mb-1">Fair Splitting</h3>
            <p className="text-gray-300 text-center text-sm">Split costs evenly or custom.</p>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-800 bg-opacity-70 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 delay-200 backdrop-blur-sm">
            <FaCheckCircle className="text-4xl text-red-400 mb-2" />
            <h3 className="text-base font-bold mb-1">Quick Settlements</h3>
            <p className="text-gray-300 text-center text-sm">See who owes whom, settle fast.</p>
          </div>
        </div>
        
        {/* Call to Action Buttons - more compact layout */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 opacity-0 animate-fade-in delay-600"> {/* Reduced space-y/x */}
          <Link
            to="/login"
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg hover:from-green-600 hover:to-emerald-700 transition duration-300 text-lg font-bold transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
          >
            Get Started!
          </Link>
          <p className="text-sm text-gray-300 mt-2 sm:mt-0"> {/* Smaller text */}
            New here?{' '}
            <Link
              to="/signup"
              className="text-yellow-300 font-extrabold hover:text-yellow-400 hover:underline transition duration-200"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-3 bg-black bg-opacity-70 text-gray-500 text-xs z-10"> {/* Reduced padding, smaller text */}
        <p>© {new Date().getFullYear()} BillSplitter. All rights reserved | Project by Ravi & Prahlad</p>
      </footer>

      {/* Custom CSS for animations (remains the same) */}
      <style>{`
        @keyframes fadeInUps {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUps 1s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-fade-in.delay-200 {
            animation-delay: 0.2s;
        }
        .animate-fade-in.delay-400 {
            animation-delay: 0.4s;
        }
        .animate-fade-in.delay-600 {
            animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
}

export default Home;