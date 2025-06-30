// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import DashboardLayout from "../components/DashboardLayout";
// import api from "../api";

// const GroupDetails = () => {
//   const { groupId } = useParams();
//   const navigate = useNavigate();
//   const [newMember, setNewMember] = useState("");
//   const [showExpenseForm, setShowExpenseForm] = useState(false);
//   const [expenseData, setExpenseData] = useState({
//     amount: "",
//     description: "",
//     category: "",
//     paidBy: "",
//     date: "",
//     time: "",
//   });
//   const [groupMembers, setGroupMembers] = useState([]);
//   const [splitBetween, setSplitBetween] = useState([]);
//   const [showSplitDropdown, setShowSplitDropdown] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [error, setError] = useState("");

//   const groupExpenses = [
//     {
//       id: 1,
//       description: "Dinner at Pizza Place",
//       amount: 1200,
//       category: "Food",
//       paidBy: "Alice",
//       date: "2025-06-25",
//     },
//     {
//       id: 2,
//       description: "Cab to airport",
//       amount: 850,
//       category: "Travel",
//       paidBy: "Bob",
//       date: "2025-06-26",
//     },
//   ];

//   useEffect(() => {
//     const fetchMembers = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const config = { headers: { Authorization: `Bearer ${token}` } };
//         const response = await api.get(`/group/${groupId}/members`, config);
//         setGroupMembers(response.data.members);
//       } catch (err) {
//         console.error("Failed to load members", err);
//         setError("Could not fetch group members.");
//       }
//     };

//     fetchMembers();
//   }, [groupId]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest(".split-dropdown")) {
//         setShowSplitDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleAddMember = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const config = { headers: { Authorization: `Bearer ${token}` } };
//       const response = await api.put(
//         `/group/${groupId}/add-member`,
//         { username: newMember },
//         config
//       );
//       setNewMember("");
//       setSuccessMessage(response.data.message);
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to add member.");
//     }
//   };

//   const handleExpenseFormSubmit = async (e) => {
//     e.preventDefault();
//     const payload = {
//       ...expenseData,
//       paidBy: [expenseData.paidBy],
//       splitBetween,
//       groupId,
//     };

//     try {
//       const token = localStorage.getItem("token");
//       const config = { headers: { Authorization: `Bearer ${token}` } };
//       await api.post("/expenses", payload, config);
//       alert("Expense added!");
//       setExpenseData({
//         amount: "",
//         description: "",
//         category: "",
//         paidBy: "",
//         date: "",
//         time: "",
//       });
//       setSplitBetween([]);
//       setShowExpenseForm(false);
//     } catch (err) {
//       setError(err.response?.data?.error || "Error submitting expense.");
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-600 p-6 md:p-10 text-gray-800">
//         {/* Top Action Bar */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white p-6 rounded-xl shadow-md">
//           <div className="flex flex-1 gap-4">
//             <input
//               type="text"
//               placeholder="Add member by username"
//               value={newMember}
//               onChange={(e) => setNewMember(e.target.value)}
//               className="flex-1 px-4 py-2  rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm text-black"
//             />
//             <button
//               onClick={handleAddMember}
//               className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//             >
//               Add Member
//             </button>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={() => navigate("/settleup")}
//               className="px-5 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
//             >
//               Settle Up
//             </button>
//             <button
//               onClick={() => setShowExpenseForm(true)}
//               className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//             >
//               Add Expense
//             </button>
//           </div>
//         </div>

//         {/* Expense Form */}
//         {showExpenseForm && (
//           <form
//             onSubmit={handleExpenseFormSubmit}
//             className="bg-white p-6 rounded-lg shadow-md mb-10"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold text-slate-800">Add New Expense</h3>
//               <button
//                 type="button"
//                 onClick={() => setShowExpenseForm(false)}
//                 className="text-gray-400 hover:text-red-500"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <input
//                 type="number"
//                 placeholder="Amount (₹)"
//                 value={expenseData.amount}
//                 onChange={(e) =>
//                   setExpenseData({ ...expenseData, amount: e.target.value })
//                 }
//                 className="px-4 py-2 border rounded-lg w-full"
//               />
//               <input
//                 type="text"
//                 placeholder="Description"
//                 value={expenseData.description}
//                 onChange={(e) =>
//                   setExpenseData({ ...expenseData, description: e.target.value })
//                 }
//                 className="px-4 py-2 border rounded-lg w-full"
//               />
//               <select
//                 value={expenseData.category}
//                 onChange={(e) =>
//                   setExpenseData({ ...expenseData, category: e.target.value })
//                 }
//                 className="px-4 py-2 border rounded-lg bg-white"
//               >
//                 <option value="">Select Category</option>
//                 {["Food", "Travel", "Entertainment", "Others"].map((c) => (
//                   <option key={c} value={c}>
//                     {c}
//                   </option>
//                 ))}
//               </select>
//               <select
//                 value={expenseData.paidBy}
//                 onChange={(e) =>
//                   setExpenseData({ ...expenseData, paidBy: e.target.value })
//                 }
//                 className="px-4 py-2 border rounded-lg bg-white"
//               >
//                 <option value="">Paid by</option>
//                 {groupMembers.map((m) => (
//                   <option key={m._id} value={m.name}>
//                     {m.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="split-dropdown relative mb-4">
//               <button
//                 type="button"
//                 onClick={() => setShowSplitDropdown(!showSplitDropdown)}
//                 className="w-full px-4 py-2 border rounded-lg bg-white text-left"
//               >
//                 {splitBetween.length > 0
//                   ? splitBetween.join(", ")
//                   : "Split Between (select members)"}
//               </button>
//               {showSplitDropdown && (
//                 <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow max-h-48 overflow-y-auto">
//                   {groupMembers.map((m) => (
//                     <label
//                       key={m._id}
//                       className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                     >
//                       <input
//                         type="checkbox"
//                         value={m.name}
//                         checked={splitBetween.includes(m.name)}
//                         onChange={(e) => {
//                           const value = e.target.value;
//                           setSplitBetween((prev) =>
//                             prev.includes(value)
//                               ? prev.filter((v) => v !== value)
//                               : [...prev, value]
//                           );
//                         }}
//                         className="mr-2"
//                       />
//                       {m.name}
//                     </label>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
//             >
//               Submit Expense
//             </button>
//           </form>
//         )}

//         {/* Expenses List */}
//         <div className="bg-white p-6 rounded-xl shadow-md">
//           <h2 className="text-2xl font-bold mb-6 text-slate-800">Group Expenses</h2>
//           {groupExpenses.length > 0 ? (
//             <ul className="space-y-4">
//               {groupExpenses.map((expense) => (
//                 <li
//                   key={expense.id}
//                   className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-sm"
//                 >
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h4 className="text-lg font-semibold text-gray-800">
//                         {expense.description}
//                       </h4>
//                       <p className="text-sm text-gray-600">
//                         ₹{expense.amount} • {expense.category} •{" "}
//                         <span className="text-gray-700 font-medium">
//                           Paid by: {expense.paidBy}
//                         </span>
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         Date: {new Date(expense.date).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-500">No expenses recorded yet.</p>
//           )}
//         </div>

//         {error && <p className="text-red-600 mt-4">{error}</p>}
//         {successMessage && (
//           <p className="text-green-600 mt-4">{successMessage}</p>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default GroupDetails;
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
  FaUserCircle, // Still needed for add member, potentially for the dropdown icon
} from "react-icons/fa";

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

  // State for the new Group Members dropdown
  const [selectedDisplayMember, setSelectedDisplayMember] = useState("");

  // --- Initial Data Fetching (Group Details & Expenses) ---
  useEffect(() => {
    const fetchGroupData = async () => {
      setLoading(true);
      setMessage({ type: "", text: "" }); // Clear messages on fetch
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
          `/group/${groupId}/members`,
          config
        );
        setGroupName(groupResponse.data.name || "Group Details");
        const members = groupResponse.data.members || [];
        setGroupMembers(members);

        // Pre-select all members for new expense split by default
        if (members.length > 0) {
          setSplitBetween(members.map((m) => m._id));
          // Set the first member as default for 'paidBy' if available
          setExpenseData((prev) => ({ ...prev, paidBy: members[0]._id }));
          // Set the first member as default for the new group members display dropdown
          setSelectedDisplayMember(members[0]._id);
        }

        // Fetch group-specific expenses
        const expensesResponse = await api.get(
          `/expenses/group/${groupId}`,
          config
        );
        setGroupExpenses(expensesResponse.data);
      } catch (err) {
        console.error("Failed to load group data", err.response || err);
        const errorMessage = err.response?.data?.message || "";
        if (errorMessage) {
          setMessage({ type: "error", text: errorMessage });
        }

        // Redirect to login if unauthorized
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId, navigate]); // Depend on groupId and navigate

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
  }, []); // Run once on mount

  // Function to determine display name for members (handles duplicates)
  const getMemberDisplayName = (memberId) => {
    const member = groupMembers.find((m) => m._id === memberId);
    if (!member) return "Unknown";

    const sameNameCount = groupMembers.filter(
      (m) => m.name === member.name
    ).length;
    return sameNameCount > 1
      ? `${member.name} (${member.username})`
      : member.name;
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
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Step 1: Add member to group
      const addResponse = await api.put(
        `/group/${groupId}/add-member`,
        { username: newMemberUsername },
        config
      );

      // Step 2: Fetch full user details by username
      const userResponse = await api.get(
        `/users/username/${newMemberUsername}`,
        config
      );
      const newUser = userResponse.data;

      // Step 3: Update members list in UI
      setGroupMembers((prev) => {
        const updatedMembers = [...prev, newUser];
        // If it's the first member added, set them as selected for display
        if (prev.length === 0) {
            setSelectedDisplayMember(newUser._id);
        }
        return updatedMembers;
      });

      // Step 4: Update splitBetween
      setSplitBetween((prev) => [...prev, newUser._id]);

      // Step 5: If no paidBy is set, assign this one
      if (!expenseData.paidBy) {
        setExpenseData((prev) => ({ ...prev, paidBy: newUser._id }));
      }

      setNewMemberUsername("");
      setMessage({ type: "success", text: "Member added successfully!" });
    } catch (err) {
      console.error("Error adding member:", err.response || err);
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Failed to add member.",
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
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await api.post("/expense/add", payload, config);

      // Update UI
      setGroupExpenses((prev) => [response.data, ...prev]);
      setMessage({ type: "success", text: "Expense added successfully!" });

      // Reset form
      const defaultPaidBy = groupMembers?.[0]?._id || "";
      const defaultSplitBetween = Array.isArray(groupMembers)
        ? groupMembers.map((m) => m._id)
        : [];

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
                // onClick={() => navigate(`/group/${groupId}/settle`)}
                onClick={() => navigate("/settleup")}
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
                      "Utilities",
                      "Rent",
                      "Groceries",
                      "Shopping",
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
                                {groupMembers.find(m => m._id === selectedDisplayMember)?.email && (
                                    <span className="text-sm text-gray-400 block">
                                        Email: {groupMembers.find(m => m._id === selectedDisplayMember).email}
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


        {/* Expenses List - ADDED LINE/BORDER */}
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
                          {/* Map splitBetween IDs to usernames */}
                          {expense.splitBetween
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