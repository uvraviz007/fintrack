// filepath: /Users/prahladchaudhary/bill-splitter/frontend/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome to Bill Splitter</h1>
      <div className="space-x-4">
        <Link
          to="/signup"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          Signup
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default Home;