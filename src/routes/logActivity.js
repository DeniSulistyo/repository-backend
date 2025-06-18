const express = require("express");

const router = express.Router();
const logActivityController = require("../controllers/logActivityController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR"),
  logActivityController.getAllActivityLog
);

module.exports = router;
