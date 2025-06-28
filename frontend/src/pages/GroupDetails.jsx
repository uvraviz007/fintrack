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
  const [groupMembers, setGroupMembers] = useState([]);
  const [splitBetween, setSplitBetween] = useState([]);
  const [showSplitDropdown, setShowSplitDropdown] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const groupExpenses = []; // You can replace with real expenses later

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await api.get(`/group/${groupId}/members`, config);
        setGroupMembers(response.data.members);
      } catch (err) {
        console.error("Failed to load members", err);
        setError("Could not fetch group members.");
      }
    };

    fetchMembers();
  }, [groupId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".split-dropdown")) {
        setShowSplitDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddMember = async () => {
    try {
      const token = localStorage.getItem("token");
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
      setSuccessMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add member.");
    }
  };

  const handleExpenseFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...expenseData,
      paidBy: [expenseData.paidBy],
      splitBetween,
      groupId,
    };

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.post("/expenses", payload, config);
      alert("Expense added!");
      setExpenseData({
        amount: "",
        description: "",
        category: "",
        paidBy: "",
        date: "",
        time: "",
      });
      setSplitBetween([]);
      setShowExpenseForm(false);
    } catch (err) {
      setError(err.response?.data?.error || "Error submitting expense.");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-600 p-8 text-gray-800">
       
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm">
  <div className="flex flex-1 gap-4">
    <input
      type="text"
      placeholder="Add Member"
      value={newMember}
      onChange={(e) => setNewMember(e.target.value)}
      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-full md:w-64"
    />
    <button
      onClick={handleAddMember}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
    >
      Add Member
    </button>
  </div>
  <div className="flex gap-4 mt-4 md:mt-0">
    <button
      onClick={() => navigate("/settleup")}
      className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-200"
    >
      Settle Up
    </button>
    <button
      onClick={() => setShowExpenseForm(true)}
      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
    >
      Add Expense
    </button>
  </div>
</div>

        {showExpenseForm && (
          <form
            onSubmit={handleExpenseFormSubmit}
            className="bg-white p-6 rounded-lg shadow relative"
          >
            <button
              type="button"
              onClick={() => setShowExpenseForm(false)}
              className="absolute top-2 right-2 text-gray-600"
            >
              ✖
            </button>

            <h3 className="text-xl font-semibold mb-4">Add Expense</h3>

            <input
              type="number"
              placeholder="Amount"
              value={expenseData.amount}
              onChange={(e) =>
                setExpenseData({ ...expenseData, amount: e.target.value })
              }
              className="w-full mb-3 px-4 py-2 border rounded-lg"
            />

            <input
              type="text"
              placeholder="Description"
              value={expenseData.description}
              onChange={(e) =>
                setExpenseData({ ...expenseData, description: e.target.value })
              }
              className="w-full mb-3 px-4 py-2 border rounded-lg"
            />

            <select
              value={expenseData.category}
              onChange={(e) =>
                setExpenseData({ ...expenseData, category: e.target.value })
              }
              className="w-full mb-3 px-4 py-2 border rounded-lg bg-white"
            >
              <option value="">Select Category</option>
              {["food", "travel", "entertainment", "others"].map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={expenseData.paidBy}
              onChange={(e) =>
                setExpenseData({ ...expenseData, paidBy: e.target.value })
              }
              className="w-full mb-3 px-4 py-2 border rounded-lg bg-white"
            >
              <option value="">Select who paid</option>
              {groupMembers.map((m) => (
                <option key={m._id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>

            <div className="split-dropdown relative mb-3">
              <button
                type="button"
                onClick={() => setShowSplitDropdown(!showSplitDropdown)}
                className="w-full px-4 py-2 border rounded-lg bg-white text-left"
              >
                {splitBetween.length > 0
                  ? splitBetween.join(", ")
                  : "Select Members to Split"}
              </button>
              {showSplitDropdown && (
                <div className="absolute bg-white border rounded-lg shadow z-10 w-full mt-1 max-h-40 overflow-y-auto">
                  {groupMembers.map((m) => (
                    <label
                      key={m._id}
                      className="flex items-center px-4 py-2 hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        value={m.name}
                        checked={splitBetween.includes(m.name)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSplitBetween((prev) =>
                            prev.includes(value)
                              ? prev.filter((v) => v !== value)
                              : [...prev, value]
                          );
                        }}
                        className="mr-2"
                      />
                      {m.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit Expense
            </button>
          </form>
        )}

        {error && <p className="text-red-600 mt-4">{error}</p>}
        {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
      </div>
    </DashboardLayout>
  );
};

export default GroupDetails;
