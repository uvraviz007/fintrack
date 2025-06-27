const express = require('express');
const router = express.Router();
const Group = require('./../models/group.model');
const Expense = require('./../models/expense.model');
const { jwtAuthMiddleware } = require('./../jwt');





//adding the expense
router.post('/add', jwtAuthMiddleware, async (req, res) => {
  try {
    const { group: groupName, description, amount, paidBy, splitBetween } = req.body;

    if (!groupName || !description || !amount || !paidBy || !splitBetween || splitBetween.length === 0) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // Find the group by name
    const groupDoc = await Group.findOne({ name: groupName });
    if (!groupDoc) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if all users are members of the group
    const allUsersValid = splitBetween.every(userId => groupDoc.members.includes(userId));
    if (!allUsersValid || !groupDoc.members.includes(paidBy)) {
      return res.status(400).json({ message: 'Users must be part of the group' });
    }

    // Create new expense
    const expense = new Expense({
      group: groupDoc._id,
      description,
      amount,
      paidBy,
      splitBetween,
    });

    await expense.save();

    // Update group document to include the new expense
    groupDoc.expenses.push(expense._id);
    await groupDoc.save();

    res.status(201).json({ message: 'Expense added and group updated successfully', expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
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

module.exports = router;



