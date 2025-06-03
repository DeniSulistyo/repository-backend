const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// ADMINISTRATOR & OPERATOR: CRUD dokumen
router.post(
    '/', 
    authenticateToken, 
    authorizeRoles('ADMINISTRATOR', 'OPERATOR'), 
    documentController.createDocument
);
router.get(
    '/', 
    authenticateToken, 
    authorizeRoles('ADMINISTRATOR', 'OPERATOR', 'VALIDATOR'), 
    documentController.getDocuments
);
router.put(
    '/:id', 
    authenticateToken, 
    authorizeRoles('ADMINISTRATOR', 'OPERATOR'), 
    documentController.updateDocument
);
router.delete(
    '/:id', 
    authenticateToken, 
    authorizeRoles('ADMINISTRATOR', 'OPERATOR'), 
    documentController.deleteDocument
);

// VALIDATOR: Validasi dokumen
router.patch(
    '/:id/validate', 
    authenticateToken, 
    authorizeRoles('VALIDATOR'), 
    documentController.validateDocument
);

module.exports = router;
