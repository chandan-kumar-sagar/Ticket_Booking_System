const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Wallet = require("../models/Wallet");
const Seat = require("../models/Seat");
const Transaction = require("../models/Transaction");
const Event = require("../models/Event");
const User = require("../models/User");

exports.bookSeats = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { eventId, seats } = req.body;

    // ✅ Validate input
    if (!eventId || !seats || seats.length === 0) {
      throw new Error("EventId and seats are required");
    }

    // ✅ Get event
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      throw new Error("Event not found");
    }

    // ✅ Calculate amount
    const totalAmount = event.price * seats.length;

    // ✅ Validate seats are AVAILABLE at booking time
    const seatDocs = await Seat.find({
      _id: { $in: seats },
      eventId,
      status: "AVAILABLE"
    }).session(session);

    if (seatDocs.length !== seats.length) {
      throw new Error("Some seats are already reserved or booked");
    }

    // ✅ Deduct wallet (atomic)
    const wallet = await Wallet.findOneAndUpdate(
      {
        userId,
        balance: { $gte: totalAmount }
      },
      {
        $inc: { balance: -totalAmount }
      },
      {
        new: true,
        session
      }
    );

    if (!wallet) {
      throw new Error("Insufficient balance");
    }

    // ✅ Create transaction
    await Transaction.create([{
      userId,
      type: "debit",
      amount: totalAmount,
      balanceAfter: wallet.balance
    }], { session });

    // ✅ Update seats → BOOKED (atomically)
    await Seat.updateMany(
      {
        _id: { $in: seats },
        eventId,
        status: "AVAILABLE"
      },
      {
        status: "BOOKED",
        reservedBy: userId,
        reservedAt: new Date()
      },
      { session }
    );

    // ✅ Create booking
    const booking = await Booking.create([{
      userId,
      eventId,
      seats,
      totalAmount,
      status: "CONFIRMED"
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Booking successful",
      booking: booking[0]
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({ msg: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const { userId, status } = req.query;

    let filter = {};
    if (userId) filter.userId = userId;
    if (status) filter.status = status;

    const bookings = await Booking.find(filter);

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ _id: -1 });

    const eventObjectIds = [];
    const eventIdByString = new Set();
    const seatObjectIds = [];

    for (const b of bookings) {
      const eId = b.eventId;
      if (eId && typeof eId === "string" && mongoose.Types.ObjectId.isValid(eId) && !eventIdByString.has(eId)) {
        eventObjectIds.push(new mongoose.Types.ObjectId(eId));
        eventIdByString.add(eId);
      }

      const seats = Array.isArray(b.seats) ? b.seats : [];
      for (const s of seats) {
        const sId = String(s);
        if (mongoose.Types.ObjectId.isValid(sId)) {
          seatObjectIds.push(new mongoose.Types.ObjectId(sId));
        }
      }
    }

    const [events, seats] = await Promise.all([
      eventObjectIds.length ? Event.find({ _id: { $in: eventObjectIds } }).select("_id name price totalSeats") : Promise.resolve([]),
      seatObjectIds.length ? Seat.find({ _id: { $in: seatObjectIds } }).select("_id seatNumber eventId") : Promise.resolve([])
    ]);

    const eventById = new Map(events.map(e => [String(e._id), e]));
    const seatById = new Map(seats.map(s => [String(s._id), s]));

    const enriched = bookings.map(b => {
      const event = eventById.get(String(b.eventId));
      const seatNumbers = (Array.isArray(b.seats) ? b.seats : [])
        .map(id => seatById.get(String(id))?.seatNumber)
        .filter(Boolean);

      return {
        ...b.toObject(),
        event: event ? event.toObject() : null,
        seatNumbers
      };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.getRefundRequests = async (req, res) => {
  try {
    const requests = await Booking.find({
      status: "REFUND_REQUESTED"
    }).sort({ _id: -1 });

    console.log("[admin] refund requests:", {
      adminId: req.user?.id,
      role: req.user?.role,
      count: requests.length
    });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.requestRefund = async (req, res) => {
  const { bookingId, reason } = req.body;

  const booking = await Booking.findOne({
    _id: bookingId,
    userId: req.user.id
  });

  if (!booking) {
    return res.status(404).json({ msg: "Booking not found" });
  }

  booking.status = "REFUND_REQUESTED";
  booking.refundReason = reason;

  await booking.save();

  res.json({
    message: "Refund request submitted"
  });
};

exports.refundBooking = async (req, res) => {
  const { bookingId } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(bookingId).session(session);

    if (!booking || booking.status === "CANCELLED") {
      throw new Error("Invalid booking");
    }

    // Cancel booking
    booking.status = "CANCELLED";
    await booking.save();

    // Release seats
    await Seat.updateMany(
      { _id: { $in: booking.seats } },
      { status: "AVAILABLE" },
      { session }
    );

    // Refund wallet
    const wallet = await Wallet.findOne({ userId: booking.userId }).session(session);

    wallet.balance += booking.totalAmount;
    await wallet.save();

    // Add transaction
    await Transaction.create([{
      userId: booking.userId,
      type: "credit",
      amount: booking.totalAmount,
      balanceAfter: wallet.balance
    }], { session });

    await session.commitTransaction();

    res.json({ msg: "Refund successful" });

  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ msg: err.message });
  }
};

// Admin: users who booked admin's events
exports.getUsersForAdminEvents = async (req, res) => {
  try {
    const adminId = req.user.id;

    const events = await Event.find({ createdBy: adminId }).select("_id name price totalSeats");
    const eventIds = events.map(e => String(e._id));

    if (eventIds.length === 0) {
      return res.json({
        message: "No events found for admin",
        events: [],
        totalUsers: 0
      });
    }

    const bookings = await Booking.find({ eventId: { $in: eventIds }, status: "CONFIRMED" })
      .select("eventId userId seats totalAmount status");

    const uniqueUserIds = [...new Set(bookings.map(b => b.userId).filter(Boolean))];
    const users = await User.find({ _id: { $in: uniqueUserIds } }).select("_id name email role");
    const userById = new Map(users.map(u => [String(u._id), u]));

    const byEvent = new Map();
    for (const e of events) {
      byEvent.set(String(e._id), {
        event: e,
        users: [],
        bookingsCount: 0,
        seatsBooked: 0,
        revenue: 0
      });
    }

    for (const b of bookings) {
      const bucket = byEvent.get(String(b.eventId));
      if (!bucket) continue;
      bucket.bookingsCount += 1;
      bucket.seatsBooked += Array.isArray(b.seats) ? b.seats.length : 0;
      bucket.revenue += Number(b.totalAmount) || 0;

      const u = userById.get(String(b.userId));
      if (!u) continue;
      if (!bucket.users.some(x => String(x._id) === String(u._id))) {
        bucket.users.push(u);
      }
    }

    const result = Array.from(byEvent.values()).sort((a, b) => b.bookingsCount - a.bookingsCount);
    const totalUsers = new Set(result.flatMap(r => r.users.map(u => String(u._id)))).size;

    res.json({
      message: "Users fetched successfully",
      events: result,
      totalUsers
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

