import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api";

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [newMember, setNewMember] = useState("");
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseData, setExpenseData] = useState({
    amount: "",
    description: "",
    category: "",
    paidBy: "",
    date: "",
    time: "",
  });
  const [groupMembers, setGroupMembers] = useState(["Alice", "Bob", "Charlie"]); // Replace with API
  const [splitBetween, setSplitBetween] = useState([]);
  const [showSplitDropdown, setShowSplitDropdown] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const exampleExpenses = [
    {
      id: "1",
      groupId: "1",
      description: "Dinner at Restaurant",
      amount: 1200,
      category: "Food",
      date: "2025-06-27",
      time: "19:30",
      paidBy: ["Alice"],
    },
    {
      id: "2",
      groupId: "1",
      description: "Movie Tickets",
      amount: 600,
      category: "Entertainment",
      date: "2025-06-26",
      time: "21:00",
      paidBy: ["Charlie"],
    },
  ];

  const groupExpenses = exampleExpenses.filter(
    (expense) => expense.groupId === groupId
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".split-dropdown")) {
        setShowSplitDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddMember = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Login required.");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await api.put(
        `/group/${groupId}/add-member`,
        { username: newMember },
        config
      );

      alert(`Member "${newMember}" added successfully.`);
      setNewMember("");
      setError("");
      setSuccessMessage(response.data.message);
    } catch (err) {
      console.error("Error adding member:", err);
      setError(err.response?.data?.error || "Failed to add member.");
    }
  };

  const handleExpenseFormSubmit = async (e) => {
    e.preventDefault();

    const expensePayload = {
      ...expenseData,
      groupId,
      paidBy: [expenseData.paidBy], // ensure array format
      splitBetween,
    };

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await api.post(`/expenses`, expensePayload, config);

      alert("Expense added successfully!");
      setShowExpenseForm(false);
      setExpenseData({
        amount: "",
        description: "",
        category: "",
        paidBy: "",
        date: "",
        time: "",
      });
      setSplitBetween([]);
    } catch (err) {
      console.error("Error adding expense:", err);
      setError(err.response?.data?.error || "Failed to add expense.");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-r from-gray-700 via-gray-300 to-gray-400 p-8 text-gray-800">
        <button
          onClick={() => navigate("/groups")}
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
        </div>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate("/settleup")}
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-300 shadow-lg"
          >
            Settle Up
          </button>
          <button
            onClick={() => setShowExpenseForm(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
          >
            Add Expense
          </button>
        </div>

        <hr className="border-gray-400 mb-12" />

        {showExpenseForm && (
          <form
            onSubmit={handleExpenseFormSubmit}
            className="bg-white rounded-lg shadow-lg p-6 mb-6 relative"
          >
            <button
              type="button"
              onClick={() => setShowExpenseForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition duration-300"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              Add Expense
            </h3>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Amount"
                value={expenseData.amount}
                onChange={(e) =>
                  setExpenseData({ ...expenseData, amount: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="text"
                placeholder="Description"
                value={expenseData.description}
                onChange={(e) =>
                  setExpenseData({
                    ...expenseData,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <select
                value={expenseData.category}
                onChange={(e) =>
                  setExpenseData({ ...expenseData, category: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-800"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {["food", "travel", "entertainment", "others"].map(
                  (category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  )
                )}
              </select>

              {/* ✅ Replaced Paid By input with dropdown */}
              <select
                value={expenseData.paidBy}
                onChange={(e) =>
                  setExpenseData({ ...expenseData, paidBy: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="" disabled>
                  Select who paid
                </option>
                {groupMembers.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>

              <div className="split-dropdown relative">
                <button
                  type="button"
                  onClick={() => setShowSplitDropdown(!showSplitDropdown)}
                  className="w-full px-4 py-2 border rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {splitBetween.length > 0
                    ? splitBetween.join(", ")
                    : "Select Members"}
                </button>
                {showSplitDropdown && (
                  <div className="absolute mt-1 w-full bg-white border rounded-lg shadow z-10 max-h-40 overflow-y-auto">
                    {groupMembers.map((member) => (
                      <label
                        key={member}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={member}
                          checked={splitBetween.includes(member)}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSplitBetween((prev) =>
                              prev.includes(value)
                                ? prev.filter((m) => m !== value)
                                : [...prev, value]
                            );
                          }}
                          className="mr-2"
                        />
                        {member}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
            >
              Submit Expense
            </button>
          </form>
        )}

        {groupExpenses.length === 0 ? (
          <p className="text-gray-500 text-lg text-center">
            No expenses found for this group.
          </p>
        ) : (
          <ul className="space-y-2">
            {groupExpenses.map((expense) => (
              <li
                key={expense.id}
                className="bg-white rounded-lg shadow-md p-3 text-gray-800 hover:shadow-lg transition duration-300 border border-gray-300"
              >
                <h3 className="text-lg font-semibold text-blue-600 mb-1">
                  {expense.description}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-600 text-sm">
                    <strong>Amount:</strong> ₹{expense.amount}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <strong>Category:</strong> {expense.category}
                  </p>
                  <p className="text-gray-600 text-sm col-span-2">
                    <strong>Paid By:</strong> {expense.paidBy.join(", ")}
                  </p>
                  <div className="flex justify-start items-end absolute right-80 mt-6">
                    <p className="text-gray-500 text-xs">
                      <strong>Date:</strong> {expense.date}
                    </p>
                    <p className="text-gray-500 text-xs ml-4">
                      <strong>Time:</strong> {expense.time}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-600 mb-4">{successMessage}</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GroupDetails;
