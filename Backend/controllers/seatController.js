const Seat = require("../models/Seat");

exports.reserveSeat = async (req, res) => {
  try {
    const { seats, eventId, seatId } = req.body;
    const userId = req.user.id;

    // Support single-seat reserve: { seatId }
    if (seatId) {
      const seat = await Seat.findOneAndUpdate(
        { _id: seatId, status: "AVAILABLE" },
        { status: "RESERVED", reservedBy: userId, reservedAt: new Date() },
        { new: true }
      );

      if (!seat) {
        return res.status(400).json({ msg: "Seat is already reserved or booked" });
      }

      return res.json({
        message: "Seat reserved successfully",
        seatId,
        eventId: seat.eventId
      });
    }

    // Bulk reserve: { eventId, seats: [] }
    if (!eventId || !seats || seats.length === 0) {
      return res.status(400).json({ msg: "EventId and seats required" });
    }

    // ✅ Reserve only AVAILABLE seats
    const result = await Seat.updateMany(
      {
        _id: { $in: seats },
        eventId,
        status: "AVAILABLE"
      },
      {
        status: "RESERVED",
        reservedBy: userId,
        reservedAt: new Date()
      }
    );

    // ✅ Check if all seats reserved
    if (result.modifiedCount !== seats.length) {
      return res.status(400).json({
        msg: "Some seats are already reserved or booked"
      });
    }

    res.json({
      message: "Seats reserved successfully",
      seats
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.createSeats = async (req, res) => {
  const { seats } = req.body;

  if (!seats || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ msg: "Seats array is required" });
  }

  for (let seat of seats) {
    if (!seat.eventId || !seat.seatNumber) {
      return res.status(400).json({
        msg: "Each seat must have eventId and seatNumber"
      });
    }
  }

  const createdSeats = await Seat.insertMany(seats);
  res.json(createdSeats);
};



// Get seats by event
exports.getSeatsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const seats = await Seat.find({ eventId });

    res.json({
      message: "Seats fetched successfully",
      eventId, // ✅ include eventId clearly
      totalSeats: seats.length, // 🔥 useful info
      seats
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
