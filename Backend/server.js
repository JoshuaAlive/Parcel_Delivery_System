const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 8500;
const router = require("./routes/routes");

// ROUTE
app.use(router);

// MIDDLEWARES
app.use(express.json());
app.use(cors());

// CONNECT TO MONGODB, THEN START THE SERVER
connectDB()
  .then(() => {
    console.log("MongoDB connected successfully...");
    app.listen(PORT, () => {
      console.log(`Backend server is running on port:http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error.message);
    process.exit(1);
  });
