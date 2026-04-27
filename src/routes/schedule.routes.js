const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

const scheduleController = require("../controllers/schedule.controller");

console.log(scheduleController);

router.post(
  "/",
  authMiddleware,
  allowRoles("teacher"),
  scheduleController.createSchedule
);

module.exports = router;