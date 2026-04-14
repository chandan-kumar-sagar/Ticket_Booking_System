const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());

app.use("/api/v1/Admin", require("./routes/adminRoutes"));
app.use("/api/v1/user", require("./routes/userRoutes"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports =app;




