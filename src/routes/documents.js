const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Upload dokumen + multer middleware
router.post(
  '/', 
  authenticateToken, 
  authorizeRoles('ADMINISTRATOR', 'OPERATOR'), 
  documentController.upload.single('file'), 
  documentController.createDocument
);

// Get dokumen berdasarkan subchapter
router.get(
  '/subchapter/:id', 
  authenticateToken, 
  authorizeRoles('ADMINISTRATOR', 'OPERATOR', 'VALIDATOR'), 
  documentController.getDocumentsBySubChapter
);

// Validasi status dokumen (PATCH)
router.patch(
  '/:id/status', 
  authenticateToken, 
  authorizeRoles('VALIDATOR'), 
  documentController.validateDocument // <== ini diganti dari updateDocumentStatus ke validateDocument
);

// Preview dokumen
router.get('/:id', authenticateToken, documentController.getDocumentById);

// Edit metadata dokumen
router.put(
  '/:id', 
  authenticateToken, 
  authorizeRoles('ADMINISTRATOR', 'OPERATOR'), 
  documentController.updateDocument
);

// Hapus dokumen
router.delete(
  '/:id', 
  authenticateToken, 
  authorizeRoles('ADMINISTRATOR', 'OPERATOR'), 
  documentController.deleteDocument
);

module.exports = router;
