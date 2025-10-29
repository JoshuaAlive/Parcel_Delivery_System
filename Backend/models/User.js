const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    country: { type: String, require: true },
    address: { type: String, require: true },
    password: { type: String, require: true },
    status: { type: Number, default: 0 },
    role: { type: String, default: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);