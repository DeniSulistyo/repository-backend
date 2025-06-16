const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Hanya ADMINISTRATOR yang bisa akses semua ini
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR"),
  userController.createUser
);
router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR"),
  userController.getUsers
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR"),
  userController.updateUser
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR"),
  userController.deleteUser
);

// program studi
router.get(
  "/program-studi",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR"),
  userController.getAllProgramStudi
);

module.exports = router;
