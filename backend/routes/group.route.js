const express = require('express')
const router =express.Router();
const User = require('./../models/user.model');
const Group=require('./../models/group.model');
const Expense=require('./../models/expense.model');


const {jwtAuthMiddleware,generateToken}=require('./../jwt');

// router.get('/', (req,res)=>{
//     res.send("hello lets work on the project");
// });

router.post('/create', jwtAuthMiddleware, async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.user.id;

    // Convert usernames to userIds
    const users = await User.find({ username: { $in: members } });

    if (users.length !== members.length) {
      const foundUsernames = users.map(u => u.username);
      const notFound = members.filter(m => !foundUsernames.includes(m));
      return res.status(400).json({
        error: `User(s) not found: ${notFound.join(', ')}`
      });
    }

    const memberIds = users.map(user => user._id.toString());

    // Add creator's userId
    const uniqueMembers = new Set([...memberIds, userId.toString()]);
    const memberArray = Array.from(uniqueMembers);

    const newGroup = new Group({
      name,
      members: memberArray,
      createdBy: userId,
    });

    const savedGroup = await newGroup.save();
    console.log('Group created:', savedGroup);

    res.status(201).json({ message: 'Group created successfully', group: savedGroup });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});






//add members in the  group 
router.put('/:groupId/add-member', jwtAuthMiddleware, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { newMember } = req.body;
    const userId = req.user.id;

    if (!newMember || typeof newMember !== 'string') {
      return res.status(400).json({ error: 'newMember must be a valid user ID string' });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (group.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Only group creator can add members' });
    }

    // Ensure members is an array
    if (!Array.isArray(group.members)) {
      group.members = [];
    }

    // Add new member if not already present
    const currentMembers = group.members.map(id => id.toString());
    if (currentMembers.includes(newMember.toString())) {
      return res.status(400).json({ error: 'Member already in the group' });
    }

    group.members.push(newMember);

    const updatedGroup = await group.save();
    res.status(200).json({
      message: 'Member added successfully',
      group: updatedGroup
    });

  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// router.put('/:groupId/add-member', jwtAuthMiddleware, async (req, res) => {
//   try {
//     const groupId = req.params.groupId;
//     const { newMember } = req.body; // Expecting a username
//     const userId = req.user.id;

    // if (!newMember || typeof newMember !== 'string') {
    //   return res.status(400).json({ error: 'newMember must be a valid username string' });
    // }

    // const group = await Group.findById(groupId);
    // if (!group) {
    //   return res.status(404).json({ error: 'Group not found' });
    // }

    // if (group.createdBy.toString() !== userId.toString()) {
    //   return res.status(403).json({ error: 'Only the group creator can add members' });
    // }

    // 🔍 Lookup user by username
    // const userToAdd = await User.findOne({ username: newMember });
    // if (!userToAdd) {
    //   return res.status(404).json({ error: `User with username "${newMember}" not found` });
    // }

    // const memberId = userToAdd._id.toString();
    // const currentMembers = group.members.map(id => id.toString());

    // // ➕ Add only if not already present
    // if (!currentMembers.includes(memberId)) {
    //   group.members.push(memberId);
    // } else {
    //   return res.status(400).json({ error: 'User is already a member of the group' });
    // }

  //   const updatedGroup = await group.save();

  //   res.status(200).json({
  //     message: `Member "${newMember}" added successfully`,
  //     group: updatedGroup
  //   });
  // }

  //  catch (error) {
  //   console.error('Error adding member:', error);
  //   res.status(500).json({ error: 'Internal server error' });
  // }
// });







//this is to get members of the group
router.get('/:groupId/members', jwtAuthMiddleware, async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const group = await Group.findById(groupId).populate('members', 'name username email');

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.status(200).json({
      groupId: group.id,
      groupName: group.name,
      members: group.members
    });
  } catch (error) {
    console.error('Error fetching group members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//get the group 
// router.get('/:groupId', jwtAuthMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const groups = await Group.find({ members: userId })
//       .populate('createdBy', 'username')
//       .sort({ createdAt: -1 });

//     res.status(200).json({ groups });
//   } catch (error) {
//     console.error('Error fetching user groups:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
router.get('/user', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await Group.find({ members: userId })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({ groups });
  } catch (error) {
    console.error('Error fetching user groups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// router.get('/:groupId', jwtAuthMiddleware, async (req, res) => {
//   try {
//     const groupId = req.params.groupId;

//     const group = await Group.findById(groupId)
//       .populate('members', 'name username email')
//       .populate('createdBy', 'name username email')
//       .populate('expenses'); // Optional: only if you’ve defined expenses

//     if (!group) {
//       return res.status(404).json({ error: 'Group not found' });
//     }

//     res.status(200).json({
//       message: 'Group fetched successfully',
//       group: group
//     });
//   } catch (error) {
//     console.error('Error fetching group data:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }); 
//     res.status(200).json({
//       groupId: group.id,
//       groupName: group.name,
//       members: group.members
//     });
//   } catch (error) {
//     console.error('Error fetching group members:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


//delete group 
router.delete('/:groupId', jwtAuthMiddleware, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.id;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    // Only creator can delete
    if (group.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Only the group creator can delete this group' });
    }
    await Group.findByIdAndDelete(groupId);
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//join the group by any user
router.put('/:groupId/join', jwtAuthMiddleware, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if already a member
    const isAlreadyMember = group.members.some(
      member => member.toString() === userId.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    // Add user to members array
    group.members.push(userId);
    await group.save();

    res.status(200).json({
      message: 'You have successfully joined the group',
      groupId: group._id,
      groupName: group.name,
      totalMembers: group.members.length
    });
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;