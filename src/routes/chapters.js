const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, chapterController.getChapters);
router.get('/:id/subchapters', authenticateToken, chapterController.getSubChaptersByChapter);

router.post('/', authenticateToken, authorizeRoles('ADMINISTRATOR', 'OPERATOR'), chapterController.createChapter);
router.post('/subchapter', authenticateToken, authorizeRoles('ADMINISTRATOR', 'OPERATOR'), chapterController.createSubChapter);

module.exports = router;
