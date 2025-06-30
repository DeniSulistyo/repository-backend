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
  authorizeRoles("ADMINISTRATOR", "VALIDATOR", "OPERATOR"),
  programStudiController.getAllProgramStudi
);

router.get("/:id", authenticateToken, authorizeRoles("ADMINISTRATOR", "VALIDATOR", "OPERATOR"), programStudiController.getProgramStudiById);

module.exports = router;
