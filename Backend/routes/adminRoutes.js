const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/roleMiddleware");
const authController = require("../controllers/authController");
const eventCtrl = require("../controllers/eventController");
const bookingCtrl = require("../controllers/bookingController");
const walletCtrl = require("../controllers/walletController");
const seatCtrl = require("../controllers/seatController");

router.post("/admin/signup", authController.adminSignup);
router.post("/login", authController.adminLogin);

// Event Management
router.post("/data/event", auth, isAdmin, eventCtrl.createEvent);
router.get("/data/event", auth, isAdmin, eventCtrl.getEvents);
router.put("/data/event/:id", auth, isAdmin, eventCtrl.updateEvent);
router.delete("/data/event/:id", auth, isAdmin, eventCtrl.deleteEvent);

// Seat Management
router.post("/data/seats/bulk", auth, isAdmin, seatCtrl.createSeats);

// Booking Monitoring
router.get("/data/bookings", auth, isAdmin, bookingCtrl.getAllBookings);
router.get("/data/event/users", auth, isAdmin, bookingCtrl.getUsersForAdminEvents);

// Wallet Monitoring
router.get("/data/transactions", auth, isAdmin, walletCtrl.getAllTransactions);

router.get("/data/refund/requests", auth, isAdmin, bookingCtrl.getRefundRequests);
// Refund
router.post("/data/refund", auth, isAdmin, bookingCtrl.refundBooking);

module.exports = router;
