const express = require('express');
const router = express.Router();
const Group = require('./../models/group.model');
const Expense = require('./../models/expense.model');
const { jwtAuthMiddleware } = require('./../jwt');

const express = require('express');
const router = express.Router();
const Group = require('./../models/group.model');
const Expense = require('./../models/expense.model');
const { jwtAuthMiddleware } = require('./../jwt');

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

module.exports = router;


module.exports = router;
