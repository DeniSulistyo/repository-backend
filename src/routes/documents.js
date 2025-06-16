const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// 📌 Upload dokumen (khusus ADMINISTRATOR dan OPERATOR)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('ADMINISTRATOR', 'OPERATOR'),
  documentController.upload.single('file'),
  documentController.createDocument
);

// 📌 Ambil semua dokumen (jika diperlukan route umum)
router.get(
  '/',
  authenticateToken,
  authorizeRoles('ADMINISTRATOR', 'OPERATOR', 'VALIDATOR'),
  documentController.getDocuments
);

// 📌 Ambil dokumen berdasarkan SubChapter
router.get(
  '/subchapter/:id',
  authenticateToken,
  authorizeRoles('ADMINISTRATOR', 'OPERATOR', 'VALIDATOR'),
  documentController.getDocumentsBySubChapter
);

// 📌 Validasi dokumen (khusus VALIDATOR)
router.patch(
  '/:id/status',
  authenticateToken,
  authorizeRoles('VALIDATOR'),
  documentController.validateDocument
);

// 📌 Detail dokumen (preview)
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMINISTRATOR', 'OPERATOR', 'VALIDATOR'),
  documentController.getDocumentById
);

// 📌 Edit metadata dokumen (ADMINISTRATOR dan OPERATOR)
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMINISTRATOR', 'OPERATOR'),
  documentController.updateDocument
);

// 📌 Hapus dokumen (ADMINISTRATOR dan OPERATOR)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMINISTRATOR', 'OPERATOR'),
  documentController.deleteDocument
);

module.exports = router;
