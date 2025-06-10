const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");
const subChapterController = require("./../controllers/subChapterController");

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR"),
  subChapterController.createSubChapter
);

module.exports = router;
