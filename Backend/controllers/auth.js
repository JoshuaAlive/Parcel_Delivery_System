const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const registerUser = async (req, res) => {
  const {
    fullname,
    email,
    age,
    country,
    address,
    password,
    phoneNumber,
    adminKey,
  } = req.body;

  // ---- VALIDATIONS START ----
  if (
    !fullname ||
    !email ||
    !age ||
    !country ||
    !address ||
    !password ||
    !phoneNumber
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address" });
  }

  // Validate phone number format for all countries
  const phoneRegex = /^\+?[0-9]{10,14}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }

  // Check for existing phone number
  const existingPhone = await User.findOne({ phoneNumber });
  if (existingPhone) {
    return res.status(400).json({ message: "Phone number already exists." });
  }

  // check for password length
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  // check for existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists." });
  }
  // ---- VALIDATIONS END ----

  // role: never trust the client. Default to "user".
  let role = "user";

  // If client supplies the correct ADMIN_KEY, grant admin role.

  if (adminKey && process.env.ADMIN_KEY && adminKey === process.env.ADMIN_KEY) {
    role = "admin";
  }

  const newUser = new User({
    fullname,
    email,
    age,
    country,
    address,
    role,
    password: CryptoJs.AES.encrypt(password, process.env.PASS).toString(),
  });

  try {
    const user = await newUser.save();
    // don't send password back
    const { password: pwd, ...info } = user._doc;
    res.status(201).json({ message: "Registration successful", user: info });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while registering user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "You have not registered" });
    }

    const hashedPassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.PASS
    );
    const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

    if (originalPassword !== password) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const { password: pwd, ...info } = user._doc;
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SEC,
      { expiresIn: "10d" }
    );

    if (user.role === "admin") {
      return res.status(200).json({
        message: "Admin login successful",
        ...info,
        accessToken,
        role: "admin",
      });
    } else {
      return res.status(200).json({
        message: "User login successful",
        ...info,
        accessToken,
        role: "user",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred during login",
      error: error.message,
    });
  }
};

module.exports = { registerUser, loginUser };
