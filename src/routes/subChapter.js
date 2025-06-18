const express = require("express");
const router = express.Router();
const prisma = require("../db/prisma"); // <== import prisma
const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");
const subChapterController = require("../controllers/subChapterController");
const subSubChapterController = require("../controllers/subSubChapterController");

// POST create subchapter
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR"),
  subChapterController.createSubChapter
);

// GET semua subchapter tanpa filter
router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR", "VALIDATOR"),
  async (req, res) => {
    try {
      const subChapters = await prisma.subChapter.findMany();
      res.status(200).json({ message: "Semua subbab", data: subChapters });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Gagal mengambil data subbab", error: error.message });
    }
  }
);

// GET subchapter berdasarkan chapterId
router.get(
  "/chapter/:chapterId",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR", "VALIDATOR"),
  subChapterController.getSubChaptersByChapter
);

// PUT update subchapter berdasarkan id
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR"),
  subChapterController.updateSubChapter
);

// DELETE hapus subchapter berdasarkan id
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR"),
  subChapterController.deleteSubChapter
);

// subsubchapters
router.get(
  "/:id/subsubchapters",
  subSubChapterController.getSubSubChaptersBySubChapter
);
module.exports = router;
