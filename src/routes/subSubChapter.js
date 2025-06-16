const express = require('express');
const router = express.Router();

// Panggil controller
const subSubChapterController = require('../controllers/subSubChapterController');

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
    '/', 
    subSubChapterController.
    createSubSubChapter
);

router.put(
    '/:id', 
    subSubChapterController.updateSubSubChapter
);

router.delete(
    '/:id', 
    subSubChapterController.deleteSubSubChapter
);

module.exports = router;
