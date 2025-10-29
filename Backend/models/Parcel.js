const mongoose = require("mongoose");

const parcelSchema = mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true, unique: true },
    senderName: { type: Number, require: true },
    receipientName: { type: String, require: true },
    senderEmail: { type: String, require: true },
    receipientEmail: { type: String, require: true },
    weight: { type: Number, require: true },
    cost: { type: Number, require: true },
    date: { type: String, require: true },
    note: { type: String },
    feedback: { type: String },
    status: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parcel", parcelSchema);