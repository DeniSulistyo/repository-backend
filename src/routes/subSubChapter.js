const express = require('express');
const router = express.Router();

// Panggil controller
const subSubChapterController = require('../controllers/subSubChapterController');
const { authorizeRoles, authenticateToken } = require('../middlewares/authMiddleware');

// Routing CRUD untuk SubSubChapter
router.get(
    '/', 
    subSubChapterController.getAllSubSubChapters
);

router.get(
    '/:id', 
    subSubChapterController.getSubSubChapterById
);

router.post(
    '/',   authenticateToken,
   authorizeRoles("ADMINISTRATOR", "OPERATOR"),
    subSubChapterController.
    createSubSubChapter
);

router.put(
    '/:id', 
    subSubChapterController.updateSubSubChapter
);

router.delete(
    '/:id', 
    authenticateToken,
    authorizeRoles("ADMINISTRATOR", "OPERATOR"),
    subSubChapterController.deleteSubSubChapter
);

module.exports = router;
