const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { isUser } = require("../middleware/roleMiddleware");
const authController = require("../controllers/authController");
const walletCtrl = require("../controllers/walletController");
const seatCtrl = require("../controllers/seatController");
const bookingCtrl = require("../controllers/bookingController");
const eventCtrl = require("../controllers/eventController");

router.post("/user/signup", authController.userSignup);
router.post("/login", authController.userLogin);

router.get("/data/events", auth, eventCtrl.getEvents);
router.get("/data/event/:eventId", auth, eventCtrl.getEventById);
router.get("/data/seats/:eventId", auth, seatCtrl.getSeatsByEvent);


router.post("/data/wallet/add", auth, isUser, walletCtrl.addMoney);
router.get("/data/wallet/history", auth, isUser, walletCtrl.getHistory);

router.post("/data/reserve", auth, isUser, seatCtrl.reserveSeat);

router.post("/data/book", auth, isUser, bookingCtrl.bookSeats);

router.get("/data/bookings", auth, isUser, bookingCtrl.getUserBookings);

router.post("/data/refund/request", auth, isUser, bookingCtrl.requestRefund);



module.exports = router;
