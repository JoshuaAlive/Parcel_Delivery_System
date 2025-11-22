const express = require("express");
const router = express.Router();
const app = express();
require("dotenv").config();
const cron = require("node-cron");
// const { run } = require("./scheduler/taskScheduler");
// const mongoose = require("mongoose");
// const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 8501;
const { sendParcelDeliveredEmail } = require("./EmailService/DeliveredParcel");
const { SendParcelPendingEmail } = require("./EmailService/PendingParcel");
const { sendWelcomeEmail } = require("./EmailService/WelcomeEmail");

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

// Scheduler function - defined before use
const run = () => {
  // schedule to run every minute
  cron.schedule("* * * * *", async () => {
    //console.log(new Date().toISOString(), "[scheduler] running tasks...");

    try {
      await sendParcelDeliveredEmail();
    } catch (e) {
      console.error("sendParcelDeliveredEmail error:", e);
    }

    try {
      await SendParcelPendingEmail();
    } catch (e) {
      console.error("sendParcelPendingEmail error:", e);
    }

    try {
      await sendWelcomeEmail();
    } catch (e) {
      console.error("sendWelcomeEmail error:", e);
    }
  });
};

// CONNECT TO MONGODB, THEN START THE SERVER
connectDB()
  .then(() => {
    console.log("MongoDB connected successfully...");
    try {
      run(); // Start scheduler after DB connection
      console.log("Scheduler started");
    } catch (e) {
      console.error("Failed to start scheduler:", e);
    }

    app.listen(PORT, () => {
      console.log(
        `Background services server is running on port:http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message || error);
    console.error(
      "Server will continue to run so you can fix DB settings and retry."
    );

    // Start HTTP server even if DB connection failed (do not exit)
    app.listen(PORT, () => {
      console.log(
        `Background services server is running (DB disconnected) on port:http://localhost:${PORT}`
      );
    });
  });
