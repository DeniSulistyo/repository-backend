const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post(
  "/", 
  authenticateToken, 
  commentController.
  createComment
);

router.get(
  "/document/:documentId", 
  authenticateToken, 
  commentController.getCommentsByDocument
);

router.put(
  "/:id", 
  authenticateToken, 
  commentController.updateComment
);

router.delete(
  "/:id", 
  authenticateToken, 
  commentController.deleteComment
);

module.exports = router;
