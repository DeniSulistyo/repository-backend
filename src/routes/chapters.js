const express = require("express");
const router = express.Router();
const chapterController = require("../controllers/chapterController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");
const subChapterController = require("../controllers/subChapterController");

// ✅ Get semua chapter
// router.get("/", authenticateToken, chapterController.getChapters);

router.get("/", authenticateToken, chapterController.getChaptersByProgramStudi);

// ✅ Get semua subchapter berdasarkan chapterId
router.get(
  "/:id/subchapters",
  authenticateToken,
  chapterController.getSubChaptersByChapter
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR", "VALIDATOR"),
  chapterController.getChaptersById
);

// ✅ Create chapter
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR"),
  chapterController.createChapter
);

// ✅ Update chapter
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR"),
  chapterController.updateChapter
);

// ✅ Delete chapter
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR"),
  chapterController.deleteChapter
);


// 
router.get(
  "/:id/subchapters",
  authenticateToken,
  subChapterController.getSubChaptersByChapter
);

module.exports = router;
