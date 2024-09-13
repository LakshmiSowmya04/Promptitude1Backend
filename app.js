const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/promptitude1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/users", async (req, res) => {
  try {
    const { name, role, phone_number, email_id, alternate_pho_no, password } =
      req.body;
    const newUser = new User({
      name,
      role,
      phone_number,
      email_id,
      alternate_pho_no,
      password,
    });
    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      success: true,
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

app.get("/users", async (req, res) => {
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
app.get("/users/:user_id", async (req, res) => {
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
app.put("/users/:user_id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.user_id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "User updated successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Update Password
app.put("/users/:user_id/password", async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    user.password = await bcrypt.hash(req.body.new_password, 10);
    await user.save();
    res
      .status(200)
      .json({ message: "Password updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Update Status
//test by sending status as boolean value
app.put("/users/:user_id/status", async (req, res) => {
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

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
