const express = require("express");

const userRoutes = require("./routes/user.routes");
const contentRoutes = require("./routes/content.routes");
const slotRoutes = require("./routes/slot.routes");
const scheduleRoutes = require("./routes/schedule.routes");


const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/users", userRoutes);

app.use("/api/content", contentRoutes);

app.use("/api/slots", slotRoutes);

app.use("/api/schedule", scheduleRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;