const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

const contentController = require("../controllers/content.controller");
const upload = require("../config/multer");



router.get(
  "/",
  authMiddleware,
  allowRoles("principal"),
  contentController.getContent
);

router.patch(
  "/:id/status",
  authMiddleware,
  allowRoles("principal"), 
  contentController.updateContentStatus
);

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

router.get(
  "/live/:subject",
  contentController.getLiveContentBySubject
);


module.exports = router;