const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Upload dokumen (khusus ADMINISTRATOR dan OPERATOR)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR"),
  documentController.upload.single("file"),
  documentController.createDocument
);

// Ambil semua dokumen (untuk semua role)
router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR", "VALIDATOR"),
  documentController.getDocuments
);

// Ambil dokumen berdasarkan slug
router.get(
  "/slug/:slug",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR", "VALIDATOR"),
  documentController.getDocumentBySlug
);

// Ambil dokumen berdasarkan SubChapter
router.get(
  "/subchapter/:id",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR", "VALIDATOR"),
  documentController.getDocumentsBySubChapter
);

// Cari dokumen berdasarkan judul
router.get(
  "/search",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR", "VALIDATOR"),
  documentController.searchDocuments
);

// Ambil dokumen yang sudah dihapus (Recycle Bin)
router.get(
  "/deleted",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR"),
  documentController.getDeletedDocuments
);

// Ambil dokumen yang ditolak
router.get(
  "/rejected",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR"),
  documentController.getAllDocumentRejected
);

// Restore dokumen dari Recycle Bin
router.patch(
  "/:id/restore",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR"),
  documentController.restoreDocument
);

// Hapus permanen dokumen dari Recycle Bin
router.delete(
  "/:id/permanent",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR"),
  documentController.permanentlyDeleteDocument
);

// 📌 Download dokumen (ADMINISTRATOR, OPERATOR, VALIDATOR)
router.get(
  "/:id/download",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR", "VALIDATOR"),
  documentController.downloadDocument
);

// Validasi dokumen (khusus VALIDATOR dan ADMINISTRATOR)
router.patch(
  "/:id/status",
  authenticateToken,
  authorizeRoles("VALIDATOR", "ADMINISTRATOR"),
  documentController.validateDocument
);

// Detail dokumen (preview)
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR", "VALIDATOR"),
  documentController.getDocumentById
);

// Edit metadata dokumen (ADMINISTRATOR dan OPERATOR)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR"),
  documentController.upload.single("file"),
  documentController.updateDocument
);

// Hapus dokumen (soft delete) (ADMINISTRATOR dan OPERATOR)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR"),
  documentController.deleteDocument
);

// Share dokumen (khusus Admin & Operator)
router.post(
  "/:id/share",
  authenticateToken,
  authorizeRoles("ADMINISTRATOR", "OPERATOR"),
  documentController.shareDocument
);

// Akses dokumen dari link share (tanpa login)
router.get("/shared/:token", documentController.accessSharedDocument);

module.exports = router;
