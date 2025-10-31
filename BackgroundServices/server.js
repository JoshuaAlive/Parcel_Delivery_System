const express = require("express");
const router = express.Router();
const app = express();
require("dotenv").config();
// const cron = require("node-cron");
const { run } = require("./scheduler/taskScheduler");
const mongoose = require("mongoose");
// const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 8501;

// MIDDLEWARES - register parsers and CORS before routes so handlers can read req.body
// register body parsers and CORS before mounting routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
try {
  // cors is optional; require if available
  const cors = require("cors");
  app.use(cors());
} catch (e) {
  // ignore if cors isn't installed in this workspace
}

app.use(router);

router.get("/", (req, res) => {
  res.send("Background services API is up and running...");
});

// CONNECT TO MONGODB, THEN START THE SERVER
connectDB()
  .then(() => {
    console.log("MongoDB connected successfully...");
    run(); // Start scheduler after DB connection
    app.listen(PORT, () => {
      console.log(
        `Background services server is running on port:http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error.message);
    process.exit(1);
  });
