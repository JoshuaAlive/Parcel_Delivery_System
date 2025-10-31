const express = require("express");
const router = express.Router();


const getStatus = (req, res) => {
  res.send("Background services API is up and running...");
};


module.exports = router;
