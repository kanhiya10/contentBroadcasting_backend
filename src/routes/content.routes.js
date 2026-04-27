const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

const contentController = require("../controllers/content.controller");
const upload = require("../config/multer");



// Upload content (Teacher only)
router.post(
  "/upload",
  authMiddleware,
  allowRoles("teacher"),
  upload.single("file"),
  contentController.uploadContent
);

// View own content
router.get(
  "/my-content",
  authMiddleware,
  allowRoles("teacher"),
  contentController.getMyContent
);


module.exports = router;