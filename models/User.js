const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Member"], required: true },
  phone_number: { type: String, required: true },
  email_id: { type: String, required: true, unique: true },
  alternate_pho_no: { type: String },
  status: { type: Boolean, default: true },
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client" }],
  reporting_to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  password: { type: String, required: true },
});

// Pre-save hook to hash password before saving to database
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Create User Model
const User = mongoose.model("User", UserSchema);

module.exports = User;
