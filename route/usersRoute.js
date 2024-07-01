const { Router } = require('express');
const { User,validateUpdateUser } = require('../model/User');
const router = Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const {verifyTokensAndAuthorization, verifyTokensAndAdmin}=require('../middlewares/verfiyToken')
const JWT_SECRET = process.env.JWT_SECRET || ".sZz=x9OfY`2o4X";
/** 
    @desc  Get All Users
   @route  /api/users
   @method  Get
   @access  private (only admin can get all users)
**/
router.get('/users',verifyTokensAndAdmin, asyncHandler(async (req, res) => {
    const users = await User.find().select("-password")
    res.json(users);
}));

/** 
    @desc  Get user By Id
   @route  /api/users/:id
   @method  Get
   @access  private (only admin and user himself)
**/
router.get('/users/:id',verifyTokensAndAuthorization, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const theUser = await User.findById(id).select("-password");
    res.json(theUser);
}));
/** 
    @desc  Delete user By Id
   @route  /api/users/:id
   @method  Delete
   @access  private (only admin and user himself)
**/
router.delete('/users/:id',verifyTokensAndAuthorization, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json("User deleted successfully");
}));
/** 
    @desc  Update user By Id
   @route  /api/users/:id
   @method  Put
   @access  private (only admin and user himself)
**/
router.put('/users/:id', verifyTokensAndAuthorization, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const updateUser = { ...req.body };

    // Ignoring isAdmin field
    const { isAdmin, ...restUpdateUser } = updateUser;

   
 const { error } = validateUpdateUser(restUpdateUser);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    let user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    if ('isAdmin' in updateUser) {
        return res.status(403).json({ error: "You are not allowed to modify the 'isAdmin' field" });
    }
    user.userName = updateUser.userName || user.userName;
    user.email = updateUser.email || user.email;

    if (updateUser.password) {
        user.password = await bcrypt.hash(updateUser.password, 10);
    }

    user = await user.save();
    res.json(user);
}));

module.exports = router;