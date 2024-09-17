// routes/user.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const cors = require("cors");
const router = express.Router();
router.use(express.json());
router.use(cors());
router.post("/users", async (req, res) => {
  try {
    const { name, role, phone_number, email_id, alternate_pho_no, password } =
      req.body;
    if (!name || !role || !phone_number || !email_id) {
      return res.status(400).json({
        message: "All required fields must be filled",
        success: false,
      });
    }
    console.log("Received data:", req.body);
    const newUser = new User({
      name,
      role,
      phone_number,
      email_id,
      alternate_pho_no,
      password: await bcrypt.hash(password, 10),
    });

    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.error("Error in POST /users:", error); // Log the actual error
    res.status(500).json({ message: error.message, success: false });
  }
});
const isAdmin = (req, res, next) => {
  const { role } = req.query;
  if (role !== "Admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};
router.get("/users", async (req, res) => {
  console.log("packet came isnide users");
  const { user_id, role } = req.query;

  try {
    let users;
    if (role === "Admin") {
      users = await User.find();
    } else {
      users = await User.find({ reporting_to: user_id });
    }
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Get User By ID
//when testing keep id as that object id _id
router.get("/users/:user_id", async (req, res) => {
  console.log("packet came isnide users/:user_id get req");
  try {
    const user = await User.findById(req.params.user_id);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Update User
router.put("/users/:user_id", async (req, res) => {
  console.log("packet came inside users/:user_id PUT request");
  try {
    const { name, role, reporting_to } = req.body;
    console.log(req.body);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.user_id,
      { $set: { name, role, reporting_to } }, // Only update name, role, and reporting_to
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res.status(200).json({
      message: "User updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    console.error("Error in PUT /users/:user_id:", error);
    res.status(500).json({ message: error.message, success: false });
  }
});

// Update Password
router.put("/users/:user_id/password", async (req, res) => {
  console.log("Request received for user:", req.params.user_id);
  console.log("Request body:", req.body);

  try {
    const user = await User.findById(req.params.user_id);
    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    console.log("User found:", user);

    // Hash the new password and update
    user.password = await bcrypt.hash(req.body.new_password, 10);
    await user.save();

    console.log("Password updated successfully for user:", user._id);

    res
      .status(200)
      .json({ message: "Password updated successfully", success: true });
  } catch (error) {
    console.error("Error updating password:", error.message);
    res.status(500).json({ message: error.message, success: false });
  }
});

// Update Status
//test by sending status as boolean value
router.put("/users/:user_id/status", async (req, res) => {
  console.log("packet came isnide users/:user_id/status put req");
  console.log(req.body);
  try {
    const user = await User.findById(req.params.user_id);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    user.status = req.body.status;
    await user.save();
    res
      .status(200)
      .json({ message: "Status updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

module.exports = router;
