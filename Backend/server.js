require("dotenv").config();
const app =require("./app");

const Seat = require("./models/Seat");

const connectDB = require("./database/db")
const Port = parseInt(process.env.PORT, 10) || 3000;

const cors = require("cors");

app.use(cors({
  origin: "*"
}));


connectDB();
app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`);
});


setInterval(async () => {
  try {
    await Seat.updateMany(
      {
        status: "RESERVED",
        reservedAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) }
      },
      {
        status: "AVAILABLE",
        reservedBy: null,
        reservedAt: null
      }
    );
    console.log("Expired reservations cleared");
  } catch (err) {
    console.log(err.message);
  }
}, 600000);


