import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api"; // Assuming your API client is configured

import {
  FaUserPlus,
  FaHandshake,
  FaPlusCircle,
  FaMoneyBillWave,
  FaTag,
  FaCalendarAlt,
  FaClock,
  FaInfoCircle,
  FaUsers,
  FaTimes,
  FaSpinner,
} from "react-icons/fa"; // Removed FaUserCircle as it was unused

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("Loading Group...");
  const [groupMembers, setGroupMembers] = useState([]);
  const [newMemberUsername, setNewMemberUsername] = useState("");

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseData, setExpenseData] = useState({
    amount: "",
    description: "",
    category: "",
    paidBy: "", // Stores member _id
    date: new Date().toISOString().slice(0, 10), // Default to today's date
    time: new Date().toTimeString().slice(0, 5), // Default to current time
  });
  const [splitBetween, setSplitBetween] = useState([]); // Stores member _ids
  const [showSplitDropdown, setShowSplitDropdown] = useState(false);

  const [groupExpenses, setGroupExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // For add member/expense
  const [message, setMessage] = useState({ type: "", text: "" }); // { type: 'success' | 'error', text: '...' }

  const splitDropdownRef = useRef(null); // Ref for click outside dropdown

  // State for the new Group Members dropdown (display selection)
  const [selectedDisplayMember, setSelectedDisplayMember] = useState("");

  // --- Initial Data Fetching (Group Details & Expenses) ---
  // --- Initial Data Fetching (Group Details & Expenses) ---
useEffect(() => {
  const fetchGroupData = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({
          type: "error",
          text: "Authentication required. Please log in.",
        });
        navigate("/login");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch group details (including name and members)
      const groupResponse = await api.get(
        `/group/${groupId}/members`, // Assuming this route remains the same for group members
        config
      );
      setGroupName(groupResponse.data.name || "Group Details");
      const members = groupResponse.data.members || [];
      setGroupMembers(members);

      if (members.length > 0) {
        setSplitBetween(members.map((m) => m._id));
        setExpenseData((prev) => ({ ...prev, paidBy: members[0]._id }));
        setSelectedDisplayMember(members[0]._id);
      } else {
        setExpenseData((prev) => ({ ...prev, paidBy: "" }));
        setSplitBetween([]);
        setSelectedDisplayMember("");
      }

      // 🔴 IMPORTANT CHANGE HERE: Update the route to match your backend
      const expensesResponse = await api.get(
        `/expense/${groupId}`, // Changed from `/expenses/group/${groupId}`
        config
      );
      setGroupExpenses(expensesResponse.data);
    } catch (err) {
      console.error("Failed to load group data", err.response || err);
      const errorMessage =
        err.response?.data?.message || "Failed to load group data.";
      setMessage({ type: "error", text: errorMessage });

      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchGroupData();
}, [groupId, navigate]);
  // --- Click outside dropdown handler ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        splitDropdownRef.current &&
        !splitDropdownRef.current.contains(event.target)
      ) {
        setShowSplitDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to determine display name for members (handles duplicates)
  const getMemberDisplayName = (memberId) => {
    const member = groupMembers.find((m) => m._id === memberId);
    if (!member) return "Unknown";

    // Check if there are other members with the exact same 'name'
    const sameNameCount = groupMembers.filter(
      (m) => m.name === member.name && m._id !== memberId
    ).length;

    // Only append username if there's a duplicate name
    return sameNameCount > 0 ? `${member.name} (${member.username})` : member.name;
  };


  // --- Member Management ---
  const handleAddMember = async () => {
    if (!newMemberUsername.trim()) {
      setMessage({ type: "error", text: "Please enter a username to add." });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" }); // Clear previous messages

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } }; // Corrected string interpolation

      // Step 1: Add member to group
      const addResponse = await api.put(
        `/group/${groupId}/add-member`,
        { username: newMemberUsername },
        config
      );

      // Step 2: Fetch full user details by username (assuming addResponse doesn't return full user)
      // This step might be redundant if your /add-member endpoint returns the full new user object.
      // If it does, you can use addResponse.data directly and skip this GET request.
      const userResponse = await api.get(
        `/users/username/${newMemberUsername}`,
        config
      );
      const newUser = userResponse.data;

      // Check if the member is already in the group to prevent duplicates in UI state
      if (groupMembers.some(m => m._id === newUser._id)) {
        setMessage({ type: "error", text: "Member already exists in the group." });
        setSubmitting(false);
        setNewMemberUsername("");
        return;
      }

      // Step 3: Update members list in UI
      setGroupMembers((prev) => {
        const updatedMembers = [...prev, newUser];
        // If it's the first member added, set them as selected for display
        if (prev.length === 0) {
          setSelectedDisplayMember(newUser._id);
        }
        return updatedMembers;
      });

      // Step 4: Update splitBetween - automatically include new member
      setSplitBetween((prev) => [...prev, newUser._id]);

      // Step 5: If no paidBy is set, assign this one (useful for the very first member)
      if (!expenseData.paidBy) {
        setExpenseData((prev) => ({ ...prev, paidBy: newUser._id }));
      }

      setNewMemberUsername("");
      setMessage({ type: "success", text: "Member added successfully!" });
    } catch (err) {
      console.error("Error adding member:", err.response || err);
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Failed to add member. Please check the username.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // --- Expense Form Handlers ---
  const handleExpenseInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({ ...expenseData, [name]: value });
  };

  const handleSplitBetweenChange = (memberId) => {
    setSplitBetween((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleExpenseFormSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (
      !expenseData.amount ||
      !expenseData.description ||
      !expenseData.category ||
      !expenseData.paidBy ||
      !expenseData.date ||
      !expenseData.time ||
      !Array.isArray(splitBetween) ||
      splitBetween.length === 0
    ) {
      setMessage({
        type: "error",
        text: "Please fill all required expense fields and select at least one person to split with.",
      });
      return;
    }

    if (
      isNaN(parseFloat(expenseData.amount)) ||
      parseFloat(expenseData.amount) <= 0
    ) {
      setMessage({
        type: "error",
        text: "Amount must be a positive number.",
      });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" }); // Clear previous messages

    const payload = {
      ...expenseData,
      amount: parseFloat(expenseData.amount),
      paidBy: expenseData.paidBy,
      splitBetween: splitBetween,
      groupId,
    };

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } }; // Corrected string interpolation

      const response = await api.post("/expense/add", payload, config);

      // Update UI: Use the _id from the API response for the new expense
      setGroupExpenses((prev) => [{ ...payload, _id: response.data._id }, ...prev]);
      setMessage({ type: "success", text: "Expense added successfully!" });

      // Safely build default values from groupMembers for resetting form
      const validMembers = Array.isArray(groupMembers)
        ? groupMembers.filter((m) => m && m._id)
        : [];

      const defaultPaidBy = validMembers.length > 0 ? validMembers[0]._id : "";
      const defaultSplitBetween = validMembers.map((m) => m._id);

      setExpenseData({
        amount: "",
        description: "",
        category: "",
        paidBy: defaultPaidBy,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toTimeString().slice(0, 5),
      });

      setSplitBetween(defaultSplitBetween);
      setShowExpenseForm(false);
      setShowSplitDropdown(false);
    } catch (err) {
      console.error("Error submitting expense:", err.response || err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add expense.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full text-gray-100 font-sans p-6 md:p-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-wide">
          {groupName}
        </h1>

        {/* Action Bar (Add Member, Settle Up, Add Expense) */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Add Member Section */}
            <div className="flex flex-1 gap-3 items-center">
              <FaUserPlus className="text-blue-400 text-2xl" />
              <input
                type="text"
                placeholder="Add member by username"
                value={newMemberUsername}
                onChange={(e) => setNewMemberUsername(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
              />
              <button
                onClick={handleAddMember}
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? <FaSpinner className="animate-spin" /> : "Add"}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={() => navigate(`/settleup`)} // Ensure this path is correct if it's dynamic later
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <FaHandshake className="text-xl" />
                <span>Settle Up</span>
              </button>
              <button
                onClick={() => setShowExpenseForm(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <FaPlusCircle className="text-xl" />
                <span>Add Expense</span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages (Success/Error) */}
        {message.text && (
          <div
            className={`p-4 rounded-lg mb-6 text-center text-lg font-semibold animate-fade-in ${
              message.type === "success"
                ? "bg-green-700 border border-green-600"
                : "bg-red-700 border border-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Expense Form Modal/Overlay */}
        {showExpenseForm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <form
              onSubmit={handleExpenseFormSubmit}
              className="bg-gray-800 rounded-2xl shadow-2xl p-8 text-gray-100 w-full max-w-lg border border-gray-700 transform scale-95 animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-blue-400">
                  Add New Expense
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowExpenseForm(false);
                    setShowSplitDropdown(false); // Close dropdown when form closes
                    setMessage({ type: "", text: "" }); // Clear messages
                  }}
                  className="text-gray-400 hover:text-red-500 transition text-2xl"
                  title="Close form"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                {/* Amount */}
                <div className="relative">
                  <FaMoneyBillWave className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount (₹)"
                    value={expenseData.amount}
                    onChange={handleExpenseInputChange}
                    className="pl-10 pr-4 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 w-full focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                {/* Description */}
                <div className="relative">
                  <FaInfoCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={expenseData.description}
                    onChange={handleExpenseInputChange}
                    className="pl-10 pr-4 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 w-full focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    required
                  />
                </div>
                {/* Category */}
                <div className="relative">
                  <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    name="category"
                    value={expenseData.category}
                    onChange={handleExpenseInputChange}
                    className="pl-10 pr-4 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 w-full focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select Category</option>
                    {[
                      "Food",
                      "Travel",
                      "Entertainment",
                      "Others",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Paid By */}
                <div className="relative">
                  <FaUserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    name="paidBy"
                    value={expenseData.paidBy}
                    onChange={handleExpenseInputChange}
                    className="pl-10 pr-4 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 w-full focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Paid by</option>
                    {groupMembers.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.username}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Date */}
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="date"
                    value={expenseData.date}
                    onChange={handleExpenseInputChange}
                    className="pl-10 pr-4 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 w-full focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {/* Time */}
                <div className="relative">
                  <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="time"
                    name="time"
                    value={expenseData.time}
                    onChange={handleExpenseInputChange}
                    className="pl-10 pr-4 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 w-full focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Split Between Dropdown */}
              <div
                className="split-dropdown relative mb-6"
                ref={splitDropdownRef}
              >
                <button
                  type="button"
                  onClick={() => setShowSplitDropdown(!showSplitDropdown)}
                  className="w-full px-4 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 text-left focus:ring-2 focus:ring-blue-500 transition flex items-center justify-between"
                  title="Select members to split the expense with"
                >
                  <span className="flex items-center">
                    <FaUsers className="mr-3 text-xl text-gray-400" />
                    {splitBetween.length > 0
                      ? `Splitting with ${splitBetween.length} member(s)`
                      : "Split Between (select members)"}
                  </span>
                  <span className="text-gray-400">▼</span>
                </button>

                {showSplitDropdown && (
                  <div className="absolute z-10 mt-2 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                    {Array.isArray(groupMembers) && groupMembers.length > 0 ? (
                      groupMembers.map((m) => (
                        <label
                          key={m._id}
                          className="flex items-center px-4 py-3 hover:bg-gray-600 cursor-pointer transition"
                        >
                          <input
                            type="checkbox"
                            value={m._id}
                            checked={splitBetween.includes(m._id)}
                            onChange={() => handleSplitBetweenChange(m._id)}
                            className="mr-3 h-5 w-5 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
                          />
                          {m.username}
                        </label>
                      ))
                    ) : (
                      <p className="text-gray-400 px-4 py-3">
                        No members found.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowExpenseForm(false);
                    setShowSplitDropdown(false); // Ensure dropdown closes
                    setMessage({ type: "", text: "" }); // Clear messages
                  }}
                  className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-teal-700 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    "Add Expense"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Group Members List as a single dropdown */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-700 mb-4">
            <FaUsers className="text-blue-400 text-3xl" />
            <h2 className="text-blue-400 text-2xl font-semibold">Group Members</h2>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="animate-spin text-blue-500 text-4xl" />
              <p className="ml-4 text-gray-400">Loading members...</p>
            </div>
          ) : groupMembers.length > 0 ? (
            <div className="relative">
              <select
                value={selectedDisplayMember}
                onChange={(e) => setSelectedDisplayMember(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="">Select a member to view</option>
                {groupMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {getMemberDisplayName(member._id)}
                  </option>
                ))}
              </select>
              {/* Display info for the selected member (optional, but makes dropdown useful) */}
              {selectedDisplayMember && (
                <div className="mt-4 p-4 bg-gray-700 border border-gray-600 rounded-lg">
                  <p className="text-gray-300 text-lg">
                    <span className="font-semibold">Selected:</span>{" "}
                    {getMemberDisplayName(selectedDisplayMember)}
                    {groupMembers.find(m => m._id === selectedDisplayMember)?.username && (
                      <span className="text-sm text-gray-400 block">
                        Username: {groupMembers.find(m => m._id === selectedDisplayMember).username}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-lg text-center py-4">
              No members in this group yet. Add one above!
            </p>
          )}
        </div>


        {/* Expenses List */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
          {/* New line/border and title for Group Expenses */}
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-700 mb-4">
            <FaMoneyBillWave className="text-blue-400 text-3xl" /> {/* Icon */}
            <h2 className="text-blue-400 text-2xl font-semibold">Group Expenses</h2> {/* Title */}
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="animate-spin text-blue-500 text-4xl" />
              <p className="ml-4 text-gray-400">Loading expenses...</p>
            </div>
          ) : groupExpenses.length > 0 ? (
            <ul className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
              {groupExpenses.map((expense) => (
                <li
                  key={expense._id}
                  className="border border-gray-700 rounded-lg p-5 bg-gray-700 hover:shadow-lg transition duration-200 transform hover:-translate-y-0.5"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-3 sm:mb-0">
                      <h4 className="text-xl font-semibold text-gray-100 flex items-center">
                        <FaInfoCircle className="mr-2 text-blue-300 text-lg" />
                        {expense.description}
                      </h4>
                      <p className="text-sm text-gray-300 mt-1 flex items-center">
                        <FaTag className="mr-1 text-xs" /> {expense.category}
                      </p>
                      <p className="text-sm text-gray-400 mt-1 flex items-center">
                        <FaUserPlus className="mr-1 text-xs" /> Paid by:{" "}
                        <span className="font-medium text-teal-300">
                          {/* Find the member by ID to display username */}
                          {groupMembers.find((m) => m._id === expense.paidBy)
                            ?.username || "Unknown"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <FaCalendarAlt className="mr-1 text-xs" /> Date:{" "}
                        {new Date(expense.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        <FaClock className="ml-3 mr-1 text-xs" /> Time:{" "}
                        {expense.time}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Split between:{" "}
                        <span className="font-medium text-purple-300">
                          {Array.isArray(expense.splitBetween) &&
                            expense.splitBetween
                              .map(
                                (memberId) =>
                                  groupMembers.find((m) => m._id === memberId)
                                    ?.username || "Unknown"
                              )
                              .join(", ")}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center mt-3 sm:mt-0">
                      <p className="text-3xl font-bold text-green-400 mr-4">
                        ₹{parseFloat(expense.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-lg text-center py-4">
              No expenses recorded for this group yet. Add one above!
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GroupDetails;