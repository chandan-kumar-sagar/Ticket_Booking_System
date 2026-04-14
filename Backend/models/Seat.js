const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  seatNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["AVAILABLE", "RESERVED", "BOOKED"],
    default: "AVAILABLE"
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  reservedAt: {
    type: Date,
    default: null
  }
});


module.exports = mongoose.model("Seat", seatSchema);
