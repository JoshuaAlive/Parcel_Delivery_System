const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 8500;
const authRoute = require("./routes/auth");
const parcelRoute = require("./routes/parcel");
const userRoute = require("./routes/user");

// MIDDLEWARES - register parsers and CORS before routes so handlers can read req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ROUTES
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/parcels", parcelRoute);
app.use("/api/v1/users", userRoute);

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