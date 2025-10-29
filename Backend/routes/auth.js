const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/auth");

const getStatus = (req, res) => {
  res.send("Backend API is up and running...");
};

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getStatus);

module.exports = router;
