const prisma = require("../db/prisma");

const createComment = async (req, res) => {
  const { content, documentId } = req.body;
  const userId = req.user.id;

  if (!content || !documentId) {
    return res.status(400).json({ message: "Content and documentId are required." });
  }

  const document = await prisma.document.findUnique({ where: { id: documentId } });

  if (!document) return res.status(404).json({ message: "Document not found." });

  if (req.user.role !== "VALIDATOR") {
    return res.status(403).json({ message: "Only validators can create comments." });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        documentId,
        userId,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        message: `Validator ${req.user.username} commented on document ID ${documentId}`,
        status: "INFO",
      },
    });

    res.status(201).json({ message: "Comment created", data: comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating comment." });
  }
};

const getCommentsByDocument = async (req, res) => {
  const documentId = parseInt(req.params.documentId);
  if (isNaN(documentId)) return res.status(400).json({ message: "Invalid document ID" });

  try {
    const comments = await prisma.comment.findMany({
      where: { documentId },
      include: {
        user: {
          select: { id: true, username: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ message: "Comments fetched", data: comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching comments." });
  }
};

const updateComment = async (req, res) => {
  const { content } = req.body;
  const commentId = parseInt(req.params.id);

  if (req.user.role !== "VALIDATOR") {
    return res.status(403).json({ message: "Only validators can update comments." });
  }

  const existingComment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!existingComment) return res.status(404).json({ message: "Comment not found." });
  if (existingComment.userId !== req.user.id) {
    return res.status(403).json({ message: "You can only update your own comments." });
  }

  try {
    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    res.status(200).json({ message: "Comment updated", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating comment." });
  }
};

const deleteComment = async (req, res) => {
  const commentId = parseInt(req.params.id);

  if (req.user.role !== "VALIDATOR") {
    return res.status(403).json({ message: "Only validators can delete comments." });
  }

  const existingComment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!existingComment) return res.status(404).json({ message: "Comment not found." });
  if (existingComment.userId !== req.user.id) {
    return res.status(403).json({ message: "You can only delete your own comments." });
  }

  try {
    await prisma.comment.delete({ where: { id: commentId } });
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting comment." });
  }
};

module.exports = {
  createComment,
  getCommentsByDocument,
  updateComment,
  deleteComment,
};
