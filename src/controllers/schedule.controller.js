const scheduleService = require("../services/schedule.service");

exports.createSchedule = async (req, res) => {
  try {
    const schedule = await scheduleService.createSchedule(
      req.body,
      req.user.id
    );

    res.status(201).json({
      message: "Content scheduled successfully",
      schedule,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};