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
router.post("/", createParcel);  // verifyToken

// GET ALL PARCELS
router.get("/", getAllParcels); // verifyTokenAndAuthorization

// UPDATE PARCEL
router.put("/:id", updateParcel); // verifyTokenAndAuthorization

// GET ONE PARCEL
router.get("/find/:id", verifyToken, getOneParcel);

// GET USERS PARCELS
router.post("/me", verifyTokenAndAuthorization, getUserParcel);

// DELETE PARCEL
router.delete("/:id",  deleteParcel);    // verifyTokenAndAuthorization

module.exports = router;
