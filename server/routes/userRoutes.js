const express = require('express')
const router = express.Router()
const User = require('../models/User')

// GET all users
router.get("/users", async (req, res) => {
    try {
      // Fetch users excluding sensitive fields like password
      const users = await User.find({}, { password: 0 });
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Server error. Unable to fetch users." });
    }
  });


router.get("/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id, { password: 0 }); // Exclude password
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error. Unable to fetch user." });
    }
  });

router.put("/:id",async(req,res)=>{
    res.json({
        message : "This is to Update user by id"
    })
})
router.delete("/:id",async(req,res)=>{
    res.json({
        message : "This is to Delete user by id"
    })
})





module.exports = router;