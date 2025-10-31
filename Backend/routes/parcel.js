const express = require("express");
const {
  createParcel,
  getAllParcels,
  updateParcel,
  getOneParcel,
  getUserParcel,
  deleteParcel,
} = require("../controllers/parcel");
const {
  verifyToken,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
const router = express.Router();

// ADD PARCEL
router.post("/", verifyToken, createParcel);

// GET ALL PARCELS
router.get("/", verifyTokenAndAuthorization, getAllParcels);

// UPDATE PARCEL
router.put("/:id", verifyTokenAndAuthorization, updateParcel);

// GET ONE PARCEL
router.get("/find/:id", verifyToken, getOneParcel);

// GET USERS PARCELS
router.post("/me", verifyTokenAndAuthorization, getUserParcel);

// DELETE PARCEL
router.delete("/:id", verifyTokenAndAuthorization, deleteParcel);

module.exports = router;
