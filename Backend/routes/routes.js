const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth");


const getStatus = (req, res) => {
    res.send("Backend API is up and running...");
};

router.post("/", register);
router.post("/", login);
router.get("/", getStatus);

module.exports = router