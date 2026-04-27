const express = require("express");
const router = express.Router();

const  {authMiddleware}  = require("../middlewares/auth.middleware");
const  {allowRoles}  = require("../middlewares/role.middleware");

const slotController = require("../controllers/slot.controller");

// Create subject slot (Principal only)
router.post(
  "/create",
  authMiddleware,
  allowRoles("principal"),
  slotController.createSlot
);

// Get all subjects (optional but useful)
router.get(
  "/all",
  authMiddleware,
  slotController.getAllSlots
);

router.post(
  "/assign-teacher",
  authMiddleware,
  allowRoles("principal"),
  slotController.assignTeacherToSubject
);

module.exports = router;