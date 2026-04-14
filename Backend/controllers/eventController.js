const Event = require("../models/Event");


exports.createEvent = async (req, res) => {
  const { name, price, totalSeats } = req.body;

  if (!name || !price || !totalSeats) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const event = await Event.create({
    name,
    price,
    totalSeats,
    createdBy: req.user.id
  });

  res.json({
    message: "Event created successfully",
    event
  });
};


exports.getEvents = async (req, res) => {
  let events;

  if (req.user.role === "admin") {
    // Admin sees only their events
    events = await Event.find({ createdBy: req.user.id });
  } else {
    // User sees all events
    events = await Event.find();
  }

  res.json({
    message: "Events fetched successfully",
    events
  });
};

exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: "Event not found" });
    res.json({ message: "Event fetched successfully", event });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



exports.updateEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(event);
};

exports.deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Event deleted" });
};
