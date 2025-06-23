const express = require('express')
const router =express.Router();
const Group=require('./../models/group.model');

const {jwtAuthMiddleware,generateToken}=require('./../jwt');

// router.get('/', (req,res)=>{
//     res.send("hello lets work on the project");
// });

router.post('/create', jwtAuthMiddleware, async (req, res) => {
  try {
    const { name, members } = req.body;

    const userId = req.user._id; // this comes from jwtAuthMiddleware

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
 
module.exports = router;