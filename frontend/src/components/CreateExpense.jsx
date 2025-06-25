import React, { useState } from 'react';

function CreateExpense() {
  const [category, setCategory] = useState('');
  const [splitOption, setSplitOption] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Expense created with category: ${category} and split option: ${splitOption}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 border border-gray-300 max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Create Expense</h2>

      {/* Category Selection */}
      <label className="block text-gray-700 mb-2">Category</label>
      <select
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="" disabled>Select a category</option>
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Others">Others</option>
      </select>

      {/* Split Option Selection */}
      <label className="block text-gray-700 mb-2">Split Option</label>
      <select
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
        value={splitOption}
        onChange={(e) => setSplitOption(e.target.value)}
      >
        <option value="" disabled>Select a split option</option>
        <option value="Equal">Equal</option>
        <option value="Percentage">Percentage</option>
        <option value="Custom">Custom</option>
      </select>

      {/* Submit Button */}
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 font-semibold"
      >
        Create Expense
      </button>
    </form>
  );
}

export default CreateExpense;