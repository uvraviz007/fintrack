import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 flex flex-col items-center justify-center text-white">
      <div className="text-center mt-[-50px]"> {/* Shift content upward */}
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          Welcome to <span className="text-yellow-300">Bill Splitter</span>
        </h1>
        <p className="text-lg mb-8">
          Easily split bills with friends and family. Manage expenses effortlessly!
        </p>
      </div>
      <div className="flex flex-col items-center space-y-4 mt-[-30px]"> {/* Shift buttons upward */}
        <Link
          to="/login"
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
        >
          Login
        </Link>
        <p className="text-sm mt-4">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-yellow-300 font-bold hover:underline"
          >
            Signup here
          </Link>
        </p>
      </div>
      <footer className="w-full text-center py-4 bg-black text-gray-400 absolute bottom-0">
        <p>2025 all rights reserved, project by Ravi & Prahlad</p>
      </footer>
    </div>
  );
}

export default Home;