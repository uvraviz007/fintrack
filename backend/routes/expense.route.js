const express = require('express');
const mongoose = require('mongoose'); // ✅ Add this
const router = express.Router();
const Group = require('./../models/group.model');
const Expense = require('./../models/expense.model');
const User = require('./../models/user.model');
const { jwtAuthMiddleware } = require('./../jwt');
// const { jwtAuthMiddleware } = require('./../jwt');

//adding the expense
router.post('/add', jwtAuthMiddleware, async (req, res) => {
  try {
    const { groupId, amount, description, category, paidBy, splitBetween } = req.body;

    if (!groupId || !description || !amount || !paidBy || !splitBetween?.length) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // Get full Mongoose document (not lean)
    const groupDoc = await Group.findById(groupId); // ✅ Don't use .lean() here
    if (!groupDoc) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isPaidByValid = groupDoc.members.some(m => m.equals(paidBy));
    const allSplitValid = splitBetween.every(uid =>
      groupDoc.members.some(m => m.equals(uid))
    );

    if (!isPaidByValid || !allSplitValid) {
      return res.status(400).json({ message: 'Users must be part of the group' });
    }

    const expense = new Expense({
      group: groupDoc._id,
      description,
      amount,
      category,
      paidBy,
      splitBetween,
    });

    await expense.save();

    // ✅ Safely push expense ID and save the group
    groupDoc.expenses = groupDoc.expenses || [];
    groupDoc.expenses.push(expense.id);

    await groupDoc.save();

    res.status(201).json({ message: 'Expense added and group updated successfully', expense });

  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




//geting the expenses

router.get('/:groupId', jwtAuthMiddleware, async (req, res) => {
  try {
    const groupId = req.params.groupId;

    if (!groupId) {
      return res.status(400).json({ message: 'Group ID is required' });
    }

    const expenses = await Expense.find({ group: groupId })
      .sort({ createdAt: -1 }) // optional: latest first
      

    res.status(200).json(expenses);
  } catch (err) {
    console.error('Error fetching group expenses:', err);
    res.status(500).json({ message: 'Server error while fetching expenses' });
  }
});



//deleting the expense
router.delete('/:expenseId', jwtAuthMiddleware, async (req, res) => {
  try {
    const { expenseId } = req.params;

    // 1. Find & delete the expense
    const expense = await Expense.findByIdAndDelete(expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // 2. Remove the expense reference from its group
    await Group.findByIdAndUpdate(
      expense.group,            // this is the ObjectId ref in the expense doc
      { $pull: { expenses: expense._id } }
    );

    // (Optional) 3. If you have any per-user balance tracking, you could adjust balances here.

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


//update expeses
router.put('/update/:expenseId', jwtAuthMiddleware, async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { description, amount, paidBy, splitBetween } = req.body;

    // Validate input
    if (!description || !amount || !paidBy || !splitBetween || splitBetween.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find the existing expense
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Fetch the group linked to this expense
    const group = await Group.findById(expense.group);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Ensure all users in splitBetween and paidBy are part of the group
    const allUsersValid = splitBetween.every(userId => group.members.includes(userId));
    if (!allUsersValid || !group.members.includes(paidBy)) {
      return res.status(400).json({ message: 'All users must be part of the group' });
    }

    // Update fields
    expense.description = description;
    expense.amount = amount;
    expense.paidBy = paidBy;
    expense.splitBetween = splitBetween;

    await expense.save();

    res.status(200).json({ message: 'Expense updated successfully', expense });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


//get expense of a member
// get expense of a member
router.get("/member/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid User ID" });
  }

  try {
    const expenses = await Expense.find({
      $or: [
        { paidBy: userId },
        { splitBetween: userId } // ✅ match schema field
      ]
    });

    res.status(200).json(expenses);
  } catch (error) {
    console.error("❌ Error fetching user's expenses:", error);
    res.status(500).json({ error: "Server error while fetching expenses" });
  }
});




module.exports = router;



