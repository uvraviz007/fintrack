const express = require('express')
const router =express.Router();
const Group=require('./../models/group.model');
const Expense=require('./../models/expense.model');

const {jwtAuthMiddleware,generateToken}=require('./../jwt');

// router.get('/', (req,res)=>{
//     res.send("hello lets work on the project");
// });

router.post('/create', jwtAuthMiddleware, async (req, res) => {
  try {
    const { name, members } = req.body;

    const userId = req.user.id; // this comes from jwtAuthMiddleware

    // Ensure the creator is part of the group
    const uniqueMembers = new Set([...members, userId.toString()]);
    const memberArray = Array.from(uniqueMembers);

    const newGroup = new Group({
      name,
      members: memberArray,
      createdBy: userId
    });

    const response = await newGroup.save();
    console.log('Group created:', response);

    res.status(201).json({ message: 'Group created successfully', group: response });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//add members in the  group 
router.put('/:groupId/add-members', jwtAuthMiddleware, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { newMembers } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(newMembers) || newMembers.length === 0) {
      return res.status(400).json({ error: 'newMembers must be a non-empty array' });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Only creator can add members
    if (group.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Only group creator can add members' });
    }

    // Merge old and new members without duplicates
    const updatedMembers = new Set([
  ...group.members.filter(Boolean).map(id => id.toString()),
  ...newMembers.filter(Boolean).map(id => id.toString())
]);

    const updatedGroup = await group.save();

    res.status(200).json({
      message: 'Members added successfully',
      group: updatedGroup
    });

  } catch (error) {
    console.error('Error adding members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




//this is to get members of the group
router.get('/:groupId/members', jwtAuthMiddleware, async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const group = await Group.findById(groupId).populate('members', 'name username email');

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.status(200).json({
      groupId: group._id,
      groupName: group.name,
      members: group.members
    });
  } catch (error) {
    console.error('Error fetching group members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



//get the group 
router.get('/:groupId', jwtAuthMiddleware, async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const group = await Group.findById(groupId)
      .populate('members', 'name username email')
      .populate('createdBy', 'name username email')
      .populate('expenses'); // Optional: only if you’ve defined expenses

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.status(200).json({
      message: 'Group fetched successfully',
      group: group
    });
  } catch (error) {
    console.error('Error fetching group data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


 
module.exports = router;