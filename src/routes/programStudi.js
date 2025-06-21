const express = require("express");

const router = express.Router();
const programStudiController = require("../controllers/programStudiController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "VALIDATOR"),
  programStudiController.getAllProgramStudi
);

router.get("/:id", authenticateToken, authorizeRoles("ADMINISTRATOR", "VALIDATOR"), programStudiController.getProgramStudiById);

module.exports = router;
