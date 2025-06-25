import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 flex flex-col items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold mb-6 drop-shadow-lg">
          Welcome to <span className="text-yellow-300">Bill Splitter</span>
        </h1>
        <p className="text-xl mb-10 max-w-lg mx-auto">
          Simplify expense management with friends and family. Track, split, and settle bills effortlessly!
        </p>
      </div>
      <div className="flex flex-col items-center space-y-6">
        <Link
          to="/login"
          className="px-8 py-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition duration-300 text-lg font-semibold"
        >
          Login
        </Link>
        <p className="text-base">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-yellow-300 font-bold hover:underline"
          >
            Signup here
          </Link>
        </p>
      </div>
      <footer className="w-full text-center py-6 bg-black text-gray-400 absolute bottom-0">
        <p className="text-sm">© 2025 All rights reserved | Project by Ravi & Prahlad</p>
      </footer>
    </div>
  );
}

export default Home;