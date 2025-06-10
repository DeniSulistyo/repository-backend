const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "VALIDATOR"),
  commentController.createComment
);

module.exports = router;
