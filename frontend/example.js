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