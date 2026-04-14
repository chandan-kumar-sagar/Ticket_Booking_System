const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: String,
  eventId: String,
  seats: Array,
  totalAmount: Number,
  status: String
});

module.exports = mongoose.model("Booking", bookingSchema);
