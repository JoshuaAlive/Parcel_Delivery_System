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
  .then(async () => {
    console.log("MongoDB connected successfully...");

    // ============================
    // 🔥 CREATE ADMIN IF NOT EXISTS
    // ============================
    try {
      const User = require("./models/User");
      const CryptoJs = require("crypto-js");

      const adminExists = await User.findOne({ role: "admin" });

      if (!adminExists) {
        const admin = new User({
          fullname: "System Admin",
          email: process.env.INIT_ADMIN_EMAIL,
          age: 30,
          country: "Nigeria",
          address: "Admin Headquarters",
          role: "admin",
          password: CryptoJs.AES.encrypt(
            process.env.INIT_ADMIN_PWD,
            process.env.PASS
          ).toString(),
        });

        await admin.save();
        console.log("🔥 Admin created:", admin.email);
      } else {
        console.log("Admin already exists — skipping creation.");
      }
    } catch (err) {
      console.error("Error creating admin:", err.message);
    }
    // ============================

    app.listen(PORT, () => {
      console.log(`Backend server is running on: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error.message);
    process.exit(1);
  });

// connectDB()
//   .then(() => {
//     console.log("MongoDB connected successfully...");
//     app.listen(PORT, () => {
//       console.log(`Backend server is running on port:http://localhost:${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Failed to connect to MongoDB", error.message);
//     process.exit(1);
//   });